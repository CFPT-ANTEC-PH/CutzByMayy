"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUser } from "./ActionUsers";

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

export const getReservationById = async (idReservation: string) => {
  try {
    const id = idReservation;
    const reservation = await db.availability.findUnique({
      where: { id: id },
    });
    return reservation;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const updateAvailibilityUserId = async (user_id: string, id: string) => {
  try {
    const idAvailability = id;
    const userId = user_id;
    const availabilityCheck = await getAvailibilityById(idAvailability);
    if (
      (availabilityCheck !== null && availabilityCheck.user_id !== null) ||
      availabilityCheck?.guest_id !== null
    ) {
      throw new Error("Availability already taken");
      return false;
    } else {
      const availability = await db.availability.update({
        where: { id: idAvailability },
        data: {
          user_id: userId,
        },
      });
      return availability;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getAllAvailabilitiesByUser = async () => {
  try {
    const user = await getUser();
    const reservations = await db.availability.findMany({
      where: { user_id: user?.id },
      orderBy: { start_time: "desc" },
    });
    if (!reservations) {
      return [];
    }
    return reservations;
  } catch (error) {
    console.error(error);
    return [{ error: "error" }];
  }
};

export const getAllAvailabiltysByUserDateUpcoming = async () => {
  try {
    const user = await getUser();
    const reservations = await db.availability.findMany({
      where: {
        user_id: user?.id,
        start_time: {
          gt: new Date(),
        },
      },
    });
    return reservations;
  } catch (error) {
    console.error(error);
    return [{ error: "error" }];
  }
};

export const deleteReservation = async (id: string) => {
  try {
    const availability = await db.availability.update({
      where: { id },
      data: {
        user_id: null,
      },
    });
    return availability;
  } catch (error) {
    console.error(error);
    return false;
  }
};
