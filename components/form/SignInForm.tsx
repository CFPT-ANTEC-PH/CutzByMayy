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
import { updateCodeUser } from "@/lib/ActionUsers";

type FormSchema = {
  email: string;
  password: string;
};

export default function SignInForm() {
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

  const { toast } = useToast();
  const router = useRouter();
  const zodFormSchema: ZodType<FormSchema> = z.object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit faire au moins 8 caractères"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(zodFormSchema),
  });

  const handleSubmitForm = async (data: FormSchema) => {
    const signInData = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (signInData?.error) {
      if (signInData.error === "verify-code") {
        const code = Math.floor(100000 + Math.random() * 900000);
        const email = data.email;
        const response = await fetchEmail(code, email);
        if (response) {
          await updateCodeUser(email, code);
          router.push("/verify-code");
        } else {
          toast({
            variant: "destructive",
            description: "L'envoie de l'email a échoué.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          description: "Connexion raté. Veuillez réessayer.",
        });
      }
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Connexion</CardTitle>
        <CardDescription>
          Entrez vos infos en dessous pour vous connecter.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <CardContent className="grid gap-4">
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
          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <small className="font-medium text-red-500">
                {errors.password.message}
              </small>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {isSubmitting ? (
            <Button className="w-full" disabled>
              <LoaderCircle className="m-auto animate-spin" />
            </Button>
          ) : (
            <Button className="w-full">Se connecter</Button>
          )}
          <div className="flex">
            <p className="text-sm">Vous n&apos;avez pas de compte ?&nbsp;</p>{" "}
            <Link className="text-sm text-blue-500 underline" href={"/sign-up"}>
              S&apos;inscrire
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
