import React, { useState } from 'react';

// Pasos del flujo
const steps = [
  { id: 0, label: 'Admin', description: 'Responsable de la cuenta' },
  { id: 1, label: 'Empresa y grupos', description: 'Datos base de la empresa' },
  { id: 2, label: 'Trabajadores', description: 'Listado inicial' },
  { id: 3, label: 'Turnos', description: 'Definición de turnos' },
  { id: 4, label: 'Planificaciones', description: 'Tipos de planificación semanal' },
  { id: 5, label: 'Asignación', description: 'Quién trabaja qué planificación' },
  { id: 6, label: 'Resumen', description: 'Revisión final' },
];

// Días de la semana
const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const TOOLTIP_GRUPO =
  '"Grupo" corresponde a una forma de clasificar a los colaboradores según características que tengan en común, como por ejemplo el lugar de trabajo, tipo de turno, área/departamento al que pertenece.';

const TOOLTIP_PERIODO_PLAN =
  'Estas fechas indican el periodo de vigencia de la planificación asignada a cada trabajador (por ejemplo, del 01-10 al 31-10).';

// Helpers de validación
const normalizeRut = (rut: string): string => {
  if (!rut) return '';
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
};

const isValidRut = (rut: string): boolean => {
  const clean = normalizeRut(rut);
  if (!clean) return false;
  if (!/^[0-9]+[0-9K]$/.test(clean)) return false;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const mod = 11 - (sum % 11);
  let expected: string;
  if (mod === 11) expected = '0';
  else if (mod === 10) expected = 'K';
  else expected = String(mod);

  return dv === expected;
};

const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

// Tipos

type StepperProps = {
  currentStep: number;
};

function Stepper({ currentStep }: StepperProps) {
  return (
    <ol className='grid gap-2 md:grid-cols-3'>
      {steps.map((step, index) => {
        const status =
          index < currentStep
            ? 'completed'
            : index === currentStep
            ? 'current'
            : 'pending';

        const base =
          'flex items-start gap-2 rounded-xl border p-3 text-sm bg-white';
        const stateClass =
          status === 'current'
            ? 'border-sky-500 bg-sky-50'
            : status === 'completed'
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-slate-200';

        return (
          <li key={step.id} className={`${base} ${stateClass}`}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold
              ${status === 'current' ? 'bg-sky-500 text-white' : ''}
              ${status === 'completed' ? 'bg-emerald-500 text-white' : ''}
              ${status === 'pending' ? 'bg-slate-200 text-slate-700' : ''}`}
            >
              {status === 'completed' ? '✓' : index + 1}
            </div>
            <div className='flex-1'>
              <div className='font-semibold text-slate-800'>{step.label}</div>
              <div className='text-[11px] text-slate-500'>{step.description}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

type Admin = {
  nombre: string;
  email: string;
  telefono: string;
};

type AdminStepProps = {
  admin: Admin;
  setAdmin: (a: Admin) => void;
};

function AdminStep({ admin, setAdmin }: AdminStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  return (
    <section className='space-y-4'>
      <header>
        <h2 className='text-lg font-semibold text-slate-900'>Datos del administrador</h2>
        <p className='text-xs text-slate-500'>
          Persona de contacto principal para coordinar la implementación y cambios de turnos.
        </p>
      </header>

      <div className='grid gap-3 md:grid-cols-2'>
        <div className='space-y-1 text-sm'>
          <label className='font-medium'>Nombre completo</label>
          <input
            className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
            type='text'
            name='nombre'
            value={admin.nombre}
            onChange={handleChange}
            placeholder='Ej: Juan Pérez'
          />
        </div>
        <div className='space-y-1 text-sm'>
          <label className='font-medium'>Correo</label>
          <input
            className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
            type='email'
            name='email'
            value={admin.email}
            onChange={handleChange}
            placeholder='admin@empresa.com'
          />
        </div>
        <div className='space-y-1 text-sm'>
          <label className='font-medium'>Teléfono</label>
          <input
            className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
            type='tel'
            name='telefono'
            value={admin.telefono}
            onChange={handleChange}
            placeholder='+56 9 1234 5678'
          />
        </div>
      </div>
    </section>
  );
}

type Grupo = {
  id: number;
  nombre: string;
  descripcion: string;
};

type Empresa = {
  nombre: string;
  rut: string;
  pais: string;
  cantidadTrabajadores: string;
  grupos: Grupo[];
};

type EmpresaGruposStepProps = {
  empresa: Empresa;
  setEmpresa: (e: Empresa) => void;
};

function EmpresaGruposStep({ empresa, setEmpresa }: EmpresaGruposStepProps) {
  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  const handleGrupoChange = (id: number, field: keyof Grupo, value: string) => {
    const grupos = empresa.grupos.map((g) => (g.id === id ? { ...g, [field]: value } : g));
    setEmpresa({ ...empresa, grupos });
  };

  const addGrupo = () => {
    const nuevo: Grupo = {
      id: Date.now(),
      nombre: '',
      descripcion: '',
    };
    setEmpresa({ ...empresa, grupos: [...empresa.grupos, nuevo] });
  };

  const removeGrupo = (id: number) => {
    setEmpresa({
      ...empresa,
      grupos: empresa.grupos.filter((g) => g.id !== id),
    });
  };

  return (
    <section className='space-y-4'>
      <header>
        <h2 className='text-lg font-semibold text-slate-900'>Empresa y grupos</h2>
        <p className='text-xs text-slate-500'>
          Estos datos se usarán para crear la cuenta y segmentar a los trabajadores.
        </p>
      </header>

      <div className='grid gap-3 md:grid-cols-2'>
        <div className='space-y-1 text-sm'>
          <label className='font-medium'>Nombre de la empresa</label>
          <input
            className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
            type='text'
            name='nombre'
            value={empresa.nombre}
            onChange={handleEmpresaChange}
            placeholder='Ej: GeoVictoria'
          />
        </div>
        <div className='space-y-1 text-sm'>
          <label className='font-medium'>RUT / NIF / ID fiscal</label>
          <input
            className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
            type='text'
            name='rut'
            value={empresa.rut}
            onChange={handleEmpresaChange}
            placeholder='76.123.456-7'
          />
        </div>
        <div className='space-y-1 text-sm'>
          <label className='font-medium'>País</label>
          <input
            className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
            type='text'
            name='pais'
            value={empresa.pais}
            onChange={handleEmpresaChange}
            placeholder='Chile, Perú, México…'
          />
        </div>
        <div className='space-y-1 text-sm'>
          <label className='font-medium'>N° aprox. de trabajadores</label>
          <input
            className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
            type='number'
            name='cantidadTrabajadores'
            value={empresa.cantidadTrabajadores}
            onChange={handleEmpresaChange}
            min={0}
            placeholder='Ej: 150'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h3 className='flex items-center gap-1 text-sm font-semibold text-slate-900'>
            Grupos / sucursales
            <span
              className='cursor-help rounded-full border border-slate-300 px-1 text-[10px] text-slate-600'
              title={TOOLTIP_GRUPO}
            >
              ?
            </span>
          </h3>
          <button
            type='button'
            onClick={addGrupo}
            className='inline-flex items-center rounded-full border border-sky-500 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50'
          >
            + Agregar grupo
          </button>
        </div>
        <p className='text-[11px] text-slate-500'>
          Ejemplo: Casa matriz, Bodega San Bernardo, Cliente Retail, etc.
        </p>

        <div className='space-y-2'>
          {empresa.grupos.map((g) => (
            <div
              key={g.id}
              className='space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3'
            >
              <div className='grid gap-2 md:grid-cols-2'>
                <div className='space-y-1 text-sm'>
                  <label className='flex items-center gap-1 font-medium'>
                    Nombre del grupo
                    <span
                      className='cursor-help rounded-full border border-slate-300 px-1 text-[10px] text-slate-600'
                      title={TOOLTIP_GRUPO}
                    >
                      ?
                    </span>
                  </label>
                  <input
                    className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
                    type='text'
                    value={g.nombre}
                    onChange={(e) => handleGrupoChange(g.id, 'nombre', e.target.value)}
                    placeholder='Ej: Bodega San Bernardo'
                  />
                </div>
                <div className='space-y-1 text-sm'>
                  <label className='font-medium'>Descripción (opcional)</label>
                  <input
                    className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
                    type='text'
                    value={g.descripcion}
                    onChange={(e) => handleGrupoChange(g.id, 'descripcion', e.target.value)}
                    placeholder='Notas, cliente final, etc.'
                  />
                </div>
              </div>
              <button
                type='button'
                onClick={() => removeGrupo(g.id)}
                className='text-xs text-slate-500 hover:text-red-500'
              >
                Eliminar grupo
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type Trabajador = {
  id: number;
  nombre: string;
  rut: string;
  correo: string;
  grupoId: number | '';
};

type TrabajadoresErrors = {
  byId: {
    [id: number]: {
      [field: string]: string;
    };
  };
  global: string[];
};

type TrabajadoresStepProps = {
  trabajadores: Trabajador[];
  setTrabajadores: (t: Trabajador[]) => void;
  grupos: Grupo[];
  errors: TrabajadoresErrors;
  setErrors: (e: TrabajadoresErrors) => void;
  ensureGrupoByName: (name: string) => number | '';
};

function TrabajadoresStep({
  trabajadores,
  setTrabajadores,
  grupos,
  errors,
  setErrors,
  ensureGrupoByName,
}: TrabajadoresStepProps) {
  const [bulkText, setBulkText] = useState('');

  const updateTrabajador = (id: number, field: keyof Trabajador, value: any) => {
    const updated = trabajadores.map((t) => (t.id === id ? { ...t, [field]: value } : t));
    setTrabajadores(updated);

    if (errors?.byId?.[id]?.[field as string]) {
      const newById = { ...(errors.byId || {}) };
      const row = { ...(newById[id] || {}) };
      delete row[field as string];
      if (Object.keys(row).length === 0) {
        delete newById[id];
      } else {
        newById[id] = row;
      }
      setErrors({ ...(errors || { byId: {}, global: [] }), byId: newById });
    }
  };

  const addTrabajador = () => {
    setTrabajadores([
      ...trabajadores,
      {
        id: Date.now(),
        nombre: '',
        rut: '',
        correo: '',
        grupoId: '',
      },
    ]);
  };

  const removeTrabajador = (id: number) => {
    if (trabajadores.length === 1) return;
    setTrabajadores(trabajadores.filter((t) => t.id !== id));
    if (errors?.byId?.[id]) {
      const newById = { ...(errors.byId || {}) };
      delete newById[id];
      setErrors({ ...(errors || { byId: {}, global: [] }), byId: newById });
    }
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;

    const lines = bulkText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const nombreToId = new Map<string, number | ''>();

    const nuevos: Trabajador[] = lines.map((line, index) => {
      const cols = line.split(/\t|;|,/);
      const rutCompleto = (cols[0] || '').trim();
      const correoPersonal = (cols[1] || '').trim();
      const nombres = (cols[2] || '').trim();
      const apellidos = (cols[3] || '').trim();
      const grupoNombre = (cols[4] || '').trim();

      const nombreCompleto = `${nombres} ${apellidos}`.trim();

      let grupoId: number | '' = '';
      if (grupoNombre) {
        const key = grupoNombre.trim().toLowerCase();
        if (nombreToId.has(key)) {
          grupoId = nombreToId.get(key)!;
        } else {
          const idObtenido = ensureGrupoByName(grupoNombre);
          grupoId = idObtenido;
          nombreToId.set(key, idObtenido);
        }
      }

      return {
        id: Date.now() + index,
        nombre: nombreCompleto,
        rut: rutCompleto,
        correo: correoPersonal,
        grupoId,
      };
    });

    setTrabajadores([...trabajadores, ...nuevos]);
    setBulkText('');
    setErrors({ byId: {}, global: [] });
  };

  const globalErrors = errors?.global || [];

  return (
    <section className='space-y-4'>
      <header>
        <h2 className='text-lg font-semibold text-slate-900'>Trabajadores</h2>
        <p className='text-xs text-slate-500'>
          Carga una muestra inicial de trabajadores. Luego podrás importar masivamente.
        </p>
      </header>

      {globalErrors.length > 0 && (
        <div className='rounded-xl border border-red-300 bg-red-50 p-3 text-[11px] text-red-800'>
          <ul className='list-disc pl-4'>
            {globalErrors.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className='space-y-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div>
            <p className='text-sm font-semibold text-slate-800'>Pegado masivo desde Excel</p>
            <p className='text-[11px] text-slate-500'>
              Copia celdas desde Excel con las columnas en este orden:
              <span className='font-medium'> Rut Completo, Correo Personal, Nombres, Apellidos, Grupo</span>.
              Cada fila pegada creará un trabajador.
            </p>
          </div>
          <button
            type='button'
            onClick={handleBulkImport}
            className='inline-flex items-center rounded-full bg-sky-500 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-sky-600'
          >
            Procesar filas pegadas
          </button>
        </div>
        <textarea
          className='mt-2 h-28 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-mono focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
          placeholder={`Ejemplo de fila pegada:\n18371911-4\tcorreo@ejemplo.cl\tVICTOR MANUEL ALEJANDRO\tFLORES ESPEJO\tGTS`}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
        />
      </div>

      <div className='overflow-x-auto rounded-xl border border-slate-200 bg-white'>
        <table className='min-w-full border-collapse text-xs'>
          <thead className='bg-slate-50'>
            <tr>
              <th className='px-3 py-2 text-left font-medium text-slate-700'>Nombre</th>
              <th className='px-3 py-2 text-left font-medium text-slate-700'>RUT / ID</th>
              <th className='px-3 py-2 text-left font-medium text-slate-700'>Correo</th>
              <th className='px-3 py-2 text-left font-medium text-slate-700'>
                <span className='inline-flex items-center gap-1'>
                  Grupo
                  <span
                    className='cursor-help rounded-full border border-slate-300 px-1 text-[10px] text-slate-600'
                    title={TOOLTIP_GRUPO}
                  >
                    ?
                  </span>
                </span>
              </th>
              <th className='px-3 py-2' />
            </tr>
          </thead>
          <tbody>
            {trabajadores.map((t) => {
              const rowErrors = (errors && errors.byId && errors.byId[t.id]) || {};
              return (
                <tr key={t.id} className='border-t border-slate-100'>
                  <td className='px-3 py-1.5'>
                    <input
                      className={`w-full rounded-lg border px-2 py-1 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                        rowErrors.nombre ? 'border-red-400' : 'border-slate-200'
                      }`}
                      type='text'
                      value={t.nombre}
                      onChange={(e) => updateTrabajador(t.id, 'nombre', e.target.value)}
                      placeholder='Ej: Pedro Soto'
                    />
                    {rowErrors.nombre && (
                      <p className='mt-0.5 text-[10px] text-red-600'>{rowErrors.nombre}</p>
                    )}
                  </td>
                  <td className='px-3 py-1.5'>
                    <input
                      className={`w-full rounded-lg border px-2 py-1 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                        rowErrors.rut ? 'border-red-400' : 'border-slate-200'
                      }`}
                      type='text'
                      value={t.rut}
                      onChange={(e) => updateTrabajador(t.id, 'rut', e.target.value)}
                      placeholder='ID interno / RUT'
                    />
                    {rowErrors.rut && (
                      <p className='mt-0.5 text-[10px] text-red-600'>{rowErrors.rut}</p>
                    )}
                  </td>
                  <td className='px-3 py-1.5'>
                    <input
                      className={`w-full rounded-lg border px-2 py-1 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                        rowErrors.correo ? 'border-red-400' : 'border-slate-200'
                      }`}
                      type='email'
                      value={t.correo}
                      onChange={(e) => updateTrabajador(t.id, 'correo', e.target.value)}
                      placeholder='correo@empresa.com'
                    />
                    {rowErrors.correo && (
                      <p className='mt-0.5 text-[10px] text-red-600'>{rowErrors.correo}</p>
                    )}
                  </td>
                  <td className='px-3 py-1.5'>
                    <select
                      className={`w-full rounded-lg border px-2 py-1 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                        rowErrors.grupoId ? 'border-red-400' : 'border-slate-200'
                      }`}
                      value={t.grupoId}
                      onChange={(e) =>
                        updateTrabajador(
                          t.id,
                          'grupoId',
                          e.target.value ? Number(e.target.value) : ''
                        )
                      }
                    >
                      <option value=''>Seleccionar…</option>
                      {grupos.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nombre || 'Sin nombre'}
                        </option>
                      ))}
                    </select>
                    {rowErrors.grupoId && (
                      <p className='mt-0.5 text-[10px] text-red-600'>{rowErrors.grupoId}</p>
                    )}
                  </td>
                  <td className='px-3 py-1.5 text-right'>
                    <button
                      type='button'
                      onClick={() => removeTrabajador(t.id)}
                      className='rounded-full px-2 py-1 text-[11px] text-slate-500 hover:bg-red-50 hover:text-red-600'
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type='button'
        onClick={addTrabajador}
        className='mt-2 inline-flex items-center rounded-full border border-sky-500 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50'
      >
        + Agregar trabajador
      </button>
    </section>
  );
}

type Turno = {
  id: number;
  nombre: string;
  inicio: string;
  fin: string;
};

type TurnosStepProps = {
  turnos: Turno[];
  setTurnos: (t: Turno[]) => void;
};

function TurnosStep({ turnos, setTurnos }: TurnosStepProps) {
  const updateTurno = (id: number, field: keyof Turno, value: any) => {
    const updated = turnos.map((t) => (t.id === id ? { ...t, [field]: value } : t));
    setTurnos(updated);
  };

  const addTurno = () => {
    setTurnos([
      ...turnos,
      { id: Date.now(), nombre: '', inicio: '', fin: '' },
    ]);
  };

  const removeTurno = (id: number) => {
    if (turnos.length === 1) return;
    setTurnos(turnos.filter((t) => t.id !== id));
  };

  return (
    <section className='space-y-4'>
      <header>
        <h2 className='text-lg font-semibold text-slate-900'>Turnos</h2>
        <p className='text-xs text-slate-500'>
          Define uno o más turnos de referencia con nombre y horario. La planificación semanal por día la harás en el siguiente paso.
        </p>
      </header>

      <div className='space-y-3'>
        {turnos.map((t) => (
          <div
            key={t.id}
            className='space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3'
          >
            <div className='grid gap-2 md:grid-cols-3'>
              <div className='space-y-1 text-sm'>
                <label className='font-medium'>Nombre del turno</label>
                <input
                  className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
                  type='text'
                  value={t.nombre}
                  onChange={(e) => updateTurno(t.id, 'nombre', e.target.value)}
                  placeholder='Ej: Mañana'
                />
              </div>
              <div className='space-y-1 text-sm'>
                <label className='font-medium'>Hora inicio</label>
                <input
                  className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
                  type='time'
                  value={t.inicio}
                  onChange={(e) => updateTurno(t.id, 'inicio', e.target.value)}
                />
              </div>
              <div className='space-y-1 text-sm'>
                <label className='font-medium'>Hora fin</label>
                <input
                  className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
                  type='time'
                  value={t.fin}
                  onChange={(e) => updateTurno(t.id, 'fin', e.target.value)}
                />
              </div>
            </div>

            <button
              type='button'
              onClick={() => removeTurno(t.id)}
              className='text-xs text-slate-500 hover:text-red-500'
            >
              Eliminar turno
            </button>
          </div>
        ))}
      </div>

      <button
        type='button'
        onClick={addTurno}
        className='inline-flex items-center rounded-full border border-sky-500 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50'
      >
        + Agregar turno
      </button>
    </section>
  );
}

type Planificacion = {
  id: number;
  nombre: string;
  semana: {
    [dia: string]: number | '';
  };
};

type PlanificacionesStepProps = {
  planificaciones: Planificacion[];
  setPlanificaciones: (p: Planificacion[]) => void;
  turnos: Turno[];
};

function PlanificacionesStep({ planificaciones, setPlanificaciones, turnos }: PlanificacionesStepProps) {
  const updatePlanificacion = (id: number, field: keyof Planificacion, value: any) => {
    const updated = planificaciones.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setPlanificaciones(updated);
  };

  const updateDia = (id: number, dia: string, turnoId: number | '') => {
    const updated = planificaciones.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        semana: {
          ...p.semana,
          [dia]: turnoId,
        },
      };
    });
    setPlanificaciones(updated);
  };

  const addPlanificacion = () => {
    const baseSemana: { [dia: string]: number | '' } = {};
    DIAS.forEach((d) => {
      baseSemana[d] = '';
    });
    setPlanificaciones([
      ...planificaciones,
      {
        id: Date.now(),
        nombre: '',
        semana: baseSemana,
      },
    ]);
  };

  const removePlanificacion = (id: number) => {
    if (planificaciones.length === 1) return;
    setPlanificaciones(planificaciones.filter((p) => p.id !== id));
  };

  return (
    <section className='space-y-4'>
      <header>
        <h2 className='text-lg font-semibold text-slate-900'>Planificaciones semanales</h2>
        <p className='text-xs text-slate-500'>
          Crea uno o más tipos de planificación. Cada planificación distribuye los turnos creados en la semana (L a D).
        </p>
      </header>

      {turnos.length === 0 ? (
        <p className='text-xs text-slate-500'>
          Primero crea al menos un turno en el paso anterior.
        </p>
      ) : (
        <div className='space-y-3'>
          {planificaciones.map((p) => (
            <div
              key={p.id}
              className='space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3'
            >
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='space-y-1 text-sm'>
                  <label className='font-medium'>Nombre de la planificación</label>
                  <input
                    className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
                    type='text'
                    value={p.nombre}
                    onChange={(e) => updatePlanificacion(p.id, 'nombre', e.target.value)}
                    placeholder='Ej: Turnos rotativos semana A'
                  />
                </div>
                <button
                  type='button'
                  onClick={() => removePlanificacion(p.id)}
                  className='text-xs text-slate-500 hover:text-red-500'
                >
                  Eliminar planificación
                </button>
              </div>

              <div className='space-y-1'>
                <p className='text-[11px] font-medium text-slate-600'>Distribución semanal</p>
                <div className='grid grid-cols-2 gap-2 md:grid-cols-7'>
                  {DIAS.map((dia) => (
                    <div key={dia} className='space-y-1 text-[11px]'>
                      <p className='font-semibold text-slate-700'>{dia}</p>
                      <select
                        className='w-full rounded-lg border border-slate-200 px-2 py-1 text-[11px] focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
                        value={p.semana[dia] || ''}
                        onChange={(e) =>
                          updateDia(
                            p.id,
                            dia,
                            e.target.value ? Number(e.target.value) : ''
                          )
                        }
                      >
                        <option value=''>Sin turno</option>
                        {turnos.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nombre || `${t.inicio || ''}${t.inicio && t.fin ? ' - ' : ''}${
                              t.fin || ''
                            }` || 'Turno sin nombre'}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {turnos.length > 0 && (
        <button
          type='button'
          onClick={addPlanificacion}
          className='inline-flex items-center rounded-full border border-sky-500 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50'
        >
          + Agregar planificación
        </button>
      )}
    </section>
  );
}

type Asignacion = {
  id: number;
  trabajadorId: number | '';
  planificacionId: number | '';
  desde: string;
  hasta: string;
};

type AsignacionStepProps = {
  asignaciones: Asignacion[];
  setAsignaciones: (a: Asignacion[]) => void;
  trabajadores: Trabajador[];
  planificaciones: Planificacion[];
  grupos: Grupo[];
  errorGlobal: string;
};

function AsignacionStep({ asignaciones, setAsignaciones, trabajadores, planificaciones, grupos, errorGlobal }: AsignacionStepProps) {
  const [selectedGrupoId, setSelectedGrupoId] = useState<number | ''>('');
  const [selectedTrabajadoresIds, setSelectedTrabajadoresIds] = useState<number[]>([]);
  const [bulkPlanificacionId, setBulkPlanificacionId] = useState<number | ''>('');
  const [bulkDesde, setBulkDesde] = useState('');
  const [bulkHasta, setBulkHasta] = useState('');
  const [bulkError, setBulkError] = useState('');

  const updateAsignacion = (id: number, field: keyof Asignacion, value: any) => {
    const updated = asignaciones.map((a) =>
      a.id === id ? { ...a, [field]: value } : a
    );
    setAsignaciones(updated);
  };

  const addAsignacion = () => {
    setAsignaciones([
      ...asignaciones,
      { id: Date.now(), trabajadorId: '', planificacionId: '', desde: '', hasta: '' },
    ]);
  };

  const removeAsignacion = (id: number) => {
    if (asignaciones.length === 1) return;
    setAsignaciones(asignaciones.filter((a) => a.id !== id));
  };

  const trabajadoresDisponibles = trabajadores.filter((t) => {
    const asignacionValida = asignaciones.find(
      (a) =>
        a.trabajadorId === t.id &&
        a.planificacionId &&
        a.desde &&
        a.hasta
    );
    return !asignacionValida;
  });

  const trabajadoresFiltrados = selectedGrupoId
    ? trabajadoresDisponibles.filter((t) => t.grupoId === selectedGrupoId)
    : trabajadoresDisponibles;

  const toggleTrabajadorSeleccionado = (id: number) => {
    setSelectedTrabajadoresIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const seleccionarTodos = () => {
    const ids = trabajadoresFiltrados.map((t) => t.id);
    setSelectedTrabajadoresIds(ids);
  };

  const limpiarSeleccion = () => {
    setSelectedTrabajadoresIds([]);
  };

  const crearAsignacionesMasivas = () => {
    setBulkError('');

    if (!bulkPlanificacionId) {
      setBulkError('Selecciona una planificación para asignar.');
      return;
    }
    if (!bulkDesde || !bulkHasta) {
      setBulkError('Debes indicar el periodo Desde y Hasta.');
      return;
    }
    if (selectedTrabajadoresIds.length === 0) {
      setBulkError('Selecciona al menos un trabajador.');
      return;
    }

    const nuevas: Asignacion[] = selectedTrabajadoresIds.map((trabId, idx) => ({
      id: Date.now() + idx,
      trabajadorId: trabId,
      planificacionId: bulkPlanificacionId,
      desde: bulkDesde,
      hasta: bulkHasta,
    }));

    setAsignaciones([...asignaciones, ...nuevas]);
    setBulkError('');
    setSelectedTrabajadoresIds([]);
  };

  const getPlanificacionLabelForTrabajador = (trabajadorId: number): string | null => {
    const asignacionValida = asignaciones.find(
      (a) =>
        a.trabajadorId === trabajadorId &&
        a.planificacionId &&
        a.desde &&
        a.hasta
    );
    if (!asignacionValida) return null;
    const plan = planificaciones.find((p) => p.id === asignacionValida.planificacionId);
    return plan ? plan.nombre || 'Sin nombre' : null;
  };

  const totalTrabajadores = trabajadores.length;
  const trabajadoresSinPlan = trabajadores.filter(
    (t) => !getPlanificacionLabelForTrabajador(t.id)
  ).length;

  return (
    <section className='space-y-4'>
      <header>
        <h2 className='text-lg font-semibold text-slate-900'>Asignación de planificaciones</h2>
        <p className='text-xs text-slate-500'>
          Asigna planificaciones a los trabajadores, ya sea en bloque por grupo o de forma individual.
        </p>
      </header>

      <div className='rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs flex items-center justify-between gap-2'>
        <p className='text-[11px] text-slate-700'>
          Total de trabajadores:{' '}
          <span className='font-semibold'>{totalTrabajadores}</span>
        </p>
        <p className='text-[11px] text-slate-700'>
          Trabajadores sin planificación válida:{' '}
          <span
            className={
              trabajadoresSinPlan > 0
                ? 'font-semibold text-red-600'
                : 'font-semibold text-emerald-700'
            }
          >
            {trabajadoresSinPlan}
          </span>
        </p>
      </div>

      {errorGlobal && (
        <div className='rounded-xl border border-red-300 bg-red-50 p-3 text-[11px] text-red-800'>
          {errorGlobal}
        </div>
      )}

      <div className='space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs'>
        <div className='grid gap-3 md:grid-cols-4 md:items-end'>
          <div className='space-y-1'>
            <label className='text-[11px] font-medium text-slate-700'>Filtrar por grupo</label>
            <select
              className='w-full rounded-lg border border-slate-200 px-2 py-1 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
              value={selectedGrupoId}
              onChange={(e) =>
                setSelectedGrupoId(e.target.value ? Number(e.target.value) : '')
              }
            >
              <option value=''>Todos los grupos</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nombre || 'Sin nombre'}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-1'>
            <label className='text-[11px] font-medium text-slate-700'>Planificación a asignar</label>
            <select
              className='w-full rounded-lg border border-slate-200 px-2 py-1 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
              value={bulkPlanificacionId}
              onChange={(e) =>
                setBulkPlanificacionId(
                  e.target.value ? Number(e.target.value) : ''
                )
              }
            >
              <option value=''>Seleccionar…</option>
              {planificaciones.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre || 'Sin nombre'}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-1'>
            <label className='text-[11px] font-medium text-slate-700'>
              Periodo de la planificación
              <span
                className='ml-1 cursor-help rounded-full border border-slate-300 px-1 text-[10px] text-slate-600'
                title={TOOLTIP_PERIODO_PLAN}
              >
                ?
              </span>
            </label>
            <div className='flex items-center gap-1'>
              <input
                type='date'
                className='w-full rounded-lg border border-slate-200 px-2 py-1 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
                value={bulkDesde}
                onChange={(e) => setBulkDesde(e.target.value)}
              />
              <span className='text-[11px] text-slate-500'>a</span>
              <input
                type='date'
                className='w-full rounded-lg border border-slate-200 px-2 py-1 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
                value={bulkHasta}
                onChange={(e) => setBulkHasta(e.target.value)}
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label className='text-[11px] font-medium text-slate-700'>Acciones</label>
            <div className='flex flex-wrap items-center gap-2'>
              <button
                type='button'
                onClick={seleccionarTodos}
                className='rounded-full border border-slate-300 px-3 py-1 text-[11px] hover:bg-slate-100'
              >
                Seleccionar todos
              </button>
              <button
                type='button'
                onClick={limpiarSeleccion}
                className='rounded-full border border-slate-300 px-3 py-1 text-[11px] hover:bg-slate-100'
              >
                Limpiar selección
              </button>
              <button
                type='button'
                onClick={crearAsignacionesMasivas}
                className='rounded-full bg-sky-500 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-sky-600'
              >
                Asignar planificación a seleccionados
              </button>
            </div>
          </div>
        </div>

        {bulkError && (
          <p className='text-[11px] font-medium text-red-600'>{bulkError}</p>
        )}

        <div className='overflow-x-auto rounded-lg border border-slate-200 bg-white'>
          <table className='min-w-full border-collapse text-[11px]'>
            <thead className='bg-slate-50'>
              <tr>
                <th className='px-2 py-1 text-left'>
                  <span className='sr-only'>Seleccionar</span>
                </th>
                <th className='px-2 py-1 text-left'>Nombre</th>
                <th className='px-2 py-1 text-left'>Grupo</th>
              </tr>
            </thead>
            <tbody>
              {trabajadoresFiltrados.map((t) => {
                const grupo = grupos.find((g) => g.id === t.grupoId);
                const seleccionado = selectedTrabajadoresIds.includes(t.id);
                return (
                  <tr
                    key={t.id}
                    className={`border-t border-slate-100 ${
                      seleccionado ? 'bg-sky-50' : ''
                    }`}
                  >
                    <td className='px-2 py-1'>
                      <input
                        type='checkbox'
                        checked={seleccionado}
                        onChange={() => toggleTrabajadorSeleccionado(t.id)}
                      />
                    </td>
                    <td className='px-2 py-1'>{t.nombre}</td>
                    <td className='px-2 py-1'>
                      {grupo ? grupo.nombre : <span className='text-slate-400'>Sin grupo</span>}
                    </td>
                  </tr>
                );
              })}
              {trabajadoresFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className='px-2 py-3 text-center text-[11px] text-slate-500'
                  >
                    No hay trabajadores disponibles para asignar en este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs'>
        <h3 className='text-sm font-semibold text-slate-900'>
          Resumen de trabajadores y planificaciones
        </h3>
        <div className='overflow-x-auto rounded-lg border border-slate-200'>
          <table className='min-w-full border-collapse text-[11px]'>
            <thead className='bg-slate-50'>
              <tr>
                <th className='px-2 py-1 text-left'>Trabajador</th>
                <th className='px-2 py-1 text-left'>Grupo</th>
                <th className='px-2 py-1 text-left'>Planificación</th>
              </tr>
            </thead>
            <tbody>
              {trabajadores.map((t) => {
                const grupo = grupos.find((g) => g.id === t.grupoId);
                const planLabel = getPlanificacionLabelForTrabajador(t.id);
                return (
                  <tr key={t.id} className='border-t border-slate-100'>
                    <td className='px-2 py-1'>{t.nombre}</td>
                    <td className='px-2 py-1'>
                      {grupo ? grupo.nombre : <span className='text-slate-400'>Sin grupo</span>}
                    </td>
                    <td className='px-2 py-1'>
                      {planLabel ? (
                        planLabel
                      ) : (
                        <span className='font-semibold text-red-600'>Sin planificar</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

type ResumenStepProps = {
  admin: Admin;
  empresa: Empresa;
  trabajadores: Trabajador[];
  turnos: Turno[];
  planificaciones: Planificacion[];
  asignaciones: Asignacion[];
  grupos: Grupo[];
};

function ResumenStep({
  admin,
  empresa,
  trabajadores,
  turnos,
  planificaciones,
  asignaciones,
  grupos,
}: ResumenStepProps) {
  const trabajadoresSinPlan = trabajadores.filter((t) => {
    const tienePlan = asignaciones.some(
      (a) =>
        a.trabajadorId === t.id &&
        a.planificacionId &&
        a.desde &&
        a.hasta
    );
    return !tienePlan;
  });

  return (
    <section className='space-y-4'>
      <header>
        <h2 className='text-lg font-semibold text-slate-900'>Resumen final</h2>
        <p className='text-xs text-slate-500'>
          Revisa la información antes de enviar. Podrás descargar este resumen o copiarlo a Excel.
        </p>
      </header>

      <div className='grid gap-3 md:grid-cols-2'>
        <div className='space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs'>
          <h3 className='text-sm font-semibold text-slate-900'>Admin</h3>
          <p>
            <span className='font-medium'>Nombre:</span> {admin.nombre || '—'}
          </p>
          <p>
            <span className='font-medium'>Correo:</span> {admin.email || '—'}
          </p>
          <p>
            <span className='font-medium'>Teléfono:</span> {admin.telefono || '—'}
          </p>
        </div>

        <div className='space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs'>
          <h3 className='text-sm font-semibold text-slate-900'>Empresa</h3>
          <p>
            <span className='font-medium'>Nombre:</span> {empresa.nombre || '—'}
          </p>
          <p>
            <span className='font-medium'>RUT / ID fiscal:</span> {empresa.rut || '—'}
          </p>
          <p>
            <span className='font-medium'>País:</span> {empresa.pais || '—'}
          </p>
          <p>
            <span className='font-medium'>N° aprox. trabajadores:</span>{' '}
            {empresa.cantidadTrabajadores || '—'}
          </p>
        </div>
      </div>

      <div className='space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs'>
        <h3 className='text-sm font-semibold text-slate-900'>Grupos</h3>
        {empresa.grupos.length === 0 ? (
          <p className='text-[11px] text-slate-500'>No se han definido grupos.</p>
        ) : (
          <ul className='list-disc pl-4'>
            {empresa.grupos.map((g) => (
              <li key={g.id}>
                <span className='font-medium'>{g.nombre || 'Sin nombre'}</span>
                {g.descripcion && <span className='text-slate-600'> — {g.descripcion}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs'>
        <h3 className='text-sm font-semibold text-slate-900'>Trabajadores ({trabajadores.length})</h3>
        <div className='overflow-x-auto rounded-lg border'>
          <table className='min-w-full border-collapse text-[11px]'>
            <thead className='bg-slate-50'>
              <tr>
                <th className='px-2 py-1 text-left'>Nombre</th>
                <th className='px-2 py-1 text-left'>RUT / ID</th>
                <th className='px-2 py-1 text-left'>Correo</th>
                <th className='px-2 py-1 text-left'>Grupo</th>
              </tr>
            </thead>
            <tbody>
              {trabajadores.map((t) => {
                const grupo = grupos.find((g) => g.id === t.grupoId);
                return (
                  <tr key={t.id} className='border-t border-slate-100'>
                    <td className='px-2 py-1'>{t.nombre}</td>
                    <td className='px-2 py-1'>{t.rut}</td>
                    <td className='px-2 py-1'>{t.correo}</td>
                    <td className='px-2 py-1'>
                      {grupo ? grupo.nombre : <span className='text-slate-400'>Sin grupo</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className='space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs'>
        <h3 className='text-sm font-semibold text-slate-900'>Turnos ({turnos.length})</h3>
        {turnos.length === 0 ? (
          <p className='text-[11px] text-slate-500'>No se han definido turnos.</p>
        ) : (
          <ul className='list-disc pl-4'>
            {turnos.map((t) => (
              <li key={t.id}>
                <span className='font-medium'>{t.nombre || 'Sin nombre'}</span> —{' '}
                {t.inicio || '??:??'} a {t.fin || '??:??'}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs'>
        <h3 className='text-sm font-semibold text-slate-900'>
          Planificaciones ({planificaciones.length})
        </h3>
        {planificaciones.length === 0 ? (
          <p className='text-[11px] text-slate-500'>No se han definido planificaciones.</p>
        ) : (
          <div className='space-y-2'>
            {planificaciones.map((p) => (
              <div key={p.id} className='rounded border border-slate-200 p-2'>
                <p className='font-medium'>
                  {p.nombre || 'Sin nombre'} (ID: {p.id})
                </p>
                <div className='mt-1 grid grid-cols-2 gap-1 text-[11px] md:grid-cols-7'>
                  {DIAS.map((d) => {
                    const turnoId = p.semana[d];
                    const turno = turnos.find((t) => t.id === turnoId);
                    return (
                      <div key={d}>
                        <span className='font-semibold'>{d}: </span>
                        {turno
                          ? turno.nombre ||
                            `${turno.inicio || ''}${turno.inicio && turno.fin ? ' - ' : ''}${
                              turno.fin || ''
                            }`
                          : 'Sin turno'}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs'>
        <h3 className='text-sm font-semibold text-slate-900'>
          Asignaciones de planificación ({asignaciones.length})
        </h3>
        {asignaciones.length === 0 ? (
          <p className='text-[11px] text-slate-500'>
            Aún no se han asignado planificaciones a trabajadores.
          </p>
        ) : (
          <div className='overflow-x-auto rounded-lg border'>
            <table className='min-w-full border-collapse text-[11px]'>
              <thead className='bg-slate-50'>
                <tr>
                  <th className='px-2 py-1 text-left'>Trabajador</th>
                  <th className='px-2 py-1 text-left'>Grupo</th>
                  <th className='px-2 py-1 text-left'>Planificación</th>
                  <th className='px-2 py-1 text-left'>Desde</th>
                  <th className='px-2 py-1 text-left'>Hasta</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.map((a) => {
                  const trabajador = trabajadores.find((t) => t.id === a.trabajadorId);
                  const plan = planificaciones.find((p) => p.id === a.planificacionId);
                  const grupo = trabajador
                    ? grupos.find((g) => g.id === trabajador.grupoId)
                    : null;
                  return (
                    <tr key={a.id} className='border-t border-slate-100'>
                      <td className='px-2 py-1'>{trabajador ? trabajador.nombre : '—'}</td>
                      <td className='px-2 py-1'>
                        {grupo ? grupo.nombre : <span className='text-slate-400'>Sin grupo</span>}
                      </td>
                      <td className='px-2 py-1'>{plan ? plan.nombre || 'Sin nombre' : '—'}</td>
                      <td className='px-2 py-1'>{a.desde || '—'}</td>
                      <td className='px-2 py-1'>{a.hasta || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {trabajadoresSinPlan.length > 0 && (
          <p className='text-[11px] font-medium text-red-600'>
            Atención: Hay {trabajadoresSinPlan.length} trabajador(es) sin planificación asignada.
          </p>
        )}
      </div>
    </section>
  );
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const [admin, setAdmin] = useState<Admin>({
    nombre: '',
    email: '',
    telefono: '',
  });

  const [empresa, setEmpresa] = useState<Empresa>({
    nombre: '',
    rut: '',
    pais: '',
    cantidadTrabajadores: '',
    grupos: [],
  });

  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([
    {
      id: Date.now(),
      nombre: '',
      rut: '',
      correo: '',
      grupoId: '',
    },
  ]);

  const [trabajadoresErrors, setTrabajadoresErrors] = useState<TrabajadoresErrors>({
    byId: {},
    global: [],
  });

  const [turnos, setTurnos] = useState<Turno[]>([
    { id: Date.now(), nombre: '', inicio: '', fin: '' },
  ]);

  const [planificaciones, setPlanificaciones] = useState<Planificacion[]>([]);

  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([
    { id: Date.now(), trabajadorId: '', planificacionId: '', desde: '', hasta: '' },
  ]);

  const [errorAsignacionGlobal, setErrorAsignacionGlobal] = useState('');

  const ensureGrupoByName = (name: string): number | '' => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    const existing = empresa.grupos.find(
      (g) => g.nombre.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) return existing.id;

    const nuevo: Grupo = {
      id: Date.now(),
      nombre: trimmed,
      descripcion: '',
    };
    setEmpresa((prev) => ({
      ...prev,
      grupos: [...prev.grupos, nuevo],
    }));
    return nuevo.id;
  };

  const validateTrabajadores = (): boolean => {
    const byId: TrabajadoresErrors['byId'] = {};
    const global: string[] = [];

    const seenRuts = new Set<string>();

    trabajadores.forEach((t) => {
      const rowErrors: { [field: string]: string } = {};
      if (!t.nombre.trim()) {
        rowErrors.nombre = 'Nombre obligatorio.';
      }
      const cleanRut = normalizeRut(t.rut);
      if (!cleanRut) {
        rowErrors.rut = 'RUT / ID obligatorio.';
      } else if (!isValidRut(cleanRut)) {
        rowErrors.rut = 'RUT con formato inválido.';
      } else if (seenRuts.has(cleanRut)) {
        rowErrors.rut = 'RUT duplicado.';
      } else {
        seenRuts.add(cleanRut);
      }

      if (!t.correo.trim()) {
        rowErrors.correo = 'Correo obligatorio.';
      } else if (!isValidEmail(t.correo)) {
        rowErrors.correo = 'Correo con formato inválido.';
      }

      if (!t.grupoId) {
        rowErrors.grupoId = 'Debes asignar un grupo.';
      }

      if (Object.keys(rowErrors).length > 0) {
        byId[t.id] = rowErrors;
      }
    });

    if (Object.keys(byId).length > 0) {
      global.push('Revisa los errores en el listado de trabajadores (RUT, correo o grupo).');
    }

    setTrabajadoresErrors({ byId, global });
    return Object.keys(byId).length === 0;
  };

  const validateAsignaciones = (): boolean => {
    setErrorAsignacionGlobal('');

    if (planificaciones.length === 0) {
      setErrorAsignacionGlobal('Debes crear al menos una planificación antes de asignar.');
      return false;
    }

    const trabajadoresConPlan = new Set<number>();
    asignaciones.forEach((a) => {
      if (a.trabajadorId && a.planificacionId && a.desde && a.hasta) {
        trabajadoresConPlan.add(a.trabajadorId as number);
      }
    });

    const trabajadoresSinPlan = trabajadores.filter(
      (t) => !trabajadoresConPlan.has(t.id)
    );

    if (trabajadoresSinPlan.length > 0) {
      setErrorAsignacionGlobal(
        `Aún hay ${trabajadoresSinPlan.length} trabajador(es) sin planificación asignada.`
      );
      return false;
    }

    return true;
  };

  const canGoNext = (): boolean => {
    if (currentStep === 2) {
      return validateTrabajadores();
    }
    if (currentStep === 5) {
      return validateAsignaciones();
    }
    return true;
  };

  const nextStep = () => {
    if (!canGoNext()) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AdminStep admin={admin} setAdmin={setAdmin} />;
      case 1:
        return <EmpresaGruposStep empresa={empresa} setEmpresa={setEmpresa} />;
      case 2:
        return (
          <TrabajadoresStep
            trabajadores={trabajadores}
            setTrabajadores={setTrabajadores}
            grupos={empresa.grupos}
            errors={trabajadoresErrors}
            setErrors={setTrabajadoresErrors}
            ensureGrupoByName={ensureGrupoByName}
          />
        );
      case 3:
        return <TurnosStep turnos={turnos} setTurnos={setTurnos} />;
      case 4:
        return (
          <PlanificacionesStep
            planificaciones={planificaciones}
            setPlanificaciones={setPlanificaciones}
            turnos={turnos}
          />
        );
      case 5:
        return (
          <AsignacionStep
            asignaciones={asignaciones}
            setAsignaciones={setAsignaciones}
            trabajadores={trabajadores}
            planificaciones={planificaciones}
            grupos={empresa.grupos}
            errorGlobal={errorAsignacionGlobal}
          />
        );
      case 6:
        return (
          <ResumenStep
            admin={admin}
            empresa={empresa}
            trabajadores={trabajadores}
            turnos={turnos}
            planificaciones={planificaciones}
            asignaciones={asignaciones}
            grupos={empresa.grupos}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-slate-100 px-3 py-4 md:px-6'>
      <div className='mx-auto flex max-w-6xl flex-col gap-4'>
        <header className='space-y-1'>
          <h1 className='text-xl font-bold text-slate-900'>
            Onboarding de trabajadores, turnos y planificaciones
          </h1>
          <p className='text-xs text-slate-600'>
            Completa estos pasos para dejar configurada una primera versión de tu empresa en la
            plataforma de control de asistencia.
          </p>
        </header>

        <Stepper currentStep={currentStep} />

        <main className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
          {renderStep()}
        </main>

        <footer className='flex items-center justify-between gap-3'>
          <button
            type='button'
            onClick={prevStep}
            disabled={currentStep === 0}
            className='rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Anterior
          </button>
          <div className='flex items-center gap-2'>
            <span className='text-[11px] text-slate-500'>
              Paso {currentStep + 1} de {steps.length}
            </span>
            <button
              type='button'
              onClick={nextStep}
              className='rounded-full bg-sky-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-sky-600'
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
