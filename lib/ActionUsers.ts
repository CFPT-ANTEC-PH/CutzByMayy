"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";
import { getSession, signOut } from "next-auth/react";

export const getUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    redirect("../");
  }
  const id = session?.user.id;
  const user = await db.user.findUnique({
    where: { id: id },
  });
  return user;
};

export const updateUser = async (formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const first_name = formData.get("first_name") as string;
    const phone_number = formData.get("phone_number") as string;
    const email = formData.get("email") as string;

    if (
      name !== null &&
      first_name !== null &&
      phone_number !== null &&
      email !== null &&
      session?.user.id === id
    ) {
      await db.user.update({
        where: { id },
        data: {
          name: name,
          first_name: first_name,
          phone_number: phone_number,
          email: email,
        },
      });
    } else {
      console.error("Les données envoyées sont incorrectes");
      return false;
    }
  } catch (e) {
    console.error(
      "Une erreur est survenue lors de la modification de l'utilisateur " + e,
    );
    return false;
  } finally {
    return true;
  }
};

export const changePassword = async (formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);

    const id = formData.get("id") as string;
    const current = formData.get("current") as string;
    const newPass = formData.get("new") as string;

    let valid = false;
    const user = await getUser();

    if (user?.password != null) {
      valid = await bcrypt.compare(current, user.password);
    }

    if (
      current !== null &&
      newPass !== null &&
      session?.user.id === id &&
      valid
    ) {
      const passHash = await bcrypt.hash(newPass, 10);
      await db.user.update({
        where: { id },
        data: {
          password: passHash,
        },
      });
      return true;
    } else {
      console.error("Les données envoyées sont incorrectes");
      return false;
    }
  } catch (e) {
    console.error(
      "Une erreur est survenue lors de la modification de l'utilisateur : " + e,
    );
    return false;
  }
};

export const getUserFromDatabase = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
  });
  return user;
};

export const updateCodeUser = async (email: string, newCode: number) => {
  try {
    await db.user.update({
      where: { email },
      data: {
        code: newCode,
      },
    });
    return true;
  } catch (e) {
    console.error(
      "Une erreur est survenue lors de la modification du code " + e,
    );
    return false;
  }
};

export const getUserByCode = async (code: number) => {
  try {
    const user = await db.user.findFirst({
      where: { code },
    });
    if (user == null) {
      return false;
    }
    return user;
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la recherche de l'utilisateur par code : " +
        error,
    );
    return false;
  }
};

export const updateVerifyCode = async (email: string) => {
  try {
    const update = await db.user.update({
      where: { email },
      data: {
        emailVerified: true,
      },
    });
    return true;
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la mise à jour du code de vérification : " +
        error,
    );
    return false;
  }
};
