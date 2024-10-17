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
import { set } from "date-fns";
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
        router.push("sign-in");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError("Une erreur est survenue lors de la vérification du code");
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Vérification du Code</CardTitle>
        <CardDescription>
          Entrez le code à 6 chiffres pour vérification
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
        <Button onClick={handleVerify} className="mt-4 w-full">
          Vérifier
        </Button>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
