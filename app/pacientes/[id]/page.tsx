import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  ClipboardPlus,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";

import {
  patients,
} from "@/lib/mock-data";

export default async function PatientPage({
  params,
}: {
  params:
    Promise<{
      id: string;
    }>;
}) {

  const {
    id,
  } = await params;

  const patient =
    patients.find(
      (item) =>
        item.id === id
    );

  if (!patient) {
    notFound();
  }

  return (
    <AppShell>

      <PageHeader
        title={`${patient.firstName} ${patient.firstSurname}`}
        description={`Expediente ${patient.expediente}`}
        action={

          <Link
            href={`/pacientes/${patient.id}/admisiones/nueva`}
            className="bg-sky-700 text-white px-4 py-3 rounded-lg flex items-center gap-2"
          >

            <ClipboardPlus
              size={18}
            />

            Nueva admisión

          </Link>
        }
      />

      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">

        <div className="bg-sky-50 border-b px-6 py-4">

          <h2 className="font-bold text-sky-800">
            Datos generales del paciente
          </h2>

        </div>

        <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Data
            label="CUI"
            value={
              patient.cui
            }
          />

          <Data
            label="Expediente"
            value={
              patient.expediente
            }
          />

          <Data
            label="Fecha de nacimiento"
            value={
              patient.birthDate
            }
          />

          <Data
            label="Sexo"
            value={
              patient.sex
            }
          />

          <Data
            label="Teléfono"
            value={
              patient.phone ??
              "No registrado"
            }
          />

          <Data
            label="Municipio"
            value={
              patient.municipality
            }
          />

          <div className="sm:col-span-2 lg:col-span-3">

            <Data
              label="Dirección"
              value={
                patient.address ??
                "No registrada"
              }
            />

          </div>

        </div>

      </section>

      <section className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="p-6">

          <h2 className="font-bold text-xl text-sky-800">
            Historial de admisiones
          </h2>

          <p className="text-slate-500">
            {
              patient
                .admissions
                .length
            }{" "}
            admisión(es) encontrada(s)
          </p>

        </div>

        {patient.admissions.length ===
        0 ? (

          <div className="p-10 text-center border-t text-slate-500">

            Este paciente todavía no registra admisiones.

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
                      className="border-t"
                    >

                      <td className="p-4">
                        {
                          admission.date
                        }
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
                          admission.responsible
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