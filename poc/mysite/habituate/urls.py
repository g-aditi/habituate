from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("upload_text", views.upload_text, name="upload_text"),
    path("upload_file", views.upload_file, name="upload_file"),
    path("download", views.download, name="download"),
]
