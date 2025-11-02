# ✅ Checklist de Despliegue en Render

Usa esta lista para verificar que todo esté configurado correctamente.

---

## 📦 Preparación Local

- [ ] Código actualizado en GitHub
- [ ] Archivo `build.sh` creado y ejecutable
- [ ] Archivo `Procfile` creado
- [ ] `runtime.txt` con versión de Python
- [ ] `requirements.txt` actualizado con gunicorn, psycopg2-binary, whitenoise
- [ ] `settings.py` configurado para producción
- [ ] Todos los cambios commiteados y pusheados

---

## 🌐 Configuración en Render

### Web Service
- [ ] Web Service creado desde GitHub
- [ ] Build Command: `./build.sh`
- [ ] Start Command: `cd backend/config && gunicorn config.wsgi:application`
- [ ] Plan seleccionado (Free para empezar)
- [ ] Variables de entorno configuradas:
  - [ ] `DJANGO_SECRET_KEY`
  - [ ] `DJANGO_DEBUG=False`
  - [ ] `FRONTEND_URL` (URL de Netlify)
  - [ ] `PYTHON_VERSION=3.13.0`
  - [ ] `DATABASE_URL` (automática después de crear PostgreSQL)

### PostgreSQL
- [ ] PostgreSQL Database creado
- [ ] Misma región que Web Service
- [ ] Internal Database URL copiada
- [ ] `DATABASE_URL` añadida al Web Service

---

## 🔄 Primer Despliegue

- [ ] Build completado sin errores
- [ ] Deploy exitoso (check verde en Render)
- [ ] Logs sin errores críticos
- [ ] API responde: `https://tu-backend.onrender.com/api/books/`
- [ ] Respuesta JSON correcta:
  ```json
  {"count":0,"next":null,"previous":null,"results":[]}
  ```

---

## 👤 Django Admin

- [ ] Admin accesible: `https://tu-backend.onrender.com/admin/`
- [ ] Superusuario creado (via Shell en Render)
- [ ] Puede hacer login en admin
- [ ] Puede ver el modelo BookRequest

---

## 🌐 Integración Frontend

- [ ] Variable `VITE_API_URL` actualizada en Netlify
- [ ] URL correcta: `https://tu-backend.onrender.com/api`
- [ ] Frontend redesplegado
- [ ] Sin errores CORS en consola del navegador

---

## ✨ Pruebas Funcionales

### Frontend
- [ ] Página carga correctamente
- [ ] Formulario visible
- [ ] Puede enviar solicitud de libro
- [ ] Se muestra certificado después de enviar
- [ ] Panel de administración accesible
- [ ] Lista de solicitudes se muestra
- [ ] Puede cambiar estado de solicitudes
- [ ] Puede eliminar solicitudes
- [ ] Código QR se muestra correctamente

### Backend
- [ ] GET `/api/books/` funciona
- [ ] POST `/api/books/` crea solicitud
- [ ] PATCH `/api/books/{id}/` actualiza
- [ ] DELETE `/api/books/{id}/` elimina
- [ ] CORS permite peticiones desde Netlify

---

## 🔒 Seguridad

- [ ] `DEBUG=False` en producción
- [ ] `SECRET_KEY` única y segura
- [ ] HTTPS activado (automático en Render)
- [ ] `ALLOWED_HOSTS` incluye dominio Render
- [ ] CORS restringido a dominio Netlify
- [ ] PostgreSQL con contraseña segura
- [ ] Admin con usuario fuerte

---

## 📊 Monitorización

- [ ] Logs accesibles en Render Dashboard
- [ ] Sin errores en logs
- [ ] Métricas de uso visibles
- [ ] Email de alertas configurado (opcional)

---

## 📝 Documentación

- [ ] URLs finales documentadas
- [ ] Credenciales de admin guardadas de forma segura
- [ ] Variables de entorno documentadas
- [ ] Proceso de despliegue documentado

---

## 🎉 URLs Finales Verificadas

Completa con tus URLs:

- **Frontend:** `https://___________________.netlify.app`
- **Backend:** `https://___________________.onrender.com`
- **API:** `https://___________________.onrender.com/api/books/`
- **Admin:** `https://___________________.onrender.com/admin/`

---

## 📞 Información de Contacto

**Superusuario Admin:**
- Usuario: `___________________`
- Email: `___________________`

**Cuentas:**
- Netlify: `___________________`
- Render: `___________________`
- GitHub: `___________________`

---

## 🔄 Próximos Pasos (Opcional)

- [ ] Configurar dominio personalizado
- [ ] Añadir autenticación JWT
- [ ] Implementar tests automatizados
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Añadir monitoreo con Sentry
- [ ] Configurar backups automáticos
- [ ] Upgrade a plan de pago si es necesario

---

## 🆘 En Caso de Problemas

1. **Revisa logs** en Render Dashboard
2. **Verifica variables de entorno**
3. **Consulta** `DEPLOY.md` para guía detallada
4. **Consulta** `RENDER_COMMANDS.md` para comandos útiles
5. **Contacta soporte** de Render si es necesario

---

**Fecha de Despliegue:** _______________

**Versión:** _______________

**Notas Adicionales:**
_______________________________________________
_______________________________________________
_______________________________________________
