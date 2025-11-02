# Backend Django - Sistema de Solicitudes de Libros

Backend API REST construído con Django y Django REST Framework para xestionar solicitudes de libros da biblioteca.

## 🚀 Características

- API REST completa con operacións CRUD
- Modelos de datos con validacións
- Django Admin interface para xestión
- CORS configurado para desarrollo frontend
- Serializers con validacións personalizadas
- Endpoints documentados

## 📋 Requisitos

- Python 3.8+
- pip
- virtualenv (recomendado)

## 🔧 Instalación

### 1. Navega ao directorio backend

```bash
cd backend/config
```

### 2. Crea e activa o entorno virtual

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En macOS/Linux:
source venv/bin/activate
# En Windows:
venv\Scripts\activate
```

### 3. Instala as dependencias

```bash
pip install -r ../../requirements.txt
```

### 4. Configura as variables de entorno (opcional)

Copia o arquivo `.env.example` a `.env` e personaliza os valores:

```bash
cp ../.env.example ../.env
```

### 5. Executa as migracións

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. (Opcional) Crea un superusuario para o admin

```bash
python manage.py createsuperuser
```

### 7. Inicia o servidor de desarrollo

```bash
python manage.py runserver
```

O backend estará dispoñible en `http://localhost:8000`

## 📡 Endpoints da API

### Solicitudes de Libros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/books/` | Listar todas as solicitudes |
| POST | `/api/books/` | Crear nova solicitude |
| GET | `/api/books/{id}/` | Obter solicitude específica |
| PUT | `/api/books/{id}/` | Actualizar solicitude completa |
| PATCH | `/api/books/{id}/` | Actualizar solicitude parcial |
| DELETE | `/api/books/{id}/` | Eliminar solicitude |

### Exemplo de solicitude POST

```json
{
  "name": "Ana García",
  "email": "ana@example.com",
  "book": "Cen anos de soidade - Gabriel García Márquez",
  "date": "2 de novembro de 2025",
  "status": "Pendente"
}
```

### Resposta exitosa (201 Created)

```json
{
  "id": 1,
  "name": "Ana García",
  "email": "ana@example.com",
  "book": "Cen anos de soidade - Gabriel García Márquez",
  "date": "2 de novembro de 2025",
  "status": "Pendente",
  "created_at": "2025-11-02T10:30:00Z",
  "updated_at": "2025-11-02T10:30:00Z"
}
```

## 🔐 Django Admin

Accede ao panel de administración en `http://localhost:8000/admin/` cos credenciais do superusuario.

Aquí podes:
- Ver todas as solicitudes
- Filtrar por estado e data
- Buscar por nome, email ou libro
- Editar ou eliminar solicitudes

## 🧪 Probar a API

### Usando curl

```bash
# Listar solicitudes
curl http://localhost:8000/api/books/

# Crear solicitude
curl -X POST http://localhost:8000/api/books/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "book": "Test Book",
    "date": "2025-11-02",
    "status": "Pendente"
  }'
```

### Usando o navegador

Visita `http://localhost:8000/api/books/` no navegador para usar a interface DRF Browsable API.

## 📁 Estrutura do Proyecto

```
backend/
├── config/
│   ├── config/          # Configuración Django
│   │   ├── settings.py  # Configuración principal
│   │   ├── urls.py      # URLs principais
│   │   └── ...
│   ├── books/           # App de solicitudes
│   │   ├── models.py    # Modelo BookRequest
│   │   ├── serializers.py # Serializers DRF
│   │   ├── views.py     # ViewSets
│   │   ├── urls.py      # URLs da app
│   │   └── admin.py     # Configuración admin
│   └── manage.py        # Comando Django
├── requirements.txt     # Dependencias Python
└── .env                 # Variables de entorno
```

## 🔄 Migracións

Cada vez que fagas cambios nos modelos:

```bash
python manage.py makemigrations
python manage.py migrate
```

## 🛠️ Comandos Útiles

```bash
# Verificar configuración
python manage.py check

# Crear superusuario
python manage.py createsuperuser

# Abrir shell de Django
python manage.py shell

# Ver todas as URLs
python manage.py show_urls  # (requiere django-extensions)
```

## 🌐 Configuración CORS

O backend está configurado para aceptar requests desde:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React alternativo)

Para producción, actualiza `CORS_ALLOWED_ORIGINS` en `settings.py`.

## 📝 Notas

- O backend usa SQLite por defecto (arquivo `db.sqlite3`)
- Para producción, considera usar PostgreSQL ou MySQL
- Cambia `SECRET_KEY` en producción
- Configura `DEBUG=False` en producción
- Usa variables de entorno para configuracións sensibles

## 🐛 Troubleshooting

### Erro: "No module named 'rest_framework'"
```bash
pip install djangorestframework
```

### Erro: "No module named 'corsheaders'"
```bash
pip install django-cors-headers
```

### Erro de migracións
```bash
python manage.py migrate --run-syncdb
```

## 📚 Recursos

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django CORS Headers](https://github.com/adamchainz/django-cors-headers)
