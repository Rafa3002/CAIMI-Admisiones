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

import {
  apiFetch,
} from "@/lib/api";


interface PatientFormData {
  cui?: string;

  expediente: string;

  firstName: string;
  secondName?: string;

  firstSurname: string;
  secondSurname?: string;

  marriedSurname?: string;

  birthDate?: string;
  sex?: string;

  phone?: string;

  department?: string;
  municipality?: string;
  community?: string;

  address?: string;

  confirmDuplicate?: boolean;
}


interface ApiResponse {
  id?: string;

  message?: string;

  requiresConfirmation?: boolean;

  possibleDuplicate?: {
    id?: string;
    cui?: string;
    expediente?: string;
    firstName?: string;
    firstSurname?: string;
    birthDate?: string;
  };
}


export default function NewPatientPage() {

  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");


  /*
   * Convierte campos vacíos
   * en undefined.
   */
  function optionalValue(
    value:
      FormDataEntryValue | null
  ) {

    const text =
      String(
        value ?? ""
      ).trim();

    return text || undefined;
  }


  /*
   * Envía los datos al backend.
   */
  async function sendPatient(
    data:
      PatientFormData
  ) {

    const response =
      await apiFetch(
        "/api/patients",
        {
          method:
            "POST",

          body:
            JSON.stringify(
              data
            ),
        }
      );


    let result:
      ApiResponse;


    try {

      result =
        await response.json();

    } catch {

      result = {
        message:
          "El servidor respondió de forma inesperada.",
      };
    }


    return {
      response,
      result,
    };
  }


  /*
   * Registro del paciente.
   */
  async function submit(
    event:
      FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setLoading(true);

    setMessage("");

    setError("");


    try {

      const form =
        new FormData(
          event.currentTarget
        );


      const patient:
        PatientFormData = {

        cui:
          optionalValue(
            form.get(
              "cui"
            )
          ),

        expediente:
          String(
            form.get(
              "expediente"
            ) ?? ""
          ).trim(),

        firstName:
          String(
            form.get(
              "firstName"
            ) ?? ""
          ).trim(),

        secondName:
          optionalValue(
            form.get(
              "secondName"
            )
          ),

        firstSurname:
          String(
            form.get(
              "firstSurname"
            ) ?? ""
          ).trim(),

        secondSurname:
          optionalValue(
            form.get(
              "secondSurname"
            )
          ),

        marriedSurname:
          optionalValue(
            form.get(
              "marriedSurname"
            )
          ),

        birthDate:
          optionalValue(
            form.get(
              "birthDate"
            )
          ),

        sex:
          optionalValue(
            form.get(
              "sex"
            )
          ),

        phone:
          optionalValue(
            form.get(
              "phone"
            )
          ),

        department:
          optionalValue(
            form.get(
              "department"
            )
          ),

        municipality:
          optionalValue(
            form.get(
              "municipality"
            )
          ),

        community:
          optionalValue(
            form.get(
              "community"
            )
          ),

        address:
          optionalValue(
            form.get(
              "address"
            )
          ),
      };


      /*
       * Primera solicitud.
       */
      let {
        response,
        result,
      } =
        await sendPatient(
          patient
        );


      /*
       * El backend encontró
       * un posible duplicado.
       */
      if (
        response.status ===
          409 &&
        result
          .requiresConfirmation
      ) {

        const duplicate =
          result
            .possibleDuplicate;


        const confirmed =
          window.confirm(
            "Se encontró un posible paciente duplicado.\n\n" +

            `Paciente: ${
              duplicate?.firstName ??
              ""
            } ${
              duplicate?.firstSurname ??
              ""
            }\n` +

            `Expediente: ${
              duplicate?.expediente ??
              "No disponible"
            }\n` +

            `CUI: ${
              duplicate?.cui ??
              "No disponible"
            }\n\n` +

            "¿Desea registrar de todas formas al nuevo paciente?"
          );


        if (!confirmed) {

          setError(
            "Registro cancelado. Revise el paciente existente antes de continuar."
          );

          return;
        }


        /*
         * Reenviar confirmando
         * el posible duplicado.
         */
        const retry =
          await sendPatient({
            ...patient,

            confirmDuplicate:
              true,
          });


        response =
          retry.response;

        result =
          retry.result;
      }


      /*
       * Cualquier otro error.
       */
      if (
        !response.ok
      ) {

        setError(
          result.message ||
            "No fue posible registrar el paciente."
        );

        return;
      }


      /*
       * Verificar que el backend
       * retornó el ID.
       */
      if (!result.id) {

        setError(
          "El paciente fue procesado, pero el servidor no devolvió su identificador."
        );

        return;
      }


      setMessage(
        "Paciente registrado correctamente."
      );


      /*
       * Abrir directamente
       * el expediente creado.
       */
      setTimeout(
        () => {

          router.push(
            `/pacientes/${result.id}`
          );

        },
        800
      );

    } catch (
      caughtError
    ) {

      console.error(
        "Error registrando paciente:",
        caughtError
      );

      setError(
        "No fue posible comunicarse con el servidor. Verifique que el backend esté encendido."
      );

    } finally {

      setLoading(false);
    }
  }


  return (
    <AppShell>

      <PageHeader
        title="Registro de Persona"
        description="Ingrese los datos generales del nuevo paciente"
      />


      <form
        onSubmit={
          submit
        }
        className="space-y-6"
      >

        {/* DATOS GENERALES */}

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
              label="No. Expediente *"
              name="expediente"
              required
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
                defaultValue=""
                className="w-full border border-slate-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-sky-500 outline-none"
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
            />

          </div>

        </section>


        {/* UBICACIÓN */}

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
              defaultValue="San Cristóbal Verapaz"
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
                className="w-full border border-slate-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-sky-500 outline-none"
              />

            </div>

          </div>

        </section>


        {/* ERROR */}

        {error && (

          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>

        )}


        {/* ÉXITO */}

        {message && (

          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
            {message}
          </div>

        )}


        {/* BOTONES */}

        <div className="flex justify-end gap-3">

          <button
            type="button"
            disabled={
              loading
            }
            onClick={() =>
              router.back()
            }
            className="border border-slate-300 px-5 py-3 rounded-lg disabled:opacity-50"
          >
            Cancelar
          </button>


          <button
            type="submit"
            disabled={
              loading
            }
            className="bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {loading
              ? "Guardando..."
              : "Guardar paciente"}

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
        required={
          required
        }
        defaultValue={
          defaultValue
        }
        className="w-full border border-slate-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-sky-500 outline-none"
      />

    </div>
  );
}