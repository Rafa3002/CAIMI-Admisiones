"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import AppShell from "@/components/AppShell";

import PageHeader from "@/components/PageHeader";

import {
  apiFetch,
} from "@/lib/api";


export default function NewAdmissionPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const patientId =
    String(
      params.id
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");


  async function submit(
    event:
      FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setSaving(
      true
    );

    setError("");

    const form =
      new FormData(
        event.currentTarget
      );

    const date =
      form.get("date")
        ?.toString();

    const time =
      form.get("time")
        ?.toString();

    /*
     * Guatemala utiliza UTC-6.
     */
    const admissionDate =
      `${date}T${time}:00-06:00`;


    const body = {

      patientId,

      date:
        admissionDate,

      service:
        form.get(
          "service"
        )?.toString() || "",

      area:
        form.get(
          "area"
        )?.toString() || "",

      reason:
        form.get(
          "reason"
        )?.toString() || "",

      observations:
        form.get(
          "observations"
        )?.toString() || "",
    };


    try {

      const response =
        await apiFetch(
          "/api/admissions",
          {
            method:
              "POST",

            body:
              JSON.stringify(
                body
              ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {

        setError(
          data.message ||
            "No fue posible registrar la admisión."
        );

        return;
      }

      router.push(
        `/pacientes/${patientId}`
      );

    } catch {

      setError(
        "No fue posible comunicarse con el servidor."
      );

    } finally {

      setSaving(
        false
      );
    }
  }


  return (
    <AppShell>

      <PageHeader
        title="Nueva admisión"
        description="Registro de admisión del paciente"
      />

      <form
        onSubmit={submit}
        className="bg-white border rounded-xl overflow-hidden"
      >

        <div className="bg-sky-50 border-b px-6 py-4">

          <h2 className="font-bold text-sky-800">
            Datos de admisión
          </h2>

        </div>

        <div className="p-6 grid md:grid-cols-2 gap-5">

          <Field
            label="Fecha"
            name="date"
            type="date"
            required
          />

          <Field
            label="Hora"
            name="time"
            type="time"
            required
          />

          <div>

            <label className="block font-semibold mb-2">
              Servicio
            </label>

            <select
              name="service"
              required
              className="w-full border rounded-lg px-3 py-3"
            >

              <option value="">
                Seleccione
              </option>

              <option value="Emergencia">
                Emergencia
              </option>

              <option value="Consulta externa">
                Consulta externa
              </option>

              <option value="Maternidad">
                Maternidad
              </option>

              <option value="Otro">
                Otro
              </option>

            </select>

          </div>

          <Field
            label="Área"
            name="area"
            required
          />

          <div className="md:col-span-2">

            <label className="block font-semibold mb-2">
              Motivo
            </label>

            <textarea
              name="reason"
              required
              rows={3}
              className="w-full border rounded-lg px-3 py-3"
            />

          </div>

          <div className="md:col-span-2">

            <label className="block font-semibold mb-2">
              Observaciones
            </label>

            <textarea
              name="observations"
              rows={4}
              className="w-full border rounded-lg px-3 py-3"
            />

          </div>

        </div>


        {error && (

          <div className="mx-6 mb-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
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
            disabled={
              saving
            }
            className="bg-sky-700 text-white px-6 py-3 rounded-lg"
          >

            {saving
              ? "Registrando..."
              : "Registrar admisión"}

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

      <label className="block font-semibold mb-2">
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