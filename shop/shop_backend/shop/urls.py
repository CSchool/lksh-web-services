"""shop URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.urls import path
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from api import views
from api import actions

router = routers.DefaultRouter()
router.register(r'prizeclasses', views.PrizeClassViewSet)
router.register(r'tokentransfers', views.TokenTransferViewSet)
router.register(r'users', views.UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
   path('', include(router.urls)),
   path('admin/', admin.site.urls),
   path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
   path('auth/', include('dj_rest_auth.urls')),
   path('user/', views.CurrentUserView.as_view(), name='currentuser'),
   path('prizeitems/', views.PrizeItemList.as_view(), name='prizeitems'),
   path('prizeauction/', views.AuctionRequestList.as_view(), name='prizeauction'),
   path('groups/', views.GroupListView.as_view(), name='groups'),
   path('buy/', actions.BuyPrizeView.as_view(), name='buyprize'),
   path('pay/', actions.PayTokensView.as_view(), name='paytokens'),
   path('give/', actions.GivePrizeView.as_view(), name='giveprize'),
   path('undo/', actions.UndoPrizeView.as_view(), name='undoprize'),
   path('posts/', views.PostList.as_view()),
   path('posts/<int:pk>/', views.PostDetail.as_view()),
   path('userphoto/', actions.UploadUserPhoto.as_view()),
   path('comments/', views.CommentList.as_view()),
   path('comments/<int:pk>/', views.CommentDetail.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
