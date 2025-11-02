# 🔄 Guía de Migración: localStorage → Django Backend

Este documento explica como migrar os datos existentes de localStorage ao novo backend Django.

## 📋 Contexto

O proxecto orixinalmente gardaba as solicitudes no `localStorage` do navegador. Agora usa unha API REST Django para persistencia real e xestión centralizada.

## 🔀 Migración Automática

### Opción 1: Exportar e Importar Manualmente

#### 1. Exportar datos de localStorage

Antes de cambiar ao novo backend, abre a consola do navegador (F12) no frontend antigo e executa:

```javascript
// Obter datos de localStorage
const data = localStorage.getItem('libraryBookRequests');
console.log(data);

// Copiar ao portapapeis
copy(data);
```

Garda o resultado nun arquivo `backup.json`.

#### 2. Crear script de migración

Crea un arquivo `migrate_data.py` no directorio `backend/config/`:

```python
#!/usr/bin/env python
import os
import django
import json
import sys

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from books.models import BookRequest

def migrate_from_json(json_file):
    """Migrar datos dun arquivo JSON ao backend Django"""
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            print("❌ Erro: O arquivo debe conter un array de solicitudes")
            return
        
        migrated = 0
        errors = 0
        
        for item in data:
            try:
                # Crear solicitude no backend
                BookRequest.objects.create(
                    name=item.get('name', ''),
                    email=item.get('email', ''),
                    book=item.get('book', ''),
                    date=item.get('date', ''),
                    status=item.get('status', 'Pendente'),
                )
                migrated += 1
                print(f"✅ Migrada: {item.get('name')} - {item.get('book')}")
            except Exception as e:
                errors += 1
                print(f"❌ Erro ao migrar {item.get('name', 'Unknown')}: {str(e)}")
        
        print(f"\n📊 Resumo:")
        print(f"  ✅ Migradas: {migrated}")
        print(f"  ❌ Erros: {errors}")
        print(f"  📝 Total: {len(data)}")
        
    except FileNotFoundError:
        print(f"❌ Arquivo non encontrado: {json_file}")
    except json.JSONDecodeError:
        print("❌ Erro ao decodificar JSON")
    except Exception as e:
        print(f"❌ Erro inesperado: {str(e)}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python migrate_data.py <arquivo.json>")
        sys.exit(1)
    
    json_file = sys.argv[1]
    migrate_from_json(json_file)
```

#### 3. Executar a migración

```bash
cd backend/config
source venv/bin/activate
python migrate_data.py ../../backup.json
```

### Opción 2: API de Migración (Recomendada)

Crea un endpoint especial para migración masiva:

#### 1. Actualizar `books/views.py`

Engade este método ao `BookRequestViewSet`:

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

@action(detail=False, methods=['post'])
def bulk_create(self, request):
    """
    Endpoint para migración masiva de datos.
    POST /api/books/bulk_create/
    Body: [{"name": "...", "email": "...", ...}, ...]
    """
    data = request.data
    
    if not isinstance(data, list):
        return Response(
            {"error": "Debe enviar un array de solicitudes"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    created = []
    errors = []
    
    for item in data:
        serializer = self.get_serializer(data=item)
        if serializer.is_valid():
            serializer.save()
            created.append(serializer.data)
        else:
            errors.append({
                "item": item,
                "errors": serializer.errors
            })
    
    return Response({
        "created": len(created),
        "errors": len(errors),
        "details": {
            "created_items": created,
            "error_items": errors
        }
    }, status=status.HTTP_201_CREATED if created else status.HTTP_400_BAD_REQUEST)
```

#### 2. Crear script de migración no frontend

Crea `migrate-to-backend.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Migración de Datos</title>
</head>
<body>
    <h1>Migración de localStorage a Backend</h1>
    <button onclick="migrate()">Migrar Datos</button>
    <pre id="output"></pre>

    <script>
        async function migrate() {
            const output = document.getElementById('output');
            output.textContent = 'Iniciando migración...\n';
            
            // Obter datos de localStorage
            const data = localStorage.getItem('libraryBookRequests');
            if (!data) {
                output.textContent += '❌ Non hai datos en localStorage\n';
                return;
            }
            
            const requests = JSON.parse(data);
            output.textContent += `📦 Encontradas ${requests.length} solicitudes\n`;
            
            try {
                // Enviar ao backend
                const response = await fetch('http://localhost:8000/api/books/bulk_create/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requests)
                });
                
                const result = await response.json();
                output.textContent += `\n✅ Migradas: ${result.created}\n`;
                output.textContent += `❌ Erros: ${result.errors}\n`;
                
                if (result.errors > 0) {
                    output.textContent += '\nDetalles dos erros:\n';
                    output.textContent += JSON.stringify(result.details.error_items, null, 2);
                }
                
                // Opcional: limpar localStorage
                if (confirm('¿Queres limpar os datos de localStorage?')) {
                    localStorage.removeItem('libraryBookRequests');
                    output.textContent += '\n🗑️ localStorage limpo\n';
                }
                
            } catch (error) {
                output.textContent += `\n❌ Erro: ${error.message}\n`;
            }
        }
    </script>
</body>
</html>
```

#### 3. Executar migración

1. Abre `migrate-to-backend.html` no navegador
2. Asegúrate de que o backend estea en execución
3. Pulsa "Migrar Datos"

## 🔄 Transición Gradual

Se queres unha transición gradual:

### 1. Modo Híbrido Temporal

Modifica `services/backendService.ts` para intentar usar o backend primeiro, e facer fallback a localStorage:

```typescript
export const getRequests = async (): Promise<BookRequest[]> => {
  try {
    // Intentar obter do backend
    const response = await fetch(`${API_BASE_URL}/books/`);
    const data = await handleResponse<BookRequest[]>(response);
    return data;
  } catch (error) {
    console.warn('Backend non dispoñible, usando localStorage:', error);
    // Fallback a localStorage
    const localData = localStorage.getItem('libraryBookRequests');
    return localData ? JSON.parse(localData) : [];
  }
};
```

### 2. Sincronización Automática

Ao iniciar a aplicación, sincronizar localStorage co backend:

```typescript
// En App.tsx, dentro de useEffect
useEffect(() => {
  const syncData = async () => {
    const localData = localStorage.getItem('libraryBookRequests');
    if (localData) {
      const requests = JSON.parse(localData);
      // Enviar ao backend
      await fetch(`${API_BASE_URL}/books/bulk_create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requests)
      });
      // Limpar localStorage despois de sincronizar
      localStorage.removeItem('libraryBookRequests');
    }
  };
  syncData();
}, []);
```

## ✅ Verificación

Despois da migración, verifica que:

1. **Backend ten os datos:**
   ```bash
   curl http://localhost:8000/api/books/
   ```

2. **Django Admin mostra os datos:**
   Accede a `http://localhost:8000/admin/books/bookrequest/`

3. **Frontend mostra os datos:**
   Abre `http://localhost:5173` e vai ao panel de administración

## 🗑️ Limpeza

Despois de verificar a migración exitosa:

```javascript
// Na consola do navegador
localStorage.removeItem('libraryBookRequests');
```

## 🐛 Solución de Problemas

### Os datos non aparecen no backend
- Verifica que o backend estea en execución
- Comproba os logs do servidor Django
- Verifica permisos CORS

### Erros de validación
- Revisa que os datos teñan todos os campos obrigatorios
- Comproba que os emails sexan válidos
- Asegúrate de que os status sexan válidos

### Duplicados
Se executas a migración varias veces, podes ter duplicados. Para limpar:

```python
# Na consola de Django
python manage.py shell

>>> from books.models import BookRequest
>>> # Ver todos
>>> BookRequest.objects.all()
>>> # Eliminar todos (coidado!)
>>> BookRequest.objects.all().delete()
```

## 📚 Recursos Adicionais

- [Django Migrations](https://docs.djangoproject.com/en/4.2/topics/migrations/)
- [DRF Bulk Operations](https://www.django-rest-framework.org/api-guide/generic-views/#bulk-operations)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

---

Para máis axuda, revisa a [documentación completa](./README.md) ou abre un issue.
