"use client";

import {
  FormEvent,
  use,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";

export default function NewAdmissionPage({
  params,
}: {
  params:
    Promise<{
      id: string;
    }>;
}) {

  const {
    id,
  } = use(params);

  const router =
    useRouter();

  const [
    saved,
    setSaved,
  ] = useState(false);

  function submit(
    event:
      FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setSaved(true);

    setTimeout(() => {

      router.push(
        `/pacientes/${id}`
      );

    }, 1500);
  }

  return (
    <AppShell>

      <PageHeader
        title="Nueva admisión"
        description="Registro de una nueva admisión asociada al paciente"
      />

      <form
        onSubmit={submit}
        className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden"
      >

        <div className="bg-sky-50 border-b px-6 py-4">

          <h2 className="font-bold text-sky-800">
            Datos de la admisión
          </h2>

        </div>

        <div className="p-6 grid md:grid-cols-2 gap-5">

          <Field
            label="Fecha *"
            name="date"
            type="date"
            required
          />

          <Field
            label="Hora *"
            name="time"
            type="time"
            required
          />

          <div>

            <label className="block text-sm font-semibold mb-2">
              Servicio *
            </label>

            <select
              required
              className="w-full border rounded-lg px-3 py-3"
            >

              <option value="">
                Seleccione
              </option>

              <option>
                Emergencia
              </option>

              <option>
                Consulta externa
              </option>

              <option>
                Maternidad
              </option>

              <option>
                Otro
              </option>

            </select>

          </div>

          <Field
            label="Área"
            name="area"
          />

          <div className="md:col-span-2">

            <label className="block text-sm font-semibold mb-2">
              Motivo de admisión *
            </label>

            <textarea
              required
              rows={3}
              className="w-full border rounded-lg px-3 py-3"
            />

          </div>

          <div className="md:col-span-2">

            <label className="block text-sm font-semibold mb-2">
              Observaciones
            </label>

            <textarea
              rows={4}
              className="w-full border rounded-lg px-3 py-3"
            />

          </div>

        </div>

        {saved && (

          <div className="mx-6 mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
            Admisión registrada correctamente.
          </div>

        )}

        <div className="border-t p-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="border px-5 py-3 rounded-lg"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Registrar admisión
          </button>

        </div>

      </form>

    </AppShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {

  return (
    <div>

      <label className="block text-sm font-semibold mb-2">
        {label}
      </label>

      <input
        name={name}
        type={type}
        required={required}
        className="w-full border rounded-lg px-3 py-3"
      />

    </div>
  );
}