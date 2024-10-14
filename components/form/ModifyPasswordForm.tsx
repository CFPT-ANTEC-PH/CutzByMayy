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
import { useToast } from "@/components/ui/use-toast";
import { signOut, useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderCircle } from "lucide-react";
import { changePassword } from "@/lib/ActionUsers";
import { useRouter } from "next/navigation";

type FormSchema = {
  current: string;
  new: string;
  id: string;
};

export default function ModifyPasswordForm() {
  const zodFormSchema: ZodType<FormSchema> = z.object({
    current: z.string().min(1, "Votre mot de passe actuel est requis"),
    new: z
      .string()
      .min(8, "Le nouveau mot de passe doit faire au moins 8 caractères"),
    id: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(zodFormSchema),
  });

  const { toast } = useToast();
  const router = useRouter();

  const handleSubmitForm = async (data: FormSchema) => {
    try {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("current", data.current);
      formData.append("new", data.new);

      const pwdUpdate = await changePassword(formData);
      if (pwdUpdate) {
        await signOut({ redirect: false });
        router.push("/sign-in");
      } else {
        toast({ title: "Erreur", description: "La mise à jour a échoué." });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe</CardTitle>
        <CardDescription>
          Changez votre mot de passe ici. Après avoir enregistré, vous serez
          déconnecté et redirié sur la page de connexion.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <CardContent>
          <input type="hidden" {...register("id")} value={user?.id} />
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="current">Mot de passe actuel</Label>
            <Input id="current" type="password" {...register("current")} />
            {errors.current && (
              <small className="font-medium text-red-500">
                {errors.current.message}
              </small>
            )}
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="new">Nouveau mot de passe</Label>
            <Input id="new" type="password" {...register("new")} />
            {errors.new && (
              <small className="font-medium text-red-500">
                {errors.new.message}
              </small>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {isSubmitting ? (
            <Button className="w-full" disabled>
              <LoaderCircle className="m-auto animate-spin" />
            </Button>
          ) : (
            <Button className="w-full">Enregistrer</Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
