"use client";

import {
  useEffect,
  useState,
} from "react";

import AppShell from "@/components/AppShell";

import PageHeader from "@/components/PageHeader";

import StatCard from "@/components/StatCard";

import {
  apiFetch,
} from "@/lib/api";

import type {
  Admission,
  ReportSummary,
} from "@/lib/types";


export default function ReportsPage() {

  const [
    summary,
    setSummary,
  ] =
    useState<
      ReportSummary | null
    >(null);

  const [
    admissions,
    setAdmissions,
  ] =
    useState<
      Admission[]
    >([]);

  const [
    error,
    setError,
  ] =
    useState("");


  useEffect(
    () => {

      async function load() {

        try {

          const [
            reportResponse,
            admissionResponse,
          ] =
            await Promise.all([

              apiFetch(
                "/api/reports/summary"
              ),

              apiFetch(
                "/api/admissions"
              ),
            ]);


          const reportData =
            await reportResponse.json();

          const admissionData =
            await admissionResponse.json();


          if (
            !reportResponse.ok
          ) {

            setError(
              reportData.message
            );

            return;
          }


          setSummary(
            reportData
          );

          if (
            admissionResponse.ok
          ) {

            setAdmissions(
              admissionData
            );
          }

        } catch {

          setError(
            "No fue posible generar los reportes."
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
        title="Estadísticas"
        description="Información estadística de admisiones"
      />


      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-5">
          {error}
        </div>

      )}


      {summary && (

        <>

          <div className="grid md:grid-cols-3 gap-5">

            <StatCard
              title="Pacientes"
              value={
                summary.totalPatients
              }
            />

            <StatCard
              title="Admisiones"
              value={
                summary.totalAdmissions
              }
            />

            <StatCard
              title="Pacientes recurrentes"
              value={
                summary.recurrentPatients
              }
            />

          </div>


          <section className="mt-6 bg-white border rounded-xl p-6">

            <h2 className="font-bold mb-4">
              Admisiones por servicio
            </h2>

            {Object.entries(
              summary.byService
            ).map(
              ([
                service,
                total,
              ]) => (

                <div
                  key={
                    service
                  }
                  className="flex justify-between border-b py-3"
                >

                  <span>
                    {service}
                  </span>

                  <strong>
                    {total}
                  </strong>

                </div>

              )
            )}

          </section>

        </>

      )}


      <section className="mt-6 bg-white border rounded-xl overflow-hidden">

        <div className="p-5 border-b">

          <h2 className="font-bold">
            Historial de admisiones
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-sky-800 text-white">

              <tr>

                <th className="text-left p-4">
                  Fecha
                </th>

                <th className="text-left p-4">
                  Paciente
                </th>

                <th className="text-left p-4">
                  Expediente
                </th>

                <th className="text-left p-4">
                  Servicio
                </th>

                <th className="text-left p-4">
                  Área
                </th>

              </tr>

            </thead>

            <tbody>

              {admissions.map(
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

                      {new Intl.DateTimeFormat(
                        "es-GT",
                        {
                          dateStyle:
                            "short",

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
                        admission.patientName
                      }
                    </td>

                    <td className="p-4">
                      {
                        admission.expediente
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