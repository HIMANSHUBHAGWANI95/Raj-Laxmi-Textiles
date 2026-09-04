import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { name, email, password, phone, address, city } = result.data;
    
    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 400 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Determine user role (make the first user ADMIN, subsequent users MEMBER)
    const userCount = await db.user.count();
    const role = userCount === 0 ? "ADMIN" : "MEMBER";
    
    // Create new user in the database
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        city,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    
    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
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
