from django.contrib import admin
from .models import BookRequest


@admin.register(BookRequest)
class BookRequestAdmin(admin.ModelAdmin):
    """Configuración do admin para BookRequest"""
    list_display = ['name', 'email', 'book', 'status', 'date', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'book']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Información do Alumno', {
            'fields': ('name', 'email')
        }),
        ('Detalles da Solicitude', {
            'fields': ('book', 'date', 'status')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
