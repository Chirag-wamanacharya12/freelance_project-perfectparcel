import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("perfectparcel");
    
    // Get unique categories and filter out any empty strings
    const categories = await db.collection("products").distinct("category");
    const filteredCategories = categories
      .filter((cat): cat is string => typeof cat === "string" && cat.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));

    return NextResponse.json(filteredCategories);
  } catch (e) {
    console.error("Error fetching categories:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
