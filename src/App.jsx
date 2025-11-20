import React, { useState } from "react";
import { Stepper, steps } from "./components/Stepper.jsx";
import { AdminForm } from "./components/AdminForm.jsx";
import { StepPlaceholder } from "./components/StepPlaceholder.jsx";

export default function App() {
  const [step, setStep] = useState(0);

  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    setStep((current) => (current < steps.length - 1 ? current + 1 : current));
  };

  const handlePrev = () => {
    setStep((current) => (current > 0 ? current - 1 : current));
  };

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
            <Stepper activeStep={step} />
          </div>

          {/* Card de contenido del paso */}
          <div className="md:w-auto">
            <section className="bg-white rounded-3xl shadow-md px-6 py-5 w-full max-w-xs">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {step === 0 ? "Administrador del sistema" : steps[step]}
              </h2>

              {step === 0 ? (
                <AdminForm />
              ) : (
                <StepPlaceholder step={step} />
              )}

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isFirst}
                  className={[
                    "flex-1 rounded-3xl border px-3 py-2 text-sm font-medium transition",
                    isFirst
                      ? "border-slate-200 text-slate-300 bg-white cursor-not-allowed"
                      : "border-slate-300 text-slate-600 bg-white hover:bg-slate-50"
                  ].join(" ")}
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={[
                    "flex-1 rounded-3xl px-3 py-2 text-sm font-semibold text-white shadow-md transition",
                    isLast
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-sky-500 hover:bg-sky-600"
                  ].join(" ")}
                >
                  {isLast ? "Finalizar" : "Siguiente"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-10">
        <div className="mt-6 h-[420px] rounded-3xl border border-dashed border-slate-300 bg-slate-100/40 flex flex-col items-center justify-center text-slate-400 text-sm text-center px-4">
          <p className="mb-2">
            Paso actual: <span className="font-semibold text-slate-500">{steps[step]}</span>
          </p>
          <p className="max-w-lg">
            Esta área está pensada para mostrar el contenido detallado del onboarding 
            (tablas, formularios, planillas de turnos, etc.) correspondiente a cada etapa.
          </p>
        </div>
      </main>
    </div>
  );
}
