import {
  Suspense,
} from "react";

import PatientClient from "./PatientClient";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}


export default function PatientPage({
  params,
}: PageProps) {

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">

          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">

            <p className="text-slate-500">
              Cargando paciente...
            </p>

          </div>

        </div>
      }
    >

      <PatientContent
        params={params}
      />

    </Suspense>
  );
}


async function PatientContent({
  params,
}: PageProps) {

  const {
    id,
  } = await params;

  return (
    <PatientClient
      id={id}
    />
  );
}