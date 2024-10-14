import { getUser } from "@/lib/ActionUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import AuroraBGHome from "@/components/home/AuroraBGHome";
import { ParticuleHome } from "@/components/home/ParticuleHome";
import InformationsHome from "@/components/home/InformationsHome";
import { ScrollTextVelocityHome } from "@/components/home/ScrollTextVelocityHome";

export default async function Home() {
  const services = [
    { name: "Coupe Homme", price: "25€" },
    { name: "Coupe + Barbe", price: "35€" },
    { name: "Coupe Enfant", price: "20€" },
    { name: "Taille de Barbe", price: "15€" },
    { name: "Rasage Traditionnel", price: "30€" },
    { name: "Coloration", price: "40€" },
  ];
  return (
    <main>
      <section>
        <AuroraBGHome />
      </section>
      <section id="tarifs">
        <ParticuleHome />
      </section>
      <section className="flex h-[225px] items-center bg-slate-800">
        <ScrollTextVelocityHome />
      </section>
      <section id="contact">
        <InformationsHome />
      </section>
    </main>
  );
}
