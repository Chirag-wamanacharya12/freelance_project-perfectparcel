import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const uid = session.user?.id || "anon";
  const client = await clientPromise;
  const db = client.db("perfectparcel");
  await db
    .collection("notifications")
    .updateOne({ _id: new ObjectId(id) }, { $addToSet: { seenBy: uid } });
  return NextResponse.json({ success: true });
}

