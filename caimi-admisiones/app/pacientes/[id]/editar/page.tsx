"use client";

import {
  FormEvent,
  useEffect,
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

import type {
  Patient,
} from "@/lib/types";


export default function EditPatientPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const id =
    String(
      params.id
    );

  const [
    patient,
    setPatient,
  ] =
    useState<
      Patient | null
    >(null);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);


  useEffect(
    () => {

      async function load() {

        const response =
          await apiFetch(
            `/api/patients/${id}`
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {

          setError(
            data.message
          );

          return;
        }

        setPatient(
          data
        );
      }

      load();

    },
    [id]
  );


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

    const body = {

      cui:
        form.get("cui")
          ?.toString()
          .trim() || "",

      expediente:
        form.get(
          "expediente"
        )
          ?.toString()
          .trim() || "",

      firstName:
        form.get(
          "firstName"
        )
          ?.toString()
          .trim() || "",

      secondName:
        form.get(
          "secondName"
        )
          ?.toString()
          .trim() || "",

      firstSurname:
        form.get(
          "firstSurname"
        )
          ?.toString()
          .trim() || "",

      secondSurname:
        form.get(
          "secondSurname"
        )
          ?.toString()
          .trim() || "",

      marriedSurname:
        form.get(
          "marriedSurname"
        )
          ?.toString()
          .trim() || "",

      birthDate:
        form.get(
          "birthDate"
        )
          ?.toString() || "",

      sex:
        form.get("sex")
          ?.toString() || "",

      phone:
        form.get("phone")
          ?.toString()
          .trim() || "",

      department:
        form.get(
          "department"
        )
          ?.toString()
          .trim() || "",

      municipality:
        form.get(
          "municipality"
        )
          ?.toString()
          .trim() || "",

      community:
        form.get(
          "community"
        )
          ?.toString()
          .trim() || "",

      address:
        form.get(
          "address"
        )
          ?.toString()
          .trim() || "",
    };


    try {

      const response =
        await apiFetch(
          `/api/patients/${id}`,
          {
            method:
              "PATCH",

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
          data.message
        );

        return;
      }

      router.push(
        `/pacientes/${id}`
      );

    } catch {

      setError(
        "No fue posible actualizar al paciente."
      );

    } finally {

      setSaving(
        false
      );
    }
  }


  if (!patient) {

    return (
      <AppShell>

        <p>
          {error ||
            "Cargando..."}
        </p>

      </AppShell>
    );
  }


  return (
    <AppShell>

      <PageHeader
        title="Editar paciente"
        description={
          patient.expediente
        }
      />

      <form
        onSubmit={submit}
        className="bg-white border rounded-xl p-6"
      >

        <div className="grid md:grid-cols-2 gap-5">

          <Field
            label="CUI"
            name="cui"
            defaultValue={
              patient.cui || ""
            }
          />

          <Field
            label="Expediente"
            name="expediente"
            required
            defaultValue={
              patient.expediente
            }
          />

          <Field
            label="Primer nombre"
            name="firstName"
            required
            defaultValue={
              patient.firstName
            }
          />

          <Field
            label="Segundo nombre"
            name="secondName"
            defaultValue={
              patient.secondName ||
              ""
            }
          />

          <Field
            label="Primer apellido"
            name="firstSurname"
            required
            defaultValue={
              patient.firstSurname
            }
          />

          <Field
            label="Segundo apellido"
            name="secondSurname"
            defaultValue={
              patient.secondSurname ||
              ""
            }
          />

          <Field
            label="Apellido de casada"
            name="marriedSurname"
            defaultValue={
              patient.marriedSurname ||
              ""
            }
          />

          <Field
            label="Fecha de nacimiento"
            name="birthDate"
            type="date"
            defaultValue={
              patient.birthDate
                ? String(
                    patient.birthDate
                  ).substring(
                    0,
                    10
                  )
                : ""
            }
          />

          <div>

            <label className="block font-semibold mb-2">
              Sexo
            </label>

            <select
              name="sex"
              defaultValue={
                patient.sex || ""
              }
              className="w-full border rounded-lg px-3 py-3"
            >

              <option value="">
                Seleccione
              </option>

              <option value="Masculino">
                Masculino
              </option>

              <option value="Femenino">
                Femenino
              </option>

              <option value="No determinado">
                No determinado
              </option>

              <option value="No indica">
                No indica
              </option>

            </select>

          </div>

          <Field
            label="Teléfono"
            name="phone"
            defaultValue={
              patient.phone || ""
            }
          />

          <Field
            label="Departamento"
            name="department"
            defaultValue={
              patient.department || ""
            }
          />

          <Field
            label="Municipio"
            name="municipality"
            defaultValue={
              patient.municipality || ""
            }
          />

          <Field
            label="Comunidad"
            name="community"
            defaultValue={
              patient.community || ""
            }
          />

          <Field
            label="Dirección"
            name="address"
            defaultValue={
              patient.address || ""
            }
          />

        </div>


        {error && (

          <div className="mt-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>

        )}


        <div className="mt-6 flex justify-end gap-3">

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
            type="submit"
            className="bg-sky-700 text-white px-6 py-3 rounded-lg"
          >

            {saving
              ? "Guardando..."
              : "Guardar cambios"}

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
  defaultValue = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
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
        defaultValue={
          defaultValue
        }
        className="w-full border rounded-lg px-3 py-3"
      />

    </div>
  );
}