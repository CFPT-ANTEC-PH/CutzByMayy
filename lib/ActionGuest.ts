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
  id_availability: string,
) => {
  try {
    const guest = await db.guest.create({
      data: {
        email: email,
        first_name: name,
        phone_number: phoneNumber,
        code: code,
        id_availability: id_availability,
      },
    });
    return guest;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getGuestByCode = async (code: number) => {
  try {
    const guest = await db.guest.findFirst({
      where: { code },
    });
    if (guest == null) {
      return false;
    }
    return guest;
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la recherche de l'utilisateur par code : " +
        error,
    );
    return false;
  }
};
