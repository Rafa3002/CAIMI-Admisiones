"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  HeartPulse,
  Lock,
  User,
} from "lucide-react";

export default function LoginPage() {

  const router =
    useRouter();

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  function login(
    event: FormEvent
  ) {

    event.preventDefault();

    /*
     * IMPORTANTE:
     * Esto es solamente frontend.
     *
     * Luego lo reemplazaremos
     * por autenticación real.
     */

    if (
      username === "admin" &&
      password === "admin123"
    ) {

      router.push(
        "/dashboard"
      );

      return;
    }

    setMessage(
      "Usuario o contraseña incorrectos."
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-700 to-cyan-600 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          <div className="bg-sky-800 text-white px-8 py-8 text-center">

            <div className="flex justify-center mb-4">

              <div className="bg-white/15 p-4 rounded-full">

                <HeartPulse
                  size={42}
                />

              </div>

            </div>

            <h1 className="text-2xl font-bold">
              CAIMI
            </h1>

            <p className="text-sky-100 mt-1">
              San Cristóbal Verapaz
            </p>

            <p className="text-sm text-sky-200 mt-3">
              Sistema de Registro y Control de Admisiones
            </p>

          </div>

          <form
            onSubmit={login}
            className="p-8 space-y-5"
          >

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Usuario
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  value={
                    username
                  }
                  onChange={(
                    event
                  ) =>
                    setUsername(
                      event
                        .target
                        .value
                    )
                  }
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Ingrese su usuario"
                />

              </div>

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="password"
                  value={
                    password
                  }
                  onChange={(
                    event
                  ) =>
                    setPassword(
                      event
                        .target
                        .value
                    )
                  }
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Ingrese su contraseña"
                />

              </div>

            </div>

            {message && (

              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {message}
              </div>

            )}

            <button
              type="submit"
              className="w-full bg-sky-700 hover:bg-sky-800 text-white py-3 rounded-lg font-semibold"
            >
              Iniciar sesión
            </button>

            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">

              <strong>
                Usuario temporal:
              </strong>

              <br />

              Usuario: admin
              <br />
              Contraseña:
              admin123

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}