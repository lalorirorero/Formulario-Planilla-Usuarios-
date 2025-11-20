import React from "react";

export function TrabajadoresForm() {
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">
          Carga de trabajadores
        </h3>
        <p className="text-xs text-slate-500">
          Puedes cargar una plantilla Excel con todos los trabajadores o ingresar algunos
          manualmente para partir el onboarding.
        </p>

        {/* Zona de carga de Excel (solo UI, sin lógica) */}
        <div className="border border-dashed border-slate-300 rounded-2xl bg-slate-50 px-3 py-3 space-y-2">
          <p className="text-xs text-slate-600">
            Arrastra aquí tu archivo <strong>.xlsx</strong> o selecciónalo desde tu equipo.
          </p>
          <button
            type="button"
            className="inline-flex items-center rounded-2xl border border-sky-400 px-3 py-1.5 text-xs font-medium text-sky-600 bg-white hover:bg-sky-50"
          >
            Seleccionar archivo
          </button>
          <p className="text-[11px] text-slate-400">
            Formato sugerido: RUT, Nombre, Apellido, Correo, Grupo, Turno, Centro de costo.
          </p>
        </div>
      </div>

      {/* Ingreso manual rápido */}
      <form className="space-y-3">
        <p className="text-xs font-semibold text-slate-700">
          Ingreso rápido de trabajadores clave
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
    </div>
  );
}
