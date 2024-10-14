"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const getAvailibility = async (date: string) => {
  // Convertir la date en objet Date
  const selectedDate = new Date(date);

  // Vérifier si la date est valide
  if (isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date format");
  }

  // Obtenir le début et la fin de la journée
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0); // 00:00:00

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999); // 23:59:59

  // Requête pour récupérer toutes les disponibilités
  const availabilities = await db.availability.findMany({
    where: {
      start_time: {
        gte: startOfDay,
      },
      end_time: {
        lte: endOfDay,
      },
    },
  });

  return availabilities;
};

export const getAvailibilityById = async (idAvailibility: string) => {
  const id = idAvailibility;
  const availability = await db.availability.findUnique({
    where: { id: id },
  });
  return availability;
};
