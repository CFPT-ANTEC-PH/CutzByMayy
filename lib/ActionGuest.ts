"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";
import { getSession, signOut } from "next-auth/react";

export const createGuest = async (
  email: string,
  name: string,
  phoneNumber: string,
  code: number,
) => {
  try {
    const user = await db.guest.create({
      data: {
        email: email,
        first_name: name,
        phone_number: phoneNumber,
        code: code,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return false;
  }
};
