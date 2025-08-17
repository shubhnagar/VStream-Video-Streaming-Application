from django.db import models

class AuditLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=10)  # e.g., GET, POST
    path = models.TextField()  # URL path
    headers = models.JSONField()  # Store headers as JSON
    body = models.TextField(null=True, blank=True)  # Request body if available

    def __str__(self):
        return f"{self.method} {self.path} at {self.timestamp}"
