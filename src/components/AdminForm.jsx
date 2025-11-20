import React from "react";

export function AdminForm() {
  return (
    <form className="space-y-3 text-sm">
      <div className="space-y-1">
        <label className="block text-slate-600">
          Nombre <span className="text-sky-500">*</span>
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          defaultValue="Administrador"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">
          RUT <span className="text-sky-500">*</span>
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          defaultValue="11.111.111-1"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">Teléfono</label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          defaultValue="+56 9 9988 77"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-600">
          Correo <span className="text-sky-500">*</span>
        </label>
        <input
          type="email"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          defaultValue="admin@empresa.cl"
        />
      </div>
    </form>
  );
}
