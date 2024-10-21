import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAvailabilityByDate } from "@/lib/ActionAvailbility";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { fr } from "date-fns/locale";

const joursDeLaSemaine = [
  "lun.",
  "mar.",
  "mer.",
  "jeu.",
  "ven.",
  "sam.",
  "dim.",
];

export default function Calendrier() {
  const [dateSelectionnee, setDateSelectionnee] = useState<Date | null>(null);
  const [moisActuel, setMoisActuel] = useState<number>(new Date().getMonth());
  const [anneeActuelle, setAnneeActuelle] = useState<number>(
    new Date().getFullYear(),
  );
  const aujourdHui = new Date();

  const [availability, setAvailability] = useState<any[]>([]); // Changer null en tableau vide
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      moisActuel === aujourdHui.getMonth() &&
      anneeActuelle === aujourdHui.getFullYear()
    ) {
      setDateSelectionnee(aujourdHui); // Sélectionner la date actuelle au chargement de la page
    }
  }, [moisActuel, anneeActuelle]);

  const obtenirJoursDansMois = (annee: number, mois: number) => {
    return new Date(annee, mois + 1, 0).getDate();
  };

  const joursDansMois = obtenirJoursDansMois(anneeActuelle, moisActuel);
  const premierJourDuMois = new Date(anneeActuelle, moisActuel, 1).getDay();
  const joursVides = Array.from({ length: (premierJourDuMois + 6) % 7 });

  const gererClicJour = (jour: number) => {
    const nouvelleDate = new Date(anneeActuelle, moisActuel, jour);
    setDateSelectionnee(nouvelleDate); // Mettre à jour avec la date complète
  };

  const gererMoisSuivant = () => {
    if (moisActuel === 11) {
      setMoisActuel(0);
      setAnneeActuelle(anneeActuelle + 1);
    } else {
      setMoisActuel(moisActuel + 1);
    }
    setDateSelectionnee(null);
  };

  const gererMoisPrecedent = () => {
    if (moisActuel === 0) {
      setMoisActuel(11);
      setAnneeActuelle(anneeActuelle - 1);
    } else {
      setMoisActuel(moisActuel - 1);
    }
    setDateSelectionnee(null);
  };

  const nomsDesMois = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  useEffect(() => {
    setLoading(true);
    const getAvailability = async () => {
      if (dateSelectionnee !== null) {
        const availabilityData = await getAvailabilityByDate(dateSelectionnee);
        // console.log(availabilityData);

        if (availabilityData === false) {
          setLoading(false);
          setError("erreur");
        } else if (availabilityData === null) {
          setLoading(false);
          setError("vide");
        } else {
          setLoading(false);
          setAvailability(availabilityData);
        }
      } else {
        setLoading(false);
        setError("select");
      }
    };
    getAvailability();
  }, [dateSelectionnee]);

  return (
    <section className="my-5 flex min-h-[60vh] w-full flex-wrap items-start justify-center gap-4">
      <div className="min-w-[350px] max-w-[700px] flex-1 rounded-lg bg-slate-900 p-5 text-white">
        <div className="mb-4 flex items-center justify-center gap-9 font-bold text-white">
          <Button
            size={"icon"}
            variant={"secondary"}
            onClick={gererMoisPrecedent}
          >
            <ChevronLeft />
          </Button>
          <h3 className="text-lg">{`${nomsDesMois[moisActuel]} ${anneeActuelle}`}</h3>
          <Button
            size={"icon"}
            variant={"secondary"}
            onClick={gererMoisSuivant}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="grid grid-cols-7 text-center text-sm text-gray-200">
          {joursDeLaSemaine.map((jour) => (
            <div key={jour} className="p-2">
              {jour}
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-y-4 text-center">
          {joursVides.map((_, index) => (
            <div key={index} className="p-3"></div>
          ))}
          {Array.from({ length: joursDansMois }, (_, i) => i + 1).map(
            (jour) => {
              const estAujourdhui =
                anneeActuelle === aujourdHui.getFullYear() &&
                moisActuel === aujourdHui.getMonth() &&
                jour === aujourdHui.getDate();

              const estDatePassee =
                anneeActuelle < aujourdHui.getFullYear() ||
                (anneeActuelle === aujourdHui.getFullYear() &&
                  moisActuel < aujourdHui.getMonth()) ||
                (anneeActuelle === aujourdHui.getFullYear() &&
                  moisActuel === aujourdHui.getMonth() &&
                  jour < aujourdHui.getDate());

              return (
                <div key={jour}>
                  <Button
                    className={`relative h-full w-2/3 min-w-[40px] transition-colors duration-100 ${
                      dateSelectionnee?.getDate() === jour &&
                      dateSelectionnee?.getMonth() === moisActuel &&
                      dateSelectionnee?.getFullYear() === anneeActuelle
                        ? "bg-blue-200 text-blue-800"
                        : estDatePassee
                          ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                          : "hover:bg-blue-600"
                    }`}
                    onClick={() => gererClicJour(jour)}
                  >
                    {jour}
                    {estAujourdhui && (
                      <div
                        className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 transform rounded-full ${
                          dateSelectionnee?.getDate() === jour
                            ? "bg-blue-500"
                            : "bg-white"
                        }`}
                      ></div>
                    )}
                  </Button>
                </div>
              );
            },
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex h-[384px] w-[225px] items-center justify-center rounded bg-slate-900",
          GeistMono.className,
        )}
      >
        {loading ? (
          <div>
            <h1>Chargement...</h1>
          </div>
        ) : error === "erreur" ? (
          <div>
            <h1>Une erreur s'est produite. Recommencez.</h1>
          </div>
        ) : error === "vide" ? (
          <div>
            <h1>Pas de rendez-vous pour cette date.</h1>
          </div>
        ) : availability && availability.length > 0 ? (
          <div className="flex h-[350px] w-10/12 flex-col gap-y-5 overflow-y-auto">
            {availability.map((availability: any) => (
              <Link
                href={"/admin/calendar/" + availability.id}
                key={availability.id}
              >
                <Button
                  variant={"link"}
                  className="border border-white text-white"
                >
                  {availability.name +
                    " - " +
                    format(new Date(availability.start_time), "p", {
                      locale: fr,
                    })}
                </Button>
              </Link>
            ))}
          </div>
        ) : (
          <h1>Il n&apos;y a pas de rendez-vous pour ce jour.</h1>
        )}
      </div>
    </section>
  );
}
