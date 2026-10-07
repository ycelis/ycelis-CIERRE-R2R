const fs = require("fs");
const path = require("path");

const MONDAY_TOKEN = process.env.MONDAY_TOKEN;
const MONDAY_BOARD_ID = process.env.MONDAY_BOARD_ID || "18432754378";
const MONDAY_API_URL = "https://api.monday.com/v2";

if (!MONDAY_TOKEN) {
  console.error("❌ Error: MONDAY_TOKEN no está definido en el entorno.");
  process.exit(1);
}

function colText(columnValues, ...titles) {
  for (const cv of columnValues) {
    const t = (cv.column && cv.column.title) ? cv.column.title.trim() : "";
    if (titles.some(opt => t.toLowerCase() === opt.toLowerCase())) return cv.text || "";
  }
  for (const cv of columnValues) {
    const t = (cv.column && cv.column.title) ? cv.column.title.trim().toLowerCase() : "";
    if (titles.some(opt => t.includes(opt.toLowerCase()))) return cv.text || "";
  }
  return "";
}

function normalizarEstado(label) {
  if (!label) return "NOT STARTED";
  const l = label.toUpperCase();
  if (l === "COMPLETED" || l === "COMPLETADO" || l === "DONE" || l === "FINALIZADO") return "COMPLETED";
  if (l === "IN PROCESS" || l === "EN PROCESO" || l === "EN PROGRESO" || l === "WORKING ON IT") return "IN PROCESS";
  if (l === "NOT STARTED" || l === "NO INICIADO" || l === "NOT APPLICABLE" || l === "BLOQUEADO" || l === "STUCK") return "NOT STARTED";
  return "NOT STARTED";
}

async function sincronizar() {
  console.log(`📡 Consultando Monday Board: ${MONDAY_BOARD_ID}...`);
  const query = `{
    boards(ids: ${MONDAY_BOARD_ID}) {
      name
      items_page(limit: 500) {
        items {
          id
          name
          group { title }
          column_values {
            id text
            column { title }
          }
        }
      }
    }
  }`;

  const res = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": MONDAY_TOKEN,
      "API-Version": "2024-01"
    },
    body: JSON.stringify({ query })
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const json = await res.json();
  if (json.errors && json.errors.length) throw new Error(json.errors[0].message);

  const board = json.data && json.data.boards && json.data.boards[0];
  if (!board) throw new Error("Tablero no encontrado.");

  const items = board.items_page.items || [];
  console.log(`✓ Obtenidos ${items.length} items de Monday.`);

  const actividades = items.map(item => {
    const cv = item.column_values || [];
    const estRaw  = colText(cv, "Estatus Cierre","Estatus","Estado","Status","Estatus_Cierre","estado");
    const diaRaw  = colText(cv, "Dia","Día","DIA","Day","dia");
    const opRaw   = colText(cv, "Operación","Operacion","Operation","OPERACION","operacion");
    const respRaw = colText(cv, "Responsable","RESPONSABLE","Owner","Person","responsable","Assignee");
    const areaRaw = colText(cv, "Areas","Área","Area","AREA","AREAS","area");
    const paisRaw = colText(cv, "PAISES","Paises","País","Pais","PAIS","Country","pais");
    const tipoRaw = colText(cv, "Estatus Entregable","Tipo","TIPO","Deliverable Status","Cierre_Tipo","entregable");
    const comRaw  = colText(cv, "Comentarios","Comentario","Comments","Comment","COMENTARIOS","comentario","Notes","notes");

    return {
      n:        item.name.trim(),
      mondayId: item.id,
      dia:      diaRaw !== "" ? (isNaN(Number(diaRaw)) ? null : Number(diaRaw)) : null,
      op:       opRaw.trim(),
      est:      normalizarEstado(estRaw),
      resp:     respRaw.trim(),
      area:     areaRaw.trim() || (item.group ? item.group.title : ""),
      pais:     paisRaw.trim(),
      tipo:     tipoRaw.trim(),
      com:      comRaw.trim()
    };
  }).filter(d => d.n);

  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    total: actividades.length,
    actividades
  };

  const outputPath = path.join(dataDir, "cierre.json");
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`✅ Archivo data/cierre.json generado exitosamente con ${actividades.length} actividades.`);
}

sincronizar().catch(err => {
  console.error("❌ Error en la sincronización:", err.message);
  process.exit(1);
});
