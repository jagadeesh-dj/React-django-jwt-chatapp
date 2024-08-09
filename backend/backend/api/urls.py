from django.urls import path
from .views import UserAuth,MessageView,current_user,UserList,loginuser
from rest_framework_simplejwt import views as jwt_views

   
urlpatterns = [
    path('token/',jwt_views.TokenObtainPairView.as_view(),name="token_pair"),
    path('token/refresh/',jwt_views.TokenRefreshView.as_view(),name="token_refresh"),
    path('signup/',UserAuth.as_view(),name='signup'),
    path('message/<str:receiver_id>/',MessageView.as_view(),name="message"),
    path('current_user/<str:receiver_id>/',current_user.as_view(),name="current_user"),
    path('users/',UserList.as_view(),name='users'),
    path('loginuser/',loginuser.as_view(),name="loginuser")

]