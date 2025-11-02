#!/bin/bash
# Script de configuración e inicio do backend Django

echo "🚀 Iniciando configuración do backend Django..."

# Ir ao directorio correcto
cd "$(dirname "$0")/config"

# Verificar se o venv existe
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "📚 Instalando dependencias..."
pip install -q --upgrade pip
pip install -q -r ../requirements.txt

# Executar migracións
echo "🗄️  Executando migracións..."
python manage.py makemigrations
python manage.py migrate

# Preguntar se crear superusuario
echo ""
read -p "❓ Queres crear un superusuario? (s/n): " create_superuser
if [ "$create_superuser" = "s" ] || [ "$create_superuser" = "S" ]; then
    python manage.py createsuperuser
fi

# Iniciar servidor
echo ""
echo "✅ Configuración completa!"
echo "🌐 Iniciando servidor en http://localhost:8000"
echo "📡 API dispoñible en http://localhost:8000/api/books/"
echo "👤 Admin en http://localhost:8000/admin/"
echo ""
echo "Preme Ctrl+C para deter o servidor"
echo ""

python manage.py runserver
