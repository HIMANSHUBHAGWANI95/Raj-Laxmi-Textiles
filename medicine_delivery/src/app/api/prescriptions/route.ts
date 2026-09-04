import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const prescriptionSchema = z.object({
  imageUrl: z.string().min(1, "Prescription image is required"),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = prescriptionSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { imageUrl, notes } = result.data;

    // Create prescription in database connected to current user
    const newPrescription = await db.prescription.create({
      data: {
        userId: session.user.id,
        imageUrl,
        notes: notes || "",
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Prescription uploaded successfully", prescription: newPrescription },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Prescription upload error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while saving prescription" },
      { status: 500 }
    );
  }
}
