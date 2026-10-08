import Link from "next/link";

import {
  Search,
  UserPlus,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

import {
  patients,
} from "@/lib/mock-data";

export default function DashboardPage() {

  const totalAdmissions =
    patients.reduce(
      (
        total,
        patient
      ) =>
        total +
        patient
          .admissions
          .length,
      0
    );

  const patientsWithAdmissions =
    patients.filter(
      (patient) =>
        patient
          .admissions
          .length > 0
    ).length;

  return (
    <AppShell>

      <PageHeader
        title="Panel principal"
        description="Resumen general del sistema de admisiones"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

        <StatCard
          title="Pacientes registrados"
          value={
            patients.length
          }
        />

        <StatCard
          title="Admisiones registradas"
          value={
            totalAdmissions
          }
        />

        <StatCard
          title="Pacientes recurrentes"
          value={
            patientsWithAdmissions
          }
        />

        <StatCard
          title="Servicios activos"
          value="3"
        />

      </div>

      <section className="mt-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Acciones rápidas
        </h2>

        <div className="flex flex-wrap gap-3">

          <Link
            href="/pacientes"
            className="bg-sky-700 hover:bg-sky-800 text-white px-5 py-3 rounded-lg flex items-center gap-2"
          >

            <Search
              size={18}
            />

            Buscar paciente

          </Link>

          <Link
            href="/pacientes/nuevo"
            className="border border-sky-700 text-sky-700 hover:bg-sky-50 px-5 py-3 rounded-lg flex items-center gap-2"
          >

            <UserPlus
              size={18}
            />

            Registrar paciente

          </Link>

        </div>

      </section>

      <section className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="font-bold text-lg">
            Pacientes recientes
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

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

              {patients.map(
                (patient) => (

                  <tr
                    key={
                      patient.id
                    }
                    className="border-t"
                  >

                    <td className="p-4">

                      <Link
                        href={`/pacientes/${patient.id}`}
                        className="text-sky-700 font-semibold hover:underline"
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