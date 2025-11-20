import React from "react";

export const steps = [
  "1. Administrador",
  "2. Empresa y Grupos",
  "3. Trabajadores",
  "4. Turnos base y planificación",
  "5. Asignación planificación",
  "6. Resumen"
];

export function Stepper({ activeStep = 0 }) {
  return (
    <nav className="flex flex-wrap gap-x-3 gap-y-2 overflow-x-auto py-2 px-1 justify-start md:justify-center lg:justify-start">
      {steps.map((label, index) => {
        const isActive = index === activeStep;
        return (
          <div
            key={label}
            className={[
              "flex items-center justify-center rounded-full border text-xs md:text-sm px-4 md:px-5 py-2 min-w-max transition",
              isActive
                ? "bg-sky-500 text-white border-sky-500 shadow-md"
                : "bg-slate-100 text-slate-500 border-slate-200"
            ].join(" ")}
          >
            <span className="truncate">{label}</span>
          </div>
        );
      })}
    </nav>
  );
}
