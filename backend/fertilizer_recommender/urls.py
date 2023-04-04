from django.urls import path
from fertilizer_recommender.views import get_villages, village_predictions, VillageDetailView

#app_name = 'fertilizer_recommender'
urlpatterns = [
    path('get_villages/', get_villages, name='get_villages'),
    path('village_pred/', village_predictions, name='village_predictions'),
    path('villages_detail/<str:village_name>/',
         VillageDetailView.as_view(), name='village_detail'),

]
