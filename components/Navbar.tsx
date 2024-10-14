"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LogOut, Menu, User } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();

  const [isClicked, setIsClicked] = useState(false);

  function handleChange() {
    setIsClicked(!isClicked);
  }

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const router = useRouter();

  const deconnexion = async () => {
    setShowNavbar(false);
    await signOut({ redirect: false });
    router.push("/sign-in");
  };

  return (
    <>
      {/* Ordinateur */}
      <nav
        className={`fixed z-[11] ${showNavbar ? "top-0" : "top-[-100%]"} flex h-[140px] w-screen items-center justify-around bg-opacity-30 text-white shadow-xl backdrop-blur-xl transition-all duration-700 ease-in-out max-lg:hidden`}
      >
        <Link href={"/"}>
          <Image src={"/cutzbymayy.svg"} alt="logo" height={170} width={170} />
        </Link>
        <ul className="flex items-center gap-12 text-lg font-semibold">
          <li>
            <Link href={"/"} className="hover:underline">
              Accueil
            </Link>
          </li>
          <li>
            <Link href={"/#tarifs"} className="hover:underline">
              Tarifs
            </Link>
          </li>
          <li>
            <Link href={"/appointment"} className="hover:underline">
              Rendez-vous
            </Link>
          </li>
          <li>
            <Link href={"/#contact"} className="hover:underline">
              Contact
            </Link>
          </li>
          <li>
            <p>|</p>
          </li>
          <li>
            {status === "authenticated" ? (
              <div className="flex items-center gap-5">
                <Link href={"/account/information"} className="hover:underline">
                  <Button variant={"ghost"} size={"icon"}>
                    <User size={"24"} />
                  </Button>
                </Link>
                <Button size={"icon"} variant={"ghost"}>
                  <LogOut size={"24"} onClick={deconnexion} />
                </Button>
              </div>
            ) : (
              <Link href={"/sign-in"} className="hover:underline max-lg:hidden">
                S&apos;identifier
              </Link>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile */}
      <nav className="absolute left-0 top-0 z-[98] hidden h-[60px] w-full bg-slate-950 shadow-xl max-lg:flex">
        <input
          type="checkbox"
          name=""
          id="sidebar-active"
          className="hidden"
          onChange={handleChange}
        />
        <div className="flex w-full items-center justify-center">
          <label htmlFor="sidebar-active" className="absolute left-5">
            <Menu size={40} />
          </label>

          <a href="/" className="text-2xl font-extrabold no-underline">
            CutzByMayy
          </a>
        </div>

        <label
          htmlFor="sidebar-active"
          className={`${
            isClicked ? "fixed left-0 top-0 z-[99] h-full w-full" : ""
          }`}
        ></label>
        <div
          className={`fixed left-0 top-0 z-[100] flex h-full w-[300px] flex-col items-end bg-slate-900 transition-all duration-700 ease-in-out ${
            isClicked ? "left-0" : "left-[-100%]"
          }`}
        >
          <label htmlFor="sidebar-active" className="block p-[20px] lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              viewBox="0 -960 960 960"
              width="32px"
              fill="#e8eaed"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </label>
          <Link
            className="mr-auto flex h-full items-center text-slate-50 underline max-lg:mr-0 max-lg:box-border max-lg:h-auto max-lg:w-full max-lg:justify-start max-lg:px-[30px] max-lg:py-[20px]"
            href="/"
            onClick={handleChange}
          >
            Accueil
          </Link>
          <Link
            className="flex h-full items-center text-slate-50 underline max-lg:mr-0 max-lg:box-border max-lg:h-auto max-lg:w-full max-lg:justify-start max-lg:px-[30px] max-lg:py-[20px]"
            href="/#tarifs"
            onClick={handleChange}
          >
            Tarifs
          </Link>
          <Link
            className="flex h-full items-center text-slate-50 underline max-lg:mr-0 max-lg:box-border max-lg:h-auto max-lg:w-full max-lg:justify-start max-lg:px-[30px] max-lg:py-[20px]"
            href="/appointment"
            onClick={handleChange}
          >
            Rendez-vous
          </Link>
          <Link
            className="flex h-full items-center text-slate-50 underline max-lg:mr-0 max-lg:box-border max-lg:h-auto max-lg:w-full max-lg:justify-start max-lg:px-[30px] max-lg:py-[20px]"
            href="/#contact"
            onClick={handleChange}
          >
            Contact
          </Link>
          <div className="flex w-full justify-center">
            <Separator className="my-2 h-[1px] w-[250px] bg-slate-50" />
          </div>
          {status === "authenticated" ? (
            <>
              <Link
                className="flex h-full items-center text-slate-50 underline max-lg:mr-0 max-lg:box-border max-lg:h-auto max-lg:w-full max-lg:justify-start max-lg:px-[30px] max-lg:py-[20px]"
                href="/account/information"
                onClick={handleChange}
              >
                Mon compte
              </Link>
              <Link
                className="flex h-full items-center text-slate-50 underline max-lg:mr-0 max-lg:box-border max-lg:h-auto max-lg:w-full max-lg:justify-start max-lg:px-[30px] max-lg:py-[20px]"
                href="/"
                onClick={deconnexion}
              >
                Déconnexion
              </Link>
            </>
          ) : (
            <Link
              className="flex h-full items-center text-slate-50 underline max-lg:mr-0 max-lg:box-border max-lg:h-auto max-lg:w-full max-lg:justify-start max-lg:px-[30px] max-lg:py-[20px]"
              href="/sign-in"
              onClick={handleChange}
            >
              S&apos;identifier
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
