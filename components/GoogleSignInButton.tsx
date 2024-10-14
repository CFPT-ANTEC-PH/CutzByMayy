import React from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface GoogleSignInButton {
  children: React.ReactNode;
}

export default function GoogleSignInButton({ children }: GoogleSignInButton) {
  const { toast } = useToast();
  const loginWithGoogle = () => {
    toast({
      description: "Pas encore dispo (flemme d'écrire en anglais)",
      variant: "destructive",
      title: "Erreur",
    });
  };
  return (
    <Button variant={"outline"} className="w-full" onClick={loginWithGoogle}>
      {children}
    </Button>
  );
}
