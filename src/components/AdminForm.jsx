import React from "react";

export function AdminForm() {
  return (
    <section className="bg-white rounded-3xl shadow-md px-6 py-5 w-full max-w-xs">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Administrador del sistema
      </h2>

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

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          className="flex-1 rounded-3xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          Atrás
        </button>
        <button
          type="button"
          className="flex-1 rounded-3xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-sky-600 transition"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}
