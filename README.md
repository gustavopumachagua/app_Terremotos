# 🌍 App Terremotos

**App Terremotos** es una aplicación interactiva desarrollada con **React**, **D3.js** y **Tailwind CSS** para el análisis y visualización de datos sísmicos a nivel mundial. Permite explorar patrones y estadísticas de terremotos mediante gráficos dinámicos, tablas y visualizaciones personalizadas.

---

## 📊 Funcionalidades principales

- 📋 **Tabla global**: Top 10 de los terremotos más intensos.
- 📌 **Gráfico de dispersión**: Relación entre profundidad y magnitud.
- 📉 **Histogramas**: Distribución de magnitudes globales y personalizadas.
- 📊 **Gráficos de barras**:
  - Por región
  - Por país (Top 20)
- 📈 **Series temporales**:
  - Magnitud de terremotos a lo largo del tiempo
  - Solo terremotos de magnitud ≥ 8.0
- 🧪 **Visualizaciones personalizadas**: Tablas, gráficas y análisis individuales.
- 🏁 **Bar Chart Race**: Competencia visual entre países en función de la actividad sísmica.

---

## 🚀 Tecnologías utilizadas

- **React 18** – Interfaz de usuario
- **D3.js** – Gráficos y visualizaciones avanzadas
- **Tailwind CSS** – Estilos rápidos y responsivos
- **PapaParse** – Carga y parseo de datos CSV
- **Vite** – Empaquetador rápido para desarrollo moderno

---

## ⚙️ Scripts disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm install`

Instala todas las dependencias necesarias del proyecto.

### `npm run dev`

Inicia el servidor de desarrollo con Vite.
Accede en: [http://localhost:5173](http://localhost:5173)

### `npm run build`

Compila el proyecto para producción en la carpeta `dist/`.

### `npm run preview`

Sirve la versión ya compilada para pruebas locales.

---

## 📁 Estructura del proyecto

```
app\_terremotos/
├── public/
├── src/
│   ├── components/
│   │   ├── global/
│   │   ├── individual/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 📝 Requisitos

- Node.js 18+
- Navegador moderno (Chrome, Firefox, Edge)

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Puedes usarlo, modificarlo o distribuirlo libremente para fines educativos o personales.
