import React from "react";
import { steps } from "./Stepper.jsx";

export function StepPlaceholder({ step }) {
  return (
    <div className="text-sm text-slate-600 space-y-2">
      <p className="font-semibold text-slate-800">
        {steps[step]}
      </p>
      <p>
        Aquí puedes maquetar el contenido del paso <strong>{step + 1}</strong>. 
        Por ahora es solo un placeholder para probar la navegación entre pasos.
      </p>
      <p className="text-xs text-slate-500">
        El comportamiento de avance y retroceso ya está implementado. Solo falta
        reemplazar este bloque con el formulario o componentes reales de cada etapa.
      </p>
    </div>
  );
}
