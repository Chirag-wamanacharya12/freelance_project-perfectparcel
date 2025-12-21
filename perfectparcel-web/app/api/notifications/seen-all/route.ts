import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const uid = session.user?.id || "anon";
  const role = session.user?.role === "admin" ? "admin" : "customer";
  const client = await clientPromise;
  const db = client.db("perfectparcel");

  const filter: any = { role };
  if (role === "customer") {
    filter.$or = [{ userId: uid }, { userId: null }];
  }

  await db
    .collection("notifications")
    .updateMany(filter, { $addToSet: { seenBy: uid } });

  return NextResponse.json({ success: true });
}

