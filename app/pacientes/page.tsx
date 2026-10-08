"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Search,
  UserPlus,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";

import {
  patients,
} from "@/lib/mock-data";

export default function PatientsPage() {

  const [
    search,
    setSearch,
  ] = useState("");

  const filteredPatients =
    useMemo(() => {

      const value =
        search
          .toLowerCase()
          .trim();

      if (!value) {
        return patients;
      }

      return patients.filter(
        (patient) => {

          const fullName =
            [
              patient.firstName,
              patient.secondName,
              patient.firstSurname,
              patient.secondSurname,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return (
            fullName.includes(
              value
            ) ||
            patient.cui.includes(
              value
            ) ||
            patient.expediente
              .toLowerCase()
              .includes(value)
          );
        }
      );

    }, [search]);

  return (
    <AppShell>

      <PageHeader
        title="Pacientes"
        description="Registro, búsqueda y consulta de pacientes"
        action={

          <Link
            href="/pacientes/nuevo"
            className="bg-sky-700 text-white px-4 py-3 rounded-lg flex items-center gap-2"
          >

            <UserPlus
              size={18}
            />

            Nuevo paciente

          </Link>
        }
      />

      <section className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">

        <label className="block font-semibold text-slate-700 mb-2">
          Buscar paciente
        </label>

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event
                  .target
                  .value
              )
            }
            className="w-full border border-slate-300 rounded-lg pl-11 pr-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none"
            placeholder="Ingrese CUI, expediente, nombre o apellido..."
          />

        </div>

      </section>

      <section className="mt-6 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">

        <div className="p-5 border-b">

          <h2 className="font-bold">
            Resultados
          </h2>

          <p className="text-sm text-slate-500">
            {
              filteredPatients.length
            }{" "}
            paciente(s) encontrado(s)
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-sky-800 text-white">

              <tr>

                <th className="text-left p-4">
                  Expediente
                </th>

                <th className="text-left p-4">
                  Paciente
                </th>

                <th className="text-left p-4">
                  CUI
                </th>

                <th className="text-left p-4">
                  Municipio
                </th>

                <th className="text-center p-4">
                  Admisiones
                </th>

                <th className="p-4">
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPatients.map(
                (patient) => (

                  <tr
                    key={
                      patient.id
                    }
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="p-4">
                      {
                        patient.expediente
                      }
                    </td>

                    <td className="p-4 font-medium">

                      {
                        patient.firstName
                      }{" "}

                      {
                        patient.secondName
                      }{" "}

                      {
                        patient.firstSurname
                      }{" "}

                      {
                        patient.secondSurname
                      }

                    </td>

                    <td className="p-4">
                      {
                        patient.cui
                      }
                    </td>

                    <td className="p-4">
                      {
                        patient.municipality
                      }
                    </td>

                    <td className="p-4 text-center">
                      {
                        patient
                          .admissions
                          .length
                      }
                    </td>

                    <td className="p-4 text-center">

                      <Link
                        href={`/pacientes/${patient.id}`}
                        className="bg-sky-100 text-sky-800 px-4 py-2 rounded-lg font-semibold"
                      >
                        Ver
                      </Link>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </AppShell>
  );
}