import React, { useMemo, useState, useEffect } from "react";

// Prototipo App Web — Onboarding GeoVictoria (Empresa, Trabajadores, Turnos)
// Nuevo flujo (según requerimiento):
// 0) Administrador
// 1) Empresa y Grupos
// 2) Trabajadores (solo datos básicos)
// 3) Turnos base y planificación general (plantilla semanal, sin trabajadores)
// 4) Asignación de planificación a trabajadores (detalle por día)
// 5) Resumen / Exportación

const dias = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

type Turno = {
  entrada: string;
  colacion: string;
  salida: string;
};

type TurnosPorDia = Record<string, Turno>;

type TurnoBase = {
  id: string;
  nombre: string;
  entrada: string;
  colacion: string;
  salida: string;
};

const emptyEmpresa = {
  razonSocial: "Empresa Demo GeoVictoria SpA",
  fantasia: "Empresa Demo",
  rut: "11.111.111-1",
  giro: "Servicios de control de asistencia",
  direccion: "Av. Siempre Viva 123",
  comuna: "Santiago",
  emailFacturacion: "facturacion@empresa-demo.cl",
  telefonoContacto: "+56 9 9123 4567",
  sistema: "GeoVictoria BOX",
  rubro: "Retail / Servicios",
};

const emptyAdmin = {
  nombre: "Administrador Demo",
  rut: "11.111.111-1",
  telefono: "+56 9 9988 7766",
  correo: "admin@empresa-demo.cl",
};

const makeEmptyTurnos = (): TurnosPorDia => {
  const base: TurnosPorDia = {};
  dias.forEach((d) => {
    base[d.toLowerCase()] = { entrada: "", colacion: "", salida: "" };
  });
  return base;
};

const makeEmptyTrabajador = () => ({
  rut: "",
  correo: "",
  nombres: "",
  apellidos: "",
  grupo: "",
  planInicio: "",
  planFin: "",
  turnos: makeEmptyTurnos(),
});

function parseTSV(text: string): string[][] {
  const norm = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!norm) return [];
  return norm.split("\n").map((r) => r.split("\t"));
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarRUT(rut: string): boolean {
  if (!rut) return false;
  const clean = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  if (clean.length < 2) return false;
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const res = 11 - (suma % 11);
  const dvCalc = res === 11 ? "0" : res === 10 ? "K" : String(res);
  return dvCalc === dv;
}

// Componente reutilizable para tiempo (24h) con soporte de texto y flechas nativas
function TimeInput({
  value,
  onChange,
  size = "md",
}: {
  value: string;
  onChange: (v: string) => void;
  size?: "md" | "xs";
}) {
  const className = size === "xs" ? "input input-xxs" : "input";
  return (
    <input
      type="time"
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      step={60}
    />
  );
}

export default function App() {
  // 0 admin, 1 empresa+grupos, 2 trabajadores, 3 turnos base + planificación general, 4 asignación, 5 resumen
  const [step, setStep] = useState(0);
  const [empresa, setEmpresa] = useState(emptyEmpresa);
  const [admin, setAdmin] = useState(emptyAdmin);
  const [grupos, setGrupos] = useState<string[]>(["GTS", "Soporte", "Comercial"]);
  const [nuevoGrupo, setNuevoGrupo] = useState("");
  const [trabajadores, setTrabajadores] = useState<
    ReturnType<typeof makeEmptyTrabajador>[]
  >([]);
  const [selectedTrabajadores, setSelectedTrabajadores] = useState<number[]>([]);
  const [pasteTrabajadores, setPasteTrabajadores] = useState("");

  // Catálogo de turnos base
  const [turnosBase, setTurnosBase] = useState<TurnoBase[]>([]);
  const [nuevoTurnoBase, setNuevoTurnoBase] = useState<{
    nombre: string;
    entrada: string;
    colacion: string;
    salida: string;
  }>({
    nombre: "",
    entrada: "",
    colacion: "",
    salida: "",
  });

  // Planificación general (plantilla semanal, sin trabajadores)
  const [planificacionGeneral, setPlanificacionGeneral] =
    useState<TurnosPorDia>(makeEmptyTurnos());

  // --- Validaciones por paso ---
  const erroresEmpresa = useMemo(() => {
    const errs: string[] = [];
    if (!empresa.razonSocial) errs.push("La razón social es obligatoria.");
    if (!empresa.rut) errs.push("El RUT de la empresa es obligatorio.");
    if (!empresa.emailFacturacion) errs.push("El correo de facturación es obligatorio.");
    if (empresa.emailFacturacion && !emailRegex.test(empresa.emailFacturacion)) {
      errs.push("El correo de facturación no es válido.");
    }
    if (!empresa.sistema) errs.push("Debes indicar el sistema.");
    return errs;
  }, [empresa]);

  const erroresAdmin = useMemo(() => {
    const errs: string[] = [];
    if (!admin.nombre) errs.push("El nombre del administrador es obligatorio.");
    if (!admin.rut) errs.push("El RUT del administrador es obligatorio.");
    if (admin.rut && !validarRUT(admin.rut)) errs.push("El RUT del administrador no es válido.");
    if (!admin.correo) errs.push("El correo del administrador es obligatorio.");
    if (admin.correo && !emailRegex.test(admin.correo)) {
      errs.push("El correo del administrador no es válido.");
    }
    return errs;
  }, [admin]);

  const erroresGrupos = useMemo(() => {
    const errs: string[] = [];
    const limp = grupos.map((g) => g.trim()).filter(Boolean);
    if (limp.length === 0) errs.push("Debes definir al menos un grupo.");
    return errs;
  }, [grupos]);

  const erroresTrabajadoresDatos = useMemo(() => {
    const errs: string[] = [];
    const correos = new Set<string>();
    trabajadores.forEach((t, idx) => {
      const n = idx + 1;
      if (!t.rut) errs.push(`Trabajador #${n}: el RUT es obligatorio.`);
      if (t.rut && !validarRUT(t.rut)) errs.push(`Trabajador #${n}: el RUT no es válido.`);
      if (!t.correo) errs.push(`Trabajador #${n}: el correo es obligatorio.`);
      if (t.correo && !emailRegex.test(t.correo)) {
        errs.push(`Trabajador #${n}: el correo no es válido.`);
      }
      if (t.correo) {
        const key = t.correo.toLowerCase();
        if (correos.has(key)) errs.push(`Trabajador #${n}: correo duplicado (${t.correo}).`);
        correos.add(key);
      }
      if (!t.nombres) errs.push(`Trabajador #${n}: los nombres son obligatorios.`);
      if (!t.apellidos) errs.push(`Trabajador #${n}: los apellidos son obligatorios.`);
      if (!t.grupo) errs.push(`Trabajador #${n}: debes seleccionar un grupo.`);
    });
    return errs;
  }, [trabajadores]);

  const erroresTrabajadores = useMemo(() => {
    const errs: string[] = [];
    trabajadores.forEach((t, idx) => {
      const n = idx + 1;
      dias.forEach((d) => {
        const key = d.toLowerCase();
        const turno = t.turnos[key];
        if (!turno) return;
        const { entrada, salida } = turno;
        if ((entrada && !salida) || (!entrada && salida)) {
          errs.push(
            `Trabajador #${n} (${d}): si completas entrada o salida, debes completar ambas.`
          );
        }
      });
    });
    return errs;
  }, [trabajadores]);

  const erroresGlobales = [
    ...erroresEmpresa,
    ...erroresAdmin,
    ...erroresGrupos,
    ...erroresTrabajadoresDatos,
    ...erroresTrabajadores,
  ];

  // Unificar grupos duplicados y actualizar trabajadores
  useEffect(() => {
    if (!grupos || grupos.length === 0) return;

    const mapLowerToCanonical = new Map<string, string>();
    let huboDuplicados = false;

    grupos.forEach((g) => {
      const trimmed = (g || "").trim();
      if (!trimmed) return;
      const key = trimmed.toLowerCase();
      if (!mapLowerToCanonical.has(key)) {
        mapLowerToCanonical.set(key, trimmed);
      } else {
        huboDuplicados = true;
      }
    });

    const gruposUnicos = Array.from(mapLowerToCanonical.values());

    let trabajadoresCambiados = false;
    const trabajadoresUnificados = trabajadores.map((t) => {
      if (!t.grupo) return t;
      const key = t.grupo.trim().toLowerCase();
      const canonico = mapLowerToCanonical.get(key);
      if (canonico && canonico !== t.grupo) {
        trabajadoresCambiados = true;
        return { ...t, grupo: canonico };
      }
      return t;
    });

    if (huboDuplicados || gruposUnicos.length !== grupos.length) {
      setGrupos(gruposUnicos);
    }
    if (trabajadoresCambiados) {
      setTrabajadores(trabajadoresUnificados);
    }
  }, [grupos, trabajadores]);

  // --- Navegación ---
  const canNext = () => {
    // 0) Administrador
    if (step === 0) return erroresAdmin.length === 0;
    // 1) Empresa y Grupos
    if (step === 1) return erroresEmpresa.length === 0 && erroresGrupos.length === 0;
    // 2) Trabajadores
    if (step === 2) return erroresTrabajadoresDatos.length === 0 && trabajadores.length > 0;
    // 3) Turnos base y planificación general -> no obligatorio tener turnos para avanzar
    if (step === 3) return true;
    // 4) Asignación planificación a trabajadores (detalle por día)
    if (step === 4) return erroresTrabajadores.length === 0 && trabajadores.length > 0;
    return true;
  };

  const goNext = () => {
    if (!canNext()) return;
    setStep((s) => Math.min(s + 1, 5));
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  // --- Grupos ---
  const addGrupo = () => {
    const g = nuevoGrupo.trim();
    if (!g) return;
    if (!grupos.map((x) => x.toLowerCase()).includes(g.toLowerCase())) {
      setGrupos([...grupos, g]);
    }
    setNuevoGrupo("");
  };

  const removeGrupo = (idx: number) => {
    const gName = grupos[idx];
    const usado = trabajadores.some((t) => t.grupo === gName);
    if (usado) {
      alert("No puedes eliminar un grupo que ya está asignado a trabajadores.");
      return;
    }
    setGrupos(grupos.filter((_, i) => i !== idx));
  };

  // --- Turnos base ---
  const addTurnoBase = () => {
    const nombre = nuevoTurnoBase.nombre.trim();
    const entrada = nuevoTurnoBase.entrada.trim();
    const colacion = nuevoTurnoBase.colacion.trim();
    const salida = nuevoTurnoBase.salida.trim();
    if (!nombre || !entrada || !salida) {
      alert("Para crear un turno base debes completar nombre, entrada y salida.");
      return;
    }
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setTurnosBase((prev) => [...prev, { id, nombre, entrada, colacion, salida }]);
    setNuevoTurnoBase({ nombre: "", entrada: "", colacion: "", salida: "" });
  };

  const removeTurnoBase = (id: string) => {
    setTurnosBase((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Trabajadores ---
  const addTrabajador = () => {
    setTrabajadores((prev) => [...prev, makeEmptyTrabajador()]);
  };

  const updateTrabajador = (
    idx: number,
    patch: Partial<ReturnType<typeof makeEmptyTrabajador>>
  ) => {
    setTrabajadores((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  };

  const updateTurno = (
    idxTrab: number,
    diaKey: string,
    patch: { entrada?: string; colacion?: string; salida?: string }
  ) => {
    setTrabajadores((prev) =>
      prev.map((t, i) => {
        if (i !== idxTrab) return t;
        return {
          ...t,
          turnos: {
            ...t.turnos,
            [diaKey]: { ...t.turnos[diaKey], ...patch },
          },
        };
      })
    );
  };

  const updatePlanificacionGeneral = (
    diaKey: string,
    patch: { entrada?: string; colacion?: string; salida?: string }
  ) => {
    setPlanificacionGeneral((prev) => ({
      ...prev,
      [diaKey]: { ...prev[diaKey], ...patch },
    }));
  };

  const removeTrabajador = (idx: number) => {
    setTrabajadores((prev) => prev.filter((_, i) => i !== idx));
    setSelectedTrabajadores((prev) =>
      prev
        .filter((i) => i !== idx)
        .map((i) => (i > idx ? i - 1 : i))
    );
  };

  const copiarTurnoDeAnterior = (idx: number) => {
    if (idx === 0) return;
    setTrabajadores((prev) =>
      prev.map((t, i) => {
        if (i !== idx) return t;
        const anterior = prev[idx - 1];
        return { ...t, turnos: JSON.parse(JSON.stringify(anterior.turnos)) };
      })
    );
  };

  const copiarLunesATodos = (idxTrab: number) => {
    setTrabajadores((prev) =>
      prev.map((t, i) => {
        if (i !== idxTrab) return t;
        const lunes = t.turnos["lunes"];
        const nuevosTurnos = { ...t.turnos };
        dias.forEach((d) => {
          const key = d.toLowerCase();
          nuevosTurnos[key] = { ...lunes };
        });
        return { ...t, turnos: nuevosTurnos };
      })
    );
  };

  const copiarTurnoASeleccionados = (idxFuente: number) => {
    setTrabajadores((prev) => {
      const destinos = selectedTrabajadores.filter((i) => i !== idxFuente);
      if (destinos.length === 0) {
        alert("Selecciona al menos un trabajador de destino.");
        return prev;
      }
      const fuente = prev[idxFuente];
      if (!fuente) return prev;
      const turnosClonados = JSON.parse(JSON.stringify(fuente.turnos)) as TurnosPorDia;
      return prev.map((t, i) =>
        destinos.includes(i)
          ? {
              ...t,
              turnos: turnosClonados,
            }
          : t
      );
    });
  };

  const aplicarPlanificacionGeneralASeleccionados = () => {
    setTrabajadores((prev) => {
      if (selectedTrabajadores.length === 0) {
        alert("Selecciona al menos un trabajador para aplicar la planificación general.");
        return prev;
      }
      const turnosClonados = JSON.parse(
        JSON.stringify(planificacionGeneral)
      ) as TurnosPorDia;
      return prev.map((t, i) =>
        selectedTrabajadores.includes(i)
          ? {
              ...t,
              turnos: turnosClonados,
            }
          : t
      );
    });
  };

  const toggleSeleccionTrabajador = (idx: number) => {
    setSelectedTrabajadores((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const parsearPegadoTrabajadores = () => {
    const rows = parseTSV(pasteTrabajadores);
    if (!rows.length) return;

    const nuevos: ReturnType<typeof makeEmptyTrabajador>[] = [];
    rows.forEach((cols) => {
      if (cols.join("").trim() === "") return;
      const base = makeEmptyTrabajador();

      // Formato reducido: RUT, Correo, Nombres, Apellidos, Grupo
      base.rut = cols[0] || "";
      base.correo = cols[1] || "";
      base.nombres = cols[2] || "";
      base.apellidos = cols[3] || "";
      base.grupo = cols[4] || "";

      // Opcional: rango de planificación si viene en el pegado extendido
      if (cols[5]) base.planInicio = cols[5];
      if (cols[6]) base.planFin = cols[6];

      // Opcional: turnos por día si viene el formato completo
      let idx = 7;
      dias.forEach((d) => {
        const key = d.toLowerCase();
        if (idx + 2 < cols.length) {
          base.turnos[key] = {
            entrada: cols[idx] || "",
            colacion: cols[idx + 1] || "",
            salida: cols[idx + 2] || "",
          };
        }
        idx += 3;
      });

      // Si el grupo no existe aún, se agrega
      if (
        base.grupo &&
        !grupos.map((g) => g.toLowerCase()).includes(base.grupo.toLowerCase())
      ) {
        setGrupos((prev) => [...prev, base.grupo]);
      }

      nuevos.push(base);
    });

    setTrabajadores(nuevos);
  };

  const payloadFinal = useMemo(
    () => ({
      empresa,
      admin,
      grupos,
      turnosBase,
      planificacionGeneral,
      trabajadores,
    }),
    [empresa, admin, grupos, turnosBase, planificacionGeneral, trabajadores]
  );

  const exportarJSON = () => {
    const blob = new Blob([JSON.stringify(payloadFinal, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ingreso_geovictoria.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const steps = [
    "Administrador",
    "Empresa y Grupos",
    "Trabajadores",
    "Turnos base y planificación",
    "Asignación planificación",
    "Resumen",
  ];

  const renderPasoActual = () => {
    // 0) Administrador del sistema
    if (step === 0) {
      return (
        <Card title="Administrador del sistema">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Nombre *">
              <input
                className="input"
                value={admin.nombre}
                onChange={(e) =>
                  setAdmin({ ...admin, nombre: e.target.value })
                }
              />
            </Field>
            <Field label="RUT *">
              <input
                className="input"
                value={admin.rut}
                onChange={(e) => setAdmin({ ...admin, rut: e.target.value })}
              />
            </Field>
            <Field label="Teléfono">
              <input
                className="input"
                value={admin.telefono}
                onChange={(e) =>
                  setAdmin({ ...admin, telefono: e.target.value })
                }
              />
            </Field>
            <Field label="Correo *">
              <input
                className="input"
                value={admin.correo}
                onChange={(e) =>
                  setAdmin({ ...admin, correo: e.target.value })
                }
              />
            </Field>
          </div>
          {erroresAdmin.length > 0 && <ErrorsList items={erroresAdmin} />}
        </Card>
      );
    }

    // 1) Empresa y Grupos
    if (step === 1) {
      return (
        <>
          <Card title="Datos de la empresa">
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Razón social *">
                <input
                  className="input"
                  value={empresa.razonSocial}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, razonSocial: e.target.value })
                  }
                />
              </Field>
              <Field label="Nombre de fantasía">
                <input
                  className="input"
                  value={empresa.fantasia}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, fantasia: e.target.value })
                  }
                />
              </Field>
              <Field label="RUT empresa *">
                <input
                  className="input"
                  value={empresa.rut}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, rut: e.target.value })
                  }
                />
              </Field>
              <Field label="Giro">
                <input
                  className="input"
                  value={empresa.giro}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, giro: e.target.value })
                  }
                />
              </Field>
              <Field label="Dirección">
                <input
                  className="input"
                  value={empresa.direccion}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, direccion: e.target.value })
                  }
                />
              </Field>
              <Field label="Comuna">
                <input
                  className="input"
                  value={empresa.comuna}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, comuna: e.target.value })
                  }
                />
              </Field>
              <Field label="Correo de facturación *">
                <input
                  className="input"
                  value={empresa.emailFacturacion}
                  onChange={(e) =>
                    setEmpresa({
                      ...empresa,
                      emailFacturacion: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Teléfono de contacto">
                <input
                  className="input"
                  value={empresa.telefonoContacto}
                  onChange={(e) =>
                    setEmpresa({
                      ...empresa,
                      telefonoContacto: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Sistema">
                <input
                  className="input"
                  value={empresa.sistema}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, sistema: e.target.value })
                  }
                />
              </Field>
              <Field label="Rubro">
                <input
                  className="input"
                  value={empresa.rubro}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, rubro: e.target.value })
                  }
                />
              </Field>
            </div>
            {erroresEmpresa.length > 0 && <ErrorsList items={erroresEmpresa} />}
          </Card>

          <Card title="Grupos / Áreas">
            <p className="text-sm text-gray-600 mb-2">
              Define los grupos una sola vez. Luego solo se seleccionan al
              cargar trabajadores.
            </p>
            <div className="flex gap-2 mb-3">
              <input
                className="input flex-1"
                placeholder="Ej: GTS, Soporte, Comercial"
                value={nuevoGrupo}
                onChange={(e) => setNuevoGrupo(e.target.value)}
              />
              <button onClick={addGrupo} className="btn-primary">
                Agregar grupo
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {grupos.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-xl border bg-gray-50"
                >
                  <span>{g}</span>
                  <button
                    onClick={() => removeGrupo(i)}
                    className="text-xs text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              {grupos.length === 0 && (
                <p className="text-sm text-gray-500">
                  Aún no hay grupos definidos.
                </p>
              )}
            </div>
            {erroresGrupos.length > 0 && <ErrorsList items={erroresGrupos} />}
          </Card>
        </>
      );
    }

    // 2) Trabajadores (datos básicos)
    if (step === 2) {
      // Mapa rápido para detectar correos duplicados en la tabla procesada
      const emailCounts = new Map<string, number>();
      trabajadores.forEach((t) => {
        if (t.correo) {
          const key = t.correo.toLowerCase();
          emailCounts.set(key, (emailCounts.get(key) || 0) + 1);
        }
      });

      return (
        <Card title="Trabajadores">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
            <p className="text-sm text-gray-600">
              Carga aquí a los trabajadores con sus datos básicos. La
              planificación de turnos se define en los siguientes pasos.
            </p>
            <div className="flex gap-2">
              <button onClick={addTrabajador} className="btn-secondary">
                Agregar trabajador
              </button>
            </div>
          </div>

          <details className="rounded-xl border bg-gray-50 p-3 mb-4">
            <summary className="cursor-pointer font-medium">
              Pegar desde Excel
            </summary>
            <p className="text-xs text-gray-600 mt-2 mb-2">
              Puedes pegar un formato reducido con columnas:{" "}
              <strong>RUT, Correo, Nombres, Apellidos, Grupo</strong>, o el
              formato completo que además incluya planificación (fechas) y
              turnos por día. Si traes planificación, quedará prellenada para
              los pasos siguientes.
            </p>
            <textarea
              className="w-full h-32 p-3 border rounded-xl bg-white text-xs"
              placeholder="Pega aquí las filas copiadas desde Excel (tabulaciones)"
              value={pasteTrabajadores}
              onChange={(e) => setPasteTrabajadores(e.target.value)}
            />
            <div className="mt-2 flex gap-2">
              <button onClick={parsearPegadoTrabajadores} className="btn-primary">
                Procesar pegado
              </button>
              <button
                onClick={() => setPasteTrabajadores("")}
                className="btn-secondary"
              >
                Limpiar
              </button>
            </div>
          </details>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr>
                  <Th>N°</Th>
                  <Th>RUT</Th>
                  <Th>Correo</Th>
                  <Th>Nombres</Th>
                  <Th>Apellidos</Th>
                  <Th>Grupo</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {trabajadores.map((t, idx) => {
                  const erroresFila: string[] = [];

                  if (!t.rut) erroresFila.push("El RUT es obligatorio.");
                  if (t.rut && !validarRUT(t.rut)) erroresFila.push("El RUT no es válido.");
                  if (!t.correo) erroresFila.push("El correo es obligatorio.");
                  if (t.correo && !emailRegex.test(t.correo))
                    erroresFila.push("El correo no es válido.");
                  if (t.correo) {
                    const key = t.correo.toLowerCase();
                    if ((emailCounts.get(key) || 0) > 1) {
                      erroresFila.push("Este correo está duplicado en la carga.");
                    }
                  }
                  if (!t.nombres) erroresFila.push("Los nombres son obligatorios.");
                  if (!t.apellidos) erroresFila.push("Los apellidos son obligatorios.");
                  if (!t.grupo) erroresFila.push("Debes seleccionar un grupo.");

                  return (
                    <React.Fragment key={idx}>
                      <tr className="odd:bg-gray-50 align-top">
                        <Td>{idx + 1}</Td>
                        <Td>
                          <input
                            className={`input input-xs ${
                              erroresFila.some((e) => e.includes("RUT"))
                                ? "border-red-400 bg-red-50"
                                : ""
                            }`}
                            value={t.rut}
                            onChange={(e) =>
                              updateTrabajador(idx, { rut: e.target.value })
                            }
                          />
                        </Td>
                        <Td>
                          <input
                            className={`input input-xs ${
                              erroresFila.some((e) =>
                                e.toLowerCase().includes("correo")
                              )
                                ? "border-red-400 bg-red-50"
                                : ""
                            }`}
                            value={t.correo}
                            onChange={(e) =>
                              updateTrabajador(idx, { correo: e.target.value })
                            }
                          />
                        </Td>
                        <Td>
                          <input
                            className={`input input-xs ${
                              erroresFila.some((e) =>
                                e.toLowerCase().includes("nombres")
                              )
                                ? "border-red-400 bg-red-50"
                                : ""
                            }`}
                            value={t.nombres}
                            onChange={(e) =>
                              updateTrabajador(idx, { nombres: e.target.value })
                            }
                          />
                        </Td>
                        <Td>
                          <input
                            className={`input input-xs ${
                              erroresFila.some((e) =>
                                e.toLowerCase().includes("apellidos")
                              )
                                ? "border-red-400 bg-red-50"
                                : ""
                            }`}
                            value={t.apellidos}
                            onChange={(e) =>
                              updateTrabajador(idx, {
                                apellidos: e.target.value,
                              })
                            }
                          />
                        </Td>
                        <Td>
                          <select
                            className={`input input-xs ${
                              erroresFila.some((e) =>
                                e.toLowerCase().includes("grupo")
                              )
                                ? "border-red-400 bg-red-50"
                                : ""
                            }`}
                            value={t.grupo}
                            onChange={(e) =>
                              updateTrabajador(idx, { grupo: e.target.value })
                            }
                          >
                            <option value="">Selecciona…</option>
                            {grupos.map((g) => (
                              <option key={g} value={g}>
                                {g}
                              </option>
                            ))}
                          </select>
                        </Td>
                        <Td>
                          <button
                            className="btn-ghost text-xs text-red-600"
                            onClick={() => removeTrabajador(idx)}
                          >
                            Eliminar
                          </button>
                        </Td>
                      </tr>
                      {erroresFila.length > 0 && (
                        <tr className="bg-red-50/40">
                          <Td colSpan={7}>
                            <ul className="text-[11px] text-red-700 list-disc list-inside">
                              {erroresFila.map((msg, i) => (
                                <li key={i}>{msg}</li>
                              ))}
                            </ul>
                          </Td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {trabajadores.length === 0 && (
                  <tr>
                    <Td colSpan={7}>
                      <span className="text-sm text-gray-500">
                        Aún no hay trabajadores. Pega desde Excel o agrega uno
                        manualmente.
                      </span>
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {erroresTrabajadoresDatos.length > 0 && (
            <ErrorsList items={erroresTrabajadoresDatos} />
          )}
        </Card>
      );
    }

    // 3) Turnos base y planificación general (solo catálogo + plantilla semanal, sin trabajadores)
    if (step === 3) {
      return (
        <>
          <Card title="Turnos base">
            <p className="text-sm text-gray-600 mb-3">
              Crea aquí los turnos tipo (horarios de entrada, colación y salida).
              Luego podrás usarlos en la plantilla semanal y asignarlos a los
              trabajadores en la pantalla siguiente.
            </p>

            <div className="grid md:grid-cols-[2fr,1fr,1fr,1fr,auto] gap-2 mb-2">
              <input
                className="input"
                placeholder="Nombre del turno (ej: Mañana)"
                value={nuevoTurnoBase.nombre}
                onChange={(e) =>
                  setNuevoTurnoBase((prev) => ({
                    ...prev,
                    nombre: e.target.value,
                  }))
                }
              />
              <TimeInput
                value={nuevoTurnoBase.entrada}
                onChange={(v) =>
                  setNuevoTurnoBase((prev) => ({
                    ...prev,
                    entrada: v,
                  }))
                }
              />
              <input
                className="input"
                placeholder="Colación (min)"
                value={nuevoTurnoBase.colacion}
                onChange={(e) =>
                  setNuevoTurnoBase((prev) => ({
                    ...prev,
                    colacion: e.target.value,
                  }))
                }
              />
              <TimeInput
                value={nuevoTurnoBase.salida}
                onChange={(v) =>
                  setNuevoTurnoBase((prev) => ({
                    ...prev,
                    salida: v,
                  }))
                }
              />
              <button onClick={addTurnoBase} className="btn-primary text-xs">
                Agregar
              </button>
            </div>

            {turnosBase.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-xs">
                {turnosBase.map((tb) => (
                  <div
                    key={tb.id}
                    className="px-3 py-1 rounded-full border bg-gray-50 flex items-center gap-2"
                  >
                    <span className="font-medium">{tb.nombre}</span>
                    <span className="text-gray-500">
                      {tb.entrada} – {tb.salida} ({tb.colacion || "0"} min
                      colación)
                    </span>
                    <button
                      type="button"
                      className="btn-ghost text-[10px] text-red-600"
                      onClick={() => removeTurnoBase(tb.id)}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-2">
                Aún no has definido turnos base. Puedes crearlos ahora o más
                adelante.
              </p>
            )}
          </Card>

          <Card title="Planificación general (plantilla semanal)">
            <p className="text-sm text-gray-600 mb-2">
              Define una plantilla semanal de turnos. Esta planificación general
              se puede aplicar luego a los trabajadores en la pantalla de
              asignación.
            </p>
            <div className="grid md:grid-cols-4 gap-2 text-xs">
              {dias.map((d) => {
                const key = d.toLowerCase();
                const turno = planificacionGeneral[key] || {
                  entrada: "",
                  colacion: "",
                  salida: "",
                };

                const matchingTurno = turnosBase.find(
                  (tb) =>
                    tb.entrada === turno.entrada &&
                    tb.colacion === turno.colacion &&
                    tb.salida === turno.salida
                );
                const selectedTurnoId = matchingTurno ? matchingTurno.id : "";

                return (
                  <div key={key} className="bg-white border rounded-xl p-2">
                    <div className="font-semibold mb-1">{d}</div>

                    <div className="mb-1">
                      <select
                        className="input input-xxs"
                        value={selectedTurnoId}
                        onChange={(e) => {
                          const id = e.target.value;
                          if (!id) {
                            updatePlanificacionGeneral(key, {
                              entrada: "",
                              colacion: "",
                              salida: "",
                            });
                            return;
                          }
                          const base = turnosBase.find((tb) => tb.id === id);
                          if (base) {
                            updatePlanificacionGeneral(key, {
                              entrada: base.entrada,
                              colacion: base.colacion,
                              salida: base.salida,
                            });
                          }
                        }}
                      >
                        <option value="">Libre / Personalizado</option>
                        {turnosBase.map((tb) => (
                          <option key={tb.id} value={tb.id}>
                            {tb.nombre} ({tb.entrada}–{tb.salida})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-1 items-center">
                      <div className="col-span-1">
                        <label className="block text-[10px] text-gray-500">
                          Entrada
                        </label>
                        <TimeInput
                          size="xs"
                          value={turno.entrada}
                          onChange={(v) =>
                            updatePlanificacionGeneral(key, {
                              entrada: v,
                            })
                          }
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] text-gray-500">
                          Col (min)
                        </label>
                        <input
                          className="input input-xxs"
                          value={turno.colacion}
                          onChange={(e) =>
                            updatePlanificacionGeneral(key, {
                              colacion: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] text-gray-500">
                          Salida
                        </label>
                        <TimeInput
                          size="xs"
                          value={turno.salida}
                          onChange={(v) =>
                            updatePlanificacionGeneral(key, {
                              salida: v,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      );
    }

    // 4) Asignación de planificación a trabajadores (detalle semanal)
    if (step === 4) {
      return (
        <Card title="Asignación de planificación a trabajadores">
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <p className="text-sm text-gray-600">
              Asigna los turnos a cada trabajador, por día de la semana. Puedes
              copiar planificaciones entre trabajadores usando selección por
              checkbox o aplicar la planificación general.
            </p>
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={aplicarPlanificacionGeneralASeleccionados}
            >
              Aplicar planificación general a seleccionados
            </button>
          </div>

          {/* Tabla superior de selección y acciones masivas */}
          <section className="mb-4">
            <h3 className="text-sm font-medium mb-2">Selección de trabajadores</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr>
                    <Th>N°</Th>
                    <Th>Sel.</Th>
                    <Th>RUT</Th>
                    <Th>Trabajador</Th>
                    <Th>Grupo</Th>
                    <Th>Planificación (Inicio - Fin)</Th>
                    <Th>Acciones</Th>
                  </tr>
                </thead>
                <tbody>
                  {trabajadores.map((t, idx) => (
                    <tr key={idx} className="odd:bg-gray-50 align-top">
                      <Td>{idx + 1}</Td>
                      <Td>
                        <input
                          type="checkbox"
                          checked={selectedTrabajadores.includes(idx)}
                          onChange={() => toggleSeleccionTrabajador(idx)}
                        />
                      </Td>
                      <Td>{t.rut || "(sin RUT)"}</Td>
                      <Td>
                        {`${t.nombres || "(Sin nombre)"} ${
                          t.apellidos || ""
                        }`}
                      </Td>
                      <Td>{t.grupo || "(sin grupo)"}</Td>
                      <Td>
                        <div className="flex flex-col gap-1">
                          <input
                            className="input input-xs"
                            placeholder="Inicio"
                            value={t.planInicio}
                            onChange={(e) =>
                              updateTrabajador(idx, {
                                planInicio: e.target.value,
                              })
                            }
                          />
                          <input
                            className="input input-xs"
                            placeholder="Fin (o PERMANENTE)"
                            value={t.planFin}
                            onChange={(e) =>
                              updateTrabajador(idx, {
                                planFin: e.target.value,
                              })
                            }
                          />
                        </div>
                      </Td>
                      <Td>
                        <div className="flex flex-col gap-1">
                          <button
                            className="btn-ghost text-xs"
                            onClick={() => copiarTurnoDeAnterior(idx)}
                            disabled={idx === 0}
                          >
                            Copiar turno anterior
                          </button>
                          <button
                            className="btn-ghost text-xs"
                            onClick={() => copiarLunesATodos(idx)}
                          >
                            Copiar lunes a toda la semana
                          </button>
                          <button
                            className="btn-ghost text-xs"
                            onClick={() => copiarTurnoASeleccionados(idx)}
                          >
                            Copiar a seleccionados
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                  {trabajadores.length === 0 && (
                    <tr>
                      <Td colSpan={7}>
                        <span className="text-sm text-gray-500">
                          No hay trabajadores cargados. Primero agrega
                          trabajadores en los pasos anteriores.
                        </span>
                      </Td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Detalle de turnos por trabajador */}
          {trabajadores.length > 0 && (
            <section className="mt-4">
              <h3 className="font-medium mb-2">
                Detalle de turnos por trabajador
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                Selecciona un turno base por día o ajusta los horarios
                manualmente.
              </p>
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                {trabajadores.map((t, idxTrab) => (
                  <div
                    key={idxTrab}
                    className="border rounded-2xl p-3 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">
                        {t.nombres || "(Sin nombre)"} {t.apellidos} — {t.rut}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="btn-ghost text-xs"
                          onClick={() => copiarTurnoDeAnterior(idxTrab)}
                          disabled={idxTrab === 0}
                        >
                          Copiar turno anterior
                        </button>
                        <button
                          className="btn-ghost text-xs"
                          onClick={() => copiarLunesATodos(idxTrab)}
                        >
                          Copiar lunes a toda la semana
                        </button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-2 text-xs">
                      {dias.map((d) => {
                        const key = d.toLowerCase();
                        const turno = t.turnos[key] || {
                          entrada: "",
                          colacion: "",
                          salida: "",
                        };

                        const matchingTurno = turnosBase.find(
                          (tb) =>
                            tb.entrada === turno.entrada &&
                            tb.colacion === turno.colacion &&
                            tb.salida === turno.salida
                        );
                        const selectedTurnoId = matchingTurno
                          ? matchingTurno.id
                          : "";

                        return (
                          <div
                            key={key}
                            className="bg-white border rounded-xl p-2"
                          >
                            <div className="font-semibold mb-1">{d}</div>

                            <div className="mb-1">
                              <select
                                className="input input-xxs"
                                value={selectedTurnoId}
                                onChange={(e) => {
                                  const id = e.target.value;
                                  if (!id) {
                                    updateTurno(idxTrab, key, {
                                      entrada: "",
                                      colacion: "",
                                      salida: "",
                                    });
                                    return;
                                  }
                                  const base = turnosBase.find(
                                    (tb) => tb.id === id
                                  );
                                  if (base) {
                                    updateTurno(idxTrab, key, {
                                      entrada: base.entrada,
                                      colacion: base.colacion,
                                      salida: base.salida,
                                    });
                                  }
                                }}
                              >
                                <option value="">Libre / Personalizado</option>
                                {turnosBase.map((tb) => (
                                  <option key={tb.id} value={tb.id}>
                                    {tb.nombre} ({tb.entrada}–{tb.salida})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-3 gap-1 items-center">
                              <div className="col-span-1">
                                <label className="block text-[10px] text-gray-500">
                                  Entrada
                                </label>
                                <TimeInput
                                  size="xs"
                                  value={turno.entrada}
                                  onChange={(v) =>
                                    updateTurno(idxTrab, key, {
                                      entrada: v,
                                    })
                                  }
                                />
                              </div>
                              <div className="col-span-1">
                                <label className="block text-[10px] text-gray-500">
                                  Col (min)
                                </label>
                                <input
                                  className="input input-xxs"
                                  value={turno.colacion}
                                  onChange={(e) =>
                                    updateTurno(idxTrab, key, {
                                      colacion: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="col-span-1">
                                <label className="block text-[10px] text-gray-500">
                                  Salida
                                </label>
                                <TimeInput
                                  size="xs"
                                  value={turno.salida}
                                  onChange={(v) =>
                                    updateTurno(idxTrab, key, {
                                      salida: v,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {erroresTrabajadores.length > 0 && (
            <ErrorsList items={erroresTrabajadores} />
          )}
        </Card>
      );
    }

    // 5) Resumen
    if (step === 5) {
      return (
        <Card title="Resumen y exportación">
          <p className="text-sm text-gray-600 mb-4">
            Revisa un resumen de la información que se enviará. Puedes descargar
            un JSON para Integración / Onboarding.
          </p>
          <div className="mb-4">
            <button onClick={exportarJSON} className="btn-primary">
              Descargar JSON de ingreso
            </button>
          </div>
          <pre className="text-xs bg-gray-900 text-green-200 p-3 rounded-xl max-h-80 overflow-auto">
            {JSON.stringify(payloadFinal, null, 2)}
          </pre>
          {erroresGlobales.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-1 text-red-700">
                Advertencias / Errores de validación
              </h3>
              <ErrorsList items={erroresGlobales} />
            </div>
          )}
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center px-2 py-4 md:py-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg border border-slate-200 p-4 md:p-8 flex flex-col gap-4">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              Onboarding GeoVictoria — Ingreso de Empresa y Trabajadores
            </h1>
            <p className="text-xs md:text-sm text-slate-600">
              Prototipo web para reemplazar la planilla Excel de ingreso de
              empresa, empleados y turnos.
            </p>
          </div>
          <div className="flex flex-wrap gap-1 text-xs">
            {steps.map((label, i) => (
              <span
                key={label}
                className={`px-2 py-1 rounded-full border text-[11px] ${
                  i === step
                    ? "bg-sky-600 text-white border-sky-600"
                    : i < step
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}
              >
                {i + 1}. {label}
              </span>
            ))}
          </div>
        </header>

        <main className="flex-1 flex flex-col gap-4">
          {renderPasoActual()}

          <div className="flex justify-between items-center pt-2 border-t mt-2">
            <button
              onClick={goPrev}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-40"
            >
              Atrás
            </button>
            <button
              onClick={goNext}
              disabled={!canNext() || step === 5}
              className="btn-primary disabled:opacity-40"
            >
              {step === 5 ? "Completado" : "Siguiente"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Componentes de UI auxiliares ---

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-slate-200 rounded-2xl p-4 md:p-6 bg-slate-50/60 flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-700 text-xs md:text-sm">{label}</span>
      {children}
    </label>
  );
}

function ErrorsList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-2 list-disc list-inside">
      {items.map((e, i) => (
        <li key={i}>{e}</li>
      ))}
    </ul>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-2 py-1 text-left text-[11px] font-semibold text-slate-600 border-b">
      {children}
    </th>
  );
}

function Td({
  children,
  colSpan,
}: {
  children: React.ReactNode;
  colSpan?: number;
}) {
  return (
    <td
      className="px-2 py-1 align-top text-[11px] text-slate-800 border-b"
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}
