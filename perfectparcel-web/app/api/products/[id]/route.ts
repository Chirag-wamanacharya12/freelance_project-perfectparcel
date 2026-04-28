import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  
  try {
    const client = await clientPromise;
    const db = client.db("perfectparcel");
    
    // Build update object dynamically
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = String(body.name);
    if (body.productId !== undefined) updateData.productId = String(body.productId);
    if (body.category !== undefined) updateData.category = String(body.category).trim().toLowerCase();
    if (body.mrp !== undefined) updateData.mrp = Number(body.mrp);
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.discount !== undefined) updateData.discount = Number(body.discount);
    if (body.quantity !== undefined) {
      updateData.quantity = Number(body.quantity);
      updateData.inStock = updateData.quantity > 0;
    }
    if (body.is_discontinued !== undefined) updateData.is_discontinued = !!body.is_discontinued;
    if (body.image !== undefined) updateData.image = String(body.image);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Update error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db("perfectparcel");
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
