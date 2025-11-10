# 🔄 Configuración de Keep-Alive para Render

El plan gratuito de Render pone el servidor en "sleep mode" después de 15 minutos de inactividad. Esto causa un delay de ~50 segundos en la primera petición.

## ✅ Soluciones Implementadas

### 1. Keep-Alive desde el Frontend (YA IMPLEMENTADO)
El frontend hace un ping cada 10 minutos automáticamente cuando la app está abierta.

### 2. Servicio Externo de Keep-Alive (RECOMENDADO)

Configura un servicio externo que haga ping cada 14 minutos para mantener el servidor despierto 24/7.

#### Opción A: UptimeRobot (Gratis, Recomendado)

1. **Ve a**: https://uptimerobot.com/
2. **Regístrate gratis** (permite 50 monitores)
3. **Add New Monitor**:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Biblioteca Backend Keep-Alive
   - **URL**: `https://biblioteca-backend-yisd.onrender.com/health/`
   - **Monitoring Interval**: 5 minutos (gratis)
4. **Guarda** y el servicio empezará a hacer ping automáticamente

#### Opción B: Cron-job.org (Gratis)

1. **Ve a**: https://cron-job.org/
2. **Regístrate gratis**
3. **Create Cronjob**:
   - **Title**: Backend Keep-Alive
   - **URL**: `https://biblioteca-backend-yisd.onrender.com/health/`
   - **Schedule**: Every 10 minutes
   - **Enabled**: ✅
4. **Save**

#### Opción C: GitHub Actions (Gratis, Avanzado)

Crea `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Alive Backend

on:
  schedule:
    # Ejecutar cada 10 minutos
    - cron: '*/10 * * * *'
  workflow_dispatch: # Permite ejecutar manualmente

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Backend
        run: |
          curl https://biblioteca-backend-yisd.onrender.com/health/
          echo "Backend keep-alive ping sent"
```

## 📊 Resultados Esperados

Con cualquiera de estas soluciones:
- ✅ **Sin delay** en horas pico (8am - 10pm)
- ✅ **Máximo 50s delay** en la primera visita después de 6+ horas sin actividad
- ✅ **Respuestas instantáneas** (<500ms) para usuarios subsecuentes

## 🚀 Alternativa: Plan Pagado de Render

Si necesitas **cero delay garantizado**:
- **Plan Starter**: $7/mes
- **Beneficios**:
  - Servidor siempre activo
  - 0ms cold start
  - 750 horas de cómputo/mes
  - Mejor rendimiento general

## 🔍 Verificar que Funciona

Después de configurar UptimeRobot o Cron-job:

1. Espera 30 minutos sin visitar la app
2. Abre https://formulario-libros-eoi.netlify.app
3. Deberías ver carga instantánea (<2 segundos)

## 📝 Notas

- El endpoint `/health/` es muy ligero (no consulta la BD)
- No consume recursos significativos
- Es la solución estándar para apps en Render gratuito
