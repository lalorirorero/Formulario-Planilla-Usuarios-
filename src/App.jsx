import React, { useState } from "react";
import { Stepper, steps } from "./components/Stepper.jsx";
import { AdminForm } from "./components/AdminForm.jsx";
import { EmpresaGruposForm } from "./components/EmpresaGruposForm.jsx";
import { TrabajadoresForm } from "./components/TrabajadoresForm.jsx";
import { StepPlaceholder } from "./components/StepPlaceholder.jsx";

function getStepForm(step) {
  switch (step) {
    case 0:
      return <AdminForm />;
    case 1:
      return <EmpresaGruposForm />;
    case 2:
      return <TrabajadoresForm />;
    default:
      return <StepPlaceholder step={step} />;
  }
}

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
      <header className="mx-auto max-w-5xl px-3 sm:px-4 lg:px-6 pt-4 pb-3 sm:pt-6 sm:pb-4">
        <div className="bg-slate-100 rounded-3xl shadow-sm px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* Texto principal */}
          <div className="w-full lg:w-[40%] space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug text-slate-900">
              Onboarding GeoVictoria — Ingreso de Empresa y Trabajadores
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Prototipo web para reemplazar la planilla Excel de ingreso de empresa, empleados y turnos.
            </p>
          </div>

          {/* Stepper */}
          <div className="w-full lg:flex-1 lg:px-2">
            <Stepper activeStep={step} />
          </div>

          {/* Card de contenido del paso */}
          <div className="w-full lg:w-[28%] xl:w-[26%]">
            <section className="bg-white rounded-3xl shadow-md px-4 sm:px-5 py-4 sm:py-5 w-full">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                {steps[step]}
              </h2>

              {getStepForm(step)}

              <div className="mt-5 flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isFirst}
                  className={[
                    "w-full sm:flex-1 rounded-3xl border px-3 py-2 text-sm font-medium transition",
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
                    "w-full sm:flex-1 rounded-3xl px-3 py-2 text-sm font-semibold text-white shadow-md transition",
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

      <main className="mx-auto max-w-5xl px-3 sm:px-4 lg:px-6 pb-6 sm:pb-10">
        <div className="mt-4 sm:mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-100/40 flex flex-col items-center justify-center text-slate-400 text-xs sm:text-sm text-center px-4 py-10 sm:py-14">
          <p className="mb-2">
            Paso actual:{" "}
            <span className="font-semibold text-slate-500">
              {steps[step]}
            </span>
          </p>
          <p className="max-w-lg">
            Esta área está pensada para mostrar el contenido detallado del onboarding 
            correspondiente a cada etapa. Más adelante la podemos vincular a componentes 
            específicos (tablas, previsualización de turnos, etc.).
          </p>
        </div>
      </main>
    </div>
  );
}
