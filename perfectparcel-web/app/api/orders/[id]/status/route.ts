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
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const prevStatus = order.status;
    await db
      .collection("orders")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });
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
    if (status === "delivered" && prevStatus !== "delivered") {
      const items: string[] = Array.isArray(order.productIds) ? order.productIds : [];
      const counts: Record<string, number> = {};
      for (const pid of items) {
        const k = String(pid);
        counts[k] = (counts[k] || 0) + 1;
      }
      for (const [pid, cnt] of Object.entries(counts)) {
        const prod = await db.collection("products").findOne({ productId: pid });
        if (!prod) continue;
        const currentQty = Math.max(0, Number(prod.quantity ?? 0));
        const newQty = Math.max(0, currentQty - cnt);
        await db
          .collection("products")
          .updateOne(
            { _id: prod._id },
            { $set: { quantity: newQty, inStock: newQty > 0 } }
          );
      }
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const amt = Number(order.amount || 0);
      await db.collection("income").insertOne({
        type: "record",
        orderId,
        customerName: order.customerName || "",
        amount: amt,
        period,
        productCounts: counts,
        deliveredAt: now.toISOString(),
        createdAt: now,
      });
      await db
        .collection("income")
        .updateOne(
          { type: "summary", period },
          { $inc: { total: amt }, $setOnInsert: { createdAt: now } },
          { upsert: true }
        );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

