import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("perfectparcel");

    await db.collection("test").insertOne({
      message: "MongoDB connected",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "DB connection failed" },
      { status: 500 }
    );
  }
}
