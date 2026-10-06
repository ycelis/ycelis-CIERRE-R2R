![alt text](image.png)# 📊 Dashboard Cierre Contable R2R

Dashboard interactivo para el seguimiento del cierre contable R2R de México y SCAC.  
Publicado con **GitHub Pages** y actualizable subiendo un archivo Excel.

---

## 🌐 Ver el dashboard en vivo

Una vez configurado el repositorio, el dashboard estará disponible en:

```
https://<tu-usuario>.github.io/<nombre-del-repositorio>/
```

---

## 🚀 Configuración inicial (solo la primera vez)

### Paso 1 — Crear el repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión.
2. Haz clic en **New repository** (botón verde, esquina superior derecha).
3. Ponle un nombre, por ejemplo: `dashboard-r2r`
4. Marca **Public** (obligatorio para GitHub Pages gratis).
5. Haz clic en **Create repository**.

### Paso 2 — Subir los archivos de este proyecto

**Opción A — Desde la interfaz web de GitHub (sin instalar nada):**

1. En tu repositorio recién creado, haz clic en **Add file → Upload files**.
2. Arrastra **todos** los archivos de esta carpeta:
   - `index.html`
   - `.github/workflows/deploy.yml`
   - `data/INSTRUCCIONES.md`
3. En el campo "Commit changes" escribe `Primer deploy del dashboard`.
4. Haz clic en **Commit changes**.

> ⚠️ **Importante:** Para subir la carpeta `.github/workflows/deploy.yml` desde la web,
> usa la opción **"Create new file"** y escribe la ruta completa:  
> `.github/workflows/deploy.yml`  
> Luego pega el contenido del archivo.

**Opción B — Usando Git (más rápido si tienes Git instalado):**

```bash
cd github-r2r-dashboard
git init
git add .
git commit -m "Primer deploy del dashboard"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/dashboard-r2r.git
git push -u origin main
```

### Paso 3 — Habilitar GitHub Pages

1. En tu repositorio de GitHub, ve a **Settings** (⚙️).
2. En el menú izquierdo, haz clic en **Pages**.
3. En **Source**, selecciona **GitHub Actions**.
4. Guarda los cambios.

### Paso 4 — Verificar el primer deploy

1. Ve a la pestaña **Actions** de tu repositorio.
2. Deberías ver un workflow **"Deploy Dashboard a GitHub Pages"** ejecutándose.
3. Cuando termine (✅ verde), el dashboard estará disponible en la URL indicada arriba.

---

## 📂 Actualizar los datos (uso mensual)

Cada mes, para actualizar el dashboard:

1. Prepara tu archivo Excel con las columnas requeridas (ver abajo).
2. **Renómbralo exactamente como:** `cierre.xlsx`
3. En GitHub, navega a la carpeta `data/`.
4. Haz clic en **Add file → Upload files**.
5. Arrastra tu `cierre.xlsx` (si ya existe uno, lo reemplazará).
6. Escribe un mensaje de commit, por ejemplo: `Datos cierre enero 2025`
7. Haz clic en **Commit changes**.
8. El dashboard se actualizará automáticamente en **1-2 minutos** ⏱️

---

## 📋 Columnas requeridas en el Excel

| Columna | Obligatoria | Descripción |
|---|:---:|---|
| `Name` | ✅ | Nombre de la actividad |
| `Dia` | ✅ | Día del cierre (número) |
| `Operación` | ✅ | MEXICO o SCAC |
| `Estatus Cierre` | ✅ | COMPLETED / IN PROCESS / NOT STARTED / NOT APPLICABLE |
| `Responsable` | ✅ | Nombre del responsable |
| `Areas` | ✅ | Nombre del área |
| `PAISES` | ✅ | País(es) separados por coma |
| `Estatus Entregable` | ⬜ | Cierre / Postcierre |
| `Comentarios` | ⬜ | Comentario libre |

> 💡 Descarga la plantilla haciendo clic en **"Descargar Plantilla"** en el dashboard.

---

## 🏗️ Estructura del repositorio (Frontend & Backend)

```
📁 dashboard-r2r/
├── .env                          ← Variables de entorno (Token, Board ID) [Ignorado en Git]
├── .env.example                  ← Plantilla de configuración
├── package.json                  ← Dependencias del servidor Node.js
├── index.html                    ← Frontend del dashboard
├── server/
│   └── index.js                  ← Servidor Backend Express (Proxy seguro para Monday.com)
├── data/
│   ├── cierre.xlsx               ← Archivo Excel de respaldo
│   └── INSTRUCCIONES.md          ← Recordatorio de columnas
└── .github/
    └── workflows/
        └── deploy.yml            ← Pipeline de GitHub Actions
```

---

## 🚀 Cómo ejecutar el proyecto localmente

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar el archivo `.env`:**
   Copia el archivo `.env.example` a `.env` (si aún no existe) y define tus credenciales:
   ```env
   PORT=3000
   MONDAY_API_URL=https://api.monday.com/v2
   MONDAY_BOARD_ID=18432754378
   MONDAY_TOKEN=tu_token_aqui
   ```

3. **Iniciar el servidor:**
   ```bash
   npm start
   ```
   O en modo desarrollo con recarga automática:
   ```bash
   npm run dev
   ```

4. **Acceder al Dashboard:**
   Abre tu navegador en `http://localhost:3000`.

---

## ❓ Preguntas frecuentes

**¿El dashboard es público, cualquiera puede verlo?**  
Sí. Cualquier persona con el link puede consultar el dashboard sin necesidad de tener cuenta de GitHub.

**¿Mis datos de Excel quedan expuestos?**  
Sí, el archivo `cierre.xlsx` en la carpeta `data/` es público. No incluyas información confidencial. Si necesitas privacidad, considera un repositorio privado con GitHub Pages (requiere GitHub Team/Enterprise).

**¿El dashboard funciona sin conexión a internet?**  
No, requiere internet para cargar la librería SheetJS (CDN) y el archivo Excel del repositorio.

**¿Puedo usar otro nombre para el Excel?**  
El archivo debe llamarse exactamente `cierre.xlsx`. Si cambias el nombre, el dashboard no lo encontrará automáticamente.

**¿Qué pasa si el Excel tiene un error?**  
El dashboard mostrará un mensaje de error con la descripción del problema. Corrige el archivo y vuelve a subirlo.

---

## 🔧 Tecnologías usadas

- **HTML + CSS + JavaScript** — Sin frameworks, sin dependencias de backend
- **SheetJS (xlsx.js)** — Lectura de archivos Excel en el navegador
- **GitHub Pages** — Hosting gratuito y público
- **GitHub Actions** — Despliegue automático al detectar cambios

---

*Generado con IBM Bob*
