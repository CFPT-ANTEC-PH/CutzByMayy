"use client";

import Particles from "@/components/magicui/particles";
import { Scissors } from "lucide-react";

export const ParticuleHome = () => {
  const color = "#ffffff";

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
      <div className="flex w-full flex-col items-center gap-y-24 max-[1443px]:gap-12">
        <h1 className="text-4xl font-bold max-[1443px]:text-3xl">
          Les différents tarifs :
        </h1>

        <div className="flex w-2/3 flex-wrap justify-between max-[1443px]:h-[275px] max-[1443px]:flex-col max-[1443px]:items-center">
          <div className="flex w-[300px] items-center justify-center gap-x-10 rounded-lg border bg-slate-900 py-6 max-[1443px]:w-[250px]">
            <div className="flex gap-3">
              <Scissors size={"28"} />
              <p className="text-lg">Taper</p>
            </div>
            <p className="text-xl font-bold">20.-</p>
          </div>

          <div className="flex w-[300px] items-center justify-center gap-x-10 rounded-lg border bg-slate-900 py-6 max-[1443px]:w-[250px]">
            <div className="flex gap-3">
              <Scissors size={"28"} />
              <p className="text-lg">Dégradé</p>
            </div>
            <p className="text-xl font-bold">25.-</p>
          </div>

          <div className="flex w-[300px] items-center justify-center gap-x-10 rounded-lg border bg-slate-900 py-6 max-[1443px]:w-[250px] max-[1443px]:gap-x-2">
            <div className="flex gap-3 max-[1443px]:gap-2">
              <Scissors size={"28"} />
              <p className="text-lg">Transformation</p>
            </div>
            <p className="text-xl font-bold">40.-</p>
          </div>
        </div>
      </div>
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
};
