import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import traceback

# Service Base URLs
USER_SERVICE_BASE_URL = "http://127.0.0.1:8000/vstream-user-service/"
VIDEO_SERVICE_BASE_URL = "http://10.17.35.84:8080/vstream-video-service/"
AUDIT_SERVICE_URL = "http://127.0.0.1:8002/audit/log/"


@csrf_exempt
def gateway_route(request, service_action):
    """
    Generic gateway route to forward requests to the appropriate user or video service endpoint.
    """
    try:
        # Log the request to the Audit Service
        log_to_audit_service(request)
        print("Request Details:")
        print(f"Service Action: {service_action}")
        print(f"Request: {request}")

        # Map service_action to the appropriate service URL
        action_to_url = {
            # User Service Actions
            "register": f"{USER_SERVICE_BASE_URL}register/",
            "login": f"{USER_SERVICE_BASE_URL}login/",
            "authorize_user": f"{USER_SERVICE_BASE_URL}authorize_user/",
            "modify_user": f"{USER_SERVICE_BASE_URL}modify_user/",
            "delete_user": f"{USER_SERVICE_BASE_URL}delete_user/",

            # Video Service Actions
            "upload_video": f"{VIDEO_SERVICE_BASE_URL}videos/upload",
            "fetch_videos": f"{VIDEO_SERVICE_BASE_URL}videos",
        }

        if service_action not in action_to_url:
            return JsonResponse({'error': 'Invalid service action'}, status=400)

        # Target URL
        target_url = action_to_url[service_action]
        print(f"Target URL: {target_url}")

        # Request Headers
        headers = request.headers.copy()
        print("hreader")
        print(headers)

        # Forward the request to the appropriate service
        if request.method == 'POST':
            if service_action == "upload_video":
                # Video upload (handling multipart form-data)
                response = requests.post(
                    target_url,
                    files=request.FILES,
                    data=request.POST,
                    headers=headers
                )
            else:
                response = requests.post(target_url, data=request.body, headers=headers)
        elif request.method == 'GET' and service_action == "fetch_videos":
            # Handle query parameters
            query_params = request.GET.urlencode()
            full_url = f"{target_url}?{query_params}" if query_params else target_url
            print(f"Full URL for GET: {full_url}") 
            response = requests.request(request.method, full_url, headers=headers)
        elif request.method == 'PUT':
            response = requests.put(target_url, data=request.body, headers=headers)
        elif request.method == 'DELETE':
            response = requests.delete(target_url, headers=headers)
        else:
            return JsonResponse({'error': 'Unsupported HTTP method'}, status=405)

        # Handle response and parse JSON gracefully
        try:
            response_data = response.json()
        except requests.exceptions.JSONDecodeError:
            print("Non-JSON response from service:", response.text)
            response_data = {"error": "Non-JSON response received", "raw_response": response.text}

        return JsonResponse(response_data, status=response.status_code, safe=False)

    except requests.exceptions.RequestException as e:
        print("Stack trace for RequestException:")
        traceback.print_exc()
        return JsonResponse({'error': f"Gateway service error: {str(e)}"}, status=500)
    except Exception as e:
        print("Stack trace for General Exception:")
        traceback.print_exc()
        return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"}, status=500)


def log_to_audit_service(request):
    """
    Log request details to the Audit Service.
    """
    try:
        audit_payload = {
            "method": request.method,
            "path": request.path,
            "headers": dict(request.headers),
            "body": request.body.decode('utf-8') if request.body else None,
        }
        requests.post(AUDIT_SERVICE_URL, json=audit_payload)
    except Exception as e:
        print(f"Failed to log to Audit Service: {e}")
