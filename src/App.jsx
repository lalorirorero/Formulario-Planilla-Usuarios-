import React, { useState } from "react";
import { Stepper, steps } from "./components/Stepper.jsx";
import { AdminForm } from "./components/AdminForm.jsx";
import { EmpresaGruposForm } from "./components/EmpresaGruposForm.jsx";
import { TrabajadoresForm } from "./components/TrabajadoresForm.jsx";
import { TurnosPlanificacionForm } from "./components/TurnosPlanificacionForm.jsx";
import { AsignacionPlanificacionForm } from "./components/AsignacionPlanificacionForm.jsx";
import { ResumenPaso } from "./components/ResumenPaso.jsx";

function getStepForm(step) {
  switch (step) {
    case 0:
      return <AdminForm />;
    case 1:
      return <EmpresaGruposForm />;
    case 2:
      return <TrabajadoresForm />;
    case 3:
      return <TurnosPlanificacionForm />;
    case 4:
      return <AsignacionPlanificacionForm />;
    case 5:
      return <ResumenPaso />;
    default:
      return null;
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
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center">
      <header className="w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center justify-center gap-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-2">
            Onboarding GeoVictoria — Ingreso de Empresa y Trabajadores
          </h1>
          <p className="text-sm text-slate-600 text-center max-w-xl mb-4">
            Prototipo web para reemplazar la planilla Excel clásica de onboarding: empresa, trabajadores, turnos y planificación.
          </p>
          <Stepper activeStep={step} />
          <section className="w-full max-w-md bg-white rounded-3xl shadow-md px-6 py-6 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 text-center">
              {steps[step]}
            </h2>
            <div className="w-full flex flex-col items-center justify-center">
              {getStepForm(step)}
            </div>
            <div className="mt-6 flex flex-row items-center justify-center gap-4 w-full">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isFirst}
                className={[
                  "w-32 rounded-3xl border px-3 py-2 text-sm font-medium transition",
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
                  "w-32 rounded-3xl px-3 py-2 text-sm font-semibold text-white shadow-md transition",
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
      </header>
      <main className="w-full flex flex-col items-center justify-center">
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-100/40 flex flex-col items-center justify-center text-slate-400 text-xs sm:text-sm text-center px-4 py-10 sm:py-14 max-w-xl mx-auto">
          <p className="mb-2">
            Paso actual:{" "}
            <span className="font-semibold text-slate-500">
              {steps[step]}
            </span>
          </p>
          <p className="max-w-lg text-slate-500 text-xs sm:text-sm">
            Esta área está pensada para mostrar, en la versión final, una vista más detallada del Excel o de los datos consolidados (preview de planillas, validaciones, métricas, etc.). Por ahora es solo contextual para el demo.
          </p>
        </div>
      </main>
    </div>
  );
}
