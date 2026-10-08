import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "CAIMI Admisiones",

  description:
    "Sistema Web de Registro, Consulta y Control de Admisiones de Pacientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}