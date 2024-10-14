"use client";

import EmailForm from "@/components/EmailForm";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";

export default function Page() {
  const [isChecked, setIsChecked] = useState<boolean>();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <div>
        <h1>Envoyer un Email</h1>
        <EmailForm />
      </div>
    </>
  );
}
