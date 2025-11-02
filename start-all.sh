#!/bin/bash
# Script para iniciar frontend e backend simultaneamente

echo "🚀 Sistema de Solicitudes de Libros"
echo "===================================="
echo ""

# Función para limpiar procesos ao saír
cleanup() {
    echo ""
    echo "🛑 Detendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar backend Django
echo "📦 Iniciando backend Django..."
cd backend/config

# Verificar e activar venv
if [ ! -d "venv" ]; then
    echo "⚠️  Entorno virtual non encontrado. Executando setup..."
    cd ..
    ./start.sh &
    BACKEND_PID=$!
else
    source venv/bin/activate
    python manage.py runserver 2>&1 | sed 's/^/[Backend] /' &
    BACKEND_PID=$!
fi

cd ../..

# Esperar a que o backend inicie
echo "⏳ Esperando a que o backend inicie..."
sleep 5

# Iniciar frontend Vite
echo "⚡ Iniciando frontend Vite..."
npm run dev 2>&1 | sed 's/^/[Frontend] /' &
FRONTEND_PID=$!

echo ""
echo "✅ Servidores iniciados!"
echo ""
echo "📡 Backend:  http://localhost:8000"
echo "    API:     http://localhost:8000/api/books/"
echo "    Admin:   http://localhost:8000/admin/"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Preme Ctrl+C para deter ambos servidores"
echo ""

# Esperar a que finalicen os procesos
wait $BACKEND_PID $FRONTEND_PID
