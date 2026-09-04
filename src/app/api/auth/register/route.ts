import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  defaultAddress: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = registerSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email: parsedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    const user = await db.user.create({
      data: {
        name: parsedData.name,
        email: parsedData.email,
        password: hashedPassword,
        phone: parsedData.phone || null,
        defaultAddress: parsedData.defaultAddress || null,
        role: "CUSTOMER"
      }
    });

    // Exclude password from the returned object
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
