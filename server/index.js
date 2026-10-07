require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const MONDAY_TOKEN = process.env.MONDAY_TOKEN;
const MONDAY_BOARD_ID = process.env.MONDAY_BOARD_ID;
const MONDAY_API_URL = process.env.MONDAY_API_URL || "https://api.monday.com/v2";

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "..")));

// Función helper para consultar la API de Monday
async function mondayRequest(query, variables = {}) {
  if (!MONDAY_TOKEN) {
    throw new Error("MONDAY_TOKEN no configurado en el archivo .env");
  }
  const response = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": MONDAY_TOKEN,
      "API-Version": "2024-01"
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`Monday API HTTP error: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }
  return result;
}

// Endpoint GET: Obtener las actividades del tablero de Monday
app.get("/api/activities", async (req, res) => {
  try {
    const query = `{
      boards(ids: ${MONDAY_BOARD_ID}) {
        name
        items_page(limit: 500) {
          items {
            id
            name
            group { title }
            column_values {
              id
              text
              column { title }
            }
          }
        }
      }
    }`;

    const data = await mondayRequest(query);
    const board = data.data && data.data.boards && data.data.boards[0];
    if (!board) {
      return res.status(404).json({ error: "Tablero no encontrado" });
    }

    res.json({
      boardName: board.name,
      items: board.items_page ? board.items_page.items : []
    });
  } catch (err) {
    console.error("Error al obtener actividades desde Monday:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint POST: Actualizar celda/valor de columna en Monday
app.post("/api/update-cell", async (req, res) => {
  try {
    const { itemId, columnId, value } = req.body;
    if (!itemId || !columnId || value === undefined) {
      return res.status(400).json({ error: "Faltan parámetros requeridos (itemId, columnId, value)" });
    }

    const valueStr = JSON.stringify(typeof value === "string" ? value : JSON.stringify(value));
    const mutation = `mutation {
      change_column_value(
        item_id: ${itemId},
        board_id: ${MONDAY_BOARD_ID},
        column_id: "${columnId}",
        value: ${valueStr}
      ) {
        id
      }
    }`;

    const data = await mondayRequest(mutation);
    res.json({ success: true, data: data.data });
  } catch (err) {
    console.error("Error al actualizar celda en Monday:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Ruta de fallback para servir el dashboard
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Dashboard Server iniciado`);
  console.log(`🌐 Acceso local: http://localhost:${PORT}`);
  console.log(`📋 Monday Board ID: ${MONDAY_BOARD_ID}`);
  console.log(`🔒 Token cargado de forma segura desde .env`);
  console.log(`===============================================`);
});
