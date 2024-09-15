# server/urls.py (main project urls.py)
from django.contrib import admin
from django.urls import path, include
from fileupload.views import FileUploadView, get_processed_data

urlpatterns = [
    path('upload/', FileUploadView, name='file-upload'),  # Include the file upload view
    path('processed-data/', get_processed_data, name='get-processed-data'),
]
