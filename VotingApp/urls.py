
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  OptionViewSet
from .views import VoteViewSet, OptionVoteCountViewSet, AgendaVoteCountViewSet

from .views import AgendaDetailView,AgendaUpdateView,AgendaDeleteView,OptionUpdateView,OptionDeleteView,AgendaViewSet

from . import views
from .views import AgendaListView
router = DefaultRouter()
# router.register(r'agendas', AgendaViewSet)
router.register(r'options', OptionViewSet)
router.register(r'votes', VoteViewSet)
router.register(r'option-vote-count', OptionVoteCountViewSet)
router.register(r'agenda-vote-count', AgendaVoteCountViewSet)
router.register(r'agendas', AgendaViewSet, basename='agenda')
urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('logout/',views.UserLogoutView.as_view(), name='logout'),
    path('profile/', views.profile_view, name='profile'), 
    path('voting/', views.create_vote, name='create_vote'), 
    path('agendass/', AgendaListView.as_view(), name='agenda-list'),
    # path('agendas/<int:pk>/', AgendaDetailView.as_view(), name='agenda-detail'),
    path('agendass/<int:pk>/', AgendaDetailView.as_view(), name='agenda-detail'),
    path('agendas/<int:pk>/edit/', AgendaUpdateView.as_view(), name='agenda-update'),
    path('agendas/<int:pk>/delete/', AgendaDeleteView.as_view(), name='agenda-delete'),
    path('options/<int:pk>/edit/', OptionUpdateView.as_view(), name='option-update'),
    path('options/<int:pk>/delete/', OptionDeleteView.as_view(), name='option-delete'),
     path('voting/check/<int:agenda_id>/', views.CheckVoteStatusView.as_view(), name='check_vote_status'),

    path('', include(router.urls)),
    # path('<str:groupname>/',views.index,name='index'),
   
]

# VotingApp/urls.py



# agenda/urls.py



