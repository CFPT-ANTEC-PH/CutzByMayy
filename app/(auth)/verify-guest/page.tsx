"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import {
  getAvailibilityById,
  updateAvailibilityGuestId,
} from "@/lib/ActionAvailbility";
import { getGuestByCode } from "@/lib/ActionGuest";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  const fetchEmail = async (
    selectedTime: Date,
    email: string,
    userFirstName: string,
  ) => {
    try {
      const response = await fetch("/api/mail/confirmedReservationGuest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          userFirstname: userFirstName,
          date: selectedTime,
        }),
      });

      await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          description: "L'envoie de l'email a échoué.",
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "L'envoie de l'email a échoué.",
      });
      return false;
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      const code = value;
      const verify = await getGuestByCode(parseInt(code, 10));

      if (verify !== false && verify.id_availability !== null) {
        const updateAvailibility = await updateAvailibilityGuestId(
          verify.id,
          verify.id_availability,
        );
        if (updateAvailibility !== false) {
          const avaibility = await getAvailibilityById(verify.id_availability);
          if (avaibility !== false && avaibility !== null) {
            const emailSend = await fetchEmail(
              avaibility?.start_time,
              verify.email,
              verify.first_name,
            );
            if (emailSend) {
              toast({
                variant: "default",
                description: "Votre réservation a bien été enregistrer.",
              });
              router.push("/");
            } else {
              setLoading(false);
              toast({
                variant: "destructive",
                description:
                  "Une erreur est survenue lors de l'envoie de l'email.",
              });
            }
          } else {
            setLoading(false);
            toast({
              variant: "destructive",
              description:
                "Une erreur est survenue. Vous ne receverez pas de mail.",
            });
          }
        } else {
          setLoading(false);
          setError(
            "Une erreur est survenue lors de la mise à jour de la réservation. Veuillez réessayer.",
          );
        }
      } else {
        setLoading(false);
        setError("Ce n'est pas le bon code. Veuillez réessayer.");
      }
    } catch (error) {
      setLoading(false);
      setError(
        "Une erreur est survenue lors de la vérification du code. Veuillez réessayer.",
      );
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Vérification du Code</CardTitle>
        <CardDescription>
          Entrez le code que vous avez reçu par email.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex w-full flex-col items-center">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {loading ? (
          <Button onClick={handleVerify} className="mt-4 w-full" disabled>
            <Loader2 className="animate-spin" />
          </Button>
        ) : (
          <Button onClick={handleVerify} className="mt-4 w-full">
            Vérifier
          </Button>
        )}
      </CardContent>
      <CardFooter>
        {error !== "" ? (
          <small className="w-full text-center text-red-500">{error}</small>
        ) : null}
      </CardFooter>
    </Card>
  );
}
