import Link from "next/link";

import {
  BarChart3,
  ClipboardPlus,
  HeartPulse,
  Home,
  LogOut,
  UserCog,
  Users,
} from "lucide-react";

export default function AppShell({
  children,
}: {
  children:
    React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-sky-900 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-4">

          <div className="py-4 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="bg-white/15 p-2 rounded-lg">

                <HeartPulse
                  size={28}
                />

              </div>

              <div>

                <h1 className="font-bold text-xl">
                  CAIMI
                </h1>

                <p className="text-xs text-sky-200">
                  San Cristóbal Verapaz
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-sm font-semibold">
                Administrador
              </p>

              <p className="text-xs text-sky-200">
                admin
              </p>

            </div>

          </div>

        </div>

        <nav className="bg-sky-800 border-t border-sky-700">

          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">

            <NavItem
              href="/dashboard"
              icon={
                <Home
                  size={17}
                />
              }
            >
              Inicio
            </NavItem>

            <NavItem
              href="/pacientes"
              icon={
                <Users
                  size={17}
                />
              }
            >
              Pacientes
            </NavItem>

            <NavItem
              href="/pacientes"
              icon={
                <ClipboardPlus
                  size={17}
                />
              }
            >
              Admisiones
            </NavItem>

            <NavItem
              href="/reportes"
              icon={
                <BarChart3
                  size={17}
                />
              }
            >
              Estadísticas
            </NavItem>

            <NavItem
              href="/usuarios"
              icon={
                <UserCog
                  size={17}
                />
              }
            >
              Usuarios
            </NavItem>

            <NavItem
              href="/login"
              icon={
                <LogOut
                  size={17}
                />
              }
            >
              Cerrar sesión
            </NavItem>

          </div>

        </nav>

      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="max-w-7xl mx-auto px-4 pb-8 text-sm text-slate-500">

        CAIMI San Cristóbal Verapaz |
        Sistema de Registro y Control de Admisiones

      </footer>

    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon:
    React.ReactNode;
  children:
    React.ReactNode;
}) {

  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-5 py-4 whitespace-nowrap hover:bg-sky-700"
    >
      {icon}
      {children}
    </Link>
  );
}