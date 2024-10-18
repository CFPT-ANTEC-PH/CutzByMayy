"use client";
import { format, set } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, ClockIcon, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { info } from "console";
import Link from "next/link";
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
import {
  deleteAvailability,
  getAllAvailabilitiesByUser,
  getAllAvailabiltysByUserDateUpcoming,
  getAvailibilityById,
} from "@/lib/ActionAvailbility";

type Availability = {
  id: string;
  start_time: Date;
  end_time: Date;
  user_id: string;
  guest_id: string;
};

export default function Page() {
  const [avaibilities, setAvaibilities] = useState<Availability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [availbilityId, setAvailabilityId] = useState<string | null>(null);
  const [infoAvailability, setInfoAvailability] = useState<
    Availability | undefined
  >();

  const { toast } = useToast();

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        setLoading(true);
        const data = await getAllAvailabilitiesByUser();
        if (Array.isArray(data) && data.length > 0 && "error" in data[0]) {
          setError(data[0].error);
        } else {
          setAvaibilities(data as Availability[]);
        }
      } catch (err) {
        console.error(err);
        setError(
          "Une erreur est survenue lors de la récupération des réservations.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, []);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        setLoading(true);
        const data = isChecked
          ? await getAllAvailabiltysByUserDateUpcoming()
          : await getAllAvailabilitiesByUser();

        if (Array.isArray(data) && data.length > 0 && "error" in data[0]) {
          setError(data[0].error);
        } else {
          setAvaibilities(data as Availability[]);
        }
      } catch (err) {
        console.error(err);
        setError(
          "Une erreur est survenue lors de la récupération des réservations.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [isChecked]);

  function handleCheckboxChange() {
    setIsChecked((prev) => !prev);
  }

  const handleCancelAvailability = async (availabilityId: string) => {
    setLoadingId(availabilityId);
    try {
      await deleteAvailability(availabilityId);
      setAvaibilities((prev) =>
        prev.filter((availability) => availability.id !== availabilityId),
      );
      toast({ description: "Réservation annulée avec succès" });
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast({ description: "Erreur lors de l'annulation de la réservation" });
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        if (availbilityId !== null) {
          const availability = await getAvailibilityById(availbilityId);
          if (availability != null && availability != false) {
            setInfoAvailability(availability as Availability);
          } else {
            setInfoAvailability(undefined);
          }
          setLoading(false);
        }
      } catch (error) {}
    };
    fetchAvailability();
  }, [availbilityId]);

  return (
    <>
      <div className="max-sm:hidden">
        <Card className="mx-auto w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Mes Réservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-end space-x-2">
              <Checkbox
                onCheckedChange={handleCheckboxChange}
                checked={isChecked}
                name="actif"
                id="actif"
              />
              <label
                htmlFor="actif"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                A venir
              </label>
            </div>
            {loading ? (
              <p className="text-center text-muted-foreground">
                Chargement ...
              </p>
            ) : avaibilities.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="text-center text-muted-foreground">
                  Vous n&apos;avez aucune réservation pour le moment.
                </p>
                <p className="text-center">
                  Vous voulez en prendre un ? Cliquez&nbsp;
                  <Link href={"/appointment"} className="underline">
                    ici
                  </Link>
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avaibilities.map((avaibilitie) => (
                    <TableRow key={avaibilitie.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {format(avaibilitie.start_time, "dd/MM/yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {format(avaibilitie.start_time, "HH:mm")} -{" "}
                          {format(avaibilitie.end_time, "HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center capitalize">
                          Confirmé
                        </div>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="secondary">Annuler</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Êtes-vous sûr de vouloir annuler cette
                                réservation
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Une fois appuyé sur "Confirmer", la réservation
                                sera annulée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={() =>
                                  handleCancelAvailability(avaibilitie.id)
                                }
                                disabled={loadingId === avaibilitie.id}
                              >
                                {loadingId === avaibilitie.id ? (
                                  <LoaderCircle className="m-auto animate-spin" />
                                ) : (
                                  "Confirmer"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex min-h-[500px] w-screen items-center justify-center sm:hidden">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Mes réservations</CardTitle>
            <CardDescription>
              Recherche toutes tes réservations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="font-bold">Chargement des réservations...</p>
            ) : !loading && avaibilities.length === 0 ? (
              <div className="flex flex-col">
                <p className="text-red-500">
                  Vous n&apos;avez pas de rendez-vous{"."}
                </p>
                <Link
                  href="/appointment"
                  className="font-bold text-red-500 underline"
                >
                  Réserver un rendez-vous.
                </Link>
              </div>
            ) : (
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Select onValueChange={(value) => setAvailabilityId(value)}>
                    <SelectTrigger id="availability">
                      <SelectValue placeholder="Séléctionne une réservation" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {avaibilities.map((avaibilitie) => (
                        <SelectItem key={avaibilitie.id} value={avaibilitie.id}>
                          {format(avaibilitie.start_time, "iiii dd LLLL, p", {
                            locale: fr,
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {infoAvailability == undefined ? null : loading ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <p>La date du rendez-vous :</p>
                      <Skeleton className="h-[20px] w-[250px] rounded-md border" />
                    </div>
                    <p className="flex">
                      La réservation est&nbsp;
                      <Skeleton className="h-[20px] w-[80px] rounded-md border" />
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div>
                      <p>La date du rendez-vous :</p>
                      <p className="font-bold">
                        {format(
                          infoAvailability.start_time,
                          "eeee dd LLLL y à p",
                          {
                            locale: fr,
                          },
                        )}
                      </p>
                    </div>
                    <p className="flex">
                      La réservation est&nbsp;
                      <p className="font-bold">"confirmé"</p>
                      {"."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-start">
            {infoAvailability !== undefined ? (
              loading ? (
                <Button variant={"secondary"} disabled>
                  Annuler la réservation
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary">Annuler la réservation</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous sûr de vouloir annuler cette réservation
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Une fois appuyé sur "Confirmer", la réservation sera
                        annulée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() =>
                          handleCancelAvailability(infoAvailability.id)
                        }
                        disabled={loadingId === infoAvailability.id}
                      >
                        {loadingId === infoAvailability.id ? (
                          <LoaderCircle className="m-auto animate-spin" />
                        ) : (
                          "Confirmer"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )
            ) : null}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
