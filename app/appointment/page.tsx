"use client";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import * as React from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, LoaderCircle } from "lucide-react";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { getAvailibility, getAvailibilityById } from "@/lib/ActionAvailbility";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { stat } from "fs";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createReservation,
  getReservationByDate,
  getReservationById,
} from "@/lib/ActionReservation";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type FormSchema = {};

export default function Page() {
  const router = useRouter();
  const zodFormSchema: ZodType<FormSchema> = z.object({});
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(zodFormSchema),
  });

  const handleSubmitForm = async (data: FormSchema) => {
    if (!selectedDispo) {
      toast({
        variant: "destructive",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
      return;
    }
    const addReservation = await createReservation(selectedDispo);

    if (!addReservation) {
      toast({
        variant: "destructive",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    } else {
      router.push("/account/reservation");
      router.refresh();
    }
  };

  const { data: session, status } = useSession();

  const [date, setDate] = useState<Date | undefined>(new Date());

  const [open, setOpen] = useState(false);
  const [selectedDispo, setSelectedDispo] = useState<string | null>(null);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTime, setSelectedTime] = useState<Date | null | undefined>(
    null,
  );

  const disablePastDates = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(new Date()));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
  };

  useEffect(() => {
    setData([]);
    const getData = async () => {
      try {
        setLoading(true);
        if (date) {
          const avaibility = await getAvailibility(date?.toISOString());
          const reservation = await getReservationByDate(date?.toISOString());
          const data = avaibility.map((dispo) => {
            const isReserved = reservation.some(
              (res) => res.availability_id === dispo.id,
            );
            return { ...dispo, isReserved };
          });
          setData(data);
        }
      } catch (err) {
        setError("Une erreur est survenue.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [date]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (selectedDispo) {
          const result = await getAvailibilityById(selectedDispo);
          setSelectedTime(result?.start_time);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, [selectedDispo]);

  const handleDispoChange = (dispoId: string) => {
    setSelectedDispo(dispoId === selectedDispo ? null : dispoId);
  };

  const isAvailable = async (idAvailibility: string) => {
    const isGood = await getReservationById(idAvailibility);
    return isGood;
  };
  return (
    <main className="my-24 flex w-full flex-col items-center">
      <h1 className="mb-6 text-5xl font-extrabold max-lg:text-3xl">
        Rendez-vous
      </h1>
      <div className="flex h-full w-2/5 flex-col gap-20 max-lg:w-3/5 max-lg:gap-10 max-sm:w-4/5">
        <section className="flex flex-col gap-2">
          <p>1. Choisissez une date :</p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "PPP", { locale: fr })
                ) : (
                  <span>Choisissez un jour</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                locale={fr}
                disabled={disablePastDates}
              />
            </PopoverContent>
          </Popover>
        </section>
        <section className="flex flex-col gap-2">
          <p>2. Choisissez un horaire :</p>
          {loading ? (
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 18 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[40px] w-[75px] rounded-md border"
                />
              ))}
            </div>
          ) : null}
          {error ? <p>{error}</p> : null}
          <div className="flex flex-wrap justify-center gap-2">
            {data
              ? data.map((dispo) => (
                  <div key={dispo.id}>
                    <input
                      type="radio"
                      name="dispo"
                      id={dispo.id}
                      checked={selectedDispo === dispo.id}
                      onChange={() => handleDispoChange(dispo.id)}
                      className="hidden"
                      disabled={dispo.isReserved} // Désactiver si réservé
                    />
                    <label
                      htmlFor={dispo.id}
                      className={cn(
                        "flex h-[40px] w-[75px] items-center justify-center rounded-md border bg-slate-800 hover:cursor-pointer lg:hover:bg-slate-700",
                        selectedDispo === dispo.id
                          ? "border-white bg-slate-700"
                          : "border",
                        dispo.isReserved
                          ? "bg-slate-950 text-gray-600 hover:cursor-not-allowed lg:hover:bg-slate-950" // Style pour les items réservés
                          : "",
                      )}
                    >
                      {format(new Date(dispo.start_time), "HH:mm")}
                    </label>
                  </div>
                ))
              : null}
          </div>
          {data.length === 0 && !loading ? (
            <p>Il n&apos;y a pas encore de disponibilités pour cette date</p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3"></div>
        </section>
        <section className="flex items-center gap-2">
          <p>3.&nbsp;</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {selectedDispo == null ? (
                <Button disabled>Valider la réservation</Button>
              ) : (
                <Button>Valider la réservation</Button>
              )}
            </AlertDialogTrigger>
            {status === "authenticated" ? (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Voulez-vous confirmer la réservation?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {selectedTime ? (
                      <>
                        La date du rendez-vous est le&nbsp;
                        {date
                          ? format(date, "PPP", { locale: fr })
                          : "Date non définie"}{" "}
                        à {format(selectedTime, "HH:mm", { locale: fr })}.
                      </>
                    ) : (
                      "Chargement..."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <form onSubmit={handleSubmit(handleSubmitForm)}>
                    {isSubmitting ? (
                      <Button disabled className="w-full">
                        <LoaderCircle className="m-auto animate-spin" />
                      </Button>
                    ) : (
                      <Button className="w-full">Confirmer</Button>
                    )}
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            ) : (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Vous n&apos;êtes pas connecté
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Vous devez vous connecter pour réserver un rendez-vous.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Link href={"/sign-in"}>
                    <AlertDialogAction>S&apos;identifier</AlertDialogAction>
                  </Link>
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>
        </section>
      </div>
    </main>
  );
}
