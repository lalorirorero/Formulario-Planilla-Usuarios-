import React from "react";

export function EmpresaGruposForm() {
  return (
    <form className="space-y-3 text-sm">
      <div className="space-y-1">
        <label className="block text-slate-600">
          Nombre de la empresa <span className="text-sky-500">*</span>
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="GeoVictoria Chile SpA"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">
          RUT de la empresa <span className="text-sky-500">*</span>
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="11.111.111-1"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">País</label>
        <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400">
          <option>Chile</option>
          <option>Perú</option>
          <option>México</option>
          <option>Colombia</option>
          <option>Otro</option>
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
        />
      </div>
    </form>
  );
}
