import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const logSchema = z.object({
  exerciseId: z.string().min(1),
  sets: z.number().int().positive(),
  reps: z.number().int().positive(),
  weight: z.number().positive(),
  duration: z.number().int().positive(),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    
    const logs = await db.workoutLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        exercise: true
      }
    });
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Logs GET error:", error);
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

    const result = logSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Validation error", errors: result.error.flatten() }, { status: 400 });
    }

    const { exerciseId, sets, reps, weight, duration, notes } = result.data;
    
    const log = await db.workoutLog.create({
      data: {
        userId,
        exerciseId,
        sets,
        reps,
        weight,
        duration,
        notes,
        date: new Date()
      }
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Logs POST error:", error);
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
    
    await db.workoutLog.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: "Log entry deleted successfully" });
  } catch (error) {
    console.error("Logs DELETE error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
