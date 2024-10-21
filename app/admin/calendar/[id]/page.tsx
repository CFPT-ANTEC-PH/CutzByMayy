"use client";
import { getInfoOfAvailabilityById } from "@/lib/ActionAvailbility";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const router = useRouter();

  const [infoAvailability, setInfoAvailability] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      const avaibility = await getInfoOfAvailabilityById(id as string);
      console.log(avaibility);

      if (avaibility === false) {
        setLoading(false);
        setError("Error");
      } else if (avaibility === null) {
        setLoading(false);
        setError("Not found");
      } else if (avaibility.name == null) {
        setLoading(false);
        setError("Not found");
      } else {
        setLoading(false);
        setInfoAvailability(avaibility);
      }
    };
    fetch();
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md bg-slate-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Détails du Rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 text-sm">
                <CalendarDays className="text-blue-500" />
                <span className="font-semibold">Date :</span>
                <div className="animation-pulse rounded-mg w-[30px] bg-slate-50"></div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <Clock className="text-blue-500" />
                <span className="font-semibold">Heure :</span>
                <div className="animation-pulse rounded-mg w-[30px] bg-slate-50"></div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <User className="text-blue-500" />
                <span className="font-semibold">Client :</span>
                <div className="animation-pulse rounded-mg w-[30px] bg-slate-50"></div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <Mail className="text-blue-500" />
                <span className="font-semibold">Email :</span>
                <div className="animation-pulse rounded-mg w-[30px] bg-slate-50"></div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <Phone className="text-blue-500" />
                <span className="font-semibold">Téléphone :</span>
                <div className="animation-pulse rounded-mg w-[30px] bg-slate-50"></div>
              </div>
            </CardContent>
          </Card>
          <Button
            className="mt-4 w-full max-w-md"
            variant="outline"
            onClick={() => router.push("/admin/calendar")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </div>
      ) : error == "Error" ? (
        <div>Une erreur est survenue</div>
      ) : error == "Not found" ? (
        <div>Non trouvé</div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md bg-slate-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Détails du Rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 text-sm">
                <CalendarDays className="text-blue-500" />
                <span className="font-semibold">Date :</span>
                <span>
                  {infoAvailability.start_time instanceof Date &&
                  !isNaN(infoAvailability.start_time.getTime()) ? (
                    format(infoAvailability.start_time, "iiii, dd MMMM", {
                      locale: fr,
                    })
                  ) : (
                    <span>Date invalide</span>
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <Clock className="text-blue-500" />
                <span className="font-semibold">Heure :</span>
                <span>
                  {infoAvailability.start_time instanceof Date &&
                  !isNaN(infoAvailability.start_time.getTime()) ? (
                    format(infoAvailability.start_time, "p", {
                      locale: fr,
                    })
                  ) : (
                    <span>Date invalide</span>
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <User className="text-blue-500" />
                <span className="font-semibold">Client :</span>
                <span>{infoAvailability.name}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <Mail className="text-blue-500" />
                <span className="font-semibold">Email :</span>
                <span>{infoAvailability.email}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <Phone className="text-blue-500" />
                <span className="font-semibold">Téléphone :</span>
                <span>{infoAvailability.phone_number}</span>
              </div>
            </CardContent>
          </Card>
          <Button
            className="mt-4 w-full max-w-md"
            variant="outline"
            onClick={() => router.push("/admin/calendar")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </div>
      )}
    </>
  );
}
