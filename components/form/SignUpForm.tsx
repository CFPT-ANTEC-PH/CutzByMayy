"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormSchema = {
  name: string;
  first_name: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
};

export default function SignUpForm() {
  const { toast } = useToast();
  const router = useRouter();
  const zodFormSchema: ZodType<FormSchema> = z
    .object({
      name: z.string().min(1, "Le nom est requis"),
      first_name: z.string().min(1, "Le prénom est requis"),
      phone_number: z.string().min(1, "Le numéro de téléphone est requis"),
      email: z.string().email("Email invalide"),
      password: z
        .string()
        .min(8, "Le mot de passe doit faire au moins 8 caractères"),
      confirm_password: z
        .string()
        .min(8, "Le mot de passe doit faire au moins 8 caractères"),
    })
    .refine((data) => data.password === data.confirm_password, {
      path: ["confirm_password"],
      message: "Les mots de passe ne correspondent pas",
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(zodFormSchema),
  });

  const handleSubmitForm = async (data: FormSchema) => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        first_name: data.first_name,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
      }),
    });

    if (response.ok) {
      router.push("sign-in");
    } else {
      toast({
        variant: "destructive",
        description: "L'inscription a raté. Veuillez reéssayer.",
      });
      console.error("Registration failed");
    }
  };

  return (
    <Card className="w-full max-w-xl max-sm:max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Inscription</CardTitle>
        <CardDescription>
          Entrez vos infos en dessous pour vous inscrire.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap justify-between max-sm:flex-col max-sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nom"
                {...register("name")}
              />
              {errors.name && (
                <small className="font-medium text-red-500">
                  {errors.name.message}
                </small>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                type="text"
                placeholder="Prénom"
                {...register("first_name")}
              />
              {errors.first_name && (
                <small className="font-medium text-red-500">
                  {errors.first_name.message}
                </small>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-between max-sm:flex-col max-sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone_number">Numéro de téléphone</Label>
              <Input
                id="phone_number"
                type="text"
                placeholder="+41 79 123 45 67"
                {...register("phone_number")}
              />
              {errors.phone_number && (
                <small className="font-medium text-red-500">
                  {errors.phone_number.message}
                </small>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="mail@example.com"
                {...register("email")}
              />
              {errors.email && (
                <small className="font-medium text-red-500">
                  {errors.email.message}
                </small>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-between max-sm:flex-col max-sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <small className="font-medium text-red-500">
                  {errors.password.message}
                </small>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm_password">Confirmer mot de passe</Label>
              <Input
                id="confirm_password"
                type="password"
                {...register("confirm_password")}
              />
              {errors.confirm_password && (
                <small className="font-medium text-red-500">
                  {errors.confirm_password.message}
                </small>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {isSubmitting ? (
            <Button className="w-full" disabled>
              <LoaderCircle className="m-auto animate-spin" />
            </Button>
          ) : (
            <Button className="w-full">S&apos;inscrire</Button>
          )}
          <div className="flex">
            <p className="text-sm">Vous avez déjà un compte ?&nbsp;</p>{" "}
            <Link className="text-sm text-blue-500 underline" href={"/sign-in"}>
              Se connecter
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
