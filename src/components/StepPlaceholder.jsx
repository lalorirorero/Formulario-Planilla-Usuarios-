import React from "react";
import { steps } from "./Stepper.jsx";

export function StepPlaceholder({ step }) {
  return (
    <div className="text-sm text-slate-600 space-y-2">
      <p className="font-semibold text-slate-800">
        {steps[step]}
      </p>
      <p>
        Todavía no definimos el formulario de este paso. 
        Puedes usar esta tarjeta para maquetar turnos, asignación de planificación 
        o un resumen final de la implementación.
      </p>
      <p className="text-xs text-slate-500">
        Si quieres, luego reemplazamos este bloque por el contenido definitivo del Excel.
      </p>
    </div>
  );
}
