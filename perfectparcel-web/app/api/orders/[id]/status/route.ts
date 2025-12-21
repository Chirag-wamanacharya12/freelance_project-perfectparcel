import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const status = body?.status;
  const allowed = [
    "pending",
    "processing",
    "dispatched",
    "shipped",
    "delivered",
    "canceled",
  ];
  if (!allowed.includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db("perfectparcel");
    const res = await db
      .collection("orders")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });
    if (res.matchedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });
    const orderId = order?.orderId || id;
    await db.collection("notifications").insertOne({
      role: "customer",
      userId: null,
      type: "order_status",
      title: "Order status updated",
      message: `Your order ${orderId} is now ${status}`,
      data: { orderId, status },
      seenBy: [],
      createdAt: new Date(),
    });
    if (status === "canceled") {
      await db.collection("notifications").insertOne({
        role: "admin",
        userId: null,
        type: "order_cancelled",
        title: "Order canceled",
        message: `${order?.customerName || "-"} canceled ${orderId}`,
        data: { orderId },
        seenBy: [],
        createdAt: new Date(),
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

