import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ user: null, lastOrder: null });
  }
  const client = await clientPromise;
  const db = client.db("perfectparcel");
  const user = {
    id: session.user?.id || "",
    name: session.user?.name || "",
    email: session.user?.email || "",
  };
  const lastOrder = await db
    .collection("orders")
    .find({ userId: user.id })
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray();
  const order = lastOrder[0] || null;
  return NextResponse.json({
    user,
    lastOrder: order
      ? {
          mobile: order.mobile || "",
          altMobile: order.altMobile || "",
          address: order.address || {
            house: "",
            street: "",
            landmark: "",
            pin: "",
          },
          note: order.note || "",
        }
      : null,
  });
}

