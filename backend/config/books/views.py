from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import BookRequest
from .serializers import BookRequestSerializer


class BookRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet para xestionar solicitudes de libros.
    Proporciona operacións CRUD completas:
    - list: GET /api/books/
    - create: POST /api/books/
    - retrieve: GET /api/books/{id}/
    - update: PUT /api/books/{id}/
    - partial_update: PATCH /api/books/{id}/
    - destroy: DELETE /api/books/{id}/
    """
    queryset = BookRequest.objects.all()
    serializer_class = BookRequestSerializer
    
    def create(self, request, *args, **kwargs):
        """Crear nova solicitude de libro"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def update(self, request, *args, **kwargs):
        """Actualizar solicitude existente"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Eliminar solicitude"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Solicitude eliminada con éxito"},
            status=status.HTTP_204_NO_CONTENT
        )
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Endpoint personalizado para actualizar só o estado.
        PATCH /api/books/{id}/update_status/
        Body: {"status": "Aprobado"}
        """
        book_request = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {"error": "O campo 'status' é obrigatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        book_request.status = new_status
        book_request.save()
        serializer = self.get_serializer(book_request)
        return Response(serializer.data)
