"use client";
import React from "react";
import { Button } from "./ui/button";
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
} from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "./ui/use-toast";
import { createGuest } from "@/lib/ActionGuest";

interface ChildProps {
  selectedTime: Date;
}

type FormSchema = {
  email: string;
  name: string;
  phoneNumber: string;
};

export default function AlertGuest() {
  const { toast } = useToast();

  const zodFormSchema: ZodType<FormSchema> = z.object({
    email: z.string().email("Email invalide"),
    name: z.string().min(2, "Nom invalide"),
    phoneNumber: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(zodFormSchema),
  });

  const fetchEmail = async (code: Number, email: string) => {
    try {
      const response = await fetch("/api/mail/verifyMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          code: code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          description: "L'envoie de l'email a échoué.",
        });
      }
      return true;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "L'envoie de l'email a échoué.",
      });
    }
  };

  const handleSubmitForm = async (data: FormSchema) => {
    try {
      const code = Math.floor(1000 + Math.random() * 9000);
      const user = await createGuest(
        data.email,
        data.name,
        data.phoneNumber,
        code,
      );
      const email = await fetchEmail(code, data.email);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"link"} className="text-gray-300 underline">
          Continuer en tant qu&apos;invité
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <AlertDialogHeader>
            <AlertDialogTitle className="mb-4">
              Vos informations
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col items-start">
                  <div className="flex w-full flex-col items-start gap-2">
                    <Label htmlFor="email">Votre e-mail</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="mail@example.com"
                      className="w-[90%]"
                      {...register("email")}
                    />
                  </div>
                  <small className="font-bold">
                    L'e-mail sera vérifié pour valider la réservation.
                  </small>
                  {errors.email && (
                    <small className="font-medium text-red-500">
                      {errors.email.message}
                    </small>
                  )}
                </div>
                <div className="flex w-full flex-col items-start gap-2">
                  <Label htmlFor="name">Votre nom / prénom</Label>
                  <Input
                    type="text"
                    id="name"
                    className="w-[90%]"
                    {...register("name")}
                  />
                  {errors.name && (
                    <small className="font-medium text-red-500">
                      {errors.name.message}
                    </small>
                  )}
                </div>
                <div className="flex w-full flex-col items-start gap-2">
                  <Label htmlFor="phoneNumber">Votre numéro de téléphone</Label>
                  <Input
                    type="text"
                    id="phoneNumber"
                    className="w-[90%]"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <small className="font-medium text-red-500">
                      {errors.phoneNumber.message}
                    </small>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="mt-3 flex w-full items-center justify-between">
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit(handleSubmitForm)}>
                Confirmer
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
