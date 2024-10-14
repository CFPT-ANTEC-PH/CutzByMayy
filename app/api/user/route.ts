import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";

// Define a schema for input validation
const userSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
  name: z
    .string()
    .min(1, "Username is required")
    .max(100, "Username is too long"),
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number is too long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, first_name, phone_number } =
      userSchema.parse(body);

    //check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          message: "User with this email already exists",
        },
        { status: 409 },
      );
    }

    //check if phone number already exists
    const existingUserByPhoneNumber = await db.user.findUnique({
      where: { phone_number: phone_number },
    });
    if (existingUserByPhoneNumber) {
      return NextResponse.json(
        {
          user: null,
          message: "User with this phone number already exists",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        first_name,
        phone_number,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      {
        user: rest,
        message: "User created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
