import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role === "admin" ? "admin" : "customer";
  const userId = session?.user?.id || null;
  const client = await clientPromise;
  const db = client.db("perfectparcel");
  const filter: any = { role };
  if (role === "customer") {
    filter.$or = [{ userId: userId }, { userId: null }];
  }
  const notifications = await db
    .collection("notifications")
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(30)
    .toArray();
  const unseenCount = notifications.filter((n: any) => !(n.seenBy || []).includes(userId || "anon")).length;
  return NextResponse.json({
    notifications: notifications.map((n: any) => ({
      _id: n._id?.toString(),
      type: n.type,
      title: n.title,
      message: n.message,
      role: n.role,
      createdAt: n.createdAt,
      data: n.data || {},
      isSeen: (n.seenBy || []).includes(userId || "anon"),
    })),
    unseenCount,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { role = "customer", userId = null, type, title, message, data } = body || {};
  if (!type || !title || !message) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db("perfectparcel");
  const doc = {
    role,
    userId,
    type,
    title,
    message,
    data: data || {},
    seenBy: [],
    createdAt: new Date(),
  };
  await db.collection("notifications").insertOne(doc);
  return NextResponse.json({ success: true });
}

