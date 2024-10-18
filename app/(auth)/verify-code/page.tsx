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
import { getUserByCode, updateVerifyCode } from "@/lib/ActionUsers";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleVerify = async () => {
    try {
      setLoading(true);
      const code = value;
      const verify = await getUserByCode(parseInt(code, 10));
      if (verify !== false) {
        await updateVerifyCode(verify.email);

        const signInData = await signIn("credentials", {
          email: verify.email,
          password: verify.password,
          redirect: false,
        });
        console.log(verify.password);

        if (signInData?.error) {
          router.push("/sign-in");
          router.refresh();
        } else {
          router.push("/");
          router.refresh();
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
