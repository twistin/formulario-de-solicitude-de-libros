from rest_framework import serializers
from .models import BookRequest


class BookRequestSerializer(serializers.ModelSerializer):
    """Serializer para BookRequest con validacións"""
    
    class Meta:
        model = BookRequest
        fields = ['id', 'name', 'email', 'book', 'date', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_name(self, value):
        """Validar que o nome non estea baleiro"""
        if not value or not value.strip():
            raise serializers.ValidationError("O nome é obrigatorio.")
        return value.strip()
    
    def validate_email(self, value):
        """Validar formato do email"""
        if not value or not value.strip():
            raise serializers.ValidationError("O email é obrigatorio.")
        return value.strip().lower()
    
    def validate_book(self, value):
        """Validar que o libro non estea baleiro"""
        if not value or not value.strip():
            raise serializers.ValidationError("O nome do libro é obrigatorio.")
        return value.strip()
    
    def validate_status(self, value):
        """Validar que o status sexa válido"""
        valid_statuses = ['Pendente', 'Aprobado', 'Mercado', 'Rexeitado']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Estado non válido. Debe ser un de: {', '.join(valid_statuses)}")
        return value
