"use client";
import React from "react";
import { AuroraBackground } from "../ui/aurora-background";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";
import { CarouselHome } from "./CarouselHome";
import ShinyButton from "../magicui/shiny-button";

export default function AuroraBGHome() {
  return (
    <div className="flex h-[80vh] justify-center">
      <div className="flex w-2/3 items-center justify-between max-lg:flex-col max-lg:gap-7">
        <div className="flex flex-col gap-8 max-lg:w-2/3 max-lg:min-w-[300px] max-lg:gap-4">
          <h1 className="max-lg:w-lg max-w-md text-4xl font-bold dark:text-red-500">
            Bienvenue chez CutzByMayy
          </h1>
          <p className="max-w-sm text-justify text-xl">
            Découvrez l&apos;art de la coiffure masculine dans notre salon. Nos
            experts barbiers vous offrent des coupes tendance et un service
            personnalisé pour révéler votre meilleur style.
          </p>
          <Link href="/appointment">
            <Button size={"lg"}>Réserver maintenant</Button>
          </Link>
        </div>

        <div className="flex justify-center">
          <CarouselHome />
        </div>
      </div>
    </div>
  );
}
