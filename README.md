# 📚 Sistema de Solicitudes de Libros

Sistema completo de xestión de solicitudes de libros para bibliotecas, con frontend React + Vite e backend Django REST API.

## ✨ Características

### Frontend (React + TypeScript + Vite)
- 📝 Formulario de solicitude de libros con validación
- 📜 Certificado de solicitude generado con Google Gemini AI
- 👨‍💼 Panel de administración para xestionar solicitudes
- 📱 Código QR para acceso rápido dos alumnos
- 🎨 Interfaz moderna con Tailwind CSS
- ⚡ Rápido y reactivo con Vite

### Backend (Django + DRF)
- 🔌 API REST completa con operacións CRUD
- 📊 Base de datos SQLite (configurable para PostgreSQL/MySQL)
- 🔐 Panel de administración Django
- ✅ Validacións de datos con serializers
- 🌐 CORS configurado para desarrollo
- 📝 Endpoints documentados

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** 16+ e npm
- **Python** 3.8+
- **Git**

### 1️⃣ Clonar o Repositorio

```bash
git clone <repository-url>
cd formulario-de-solicitude-de-libros
```

### 2️⃣ Configurar Backend Django

```bash
# Ir ao directorio backend
cd backend

# Executar script de setup (recomendado)
./start.sh

# O bien manualmente:
cd config
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r ../requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Opcional
python manage.py runserver
```

O backend estará dispoñible en `http://localhost:8000`

### 3️⃣ Configurar Frontend React

En outra terminal:

```bash
# Volver ao directorio raíz
cd ..

# Instalar dependencias
npm install

# Copiar arquivo de configuración
cp .env.example .env.local

# Editar .env.local e configurar:
# VITE_API_URL=http://localhost:8000/api
# VITE_API_KEY=tu_clave_gemini_opcional

# Iniciar servidor de desarrollo
npm run dev
```

O frontend estará dispoñible en `http://localhost:5173`

## 📡 Endpoints da API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/books/` | Listar todas as solicitudes |
| POST | `/api/books/` | Crear nova solicitude |
| GET | `/api/books/{id}/` | Obter solicitude específica |
| PATCH | `/api/books/{id}/` | Actualizar solicitude |
| DELETE | `/api/books/{id}/` | Eliminar solicitude |

### Exemplo de Solicitude

```json
POST http://localhost:8000/api/books/
Content-Type: application/json

{
  "name": "Ana García",
  "email": "ana@example.com",
  "book": "Cen anos de soidade - Gabriel García Márquez",
  "date": "2 de novembro de 2025",
  "status": "Pendente"
}
```

## 📁 Estrutura do Proyecto

```
formulario-de-solicitude-de-libros/
├── backend/                    # Backend Django
│   ├── config/
│   │   ├── config/            # Configuración Django
│   │   │   ├── settings.py
│   │   │   └── urls.py
│   │   ├── books/             # App de solicitudes
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   └── manage.py
│   ├── requirements.txt
│   ├── start.sh              # Script de inicio
│   └── README.md
├── components/               # Componentes React
│   ├── AdminView.tsx
│   ├── CertificateCard.tsx
│   ├── QRCodeModal.tsx
│   └── ...
├── services/                 # Servicios del frontend
│   ├── backendService.ts    # Comunicación con API
│   └── geminiService.ts     # Integración Gemini AI
├── App.tsx                  # Componente principal
├── index.tsx               # Entry point
├── package.json
├── vite.config.ts
└── README.md
```

## 🔧 Configuración

### Variables de Entorno - Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8000/api
VITE_API_KEY=tu_clave_gemini_opcional
```

### Variables de Entorno - Backend (backend/.env)

```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

## 🎯 Uso

### Como Alumno

1. Abre `http://localhost:5173`
2. Enche o formulario con:
   - Nome completo
   - Email
   - Libro e autor desexado
3. Envía a solicitude
4. Recibirás un certificado de confirmación

### Como Administrador

1. Pulsa "Ir ao Panel de Administración"
2. Ver todas as solicitudes
3. Cambiar o estado (Pendente → Aprobado → Mercado)
4. Eliminar solicitudes
5. Xerar código QR para compartir con alumnos

### Django Admin

1. Accede a `http://localhost:8000/admin/`
2. Usa os credenciais do superusuario
3. Xestiona solicitudes desde a interfaz admin

## 🛠️ Comandos Útiles

### Frontend

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview do build
```

### Backend

```bash
python manage.py runserver        # Iniciar servidor
python manage.py makemigrations   # Crear migracións
python manage.py migrate          # Aplicar migracións
python manage.py createsuperuser  # Crear admin
python manage.py shell            # Shell Django
```

## 🐛 Solución de Problemas

### Erro: "CORS policy"
- Verifica que o backend estea en execución en `http://localhost:8000`
- Comproba que `VITE_API_URL` en `.env.local` sexa correcta

### Erro: "Module not found"
```bash
# Frontend
npm install

# Backend
pip install -r backend/requirements.txt
```

### O código QR non se mostra
- Asegúrate de que instalaches `qrcode.react`: `npm install qrcode.react`
- Verifica que non haxa erros na consola do navegador

### Erro de migracións Django
```bash
cd backend/config
python manage.py migrate --run-syncdb
```

## 📚 Tecnologías Utilizadas

### Frontend
- React 19
- TypeScript
- Vite 6
- Tailwind CSS
- Google Gemini AI
- qrcode.react

### Backend
- Django 4.2
- Django REST Framework
- django-cors-headers
- SQLite (configurable)

## 🔐 Seguridade

⚠️ **Para Producción:**
- Cambia `SECRET_KEY` en Django
- Configura `DEBUG=False`
- Usa PostgreSQL/MySQL en lugar de SQLite
- Configura `ALLOWED_HOSTS` e `CORS_ALLOWED_ORIGINS`
- Usa HTTPS
- Implementa autenticación e autorización
- Valida e sanitiza todas as entradas

## 🤝 Contribución

As contribucións son benvidas! Por favor:
1. Fai fork do repositorio
2. Crea unha rama para a túa función
3. Fai commit dos cambios
4. Envía un pull request

## 📄 Licenza

Este proxecto está baixo a licenza MIT.

## 📞 Contacto

Para preguntas ou soporte, por favor abre un issue no repositorio.

---

Feito con ❤️ para a Biblioteca Dixital
