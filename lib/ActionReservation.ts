"use server";

import { redirect } from "next/navigation";
import { db } from "./db";
import { getUser } from "./ActionUsers";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { getAvailibilityById } from "./ActionAvailbility";

export const createReservation = async (idAvailibility: string) => {
  try {
    const user = await getUser();
    const userId = user?.id;
    const availability = await getAvailibilityById(idAvailibility);
    if (
      !availability ||
      !availability.start_time ||
      !availability.end_time ||
      !user ||
      !userId
    ) {
      throw new Error("Something went wrong");
    }
    const startTime = new Date(availability?.start_time);
    const endTime = new Date(availability?.end_time);
    await db.reservation.create({
      data: {
        client_id: userId,
        availability_id: availability?.id,
        start_time: startTime,
        end_time: endTime,
        status: "CONFIRMED",
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getReservationById = async (idReservation: string) => {
  try {
    const id = idReservation;
    const reservation = await db.reservation.findUnique({
      where: { id: id },
    });
    return reservation;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getAllReservationsByUser = async () => {
  try {
    const user = await getUser();
    const reservations = await db.reservation.findMany({
      where: { client_id: user?.id },
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

export const getAllReservationsByUserConfirmed = async () => {
  try {
    const user = await getUser();
    const reservations = await db.reservation.findMany({
      where: { client_id: user?.id, status: "CONFIRMED" },
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

export const getReservationByDate = async (date: string) => {
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
  const availabilities = await db.reservation.findMany({
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

export const deleteReservation = async (id: string) => {
  try {
    const supprimer = await db.reservation.delete({
      where: { id },
    });
    if (!supprimer) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
