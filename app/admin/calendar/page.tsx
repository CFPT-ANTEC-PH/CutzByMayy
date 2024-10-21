"use client";
import Calendar from "@/components/calendar/Calendar";
import { useState } from "react";

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center">
      <Calendar />
    </div>
  );
}
