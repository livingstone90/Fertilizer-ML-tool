"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import View
from django.shortcuts import render
from django.urls import include, path
from fertilizer_recommender.views import get_villages, get_villages_data, village_predictions, VillageDetailView, upload_data
from frontend.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get_villages/', get_villages, name='get_villages'),
    path('upload/', upload_data, name='upload_data'),
    path('get_villages_data/', get_villages_data, name='get_villages_data'),
    path('village_pred/', village_predictions, name='village_predictions')
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
