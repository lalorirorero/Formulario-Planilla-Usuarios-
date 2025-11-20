import React from "react";

export function ResumenPaso() {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="text-sm font-semibold text-slate-800">
        Resumen de la configuración
      </h3>

      <div className="space-y-2 text-xs text-slate-600">
        <p>
          • 1 administrador configurado con correo de acceso al portal.
        </p>
        <p>
          • Empresa creada con sus grupos/unidades de negocio principales.
        </p>
        <p>
          • Trabajadores cargados vía Excel e ingreso manual rápido.
        </p>
        <p>
          • Turnos base definidos y planificación semanal de ejemplo.
        </p>
        <p>
          • Planificación asociada a trabajadores clave para el arranque.
        </p>
      </div>

      <div className="mt-2 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-2xl px-3 py-2 text-xs">
        Este resumen es solo visual. En el producto final se podría generar un
        PDF para el cliente o un resumen para el equipo de implementaciones.
      </div>
    </div>
  );
}
