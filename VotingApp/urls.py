
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgendaViewSet, OptionViewSet
from .views import VoteViewSet, OptionVoteCountViewSet, AgendaVoteCountViewSet


from . import views
router = DefaultRouter()
router.register(r'agendas', AgendaViewSet)
router.register(r'options', OptionViewSet)
router.register(r'votes', VoteViewSet)
router.register(r'option-vote-count', OptionVoteCountViewSet)
router.register(r'agenda-vote-count', AgendaVoteCountViewSet)

urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('logout/',views.UserLogoutView.as_view(), name='logout'),
    path('profile/', views.profile_view, name='profile'), 
    path('voting/', views.create_vote, name='create_vote'), # Corrected line
    path('', include(router.urls)),
    # path('<str:groupname>/',views.index,name='index'),
   
]

# VotingApp/urls.py



# agenda/urls.py



