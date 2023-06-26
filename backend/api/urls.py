
from django.urls import path, include 
from . import views

urlpatterns=[
    path('GetAWSDBStatus/', views.GetAWSDBStatus),
    path('HeartBeat/', views.HeartBeat),
    path('PlantClassifier/', views.PlantClassifier),
    path('GetSearchImageBase64/<str:imageName>', views.GetSearchImageBase64),
    path('SaveIdentification/<str:filename>', views.SaveIdentification),
    path('GetAllIdentifications/', views.GetAllIdentifications),
    path('GetIdentificationsSummary/', views.GetIdentificationsSummary),
    path('GetRecentIdentifications/', views.GetRecentIdentifications),
    path('UpdateUserInformation/<str:filename>', views.UpdateUserInformation),
    path('DeleteIdentification/', views.DeleteIdentification),
    path('GetSampleImages/', views.GetSampleImages)
]
