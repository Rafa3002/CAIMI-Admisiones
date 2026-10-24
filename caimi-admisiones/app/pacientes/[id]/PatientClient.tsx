"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ClipboardPlus,
  Pencil,
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


export default function PatientClient({
  id,
}: {
  id: string;
}) {

  const [
    patient,
    setPatient,
  ] =
    useState<Patient | null>(
      null
    );

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


      async function loadPatient() {

        try {

          const response =
            await apiFetch(
              `/api/patients/${id}`
            );

          const data =
            await response.json();


          if (!response.ok) {

            setError(
              data.message ||
                "No fue posible consultar al paciente."
            );

            return;
          }


          setPatient(
            data
          );

        } catch (error) {

          console.error(
            "Error cargando paciente:",
            error
          );

          setError(
            "No fue posible comunicarse con el servidor."
          );
        }
      }


      loadPatient();

    },
    [id]
  );


  if (!patient) {

    return (
      <AppShell>

        <div className="bg-white border border-slate-200 rounded-xl p-8">

          {error ? (

            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {error}
            </div>

          ) : (

            <p className="text-slate-500">
              Cargando información del paciente...
            </p>

          )}

        </div>

      </AppShell>
    );
  }


  return (
    <AppShell>

      <PageHeader
        title={`${patient.firstName} ${patient.firstSurname}`}
        description={`Expediente ${patient.expediente}`}
        action={

          canWrite ? (

            <div className="flex flex-wrap gap-2">

              <Link
                href={`/pacientes/${id}/editar`}
                className="border border-sky-700 text-sky-700 px-4 py-3 rounded-lg flex items-center gap-2"
              >

                <Pencil
                  size={18}
                />

                Editar

              </Link>


              <Link
                href={`/pacientes/${id}/admisiones/nueva`}
                className="bg-sky-700 text-white px-4 py-3 rounded-lg flex items-center gap-2"
              >

                <ClipboardPlus
                  size={18}
                />

                Nueva admisión

              </Link>

            </div>

          ) : undefined
        }
      />


      {/* DATOS GENERALES */}

      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">

        <div className="bg-sky-50 border-b border-sky-100 px-6 py-4">

          <h2 className="font-bold text-sky-800">
            Datos generales del paciente
          </h2>

        </div>


        <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Data
            label="CUI / DPI"
            value={
              patient.cui ||
              "Sin CUI"
            }
          />

          <Data
            label="Expediente"
            value={
              patient.expediente
            }
          />

          <Data
            label="Nombre"
            value={
              [
                patient.firstName,
                patient.secondName,
                patient.firstSurname,
                patient.secondSurname,
              ]
                .filter(Boolean)
                .join(" ")
            }
          />

          <Data
            label="Fecha de nacimiento"
            value={
              patient.birthDate
                ? String(
                    patient.birthDate
                  ).substring(
                    0,
                    10
                  )
                : "No registrada"
            }
          />

          <Data
            label="Sexo"
            value={
              patient.sex ||
              "No registrado"
            }
          />

          <Data
            label="Teléfono"
            value={
              patient.phone ||
              "No registrado"
            }
          />

          <Data
            label="Departamento"
            value={
              patient.department ||
              "No registrado"
            }
          />

          <Data
            label="Municipio"
            value={
              patient.municipality ||
              "No registrado"
            }
          />

          <Data
            label="Comunidad"
            value={
              patient.community ||
              "No registrada"
            }
          />

          <div className="sm:col-span-2 lg:col-span-3">

            <Data
              label="Dirección"
              value={
                patient.address ||
                "No registrada"
              }
            />

          </div>

        </div>

      </section>


      {/* ADMISIONES */}

      <section className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="font-bold text-xl text-sky-800">
            Historial de admisiones
          </h2>

          <p className="text-sm text-slate-500 mt-1">

            {
              patient.admissions?.length ||
              0
            }{" "}

            admisión(es) registrada(s)

          </p>

        </div>


        {!patient.admissions ||
        patient.admissions.length ===
          0 ? (

          <div className="p-10 text-center text-slate-500">

            Este paciente todavía no tiene admisiones registradas.

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-sky-800 text-white">

                <tr>

                  <th className="text-left p-4">
                    Fecha
                  </th>

                  <th className="text-left p-4">
                    Servicio
                  </th>

                  <th className="text-left p-4">
                    Área
                  </th>

                  <th className="text-left p-4">
                    Motivo
                  </th>

                  <th className="text-left p-4">
                    Responsable
                  </th>

                </tr>

              </thead>


              <tbody>

                {patient.admissions.map(
                  (
                    admission
                  ) => (

                    <tr
                      key={
                        admission.id
                      }
                      className="border-t hover:bg-slate-50"
                    >

                      <td className="p-4">

                        {new Intl.DateTimeFormat(
                          "es-GT",
                          {
                            dateStyle:
                              "medium",

                            timeStyle:
                              "short",

                            timeZone:
                              "America/Guatemala",
                          }
                        ).format(
                          new Date(
                            admission.date
                          )
                        )}

                      </td>


                      <td className="p-4">
                        {
                          admission.service
                        }
                      </td>


                      <td className="p-4">
                        {
                          admission.area
                        }
                      </td>


                      <td className="p-4">
                        {
                          admission.reason
                        }
                      </td>


                      <td className="p-4">
                        {
                          admission.responsible ||
                          "No registrado"
                        }
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </AppShell>
  );
}


function Data({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <div>

      <p className="text-sm text-slate-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}