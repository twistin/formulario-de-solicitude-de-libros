# 🚀 Comandos Útiles para Render

## Acceder al Shell de Render

Desde el Dashboard de Render, ve a tu Web Service y clic en **"Shell"**.

---

## 📦 Comandos Comunes

### Crear Superusuario
```bash
cd backend/config
python manage.py createsuperuser
```

### Ejecutar Migraciones
```bash
cd backend/config
python manage.py migrate
```

### Crear Nuevas Migraciones
```bash
cd backend/config
python manage.py makemigrations
python manage.py migrate
```

### Recopilar Archivos Estáticos
```bash
cd backend/config
python manage.py collectstatic --no-input
```

### Abrir Shell de Django
```bash
cd backend/config
python manage.py shell
```

### Ver Todas las URLs
```bash
cd backend/config
python manage.py show_urls  # Requiere django-extensions
```

### Verificar Configuración
```bash
cd backend/config
python manage.py check --deploy
```

---

## 🗄️ Comandos de Base de Datos

### Conectar a PostgreSQL
```bash
# Desde tu terminal local con psql instalado
psql <DATABASE_URL>
```

### Hacer Backup de la Base de Datos
```bash
# Desde Render Dashboard:
# PostgreSQL → Connect → External Database URL
# Copia la URL y ejecuta localmente:
pg_dump <DATABASE_URL> > backup.sql
```

### Restaurar Backup
```bash
psql <DATABASE_URL> < backup.sql
```

### Limpiar Base de Datos (¡CUIDADO!)
```bash
cd backend/config
python manage.py flush
```

---

## 🔍 Debugging

### Ver Logs en Tiempo Real
```bash
# En Render Dashboard: Logs tab
# O usar CLI de Render:
render logs -f <service-name>
```

### Ver Variables de Entorno
```bash
env | grep DJANGO
env | grep DATABASE
```

### Probar Conexión a Base de Datos
```bash
cd backend/config
python manage.py dbshell
```

---

## 🔧 Mantenimiento

### Generar Nueva SECRET_KEY
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Ver Estado de Migraciones
```bash
cd backend/config
python manage.py showmigrations
```

### Ejecutar Tests
```bash
cd backend/config
python manage.py test
```

---

## 📊 Datos de Ejemplo

### Crear Datos de Prueba (Shell Django)
```python
cd backend/config
python manage.py shell

# Dentro del shell:
from books.models import BookRequest

BookRequest.objects.create(
    name="Ana García",
    email="ana@example.com",
    book="Cen anos de soidade - Gabriel García Márquez",
    date="2 de novembro de 2025",
    status="Pendente"
)

BookRequest.objects.create(
    name="Carlos López",
    email="carlos@example.com",
    book="Don Quixote - Miguel de Cervantes",
    date="2 de novembro de 2025",
    status="Aprobado"
)
```

### Eliminar Todos los Datos
```python
# En Django shell:
from books.models import BookRequest
BookRequest.objects.all().delete()
```

---

## 🔄 Comandos de Despliegue

### Forzar Redespliegue
```bash
# Desde Render Dashboard:
# Manual Deploy → Clear build cache & deploy
```

### Rollback a Deploy Anterior
```bash
# Desde Render Dashboard:
# Events → Buscar deploy exitoso anterior → "Rollback to this version"
```

---

## 📝 Notas Importantes

1. **Siempre navega a `backend/config`** antes de ejecutar comandos Django
2. **No uses `DEBUG=True`** en producción
3. **Haz backups** antes de ejecutar `flush` o `migrate`
4. **Los cambios en archivos Python** requieren redespliegue
5. **Los cambios en variables de entorno** reinician el servicio automáticamente

---

## 🆘 Comandos de Emergencia

### Si el servicio no responde:
```bash
# 1. Verificar logs
render logs <service-name>

# 2. Reiniciar servicio
# Desde Dashboard: Settings → Manual Deploy
```

### Si hay errores de migración:
```bash
cd backend/config
python manage.py migrate --fake-initial
python manage.py migrate
```

### Si la base de datos está corrupta:
```bash
# ⚠️ ESTO ELIMINARÁ TODOS LOS DATOS
cd backend/config
python manage.py flush --no-input
python manage.py migrate
python manage.py createsuperuser
```

---

## 📚 Recursos

- [Render CLI](https://render.com/docs/cli)
- [Django Management Commands](https://docs.djangoproject.com/en/4.2/ref/django-admin/)
- [PostgreSQL Commands](https://www.postgresql.org/docs/current/app-psql.html)
