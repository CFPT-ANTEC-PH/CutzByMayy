"use client";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { Button } from "../ui/button";
import Link from "next/link";
import { Turn as Hamburger } from "hamburger-react";
import { Separator } from "../ui/separator";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const { data: session, status } = useSession();

  const Deconnexion = async () => {
    setOpen(false);
    await signOut({ redirect: false });
    router.push("/sign-in");
  };

  return (
    <>
      <nav className="hidden h-[100px] w-screen items-center justify-evenly md:flex">
        <Link href={"/"} className="flex items-center">
          <Logo width={70} height={70} />
          <p className="text-2xl font-extrabold max-[900px]:text-xl">
            CutzByMayy
          </p>
        </Link>
        <div className="flex w-1/5 min-w-[400px] justify-between font-bold">
          <Link href="/">Accueil</Link>
          <Link href="/#tarifs">Tarifs</Link>
          <Link href="/appointment">Rendez-vous</Link>
          <Link href="/#contact">Contact</Link>
        </div>
        {status == "loading" ? (
          <Link href={"#"}>
            <Button variant={"ghost"} className="text-base font-bold">
              Chargement
            </Button>
          </Link>
        ) : status == "authenticated" ? (
          <Link href={"/account/information"}>
            <Button variant={"ghost"} className="text-base font-bold">
              Mon compte
            </Button>
          </Link>
        ) : (
          <Link href={"/sign-in"}>
            <Button variant={"ghost"} className="text-base font-bold">
              S&apos;identifier
            </Button>
          </Link>
        )}
      </nav>

      {/* Mobile */}

      <nav className={`flex h-[80px] w-screen justify-center md:hidden`}>
        <div className="z-[100] flex w-11/12 items-center justify-between">
          <Link
            href={"/"}
            className="flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <Logo width={60} height={60} />
            <p className="text-2xl font-extrabold">CutzByMayy</p>
          </Link>
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
        <div
          className={`absolute z-[99] ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          } h-screen w-screen min-w-[400px] justify-between bg-slate-950/80 font-bold backdrop-blur-md transition-all duration-500 ease-in-out`}
        >
          <div className="h-[80px]"></div>
          <div className="mt-10 flex w-screen flex-col items-center gap-8 text-xl font-medium">
            <Link href="/" onClick={() => setOpen(false)}>
              Accueil
            </Link>
            <Link href="/#tarifs" onClick={() => setOpen(false)}>
              Tarifs
            </Link>
            <Link href="/appointment" onClick={() => setOpen(false)}>
              Rendez-vous
            </Link>
            <Link href="/#contact" onClick={() => setOpen(false)}>
              Contact
            </Link>
            <Separator className="h-[1px] w-2/3 bg-white" />
            {status == "loading" ? (
              <Link href={"#"}>Chargement</Link>
            ) : status == "authenticated" ? (
              <>
                <Link
                  href={"/account/information"}
                  onClick={() => setOpen(false)}
                >
                  Mon compte
                </Link>
                <p onClick={Deconnexion}>Déconnexion</p>
              </>
            ) : (
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                S&apos;identifier
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
