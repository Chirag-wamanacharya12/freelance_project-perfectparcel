import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { image, category, productId, mrp, price, discount, quantity, name } = body || {};

    if (!image || !category || !productId || typeof price !== "number") {
      return NextResponse.json({ message: "Invalid payload: image, category, productId, and price are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("perfectparcel");

    // Check if productId already exists
    const existing = await db.collection("products").findOne({ productId: String(productId) });
    if (existing) {
      return NextResponse.json({ message: `Product with ID ${productId} already exists` }, { status: 400 });
    }

    const doc = {
      name: String(name || productId),
      productId: String(productId),
      category: String(category).trim().toLowerCase(),
      image: String(image),
      mrp: Number(mrp || price),
      price: Number(price),
      discount: Math.min(Math.max(Number(discount) || 0, 0), 100),
      quantity: Math.max(0, Number(quantity ?? 0)),
      inStock: Math.max(0, Number(quantity ?? 0)) > 0,
      is_discontinued: false,
      createdAt: new Date(),
    };

    await db.collection("products").insertOne(doc);
    await db.collection("notifications").insertOne({
      role: "customer",
      userId: null,
      type: "new_product",
      title: "New product added",
      message: `Check out ${doc.productId} in ${doc.category}`,
      data: { productId: doc.productId, category: doc.category },
      seenBy: [],
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true, product: doc });
  } catch (e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
