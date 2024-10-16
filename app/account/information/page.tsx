"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModifyPasswordForm from "@/components/form/ModifyPasswordForm";
import ModifyAccountForm from "@/components/form/ModifyAccountForm";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const { data: session, status } = useSession();

  const router = useRouter();
  if (session === null) {
    router.push("/sign-in");
  }

  const Deconnexion = async () => {
    await signOut({ redirect: false });
    router.push("/sign-in");
  };

  return (
    <section className="my-[20px] flex flex-col items-center gap-5">
      <Tabs defaultValue="account" className="w-1/3 min-w-[370px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="password">Mot de passe</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <ModifyAccountForm />
        </TabsContent>
        <TabsContent value="password">
          <ModifyPasswordForm />
        </TabsContent>
      </Tabs>
      <Card className="w-1/3 min-w-[370px]">
        <CardHeader>
          <CardTitle>Se déconnecter</CardTitle>
          <CardDescription>
            Cliquer sur le bouton ci-dessous pour vous déconnecter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant={"destructive"} onClick={Deconnexion}>
            Déconnexion
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
