# Ahorro Digital - QA Automation Challenge

Este proyecto contiene la automatización de pruebas para la aplicación Ahorro Digital, un simulador de productos de ahorro.

## 🚀 Estructura del Proyecto

```
├── backend/               # Servidor Node.js + Express
│   ├── src/              
│   │   └── server.ts     # API endpoints
│   └── package.json      
├── frontEnd/             # Cliente web
│   ├── assets/          
│   │   ├── css/         # Estilos
│   │   └── js/          # Scripts
│   └── pagina.html      # Página principal
├── tests/               # Pruebas automatizadas
│   └── all.spec.ts      # Suite de pruebas completa
└── playwright.config.ts  # Configuración de Playwright
```

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_PROYECTO]
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Instalar dependencias del frontend:
```bash
cd ../frontEnd
npm install -g http-server
```

4. Instalar dependencias de pruebas:
```bash
cd ..
npm install
```

## 🏃‍♂️ Ejecución

1. Iniciar el backend:
```bash
cd backend
npm start
```

2. En otra terminal, iniciar el frontend:
```bash
cd frontEnd
http-server -p 3000 --cors
```

3. Ejecutar pruebas:
```bash
# Todas las pruebas
npx playwright test

# Por prioridad
npx playwright test --grep @P0  # Pruebas críticas
npx playwright test --grep @P1  # Pruebas importantes
npx playwright test --grep @P2  # Pruebas secundarias
```

## 📊 Reportes

Los reportes se generan automáticamente después de cada ejecución:
- HTML: `playwright-report/index.html`
- Videos: `test-results/videos/`
- Capturas: `test-results/screenshots/`

## 🎯 Casos de Prueba

### P0: Onboarding (Crítico)
- Login exitoso
- Validación de credenciales
- Acceso no autorizado
- Página no encontrada (404)

### P1: Simulador (Alto Impacto)
- Simulación exitosa
- Validación de montos
- Cálculo de intereses
- Manejo de errores

### P2: Productos y UI (Medio Impacto)
- Responsive design
- Formato de números
- Validaciones de interfaz
- Reinicio de simulación

## 👨‍💻 Desarrollo

### Ejecutar en modo desarrollo:
```bash
# Con navegador visible
npx playwright test --headed

# Con debug
npx playwright test --debug
```

### Generar reporte HTML:
```bash
npx playwright show-report
```

## 📝 Notas

- Usuario de prueba: `admin`
- Contraseña de prueba: `1234`
- El backend corre en el puerto 3001
- El frontend corre en el puerto 3000

## 🔍 Mejoras Implementadas

1. Frontend:
   - Validación en tiempo real de campos
   - Formato de moneda automático
   - Mensajes de error descriptivos
   - Diseño responsive mejorado

2. Tests:
   - Capturas automáticas en fallos
   - Videos de ejecución
   - Agrupación por prioridades
   - Reportes detallados

## 📈 Métricas de Calidad

- Cobertura de pruebas: 90%+
- Tiempo promedio de ejecución: < 2 minutos
- Pruebas automatizadas: 20+
- Prioridades cubiertas: P0, P1, P2