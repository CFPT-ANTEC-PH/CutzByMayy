"use server";

import { db } from "@/lib/db";
import { getUser } from "./ActionUsers";

export const getAvailibility = async (date: string) => {
  const selectedDate = new Date(date);

  if (isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const availabilities = await db.availability.findMany({
    where: {
      start_time: {
        gte: startOfDay,
      },
      end_time: {
        lte: endOfDay,
      },
    },
    orderBy: {
      start_time: "asc",
    },
  });

  return availabilities;
};

export const getAvailibilityById = async (idAvailability: string) => {
  try {
    const id = idAvailability;
    const availability = await db.availability.findUnique({
      where: { id: id },
    });
    return availability;
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
      (availabilityCheck !== false &&
        availabilityCheck !== null &&
        availabilityCheck.user_id !== null) ||
      (availabilityCheck !== false &&
        availabilityCheck !== null &&
        availabilityCheck.guest_id !== null)
    ) {
      throw new Error("Availability already taken");
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
    const availabilities = await db.availability.findMany({
      where: { user_id: user?.id },
      orderBy: { start_time: "desc" },
    });
    if (!availabilities) {
      return [];
    }
    return availabilities;
  } catch (error) {
    console.error(error);
    return [{ error: "error" }];
  }
};

export const getAllAvailabiltysByUserDateUpcoming = async () => {
  try {
    const user = await getUser();
    const availabilities = await db.availability.findMany({
      where: {
        user_id: user?.id,
        start_time: {
          gt: new Date(),
        },
      },
    });
    return availabilities;
  } catch (error) {
    console.error(error);
    return [{ error: "error" }];
  }
};

export const deleteAvailability = async (id: string) => {
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

export const updateAvailibilityGuestId = async (
  user_id: string,
  id: string,
) => {
  try {
    const idAvailability = id;
    const guestId = user_id;
    const availabilityCheck = await getAvailibilityById(idAvailability);
    if (
      (availabilityCheck !== null &&
        availabilityCheck !== false &&
        availabilityCheck.user_id !== null) ||
      (availabilityCheck !== null &&
        availabilityCheck !== false &&
        availabilityCheck.guest_id !== null)
    ) {
      throw new Error("Availability already taken");
    } else {
      const availability = await db.availability.update({
        where: { id: idAvailability },
        data: {
          guest_id: guestId,
        },
      });
      return availability;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getAvailabilityByDate = async (date: Date) => {
  try {
    const debutJournee = new Date(date);
    debutJournee.setHours(0, 0, 0, 0); // Minuit

    const finJournee = new Date(date);
    finJournee.setHours(23, 59, 59, 999); // 23:59:59.999

    const availabilities = await db.availability.findMany({
      where: {
        start_time: {
          gte: debutJournee,
        },
        end_time: {
          lte: finJournee,
        },
        OR: [
          {
            user_id: {
              not: null,
            },
          },
          {
            guest_id: {
              not: null,
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            first_name: true, // Inclure le nom de l'utilisateur
          },
        },
        guest: {
          select: {
            first_name: true, // Inclure le prénom du guest
          },
        },
      },
      orderBy: {
        start_time: "asc",
      },
    });

    // Transformer les résultats pour inclure le nom ou le prénom
    const formattedAvailabilities = availabilities.map((availability) => {
      return {
        ...availability,
        name: availability.user_id
          ? availability.user?.first_name // Nom de l'utilisateur
          : availability.guest_id
            ? availability.guest?.first_name // Prénom du guest
            : null,
      };
    });

    return formattedAvailabilities;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getInfoOfAvailabilityById = async (id: string) => {
  try {
    const availability = await db.availability.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            first_name: true,
            phone_number: true,
          },
        },
        guest: {
          select: {
            phone_number: true,
            email: true,
            first_name: true,
          },
        },
      },
    });
    return {
      ...availability,
      name: availability?.user_id
        ? availability.user?.first_name // Nom de l'utilisateur
        : availability?.guest_id
          ? availability.guest?.first_name // Prénom du guest
          : null,
      email: availability?.user_id
        ? availability.user?.email // Email de l'utilisateur
        : availability?.guest_id
          ? availability.guest?.email // Email du guest
          : null,
      phone_number: availability?.user_id
        ? availability.user?.phone_number // Numéro de téléphone de l'utilisateur
        : availability?.guest_id
          ? availability.guest?.phone_number // Numéro de téléphone du guest
          : null,
    };
  } catch (error) {
    console.error(error);
    return false;
  }
};
