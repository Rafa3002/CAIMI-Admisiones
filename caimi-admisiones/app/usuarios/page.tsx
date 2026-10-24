"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  UserPlus,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import PageHeader from "@/components/PageHeader";

import {
  apiFetch,
} from "@/lib/api";

import type {
  Role,
  User,
} from "@/lib/types";


export default function UsersPage() {

  const [
    users,
    setUsers,
  ] =
    useState<
      User[]
    >([]);

  const [
    creating,
    setCreating,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");


  async function loadUsers() {

    try {

      const response =
        await apiFetch(
          "/api/users"
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

      setUsers(
        data
      );

    } catch {

      setError(
        "No fue posible consultar usuarios."
      );
    }
  }


  useEffect(
    () => {

      loadUsers();

    },
    []
  );


  async function createUser(
    event:
      FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    const form =
      new FormData(
        event.currentTarget
      );

    const body = {

      name:
        form.get("name")
          ?.toString()
          .trim(),

      username:
        form.get(
          "username"
        )
          ?.toString()
          .trim(),

      password:
        form.get(
          "password"
        )
          ?.toString(),

      role:
        form.get(
          "role"
        )
          ?.toString() as Role,
    };


    const response =
      await apiFetch(
        "/api/users",
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
        data.message
      );

      return;
    }


    setCreating(
      false
    );

    setError("");

    await loadUsers();
  }


  async function changeStatus(
    user:
      User
  ) {

    const response =
      await apiFetch(
        `/api/users/${user.id}/status`,
        {
          method:
            "PATCH",

          body:
            JSON.stringify({
              active:
                !user.active,
            }),
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

    await loadUsers();
  }


  return (
    <AppShell>

      <PageHeader
        title="Usuarios"
        description="Administración de usuarios y roles"
        action={

          <button
            onClick={() =>
              setCreating(
                !creating
              )
            }
            className="bg-sky-700 text-white px-4 py-3 rounded-lg flex gap-2"
          >

            <UserPlus size={18} />

            Nuevo usuario

          </button>
        }
      />


      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-5">
          {error}
        </div>

      )}


      {creating && (

        <form
          onSubmit={
            createUser
          }
          className="bg-white border rounded-xl p-6 mb-6"
        >

          <h2 className="font-bold text-lg mb-4">
            Crear usuario
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="name"
              required
              placeholder="Nombre completo"
              className="border rounded-lg px-3 py-3"
            />

            <input
              name="username"
              required
              placeholder="Usuario"
              className="border rounded-lg px-3 py-3"
            />

            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Contraseña"
              className="border rounded-lg px-3 py-3"
            />

            <select
              name="role"
              required
              className="border rounded-lg px-3 py-3"
            >

              <option value="">
                Seleccione un rol
              </option>

              <option value="ADMIN">
                Administrador
              </option>

              <option value="ADMISIONES">
                Admisiones
              </option>

              <option value="CONSULTA">
                Consulta
              </option>

            </select>

          </div>

          <div className="mt-5 flex justify-end">

            <button
              className="bg-sky-700 text-white px-6 py-3 rounded-lg"
            >
              Crear usuario
            </button>

          </div>

        </form>

      )}


      <section className="bg-white border rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-sky-800 text-white">

            <tr>

              <th className="text-left p-4">
                Nombre
              </th>

              <th className="text-left p-4">
                Usuario
              </th>

              <th className="text-left p-4">
                Rol
              </th>

              <th className="text-left p-4">
                Estado
              </th>

              <th className="p-4">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map(
              (
                user
              ) => (

                <tr
                  key={
                    user.id
                  }
                  className="border-t"
                >

                  <td className="p-4">
                    {
                      user.name
                    }
                  </td>

                  <td className="p-4">
                    {
                      user.username
                    }
                  </td>

                  <td className="p-4">
                    {
                      user.role
                    }
                  </td>

                  <td className="p-4">

                    <span className={
                      user.active
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full"
                        : "bg-red-100 text-red-700 px-3 py-1 rounded-full"
                    }>

                      {user.active
                        ? "Activo"
                        : "Inactivo"}

                    </span>

                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() =>
                        changeStatus(
                          user
                        )
                      }
                      className="border px-3 py-2 rounded-lg"
                    >

                      {user.active
                        ? "Desactivar"
                        : "Activar"}

                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </section>

    </AppShell>
  );
}