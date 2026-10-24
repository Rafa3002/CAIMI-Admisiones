"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Search,
  UserPlus,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import PageHeader from "@/components/PageHeader";

import StatCard from "@/components/StatCard";

import {
  apiFetch,
  getStoredUser,
} from "@/lib/api";

import type {
  DashboardSummary,
} from "@/lib/types";


export default function DashboardPage() {

  const [
    data,
    setData,
  ] =
    useState<
      DashboardSummary | null
    >(null);

  const [
    error,
    setError,
  ] =
    useState("");

  const user =
    getStoredUser();

  const canWrite =
    user?.role ===
      "ADMIN" ||
    user?.role ===
      "ADMISIONES";


  useEffect(
    () => {

      async function load() {

        try {

          const response =
            await apiFetch(
              "/api/dashboard/summary"
            );

          const result =
            await response.json();

          if (
            !response.ok
          ) {

            setError(
              result.message
            );

            return;
          }

          setData(
            result
          );

        } catch {

          setError(
            "No fue posible cargar el dashboard."
          );
        }
      }

      load();

    },
    []
  );


  return (
    <AppShell>

      <PageHeader
        title="Panel principal"
        description="Resumen general del sistema"
      />

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>

      )}

      {!data ? (

        <p>
          Cargando información...
        </p>

      ) : (

        <>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            <StatCard
              title="Pacientes registrados"
              value={
                data.totalPatients
              }
            />

            <StatCard
              title="Admisiones"
              value={
                data.totalAdmissions
              }
            />

            <StatCard
              title="Pacientes recurrentes"
              value={
                data.recurrentPatients
              }
            />

            <StatCard
              title="Servicios utilizados"
              value={
                data.activeServices
              }
            />

          </div>


          <section className="mt-8 bg-white border rounded-xl p-6">

            <h2 className="font-bold text-lg mb-4">
              Acciones rápidas
            </h2>

            <div className="flex gap-3 flex-wrap">

              <Link
                href="/pacientes"
                className="bg-sky-700 text-white px-5 py-3 rounded-lg flex gap-2"
              >

                <Search size={18} />

                Buscar paciente

              </Link>

              {canWrite && (

                <Link
                  href="/pacientes/nuevo"
                  className="border border-sky-700 text-sky-700 px-5 py-3 rounded-lg flex gap-2"
                >

                  <UserPlus size={18} />

                  Registrar paciente

                </Link>

              )}

            </div>

          </section>


          <section className="mt-6 bg-white border rounded-xl overflow-hidden">

            <div className="p-5 border-b">

              <h2 className="font-bold">
                Pacientes recientes
              </h2>

            </div>

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left p-4">
                    Expediente
                  </th>

                  <th className="text-left p-4">
                    Paciente
                  </th>

                  <th className="text-left p-4">
                    Municipio
                  </th>

                  <th className="text-center p-4">
                    Admisiones
                  </th>

                </tr>

              </thead>

              <tbody>

                {data.recentPatients.map(
                  (
                    patient
                  ) => (

                    <tr
                      key={
                        patient.id
                      }
                      className="border-t"
                    >

                      <td className="p-4">
                        {
                          patient.expediente
                        }
                      </td>

                      <td className="p-4">

                        <Link
                          href={`/pacientes/${patient.id}`}
                          className="text-sky-700 font-semibold"
                        >

                          {
                            patient.firstName
                          }{" "}

                          {
                            patient.firstSurname
                          }

                        </Link>

                      </td>

                      <td className="p-4">
                        {
                          patient.municipality ||
                          "-"
                        }
                      </td>

                      <td className="p-4 text-center">
                        {
                          patient.admissionsCount
                        }
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </section>

        </>

      )}

    </AppShell>
  );
}