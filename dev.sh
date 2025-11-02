#!/bin/bash
# Comandos útiles para desarrollo

case "$1" in
  "install")
    echo "📦 Instalando dependencias..."
    echo ""
    echo "🔹 Frontend..."
    npm install
    echo ""
    echo "🔹 Backend..."
    cd backend/config
    python3 -m venv venv
    source venv/bin/activate
    pip install -r ../requirements.txt
    cd ../..
    echo "✅ Instalación completa!"
    ;;
    
  "migrate")
    echo "🗄️  Aplicando migracións..."
    cd backend/config
    source venv/bin/activate
    python manage.py makemigrations
    python manage.py migrate
    cd ../..
    echo "✅ Migracións aplicadas!"
    ;;
    
  "superuser")
    echo "👤 Creando superusuario..."
    cd backend/config
    source venv/bin/activate
    python manage.py createsuperuser
    cd ../..
    ;;
    
  "shell")
    echo "🐚 Abrindo shell Django..."
    cd backend/config
    source venv/bin/activate
    python manage.py shell
    cd ../..
    ;;
    
  "clean")
    echo "🧹 Limpando arquivos temporales..."
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
    find . -type f -name "*.pyc" -delete
    rm -rf backend/config/db.sqlite3
    rm -rf backend/config/*/migrations/0*.py
    echo "✅ Limpeza completa!"
    ;;
    
  "reset")
    echo "🔄 Reiniciando base de datos..."
    cd backend/config
    source venv/bin/activate
    rm -f db.sqlite3
    find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find . -path "*/migrations/*.pyc" -delete
    python manage.py makemigrations
    python manage.py migrate
    echo ""
    read -p "Queres crear un superusuario? (s/n): " create_user
    if [ "$create_user" = "s" ]; then
        python manage.py createsuperuser
    fi
    cd ../..
    echo "✅ Base de datos reiniciada!"
    ;;
    
  "test")
    echo "🧪 Executando tests..."
    echo "Frontend: npm test"
    npm test
    echo ""
    echo "Backend: pytest"
    cd backend/config
    source venv/bin/activate
    python manage.py test
    cd ../..
    ;;
    
  "logs")
    echo "📋 Mostrando logs..."
    tail -f backend/config/*.log 2>/dev/null || echo "Non hai logs dispoñibles"
    ;;
    
  "status")
    echo "📊 Estado do sistema:"
    echo ""
    echo "🔹 Backend (Django):"
    if curl -s http://localhost:8000/api/books/ > /dev/null 2>&1; then
        echo "  ✅ En execución en http://localhost:8000"
    else
        echo "  ❌ Non está en execución"
    fi
    echo ""
    echo "🔹 Frontend (Vite):"
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "  ✅ En execución en http://localhost:5173"
    else
        echo "  ❌ Non está en execución"
    fi
    ;;
    
  "stop")
    echo "🛑 Detendo servidores..."
    pkill -f "python manage.py runserver"
    pkill -f "vite"
    echo "✅ Servidores detidos!"
    ;;
    
  "backup")
    echo "💾 Creando backup..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_dir="backups/$timestamp"
    mkdir -p "$backup_dir"
    
    # Backup base de datos
    cp backend/config/db.sqlite3 "$backup_dir/" 2>/dev/null
    
    # Backup .env
    cp .env.local "$backup_dir/" 2>/dev/null
    cp backend/.env "$backup_dir/" 2>/dev/null
    
    echo "✅ Backup creado en $backup_dir"
    ;;
    
  "dev")
    echo "🚀 Iniciando en modo desarrollo..."
    ./start-all.sh
    ;;
    
  *)
    echo "🛠️  Comandos de Desenvolvemento"
    echo "=============================="
    echo ""
    echo "Uso: ./dev.sh [comando]"
    echo ""
    echo "Comandos dispoñibles:"
    echo ""
    echo "  install     - Instalar dependencias (frontend + backend)"
    echo "  dev         - Iniciar servidores de desenvolvimento"
    echo "  migrate     - Aplicar migracións da base de datos"
    echo "  superuser   - Crear superusuario de Django"
    echo "  shell       - Abrir shell de Django"
    echo "  test        - Executar tests"
    echo "  status      - Ver estado dos servidores"
    echo "  stop        - Deter todos os servidores"
    echo "  reset       - Reiniciar base de datos completa"
    echo "  clean       - Limpar arquivos temporales"
    echo "  backup      - Crear backup da base de datos"
    echo "  logs        - Mostrar logs en tempo real"
    echo ""
    echo "Exemplos:"
    echo "  ./dev.sh install    # Primeira vez"
    echo "  ./dev.sh dev        # Iniciar desenvolvimento"
    echo "  ./dev.sh migrate    # Despois de cambios en modelos"
    echo "  ./dev.sh status     # Ver se está todo funcionando"
    echo ""
    ;;
esac
