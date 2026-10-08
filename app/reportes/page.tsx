import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

import {
  patients,
} from "@/lib/mock-data";

export default function ReportsPage() {

  const admissions =
    patients.flatMap(
      (patient) =>
        patient.admissions.map(
          (
            admission
          ) => ({
            ...admission,

            patient:
              `${patient.firstName} ${patient.firstSurname}`,
          })
        )
    );

  const emergencies =
    admissions.filter(
      (item) =>
        item.service ===
        "Emergencia"
    ).length;

  return (
    <AppShell>

      <PageHeader
        title="Estadísticas de Salud"
        description="Reportes estadísticos de admisiones"
      />

      <div className="grid md:grid-cols-3 gap-5">

        <StatCard
          title="Admisiones"
          value={
            admissions.length
          }
        />

        <StatCard
          title="Emergencias"
          value={
            emergencies
          }
        />

        <StatCard
          title="Pacientes"
          value={
            patients.length
          }
        />

      </div>

      <section className="mt-6 bg-white border rounded-xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="font-bold text-lg">
            Detalle de admisiones
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
                      {
                        admission.date
                      }
                    </td>

                    <td className="p-4">
                      {
                        admission.patient
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