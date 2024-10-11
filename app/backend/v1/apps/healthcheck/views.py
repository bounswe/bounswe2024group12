from django.shortcuts import render

from django.http import JsonResponse
from django.db import connection

def hc(request):
    return JsonResponse({"status": "OK"}, status=200)

def hc_db(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return JsonResponse({"db_status": "healthy"}, status=200)
    except Exception as e:
        return JsonResponse({"db_status": "unhealthy", "error": str(e)}, status=500)
