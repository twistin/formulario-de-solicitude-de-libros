# ⚡ Guía Rápida de Despliegue en Render

## 🎯 Resumen de 5 Minutos

### 1️⃣ Sube el Código a GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2️⃣ Crea Web Service en Render

1. Ir a [Render Dashboard](https://dashboard.render.com)
2. **New +** → **Web Service**
3. Conectar tu repo de GitHub
4. **Build Command:** `./build.sh`
5. **Start Command:** `cd backend/config && gunicorn config.wsgi:application`

### 3️⃣ Variables de Entorno

Añadir en Render:

```
DJANGO_SECRET_KEY=<genera-una-nueva>
DJANGO_DEBUG=False
FRONTEND_URL=https://tu-app.netlify.app
PYTHON_VERSION=3.13.0
```

### 4️⃣ Crear PostgreSQL

1. **New +** → **PostgreSQL**
2. Copiar **Internal Database URL**
3. En tu Web Service, añadir variable:
   ```
   DATABASE_URL=<internal-database-url>
   ```

### 5️⃣ Actualizar Netlify

En tu sitio de Netlify:
- **Environment variables** → Añadir:
  ```
  VITE_API_URL=https://tu-backend.onrender.com/api
  ```
- **Trigger deploy**

### 6️⃣ Crear Superusuario

En Render Shell:
```bash
cd backend/config
python manage.py createsuperuser
```

---

## ✅ URLs Finales

- 🌐 **Frontend:** `https://tu-app.netlify.app`
- 📡 **API:** `https://tu-backend.onrender.com/api/books/`
- 👤 **Admin:** `https://tu-backend.onrender.com/admin/`

---

## 📚 Documentación Completa

Lee **DEPLOY.md** para instrucciones detalladas paso a paso.

---

## 🆘 Problemas Comunes

### Backend no responde
- Revisa logs en Render Dashboard
- Verifica todas las variables de entorno

### Error CORS
- Asegúrate que `FRONTEND_URL` es exacta (con https://)
- No incluyas la barra final `/`

### Base de datos no conecta
- Verifica que `DATABASE_URL` está configurada
- Usa la **Internal Database URL**, no la External

---

**¡Listo en 5 pasos!** 🚀
