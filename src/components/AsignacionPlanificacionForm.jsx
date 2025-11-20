import React from "react";

const exampleAssignments = [
  { worker: "Juan Pérez", group: "Tienda 1", shift: "TM", planning: "Semana 1" },
  { worker: "Ana López", group: "Tienda 2", shift: "TN", planning: "Semana 1" }
];

export function AsignacionPlanificacionForm() {
  return (
    <div className="space-y-3 text-sm flex flex-col items-center justify-center w-full">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-800">
          Asignación de planificación
        </h3>
        <p className="text-xs text-slate-500">
          Relaciona los turnos y planificaciones con los trabajadores. Esta es
          una vista resumida para el onboarding.
        </p>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Trabajador</th>
              <th className="px-2 py-2 text-left font-medium">Grupo</th>
              <th className="px-2 py-2 text-left font-medium">Turno</th>
              <th className="px-2 py-2 text-left font-medium">Planificación</th>
            </tr>
          </thead>
          <tbody>
            {exampleAssignments.map((row, idx) => (
              <tr key={idx} className="border-t border-slate-100">
                <td className="px-3 py-2">{row.worker}</td>
                <td className="px-2 py-2">{row.group}</td>
                <td className="px-2 py-2">
                  <select className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-sky-400">
                    <option>TM</option>
                    <option>TN</option>
                    <option>Libre</option>
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-sky-400">
                    <option>Semana 1</option>
                    <option>Semana 2</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-500">
        En la versión productiva, esta tabla se conectaría a la plantilla Excel
        de trabajadores y a la definición de turnos/planificaciones.
      </p>
    </div>
  );
}
