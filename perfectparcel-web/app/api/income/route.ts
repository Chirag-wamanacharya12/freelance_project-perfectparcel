import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const client = await clientPromise;
  const db = client.db("perfectparcel");
  const summaries = await db
    .collection("income")
    .find({ type: "summary" })
    .sort({ period: -1 })
    .toArray();
  const recent = await db
    .collection("income")
    .find({ type: "record" })
    .sort({ deliveredAt: -1 })
    .limit(20)
    .toArray();
  return NextResponse.json({
    summaries: summaries.map((s: any) => ({
      period: s.period,
      total: Number(s.total || 0),
      createdAt: s.createdAt,
    })),
    recent: recent.map((r: any) => ({
      orderId: r.orderId,
      customerName: r.customerName,
      amount: Number(r.amount || 0),
      period: r.period,
      deliveredAt: r.deliveredAt,
      productCounts: r.productCounts || {},
    })),
  });
}
