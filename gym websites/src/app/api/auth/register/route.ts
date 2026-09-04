import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  city: z.string().min(1, "Please select a city"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { name, email, password, phone, city } = result.data;
    const lowerEmail = email.toLowerCase();
    
    const existingUser = await db.user.findUnique({
      where: { email: lowerEmail }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 409 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await db.user.create({
      data: {
        name,
        email: lowerEmail,
        password: hashedPassword,
        phone,
        city,
        role: "MEMBER"
      }
    });
    
    return NextResponse.json(
      { message: "User registered successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
