import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
      customerName,
      mobile,
      altMobile,
      address,
      giftWrap = false,
      note,
      productIds,
    } = body || {};

    if (!customerName || !mobile || !address || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("perfectparcel");

    const products = await db
      .collection("products")
      .find({ productId: { $in: productIds } })
      .toArray();
    const baseAmount = products.reduce((sum, p: any) => sum + (p.price || 0), 0);
    const deliveryCharge = 50;
    const giftWrapCharge = giftWrap ? 20 : 0;
    const amount = baseAmount + deliveryCharge + giftWrapCharge;

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const doc = {
      orderId,
      userId: session?.user?.id || null,
      customerName,
      mobile,
      altMobile,
      address: {
        house: address?.house || "",
        street: address?.street || "",
        landmark: address?.landmark || "",
        pin: address?.pin || "",
      },
      giftWrap: !!giftWrap,
      note: note || "",
      productIds,
      amount,
      charges: { delivery: deliveryCharge, giftWrap: giftWrapCharge },
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("orders").insertOne(doc);
    await db.collection("notifications").insertOne({
      role: "admin",
      userId: null,
      type: "new_order",
      title: "New order placed",
      message: `${customerName} placed an order ${orderId}`,
      data: { orderId, amount, customerName },
      seenBy: [],
      createdAt: new Date(),
    });
    await db.collection("notifications").insertOne({
      role: "customer",
      userId: null,
      type: "order_status",
      title: "Order placed",
      message: `Your order ${orderId} has been placed`,
      data: { orderId, status: "pending" },
      seenBy: [],
      createdAt: new Date(),
    });
    if (session?.user?.id) {
      const uid = session.user.id;
      const uname = session.user.name || customerName || "";
      const uemail = session.user.email || "";
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const existing = await db.collection("customers").findOne({ userId: uid, period });
      if (!existing) {
        await db.collection("customers").insertOne({
          userId: uid,
          name: uname,
          email: uemail,
          period,
          status: "new",
          firstOrderAt: now.toISOString(),
          lastOrderAt: now.toISOString(),
          orderCount: 1,
        });
      } else {
        await db
          .collection("customers")
          .updateOne(
            { _id: existing._id },
            { $set: { status: "returning", lastOrderAt: now.toISOString() }, $inc: { orderCount: 1 } }
          );
      }
    }
    return NextResponse.json({ success: true, order: { ...doc, _id: result.insertedId } });
  } catch (e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
