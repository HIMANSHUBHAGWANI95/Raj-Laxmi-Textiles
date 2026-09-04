import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const goalSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  target: z.number().positive(),
  current: z.number().nonnegative(),
  unit: z.string().min(1),
  deadline: z.string().min(1),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const goals = await db.fitnessGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(goals);
  } catch (error) {
    console.error("Goals GET error:", error);
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
    
    const result = goalSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Validation error", errors: result.error.flatten() }, { status: 400 });
    }
    
    const { type, title, target, current, unit, deadline } = result.data;
    const goal = await db.fitnessGoal.create({
      data: {
        userId,
        type,
        title,
        target,
        current,
        unit,
        deadline: new Date(deadline),
        status: "ACTIVE"
      }
    });
    
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Goals POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { id, current, status } = body;
    
    if (!id) {
      return NextResponse.json({ message: "Goal ID is required" }, { status: 400 });
    }

    const currentGoal = await db.fitnessGoal.findUnique({
      where: { id }
    });
    
    if (!currentGoal) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    let finalStatus = status || currentGoal.status;
    const parsedCurrent = current !== undefined ? parseFloat(current) : currentGoal.current;
    
    if (current !== undefined && parsedCurrent >= currentGoal.target) {
      finalStatus = "COMPLETED";
    } else if (current !== undefined && parsedCurrent < currentGoal.target && finalStatus === "COMPLETED") {
      finalStatus = "ACTIVE";
    }

    const updated = await db.fitnessGoal.update({
      where: { id },
      data: {
        current: parsedCurrent,
        status: finalStatus
      }
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Goals PUT error:", error);
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
      return NextResponse.json({ message: "Goal ID is required" }, { status: 400 });
    }
    
    await db.fitnessGoal.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Goals DELETE error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
