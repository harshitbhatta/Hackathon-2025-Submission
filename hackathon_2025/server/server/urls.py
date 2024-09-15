# server/urls.py (main project urls.py)
from django.contrib import admin
from django.urls import path, include
from fileupload.views import FileUploadView

urlpatterns = [
    path('upload/', FileUploadView, name='file-upload'),  # Include the file upload view
]
