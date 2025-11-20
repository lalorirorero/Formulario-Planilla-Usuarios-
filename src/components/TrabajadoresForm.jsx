import React from "react";

export function TrabajadoresForm() {
  return (
    <form className="space-y-3 text-sm">
      <p className="text-xs text-slate-500">
        Esta sección está pensada para el ingreso rápido de trabajadores clave.
        Más adelante se puede reemplazar por una carga masiva desde Excel.
      </p>

      <div className="space-y-1">
        <label className="block text-slate-600">
          Nombre trabajador 1 <span className="text-sky-500">*</span>
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="Nombre y apellido"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">RUT trabajador 1</label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="11.111.111-1"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">Correo trabajador 1</label>
        <input
          type="email"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="nombre@empresa.cl"
        />
      </div>

      <hr className="my-2 border-slate-200" />

      <div className="space-y-1">
        <label className="block text-slate-600">
          Nombre trabajador 2
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="Nombre y apellido"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">RUT trabajador 2</label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="11.111.111-1"
        />
      </div>
    </form>
  );
}
