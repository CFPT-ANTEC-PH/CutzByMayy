"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button size={"icon"} variant={"outline"} onClick={() => signOut()}>
      <LogOut />
    </Button>
  );
}
