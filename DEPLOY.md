# 🚀 Guía de Despliegue en Render

Esta guía te ayudará a desplegar el backend Django en Render.com paso a paso.

## 📋 Prerequisitos

- ✅ Cuenta en [Render.com](https://render.com) (gratuita)
- ✅ Repositorio en GitHub con el código actualizado
- ✅ Frontend desplegado en Netlify (ya lo tienes)

---

## 🔧 Paso 1: Preparar el Repositorio

Los siguientes archivos ya han sido creados para ti:

### Archivos de Configuración Creados:

1. **`build.sh`** - Script de construcción para Render
2. **`Procfile`** - Comando para iniciar el servidor
3. **`runtime.txt`** - Versión de Python
4. **`backend/requirements.txt`** - Dependencias actualizadas con:
   - `gunicorn` (servidor WSGI)
   - `psycopg2-binary` (PostgreSQL)
   - `whitenoise` (archivos estáticos)
   - `dj-database-url` (configuración DB)

5. **`backend/config/config/settings.py`** - Actualizado para producción:
   - Configuración de PostgreSQL
   - WhiteNoise para archivos estáticos
   - CORS con dominio de Netlify
   - Variables de entorno

---

## 🔐 Paso 2: Preparar Variables de Entorno

Antes de desplegar, necesitas estos valores:

1. **URL de tu frontend en Netlify** (ejemplo: `https://tu-app.netlify.app`)
2. **SECRET_KEY de Django** (genera una nueva para producción)

### Generar SECRET_KEY:

```python
# En tu terminal local:
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copia el resultado, lo necesitarás después.

---

## 🌐 Paso 3: Crear Web Service en Render

### 1. Ir a Render Dashboard

Accede a [https://dashboard.render.com](https://dashboard.render.com)

### 2. Crear Nuevo Web Service

- Clic en **"New +"** → **"Web Service"**
- Conecta tu repositorio de GitHub
- Selecciona el repositorio `formulario-de-solicitude-de-libros`

### 3. Configurar el Servicio

**Configuración básica:**

| Campo | Valor |
|-------|-------|
| **Name** | `biblioteca-backend` (o el nombre que prefieras) |
| **Region** | Elige la más cercana (Europe/Frankfurt o US East) |
| **Branch** | `main` |
| **Root Directory** | (dejar vacío) |
| **Runtime** | `Python 3` |
| **Build Command** | `./build.sh` |
| **Start Command** | `cd backend/config && gunicorn config.wsgi:application` |

**Plan:**
- Selecciona **"Free"** (suficiente para empezar)

### 4. Variables de Entorno

En la sección **"Environment Variables"**, añade:

| Key | Value |
|-----|-------|
| `DJANGO_SECRET_KEY` | `<tu-secret-key-generada>` |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `<tu-servicio>.onrender.com` |
| `FRONTEND_URL` | `https://tu-app.netlify.app` |
| `PYTHON_VERSION` | `3.13.0` |

> **Nota:** Render creará automáticamente la variable `DATABASE_URL` cuando agregues una base de datos PostgreSQL.

### 5. Crear el Servicio

- Clic en **"Create Web Service"**
- Render comenzará a construir y desplegar tu backend
- Espera 5-10 minutos para el primer despliegue

---

## 🗄️ Paso 4: Crear Base de Datos PostgreSQL

### 1. Crear PostgreSQL Database

Desde el Dashboard de Render:
- Clic en **"New +"** → **"PostgreSQL"**
- **Name:** `biblioteca-db`
- **Database:** `biblioteca_db`
- **User:** `biblioteca_user`
- **Region:** La misma que tu Web Service
- **Plan:** Free

### 2. Conectar Base de Datos al Web Service

1. Ve a tu Web Service (`biblioteca-backend`)
2. En el menú izquierdo, clic en **"Environment"**
3. Busca o añade la variable `DATABASE_URL`
4. Copia la **Internal Database URL** de tu PostgreSQL:
   - Ve a tu PostgreSQL database
   - Copia el valor de **"Internal Database URL"**
   - Pégalo en `DATABASE_URL` del Web Service

5. Guarda y espera a que se redespiegue automáticamente

---

## 🔄 Paso 5: Actualizar Frontend (Netlify)

Ahora necesitas actualizar tu frontend en Netlify para que apunte al backend de Render.

### 1. Obtener URL del Backend

- En Render, copia la URL de tu Web Service
- Será algo como: `https://biblioteca-backend.onrender.com`

### 2. Configurar Variable de Entorno en Netlify

1. Ve a tu sitio en Netlify Dashboard
2. **Site settings** → **Environment variables**
3. Añade/Edita:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://tu-backend.onrender.com/api` |

4. Guarda los cambios

### 3. Redesplegar Frontend

- Ve a **Deploys** → **Trigger deploy** → **Deploy site**
- O haz un commit/push a tu repo (si tienes auto-deploy activado)

---

## ✅ Paso 6: Verificar el Despliegue

### 1. Probar el Backend

Abre en tu navegador:
```
https://tu-backend.onrender.com/api/books/
```

Deberías ver:
```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

### 2. Probar el Frontend

1. Abre tu sitio en Netlify: `https://tu-app.netlify.app`
2. Intenta crear una solicitud de libro
3. Verifica que se guarde correctamente
4. Accede al panel de administración

### 3. Acceder al Django Admin

```
https://tu-backend.onrender.com/admin/
```

**Crear superusuario:**

Desde el Dashboard de Render:
1. Ve a tu Web Service
2. Menú **"Shell"** (consola)
3. Ejecuta:
```bash
cd backend/config
python manage.py createsuperuser
```

---

## 🐛 Solución de Problemas

### Error: "Application failed to respond"

**Causa:** El servidor no puede iniciar
**Solución:**
1. Revisa los logs en Render Dashboard
2. Verifica que `build.sh` tenga permisos de ejecución
3. Comprueba que todas las variables de entorno estén configuradas

### Error: CORS

**Causa:** El frontend no puede conectar con el backend
**Solución:**
1. Verifica que `FRONTEND_URL` esté configurada correctamente
2. Asegúrate de incluir `https://` en la URL
3. No incluyas la barra final `/`

### Error: "no such table"

**Causa:** Migraciones no se ejecutaron
**Solución:**
1. En Render Shell:
```bash
cd backend/config
python manage.py migrate
```

### Plan Free se duerme

**Comportamiento:** Los servicios gratuitos de Render se duermen después de 15 minutos de inactividad
**Solución:**
- La primera petición después de dormir tarda ~30 segundos
- Para mantenerlo activo, considera:
  - Upgrade a plan de pago ($7/mes)
  - Usar un servicio de ping externo (UptimeRobot)

---

## 🔒 Seguridad en Producción

### Checklist de Seguridad:

- ✅ `DEBUG = False`
- ✅ `SECRET_KEY` único y secreto
- ✅ HTTPS activado (automático en Render)
- ✅ `ALLOWED_HOSTS` configurado
- ✅ CORS restringido a tu dominio Netlify
- ✅ PostgreSQL con contraseña segura
- ⚠️ Considera añadir autenticación JWT para la API

---

## 📊 Monitorización

### Logs en Render:

1. Ve a tu Web Service
2. Pestaña **"Logs"**
3. Ver logs en tiempo real

### Métricas:

- **Events:** Historial de deploys
- **Metrics:** Uso de CPU, memoria, requests

---

## 🔄 Actualizar el Backend

Cada vez que hagas cambios:

1. **Commit y push a GitHub:**
```bash
git add .
git commit -m "Update backend"
git push origin main
```

2. **Render detectará el cambio** y redesplegará automáticamente

3. **Verificar el despliegue:**
   - Ve a "Events" en Render
   - Revisa los logs

---

## 💰 Costos

### Plan Free (Actual):
- ✅ 750 horas/mes de Web Service
- ✅ PostgreSQL con 1GB
- ⚠️ Se duerme después de 15 min inactividad
- ⚠️ Límite de 100GB ancho de banda/mes

### Plan de Pago (Opcional):
- **Starter:** $7/mes
  - No se duerme
  - 400 horas compute
  - Mejor para producción

---

## 📚 Recursos Adicionales

- [Documentación Render - Django](https://render.com/docs/deploy-django)
- [Configuración PostgreSQL](https://render.com/docs/databases)
- [Variables de Entorno](https://render.com/docs/environment-variables)

---

## 🆘 Ayuda

Si tienes problemas:

1. **Revisa los logs** en Render Dashboard
2. **Verifica las variables de entorno**
3. **Comprueba la conexión a la base de datos**
4. **Consulta la documentación de Render**

---

## ✅ Checklist Final

Antes de dar por terminado:

- [ ] Backend desplegado en Render
- [ ] PostgreSQL conectado
- [ ] Frontend actualizado con URL del backend
- [ ] CORS configurado correctamente
- [ ] API responde en `/api/books/`
- [ ] Frontend puede crear solicitudes
- [ ] Django Admin accesible
- [ ] Superusuario creado
- [ ] Logs sin errores

---

¡Felicidades! 🎉 Tu aplicación está completamente desplegada en producción.

**URLs finales:**
- 🌐 Frontend: `https://tu-app.netlify.app`
- 📡 Backend: `https://tu-backend.onrender.com`
- 👤 Admin: `https://tu-backend.onrender.com/admin/`
