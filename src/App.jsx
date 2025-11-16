import React from "react";
import { Stepper } from "./components/Stepper.jsx";
import { AdminForm } from "./components/AdminForm.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-200">
      <header className="mx-auto max-w-6xl px-4 pt-6 pb-4">
        <div className="bg-slate-100 rounded-3xl shadow-sm px-6 py-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {/* Texto principal */}
          <div className="md:w-2/5 space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-snug text-slate-900">
              Onboarding GeoVictoria — Ingreso de Empresa y Trabajadores
            </h1>
            <p className="text-sm text-slate-600 max-w-md">
              Prototipo web para reemplazar la planilla Excel de ingreso de empresa, empleados y turnos.
            </p>
          </div>

          {/* Stepper */}
          <div className="md:flex-1 md:px-2">
            <Stepper activeStep={0} />
          </div>

          {/* Card Administrador */}
          <div className="md:w-auto">
            <AdminForm />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-10">
        {/* Área futura de contenido (pasos siguientes, tablas, etc.) */}
        <div className="mt-6 h-[480px] rounded-3xl border border-dashed border-slate-300 bg-slate-100/40 flex items-center justify-center text-slate-400 text-sm">
          Zona de trabajo para los siguientes pasos del onboarding.
        </div>
      </main>
    </div>
  );
}
