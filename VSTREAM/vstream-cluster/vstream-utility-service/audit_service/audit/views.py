import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AuditLog

@csrf_exempt
def log_request(request):
    try:
        # Save the request data
        AuditLog.objects.create(
            method=request.method,
            path=request.path,
            headers=dict(request.headers),
            body=request.body.decode('utf-8') if request.body else None
        )
        return JsonResponse({'message': 'Request logged successfully'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def get_last_entries(request):
    """
    API to retrieve the last 50 entries from the AuditLog database.
    """
    try:
        # Retrieve the latest 50 entries
        logs = AuditLog.objects.order_by('-timestamp')[:50]
        # Serialize the data into JSON-friendly format
        log_list = [
            {
                "timestamp": log.timestamp,
                "method": log.method,
                "path": log.path,
                "headers": log.headers,
                "body": log.body
            }
            for log in logs
        ]
        return JsonResponse({'logs': log_list}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
