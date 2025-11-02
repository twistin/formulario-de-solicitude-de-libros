from django.db import models


class BookRequest(models.Model):
    """Modelo para xestionar solicitudes de libros dos alumnos"""
    
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Aprobado', 'Aprobado'),
        ('Mercado', 'Mercado'),
        ('Rexeitado', 'Rexeitado'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='Nome do Alumno/a')
    email = models.EmailField(verbose_name='Correo Electrónico')
    book = models.CharField(max_length=500, verbose_name='Libro Solicitado')
    date = models.CharField(max_length=100, verbose_name='Data da Petición')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pendente',
        verbose_name='Estado'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Solicitude de Libro'
        verbose_name_plural = 'Solicitudes de Libros'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.name} - {self.book}'
