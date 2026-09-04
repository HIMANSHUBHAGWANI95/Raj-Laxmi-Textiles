import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const progressSchema = z.object({
  weight: z.number().positive(),
  bodyFat: z.number().positive().optional().nullable(),
  chest: z.number().positive().optional().nullable(),
  waist: z.number().positive().optional().nullable(),
  hips: z.number().positive().optional().nullable(),
  biceps: z.number().positive().optional().nullable(),
  thighs: z.number().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const entries = await db.progressEntry.findMany({
      where: { userId },
      orderBy: { date: "asc" } // Order chronological for Recharts graphs
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Progress GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const body = await req.json();

    const result = progressSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Validation error", errors: result.error.flatten() }, { status: 400 });
    }

    const { weight, bodyFat, chest, waist, hips, biceps, thighs, notes } = result.data;

    const entry = await db.progressEntry.create({
      data: {
        userId,
        weight,
        bodyFat: bodyFat || null,
        chest: chest || null,
        waist: waist || null,
        hips: hips || null,
        biceps: biceps || null,
        thighs: thighs || null,
        notes: notes || null,
        date: new Date()
      }
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Progress POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Log ID is required" }, { status: 400 });
    }

    await db.progressEntry.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Progress entry deleted successfully" });
  } catch (error) {
    console.error("Progress DELETE error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
