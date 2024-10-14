import { PrismaClient } from "@prisma/client";
import { addMinutes, startOfDay, endOfDay } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  const today = new Date(); // Date du jour
  const endOfSeptember = new Date("2024-09-30T23:59:59"); // Fin de septembre

  // Génère les créneaux du lundi au vendredi
  const daysOfWeek = [1, 2, 3, 4, 5]; // Lundi à Vendredi
  const startTime = 9 * 60; // 9:00 (en minutes)
  const endTime = 18 * 60; // 18:00 (en minutes)
  const interval = 30; // intervalle en minutes

  let availabilityRecords = [];

  for (let day = today; day <= endOfSeptember; day.setDate(day.getDate() + 1)) {
    const dayOfWeek = day.getDay();

    // Si c'est un jour de la semaine (lundi à vendredi)
    if (daysOfWeek.includes(dayOfWeek)) {
      let currentTime = startTime;

      while (currentTime < endTime) {
        const startDateTime = addMinutes(startOfDay(day), currentTime);
        const endDateTime = addMinutes(startDateTime, interval);

        availabilityRecords.push({
          start_time: startDateTime,
          end_time: endDateTime,
        });

        currentTime += interval;
      }
    }
  }

  // Insérer toutes les disponibilités dans la base de données
  await prisma.availability.createMany({
    data: availabilityRecords,
  });

  console.log(
    `Dispos ajoutées de maintenant jusqu'au 30 septembre 2024 avec un intervalle de 30 min du lundi au vendredi.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
