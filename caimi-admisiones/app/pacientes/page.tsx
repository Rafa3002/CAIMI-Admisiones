"use client";

import {
  FormEvent,
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

import {
  apiFetch,
  getStoredUser,
} from "@/lib/api";

import type {
  Patient,
} from "@/lib/types";


export default function PatientsPage() {

  const [
    patients,
    setPatients,
  ] =
    useState<
      Patient[]
    >([]);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    canWrite,
    setCanWrite,
  ] =
    useState(false);


  useEffect(
    () => {

      const user =
        getStoredUser();

      setCanWrite(
        user?.role ===
          "ADMIN" ||
        user?.role ===
          "ADMISIONES"
      );

      loadPatients();

    },
    []
  );


  async function loadPatients(
    value = ""
  ) {

    setLoading(true);
    setError("");

    try {

      const response =
        await apiFetch(
          `/api/patients?q=${encodeURIComponent(
            value
          )}`
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {

        setError(
          data.message ||
            "Error consultando pacientes."
        );

        return;
      }

      setPatients(
        data
      );

    } catch {

      setError(
        "No fue posible comunicarse con el servidor."
      );

    } finally {

      setLoading(false);
    }
  }


  function searchPatient(
    event:
      FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    loadPatients(
      search
    );
  }


  return (
    <AppShell>

      <PageHeader
        title="Pacientes"
        description="Registro, búsqueda y consulta de pacientes"
        action={

          canWrite ? (

            <Link
              href="/pacientes/nuevo"
              className="bg-sky-700 text-white px-4 py-3 rounded-lg flex gap-2"
            >

              <UserPlus size={18} />

              Nuevo paciente

            </Link>

          ) : undefined

        }
      />


      <form
        onSubmit={
          searchPatient
        }
        className="bg-white border rounded-xl p-6"
      >

        <label className="block font-semibold mb-2">
          Buscar paciente
        </label>

        <div className="flex gap-3">

          <div className="relative flex-1">

            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={19}
            />

            <input
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              className="w-full border rounded-lg pl-11 pr-4 py-3"
              placeholder="CUI, expediente, nombre o apellido"
            />

          </div>

          <button
            type="submit"
            className="bg-sky-700 text-white px-6 rounded-lg"
          >
            Buscar
          </button>

        </div>

      </form>


      {error && (

        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>

      )}


      <section className="mt-6 bg-white border rounded-xl overflow-hidden">

        <div className="p-5 border-b">

          {loading
            ? "Buscando..."
            : `${patients.length} paciente(s) encontrado(s)`}

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

              {patients.map(
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
                        patient.cui ||
                        "Sin CUI"
                      }
                    </td>

                    <td className="p-4">
                      {
                        patient.municipality ||
                        "-"
                      }
                    </td>

                    <td className="p-4 text-center">
                      {
                        patient.admissionsCount ||
                        0
                      }
                    </td>

                    <td className="p-4 text-center">

                      <Link
                        href={`/pacientes/${patient.id}`}
                        className="bg-sky-100 text-sky-800 px-4 py-2 rounded-lg"
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