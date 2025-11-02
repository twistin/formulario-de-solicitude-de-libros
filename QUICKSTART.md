# ⚡ Referencia Rápida

## 🚀 Inicio Rápido (Primera Vez)

```bash
# 1. Instalar todo
./dev.sh install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu VITE_API_KEY (opcional)

# 3. Iniciar todo
./dev.sh dev
```

**URLs:**
- 🌐 Frontend: http://localhost:5173
- 📡 API: http://localhost:8000/api/books/
- 👤 Admin: http://localhost:8000/admin/

---

## 🔧 Comandos Más Usados

```bash
# Iniciar desarrollo
./dev.sh dev
# o
./start-all.sh

# Ver estado
./dev.sh status

# Detener servidores
./dev.sh stop

# Aplicar migracións
./dev.sh migrate

# Crear superusuario
./dev.sh superuser

# Reiniciar DB
./dev.sh reset

# Backup
./dev.sh backup
```

---

## 📡 API Endpoints

### Listar Solicitudes
```bash
curl http://localhost:8000/api/books/
```

### Crear Solicitude
```bash
curl -X POST http://localhost:8000/api/books/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana García",
    "email": "ana@example.com",
    "book": "Cen anos de soidade",
    "date": "2 de novembro de 2025",
    "status": "Pendente"
  }'
```

### Actualizar Estado
```bash
curl -X PATCH http://localhost:8000/api/books/1/ \
  -H "Content-Type: application/json" \
  -d '{"status": "Aprobado"}'
```

### Eliminar
```bash
curl -X DELETE http://localhost:8000/api/books/1/
```

---

## 🔑 Variables de Entorno

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:8000/api
VITE_API_KEY=<opcional-gemini-key>
```

### Backend (`backend/.env`)
```env
DJANGO_SECRET_KEY=<secret-key>
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## 🐛 Solución Rápida de Problemas

### Backend non inicia
```bash
cd backend/config
source venv/bin/activate
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend non inicia
```bash
npm install
npm run dev
```

### CORS Error
- Verifica que o backend estea en execución
- Comproba `VITE_API_URL` en `.env.local`
- Revisa `CORS_ALLOWED_ORIGINS` en `backend/config/config/settings.py`

### Erro de migracións
```bash
./dev.sh reset
```

### localStorage non migra
- Le `MIGRATION.md` para guía completa
- Usa o script de migración ou endpoint `bulk_create`

---

## 📁 Estructura Resumida

```
proyecto/
├── components/          # Componentes React
├── services/           # API calls
├── backend/            # Django backend
│   └── config/
│       ├── books/      # App principal
│       └── config/     # Settings
├── .env.local          # Config frontend
├── start-all.sh        # Iniciar todo
└── dev.sh             # Comandos útiles
```

---

## 🔄 Workflow de Desenvolvemento

1. **Cambios no frontend:**
   ```bash
   # Editar archivos .tsx/.ts
   # Hot reload automático
   ```

2. **Cambios en modelos Django:**
   ```bash
   ./dev.sh migrate
   ```

3. **Crear nova funcionalidade:**
   - Frontend: Crear compoñente en `components/`
   - Backend: Engadir view/serializer en `books/`
   - Conectar en `services/backendService.ts`

4. **Antes de commit:**
   ```bash
   ./dev.sh test     # Executar tests
   ./dev.sh backup   # Crear backup
   ```

---

## 📚 Documentación Completa

- 📖 **README.md** - Documentación principal
- 🔧 **backend/README.md** - Documentación do backend
- 🔄 **MIGRATION.md** - Guía de migración
- 📝 **CHANGELOG.md** - Lista de cambios

---

## 🆘 Axuda Rápida

```bash
# Ver todos os comandos
./dev.sh

# Ver axuda do backend
cd backend && cat README.md

# Ver guía de migración
cat MIGRATION.md
```

---

## 🎯 Tarefas Comúns

### Engadir novo campo ao modelo
1. Editar `backend/config/books/models.py`
2. Executar `./dev.sh migrate`
3. Actualizar serializer en `serializers.py`
4. Actualizar frontend en `types.ts`

### Cambiar validacións
1. Editar `backend/config/books/serializers.py`
2. Reiniciar backend (Ctrl+C e `./dev.sh dev`)

### Personalizar admin
1. Editar `backend/config/books/admin.py`
2. Reiniciar backend

---

## 💡 Tips

- **Hot Reload:** O frontend refresca automáticamente
- **API Browser:** Visita http://localhost:8000/api/books/ no navegador
- **Django Shell:** `./dev.sh shell` para probar código Python
- **Backup:** Executa `./dev.sh backup` antes de cambios grandes
- **Reset:** Se algo falla, proba `./dev.sh reset`

---

**Máis info:** README.md | backend/README.md | MIGRATION.md
