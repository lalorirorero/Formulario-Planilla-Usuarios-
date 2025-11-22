import React from "react";

export function TrabajadoresForm() {
  const [pastedRows, setPastedRows] = React.useState([]);
  const [validationErrors, setValidationErrors] = React.useState([]);
  const columns = [
    "Rut Completo",
    "Correo Personal",
    "Nombres",
    "Apellidos",
    "Grupo"
  ];

  // Validaciones
  function validateRut(rut) {
    // Formato: 12345678-9 o 12345678-K
    return /^[0-9]{7,8}-[0-9Kk]$/.test(rut.trim());
  }
  function validateEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  }
  function validateNotEmpty(value) {
    return value && value.trim() !== "";
  }

  function validateRow(row) {
    const errors = [];
    if (!validateRut(row[0])) errors.push("RUT inválido");
    if (!validateEmail(row[1])) errors.push("Correo inválido");
    if (!validateNotEmpty(row[2])) errors.push("Nombre vacío");
    if (!validateNotEmpty(row[3])) errors.push("Apellido vacío");
    if (!validateNotEmpty(row[4])) errors.push("Grupo vacío");
    return errors;
  }

  function handlePaste(e) {
    const clipboard = e.clipboardData.getData("text");
    let rows = clipboard
      .split(/\r?\n/)
      .map((row) => row.split("\t"));
    // Eliminar filas vacías y encabezados
    rows = rows.filter((cols) =>
      cols.length >= columns.length &&
      !cols.every((cell) => cell.trim() === "") &&
      cols[0].toLowerCase().indexOf("rut") === -1 // no encabezado
    );

    // Validar duplicados de RUT y EMAIL
    const rutSet = new Set();
    const emailCount = {};
    rows.forEach((row) => {
      const email = row[1].trim().toLowerCase();
      emailCount[email] = (emailCount[email] || 0) + 1;
    });

    const errors = [];
    rows.forEach((row, idx) => {
      const rowErrors = validateRow(row);
      if (rutSet.has(row[0].trim())) {
        rowErrors.push("RUT duplicado");
      } else {
        rutSet.add(row[0].trim());
      }
      const email = row[1].trim().toLowerCase();
      if (emailCount[email] > 1) {
        rowErrors.push("Email duplicado (permitido)");
      }
      errors.push(rowErrors);
    });
    setValidationErrors(errors);
    setPastedRows(rows);
  }

  return (
    <div className="space-y-4 text-base flex flex-col items-center justify-center w-full">
      <div className="space-y-2 w-full flex flex-col items-center">
        <h3 className="text-sm font-semibold text-slate-800 text-center">
          Carga de trabajadores
        </h3>
        <p className="text-xs text-slate-500 text-center">
          Puedes cargar una plantilla Excel con todos los trabajadores o ingresar algunos manualmente para partir el onboarding.
        </p>
        <div className="border-2 border-dashed border-sky-400 rounded-3xl bg-slate-50 px-6 py-6 space-y-3 w-full max-w-2xl flex flex-col items-center">
          <p className="text-xs text-slate-600 text-center">
            Pega aquí las celdas copiadas desde tu Excel (Rut, Correo, Nombres, Apellidos, Grupo):
          </p>
          <textarea
            className="w-full rounded-3xl border-2 border-sky-400 bg-white px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 resize-y min-h-[100px]"
            placeholder="Pega aquí las filas copiadas de Excel..."
            onPaste={handlePaste}
          />
          <p className="text-[11px] text-slate-400 text-center">
            Formato: Rut, Correo, Nombres, Apellidos, Grupo (en ese orden, cada uno en una columna)
          </p>
        </div>
      </div>

      {/* Previsualización automática de tabla pegada con validaciones */}
      {pastedRows.length > 0 && (
        <div className="w-full mt-4">
          <h4 className="text-base font-semibold text-slate-700 mb-2 text-center">Previsualización de trabajadores</h4>
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full text-base border border-slate-300 rounded-2xl bg-white">
              <colgroup>
                <col style={{width: '16%'}} />
                <col style={{width: '20%'}} />
                <col style={{width: '18%'}} />
                <col style={{width: '18%'}} />
                <col style={{width: '10%'}} />
                <col style={{width: '18%'}} />
              </colgroup>
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-3 py-3 text-left font-medium border-b border-slate-200 whitespace-nowrap">{col}</th>
                  ))}
                  <th className="px-3 py-3 text-left font-medium border-b border-slate-200 whitespace-nowrap">Errores</th>
                </tr>
              </thead>
              <tbody>
                {pastedRows.map((row, idx) => (
                  <tr key={idx} className="border-t border-slate-100">
                    {row.slice(0, columns.length).map((cell, cidx) => (
                      <td key={cidx} className="px-3 py-3 whitespace-nowrap align-middle">{cell}</td>
                    ))}
                    <td className="px-3 py-3 text-red-500 text-xs whitespace-nowrap align-middle">
                      {validationErrors[idx] && validationErrors[idx].length > 0
                        ? validationErrors[idx].join(", ")
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mensaje general si hay errores */}
          {validationErrors.some((errs) => errs.length > 0) && (
            <div className="mt-2 text-red-600 text-xs text-center">
              Corrige los errores marcados antes de continuar.
            </div>
          )}
        </div>
      )}

      {/* Sección de ingreso manual de trabajadores clave eliminada para mejor visualización */}
    </div>
  );
}
