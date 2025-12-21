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
    const { image, category, productId, price, discount, quantity } = body || {};

    if (!image || !category || !productId || typeof price !== "number") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("perfectparcel");

    const doc = {
      name: String(productId),
      productId: String(productId),
      category: String(category).trim().toLowerCase(),
      image: String(image),
      price: Number(price),
      discount: Math.min(Math.max(Number(discount) || 0, 0), 100),
      quantity: Math.max(0, Number(quantity ?? 0)),
      inStock: Math.max(0, Number(quantity ?? 0)) > 0,
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
