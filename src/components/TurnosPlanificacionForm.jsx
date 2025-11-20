import React from "react";

const exampleShifts = [
  { name: "Turno Mañana", code: "TM", start: "08:00", end: "16:00", days: "L a V" },
  { name: "Turno Noche", code: "TN", start: "22:00", end: "06:00", days: "L a S" }
];

export function TurnosPlanificacionForm() {
  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-800">
          Turnos base
        </h3>
        <p className="text-xs text-slate-500">
          Define los turnos base que se usarán en la planificación. Más adelante
          puedes cargarlos masivamente desde Excel.
        </p>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Nombre</th>
              <th className="px-2 py-2 text-left font-medium">Código</th>
              <th className="px-2 py-2 text-left font-medium">Entrada</th>
              <th className="px-2 py-2 text-left font-medium">Salida</th>
              <th className="px-2 py-2 text-left font-medium">Días</th>
            </tr>
          </thead>
          <tbody>
            {exampleShifts.map((shift) => (
              <tr key={shift.code} className="border-t border-slate-100">
                <td className="px-3 py-2">{shift.name}</td>
                <td className="px-2 py-2">{shift.code}</td>
                <td className="px-2 py-2">{shift.start}</td>
                <td className="px-2 py-2">{shift.end}</td>
                <td className="px-2 py-2">{shift.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-2xl border border-sky-400 px-3 py-1.5 text-xs font-medium text-sky-600 bg-white hover:bg-sky-50"
        >
          Agregar turno base
        </button>
        <button
          type="button"
          className="rounded-2xl border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100"
        >
          Importar turnos desde Excel
        </button>
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-semibold text-slate-800">
          Planificación de ejemplo
        </h3>
        <p className="text-xs text-slate-500">
          Vista simplificada de cómo se vería la planificación semanal usando
          los turnos base.
        </p>

        <div className="border border-slate-200 rounded-2xl bg-slate-50 p-2">
          <div className="grid grid-cols-8 gap-1 text-[11px] text-slate-600">
            <div className="font-semibold text-[10px] text-slate-500">Trab.</div>
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
            <div>Dom</div>

            <div className="font-semibold text-[11px] text-slate-500">T1</div>
            <div className="bg-emerald-100 rounded-md text-center">TM</div>
            <div className="bg-emerald-100 rounded-md text-center">TM</div>
            <div className="bg-emerald-100 rounded-md text-center">TM</div>
            <div className="bg-emerald-100 rounded-md text-center">TM</div>
            <div className="bg-emerald-100 rounded-md text-center">TM</div>
            <div className="bg-slate-100 rounded-md text-center">-</div>
            <div className="bg-slate-100 rounded-md text-center">-</div>

            <div className="font-semibold text-[11px] text-slate-500">T2</div>
            <div className="bg-sky-100 rounded-md text-center">TN</div>
            <div className="bg-sky-100 rounded-md text-center">TN</div>
            <div className="bg-sky-100 rounded-md text-center">TN</div>
            <div className="bg-sky-100 rounded-md text-center">TN</div>
            <div className="bg-sky-100 rounded-md text-center">TN</div>
            <div className="bg-sky-100 rounded-md text-center">TN</div>
            <div className="bg-slate-100 rounded-md text-center">-</div>
          </div>
        </div>
      </div>
    </div>
  );
}
