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
import { signIn, signOut, useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderCircle } from "lucide-react";
import { changePassword, updateUser } from "@/lib/ActionUsers";
import { useRouter } from "next/navigation";
import { stat } from "fs";
import { Skeleton } from "../ui/skeleton";

type FormSchema = {
  id: string;
  name: string;
  first_name: string;
  email: string;
  phone_number: string;
};

export default function ModifyAccountForm() {
  const { data: session, status, update } = useSession();
  const user = session?.user;

  const zodFormSchema: ZodType<FormSchema> = z.object({
    id: z.string().min(1, "Votre ID est requis"),
    name: z.string().min(1, "Votre nom est requis"),
    first_name: z.string().min(1, "Votre prénom est requis"),
    email: z
      .string()
      .email("Votre email est invalide")
      .min(1, "Votre email est requis"),
    phone_number: z.string().min(1, "Votre numéro de téléphone est requis"),
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
      formData.append("name", data.name);
      formData.append("first_name", data.first_name);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);

      const changeInformation = await updateUser(formData);
      await update();
      if (changeInformation) {
        const updatedSession = await signIn("credentials", {
          redirect: false,

          email: data.email,
          name: data.name,
          first_name: data.first_name,
          phone_number: data.phone_number,
        });
        console.log(updatedSession);

        router.refresh();
        toast({
          title: "Réussite",
          description: "La mise à jour a fonctionné.",
          variant: "default",
        });
      } else {
        toast({
          title: "Erreur",
          description: "La mise à jour a échoué.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {status === "loading" ? (
        <Card>
          <CardHeader>
            <CardTitle>Compte</CardTitle>
            <CardDescription>
              Changez les informations de votre compte ici. Cliquez sur
              enregistrer lorsque vous avez terminé.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <SkeletonInfo />
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>
              Enregistrer
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Compte</CardTitle>
            <CardDescription>
              Changez les informations de votre compte ici. Cliquez sur
              enregistrer lorsque vous avez terminé.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <CardContent className="flex flex-col gap-6">
              <input
                id="id"
                type="text"
                {...register("id")}
                defaultValue={user?.id}
                hidden
              />
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Votre nom</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  defaultValue={user?.name}
                />
                {errors.name && (
                  <small className="font-medium text-red-500">
                    {errors.name.message}
                  </small>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="first_name">Votre prénom</Label>
                <Input
                  id="first_name"
                  type="text"
                  {...register("first_name")}
                  defaultValue={user?.first_name}
                />
                {errors.first_name && (
                  <small className="font-medium text-red-500">
                    {errors.first_name.message}
                  </small>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Votre e-mail</Label>
                {user?.email ? (
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    defaultValue={user?.email}
                  />
                ) : (
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Votre e-mail"
                  />
                )}
                {errors.email && (
                  <small className="font-medium text-red-500">
                    {errors.email.message}
                  </small>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone_number">Votre numéro de téléphone</Label>
                <Input
                  id="phone_number"
                  type="text"
                  {...register("phone_number")}
                  defaultValue={user?.phone_number}
                />
                {errors.phone_number && (
                  <small className="font-medium text-red-500">
                    {errors.phone_number.message}
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
      )}
    </>
  );
}

const SkeletonInfo = () => {
  return (
    <>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="flex flex-col space-y-1.5">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-[40px] w-full" />
          </div>
        ))}
    </>
  );
};
