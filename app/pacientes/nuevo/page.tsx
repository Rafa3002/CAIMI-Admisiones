"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";

export default function NewPatientPage() {

  const router =
    useRouter();

  const [
    saved,
    setSaved,
  ] = useState(false);

  function submit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    /*
     * FRONTEND SOLAMENTE.
     *
     * Todavía no estamos
     * guardando en PostgreSQL.
     */

    setSaved(true);

    setTimeout(() => {

      router.push(
        "/pacientes"
      );

    }, 1500);
  }

  return (
    <AppShell>

      <PageHeader
        title="Registro de Persona"
        description="Ingrese los datos generales del nuevo paciente"
      />

      <form
        onSubmit={submit}
        className="space-y-6"
      >

        <section className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">

          <div className="bg-sky-50 border-b border-sky-100 px-6 py-4">

            <h2 className="text-lg font-bold text-sky-800">
              Datos generales
            </h2>

          </div>

          <div className="p-6 grid md:grid-cols-2 gap-5">

            <Field
              label="CUI / DPI"
              name="cui"
            />

            <Field
              label="No. Expediente"
              name="expediente"
            />

            <Field
              label="Primer nombre *"
              name="firstName"
              required
            />

            <Field
              label="Segundo nombre"
              name="secondName"
            />

            <Field
              label="Primer apellido *"
              name="firstSurname"
              required
            />

            <Field
              label="Segundo apellido"
              name="secondSurname"
            />

            <Field
              label="Apellido de casada"
              name="marriedSurname"
            />

            <Field
              label="Fecha de nacimiento"
              name="birthDate"
              type="date"
            />

            <div>

              <label className="block font-semibold text-sm text-slate-700 mb-2">
                Sexo
              </label>

              <select
                name="sex"
                className="w-full border border-slate-300 rounded-lg px-3 py-3"
              >

                <option>
                  Seleccione
                </option>

                <option>
                  Masculino
                </option>

                <option>
                  Femenino
                </option>

                <option>
                  No determinado
                </option>

                <option>
                  No indica
                </option>

              </select>

            </div>

            <Field
              label="Teléfono"
              name="phone"
            />

          </div>

        </section>

        <section className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">

          <div className="bg-sky-50 border-b border-sky-100 px-6 py-4">

            <h2 className="text-lg font-bold text-sky-800">
              Ubicación y dirección
            </h2>

          </div>

          <div className="p-6 grid md:grid-cols-2 gap-5">

            <Field
              label="Departamento"
              name="department"
              defaultValue="Alta Verapaz"
            />

            <Field
              label="Municipio"
              name="municipality"
            />

            <Field
              label="Comunidad / Lugar poblado"
              name="community"
            />

            <div className="md:col-span-2">

              <label className="block font-semibold text-sm text-slate-700 mb-2">
                Dirección exacta
              </label>

              <textarea
                name="address"
                rows={3}
                className="w-full border border-slate-300 rounded-lg px-3 py-3"
              />

            </div>

          </div>

        </section>

        {saved && (

          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
            Paciente registrado correctamente. Redirigiendo...
          </div>

        )}

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="border border-slate-300 px-5 py-3 rounded-lg"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Guardar paciente
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
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {

  return (
    <div>

      <label className="block font-semibold text-sm text-slate-700 mb-2">
        {label}
      </label>

      <input
        name={name}
        type={type}
        required={required}
        defaultValue={
          defaultValue
        }
        className="w-full border border-slate-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-sky-500 outline-none"
      />

    </div>
  );
}