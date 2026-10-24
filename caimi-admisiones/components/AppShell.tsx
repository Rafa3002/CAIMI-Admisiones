"use client";

import type {
  ReactNode,
} from "react";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  BarChart3,
  HeartPulse,
  Home,
  LogOut,
  UserCog,
  Users,
} from "lucide-react";

import {
  apiFetch,
  clearSession,
} from "@/lib/api";

import type {
  User,
} from "@/lib/types";


export default function AppShell({
  children,
}: {
  children:
    ReactNode;
}) {

  const router =
    useRouter();

  const [
    user,
    setUser,
  ] =
    useState<
      User | null
    >(null);

  const [
    ready,
    setReady,
  ] =
    useState(false);

  const [
    connectionError,
    setConnectionError,
  ] =
    useState(false);


  useEffect(
    () => {

      async function validate() {

        try {

          const response =
            await apiFetch(
              "/api/auth/me"
            );

          if (
            !response.ok
          ) {

            clearSession();

            router.replace(
              "/login"
            );

            return;
          }

          const data =
            await response.json();

          setUser(data);

          localStorage.setItem(
            "caimi_user",
            JSON.stringify(
              data
            )
          );

          setReady(true);

        } catch (
          error
        ) {

          console.error(
            error
          );

          setConnectionError(
            true
          );

          setReady(true);
        }
      }

      validate();

    },
    [router]
  );


  function logout() {

    clearSession();

    router.replace(
      "/login"
    );
  }


  if (!ready) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <p className="text-slate-500">
          Validando sesión...
        </p>

      </div>
    );
  }


  if (
    connectionError
  ) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">

        <div className="bg-white border rounded-xl p-8 text-center">

          <h1 className="font-bold text-xl text-red-700">
            No se pudo conectar con el servidor
          </h1>

          <p className="text-slate-500 mt-2">
            Verifique que el backend esté ejecutándose en el puerto 4000.
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-sky-900 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          <div className="flex gap-3 items-center">

            <HeartPulse
              size={30}
            />

            <div>

              <h1 className="font-bold text-xl">
                CAIMI
              </h1>

              <p className="text-xs text-sky-200">
                San Cristóbal Verapaz
              </p>

            </div>

          </div>

          <div className="text-right">

            <p className="font-semibold text-sm">
              {
                user?.name
              }
            </p>

            <p className="text-xs text-sky-200">
              {
                user?.role
              }
            </p>

          </div>

        </div>

        <nav className="bg-sky-800">

          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">

            <Nav
              href="/dashboard"
              icon={
                <Home size={17} />
              }
            >
              Inicio
            </Nav>

            <Nav
              href="/pacientes"
              icon={
                <Users size={17} />
              }
            >
              Pacientes
            </Nav>

            {user?.role !==
              "CONSULTA" && (

              <Nav
                href="/reportes"
                icon={
                  <BarChart3 size={17} />
                }
              >
                Estadísticas
              </Nav>

            )}

            {user?.role ===
              "ADMIN" && (

              <Nav
                href="/usuarios"
                icon={
                  <UserCog size={17} />
                }
              >
                Usuarios
              </Nav>

            )}

            <button
              onClick={
                logout
              }
              className="flex items-center gap-2 px-5 py-4 hover:bg-sky-700"
            >

              <LogOut
                size={17}
              />

              Cerrar sesión

            </button>

          </div>

        </nav>

      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {children}

      </main>

    </div>
  );
}


function Nav({
  href,
  icon,
  children,
}: {
  href: string;

  icon:
    ReactNode;

  children:
    ReactNode;
}) {

  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-5 py-4 whitespace-nowrap hover:bg-sky-700"
    >

      {icon}

      {children}

    </Link>
  );
}