import {
  UserPlus,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";

import {
  users,
} from "@/lib/mock-data";

export default function UsersPage() {

  return (
    <AppShell>

      <PageHeader
        title="Usuarios"
        description="Administración de usuarios y roles"
        action={

          <button className="bg-sky-700 text-white px-4 py-3 rounded-lg flex items-center gap-2">

            <UserPlus
              size={18}
            />

            Nuevo usuario

          </button>
        }
      />

      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

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

            </tr>

          </thead>

          <tbody>

            {users.map(
              (user) => (

                <tr
                  key={
                    user.id
                  }
                  className="border-t"
                >

                  <td className="p-4 font-medium">
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
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                    }>
                      {
                        user.active
                          ? "Activo"
                          : "Inactivo"
                      }
                    </span>

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