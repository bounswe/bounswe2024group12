from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import JsonResponse

# Create your views here.

@swagger_auto_schema(
    method='get',
    operation_description="Henüz işlevselliği kodlanmamış, parametre alan bir endpoint.",
    manual_parameters=[
        openapi.Parameter('id', openapi.IN_QUERY, description="Kullanıcı ID'si", type=openapi.TYPE_INTEGER)
    ],
    responses={200: openapi.Response('Başarılı yanıt', examples={"application/json": {"message": "Henüz kodlanmadı"}})}
)
@api_view(['GET'])
def future_endpoint_with_param(request):
    # Henüz bu fonksiyonun işlevselliği yazılmadı.
    return JsonResponse({"message": "Henüz kodlanmadı"}, status=200)

