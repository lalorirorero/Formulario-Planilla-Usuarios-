import React from "react";

export function EmpresaGruposForm() {
  // Leer parámetros de la URL
  const params = new URLSearchParams(window.location.search);
  const nombreEmpresa = params.get('utm_company') || '';
  const rutEmpresa = params.get('utm_rut') || '';
  const paisEmpresa = params.get('utm_country') || '';
  const cantidadTrabajadores = params.get('utm_workers') || '';

  return (
    <form className="space-y-3 text-sm flex flex-col items-center justify-center w-full">
      <div className="space-y-1">
        <label className="block text-slate-600">
          Nombre de la empresa <span className="text-sky-500">*</span>
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="GeoVictoria Chile SpA"
          defaultValue={nombreEmpresa}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">
          RUT de la empresa <span className="text-sky-500">*</span>
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="11.111.111-1"
          defaultValue={rutEmpresa}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">País</label>
        <select
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          defaultValue={paisEmpresa}
        >
          <option value="">Selecciona país</option>
          <option value="Chile">Chile</option>
          <option value="Perú">Perú</option>
          <option value="México">México</option>
          <option value="Colombia">Colombia</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">
          Grupo principal / Unidad de negocio
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="Casa matriz / Retail / Bodega, etc."
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">
          Cantidad estimada de trabajadores
        </label>
        <input
          type="number"
          min="0"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="Ej. 150"
          defaultValue={cantidadTrabajadores}
        />
      </div>
    </form>
  );
}
