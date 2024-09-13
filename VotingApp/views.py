from django.shortcuts import render
from .serializers import UserRegisterSerializer, UserLoginSerializer
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate,logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models import Count
from rest_framework import viewsets
from .models import Agenda
from .serializers import AgendaSerializer

from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_GET

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View
from .models import Vote  # Ensure this import matches your project structure

from django.http import JsonResponse
from django.views import View
from .models import Vote  # Make sure this import is correct

class CheckVoteStatusView(View):
    def get(self, request, *args, **kwargs):
        agenda_id = self.kwargs.get('agenda_id')
        user = request.user

        if not agenda_id:
            return JsonResponse({'detail': 'Agenda ID not provided'}, status=400)

        if user.is_authenticated:
            # Check if the user has voted for the given agenda
            has_voted = Vote.objects.filter(user=user, agenda_id=agenda_id).exists()
        else:
            # Handle cases where the user is not authenticated
            has_voted = False

        return JsonResponse({'has_voted': has_voted})




class AgendaViewSet(viewsets.ModelViewSet):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer
# Create your views here.
class UserRegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate a token for the newly created user
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {
                    'message': 'User registered successfully',
                    'token': token.key  # Include the token in the response
                }, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User login view

class UserLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        if username is None or password is None:
            return Response({"error": "Please provide both username and password"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if not user:
            return Response({"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)

        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)


# You might also want to add a logout view
class UserLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)




# views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import ProfileSerializer

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserProfile
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
 # Assuming you have a serializer for UserProfile
from .models import UserProfile

@api_view(['GET', 'PUT'])
def profile_view(request):
    try:
        profile = request.user.userprofile  # Get the user's profile
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profile does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    if request.method == 'PUT':
        # Update profile fields
        profile_serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if profile_serializer.is_valid():
            profile_serializer.save()

        # Update user email if provided
        email = request.data.get('email')
        if email:
            request.user.email = email
            request.user.save()

        # Return the updated profile data
        return Response(profile_serializer.data, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# agenda/views.py
from rest_framework import viewsets,mixins
from rest_framework.generics import ListAPIView
from .models import Agenda, Option
from .serializers import AgendaSerializer, OptionSerializer
from rest_framework.permissions import AllowAny
class AgendaListView(ListAPIView):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer
    permission_classes = [AllowAny]

class AgendaDetailView(generics.RetrieveAPIView):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer
    permission_classes = [AllowAny]

class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer

    def perform_create(self, serializer):
        serializer.save() 

from .serializers import AgendaSerializer, OptionSerializer
class AgendaViewSet(viewsets.ModelViewSet):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer

class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer

    def destroy(self, request, *args, **kwargs):
        option = self.get_object()
        if not option.agenda:  # Assuming `agenda` is a foreign key
            return Response(
                {"detail": "Option must be associated with an agenda."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)
class AgendaUpdateView(generics.UpdateAPIView):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer

class AgendaDeleteView(generics.DestroyAPIView):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer

class OptionUpdateView(generics.UpdateAPIView):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer

class OptionDeleteView(generics.DestroyAPIView):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer


# VotingApp/views.py

from rest_framework import viewsets
from .models import Vote, OptionVoteCount, AgendaVoteCount
from .serializers import VoteSerializer, OptionVoteCountSerializer, AgendaVoteCountSerializer

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

class OptionVoteCountViewSet(viewsets.ModelViewSet):
    queryset = OptionVoteCount.objects.all()
    serializer_class = OptionVoteCountSerializer

class AgendaVoteCountViewSet(viewsets.ModelViewSet):
    queryset = AgendaVoteCount.objects.all()
    serializer_class = AgendaVoteCountSerializer

# @api_view(['POST'])
# @permission_classes([IsAuthenticated]) 
# def create_vote(request):
#     username = request.data.get('username')  # Get username from request body
#     agenda_id = request.data.get('agenda')
#     option_id = request.data.get('option')

#     try:
#         user = User.objects.get(username=username)  # Fetch the user by username
#         agenda = Agenda.objects.get(id=agenda_id)
#         option = Option.objects.get(id=option_id)
#     except (User.DoesNotExist, Agenda.DoesNotExist, Option.DoesNotExist):
#         return Response({'detail': 'Invalid user, agenda, or option.'}, status=status.HTTP_400_BAD_REQUEST)

#     if Vote.objects.filter(user=user, agenda=agenda).exists():
#         return Response({'detail': 'You have already voted for this agenda.'}, status=status.HTTP_400_BAD_REQUEST)

#     # Create and save the vote
#     vote = Vote(user=user, agenda=agenda, option=option)
#     vote.save()

#     channel_layer = get_channel_layer()
#     # Make sure that the group name matches the one used in the WebSocket consumer
#     async_to_sync(channel_layer.group_send)(
#         "vote_count_group",
#         {
#             "type": "update_vote_count",
#             # Include any necessary data to update the WebSocket clients
#             "data": {
#                 "option_counts": get_option_counts(),  # Example function to get option counts
#                 "agenda_counts": get_agenda_counts(),  # Example function to get agenda counts
#             }
#         }
#     )

#     return Response({'detail': 'Vote submitted successfully.'}, status=status.HTTP_201_CREATED)
# _______________________________________________________________________________
# from .models import Agenda, Option, Vote
# from django.db.models import Count

# def get_option_counts():
#     """
#     Fetches the vote counts for all options.
#     Returns a list of dictionaries, each containing the option ID and vote count.
#     """
#     option_counts = (
#         Vote.objects.values('option_id')
#         .annotate(vote_count=Count('option_id'))
#         .values('option_id', 'vote_count')
#     )
    
#     # Format the result as a list of dictionaries with option details
#     return [
#         {
#             'option_id': option['option_id'],
#             'vote_count': option['vote_count'],
#             'option_name': Option.objects.get(id=option['option_id']).name,  # Adjust according to your model
#             'agenda_name': Option.objects.get(id=option['option_id']).agenda.name  # Adjust according to your model
#         }
#         for option in option_counts
#     ]

# def get_agenda_counts():
#     """
#     Fetches the vote counts for all agendas.
#     Returns a list of dictionaries, each containing the agenda ID and vote count.
#     """
#     agenda_counts = (
#         Vote.objects.values('agenda_id')
#         .annotate(vote_count=Count('agenda_id'))
#         .values('agenda_id', 'vote_count')
#     )
    
#     # Format the result as a list of dictionaries with agenda details
#     return [
#         {
#             'agenda_id': agenda['agenda_id'],
#             'vote_count': agenda['vote_count'],
#             'agenda_name': Agenda.objects.get(id=agenda['agenda_id']).name,  # Adjust according to your model
#             'agenda_description': Agenda.objects.get(id=agenda['agenda_id']).description  # Adjust according to your model
#         }
#         for agenda in agenda_counts
#     ]

# _________________________________________________________
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Agenda, Option, Vote
from django.contrib.auth.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Vote, Agenda, Option
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_vote(request):
    username = request.data.get('username')
    agenda_id = request.data.get('agenda')
    option_id = request.data.get('option')

    try:
        user = User.objects.get(username=username)
        agenda = Agenda.objects.get(id=agenda_id)
        option = Option.objects.get(id=option_id)
    except (User.DoesNotExist, Agenda.DoesNotExist, Option.DoesNotExist):
        return Response({'detail': 'Invalid user, agenda, or option.'}, status=status.HTTP_400_BAD_REQUEST)

    if Vote.objects.filter(user=user, agenda=agenda).exists():
        return Response({'detail': 'You have already voted for this agenda.'}, status=status.HTTP_400_BAD_REQUEST)

    Vote.objects.create(user=user, agenda=agenda, option=option)

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "vote_count_group",
        {
            "type": "update_vote_count",
            "option_counts": get_option_counts(),
            "agenda_counts": get_agenda_counts(),
        }
    )

    # Notify all users
    async_to_sync(channel_layer.group_send)(
        "vote_notifications",
        {
            "type": "new_vote_notification",
            "message": f"{user.username} voted for {option.name} in {agenda.name}.",
            "option_id": option_id,
            "agenda_id": agenda_id
        }
    )

    # Notify the specific user
    async_to_sync(channel_layer.group_send)(
        f"user_{user.id}",  # Unique group name for the user
        {
            "type": "user_vote_notification",
            "message": f'Your vote for {option.name} in {agenda.name} has been registered.',
        }
    )

    return Response({'detail': 'Vote submitted successfully.'}, status=status.HTTP_201_CREATED)

def get_option_counts():
    option_counts = (
        Vote.objects
        .select_related('option')
        .values('option_id')
        .annotate(vote_count=Count('option_id'))
        .values('option_id', 'vote_count', 'option__name')
    )
    return [
        {
            'id': option['option_id'],
            'name': option['option__name'],
            'vote_count': option['vote_count']
        }
        for option in option_counts
    ]

def get_agenda_counts():
    agenda_counts = (
        Vote.objects
        .select_related('agenda')
        .values('agenda_id')
        .annotate(vote_count=Count('agenda_id'))
        .values('agenda_id', 'vote_count', 'agenda__name', 'agenda__description')
    )
    return [
        {
            'id': agenda['agenda_id'],
            'name': agenda['agenda__name'],
            'description': agenda['agenda__description'],
            'vote_count': agenda['vote_count']
        }
        for agenda in agenda_counts
    ]
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_vote(request):
#     # Fetch user, agenda, and option details
#     username = request.data.get('username')
#     agenda_id = request.data.get('agenda')
#     option_id = request.data.get('option')

#     try:
#         user = User.objects.get(username=username)
#         agenda = Agenda.objects.get(id=agenda_id)
#         option = Option.objects.get(id=option_id)
#     except (User.DoesNotExist, Agenda.DoesNotExist, Option.DoesNotExist):
#         return Response({'detail': 'Invalid user, agenda, or option.'}, status=status.HTTP_400_BAD_REQUEST)

#     if Vote.objects.filter(user=user, agenda=agenda).exists():
#         return Response({'detail': 'You have already voted for this agenda.'}, status=status.HTTP_400_BAD_REQUEST)

#     # Save the vote
#     Vote.objects.create(user=user, agenda=agenda, option=option)

#     # Send message to WebSocket group
#     channel_layer = get_channel_layer()
#     async_to_sync(channel_layer.group_send)(
#         "vote_count_group",
#         {
#             "type": "update_vote_count",
#         }
#     )
#     channel_layer = get_channel_layer()
#     async_to_sync(channel_layer.group_send)(
#         "vote_notifications",
#         {
#             "type": "update_vote_count",
#             "option_id": option_id,
#             "agenda_id": agenda_id
#         }
#     )
#     return Response({'detail': 'Vote submitted successfully.'}, status=status.HTTP_201_CREATED)

# def get_option_counts():
#     option_counts = (
#         Vote.objects
#         .select_related('option')
#         .values('option_id')
#         .annotate(vote_count=Count('option_id'))
#         .values('option_id', 'vote_count', 'option__name')
#     )
    
#     return [
#         {
#             'id': option['option_id'],
#             'name': option['option__name'],
#             'vote_count': option['vote_count']
#         }
#         for option in option_counts
#     ]

# def get_agenda_counts():
#     agenda_counts = (
#         Vote.objects
#         .select_related('agenda')
#         .values('agenda_id')
#         .annotate(vote_count=Count('agenda_id'))
#         .values('agenda_id', 'vote_count', 'agenda__name', 'agenda__description')
#     )
    
#     return [
#         {
#             'id': agenda['agenda_id'],
#             'name': agenda['agenda__name'],
#             'description': agenda['agenda__description'],
#             'vote_count': agenda['vote_count']
#         }
#         for agenda in agenda_counts
#     ]

# @api_view(['POST'])
# @api_view(['POST'])
# @permission_classes([IsAuthenticated]) 
# def create_vote(request):
#     username = request.data.get('username')  # Get username from request body
#     agenda_id = request.data.get('agenda')
#     option_id = request.data.get('option')

#     try:
#         user = User.objects.get(username=username)  # Fetch the user by username
#         agenda = Agenda.objects.get(id=agenda_id)
#         option = Option.objects.get(id=option_id)
#     except (User.DoesNotExist, Agenda.DoesNotExist, Option.DoesNotExist):
#         return Response({'detail': 'Invalid user, agenda, or option.'}, status=status.HTTP_400_BAD_REQUEST)

#     if Vote.objects.filter(user=user, agenda=agenda).exists():
#         return Response({'detail': 'You have already voted for this agenda.'}, status=status.HTTP_400_BAD_REQUEST)

#     # Create and save the vote
#     vote = Vote(user=user, agenda=agenda, option=option)
#     vote.save()

#     # Update OptionVoteCount
#     option_vote_count, created = OptionVoteCount.objects.get_or_create(option=option)
#     option_vote_count.vote_count += 1
#     option_vote_count.save()

#     # Update AgendaVoteCount
#     agenda_vote_count, created = AgendaVoteCount.objects.get_or_create(agenda=agenda)
#     agenda_vote_count.vote_count += 1
#     agenda_vote_count.save()

#     # Send message to WebSocket group
#     channel_layer = get_channel_layer()
#     async_to_sync(channel_layer.group_send)(
#         "vote_count_group",
#         {
#             "type": "update_vote_count",
#         }
#     )

#     return Response({'detail': 'Vote submitted successfully.'}, status=status.HTTP_201_CREATED)




# This is for creating 
# @api_view(['POST'])
# @permission_classes([IsAuthenticated]) 
# def create_vote(request):
#     username = request.data.get('username')  # Get username from request body
#     agenda_id = request.data.get('agenda')
#     option_id = request.data.get('option')

#     try:
#         user = User.objects.get(username=username)  # Fetch the user by username
#         agenda = Agenda.objects.get(id=agenda_id)
#         option = Option.objects.get(id=option_id)
#     except (User.DoesNotExist, Agenda.DoesNotExist, Option.DoesNotExist):
#         return Response({'detail': 'Invalid user, agenda, or option.'}, status=status.HTTP_400_BAD_REQUEST)

#     if Vote.objects.filter(user=user, agenda=agenda).exists():
#         return Response({'detail': 'You have already voted for this agenda.'}, status=status.HTTP_400_BAD_REQUEST)

#     # Create and save the vote
#     vote = Vote(user=user, agenda=agenda, option=option)
#     vote.save()

#     channel_layer = get_channel_layer()
#     async_to_sync(channel_layer.group_send)(
#         "vote_count_group",
#         {
#             "type": "update_vote_count",
#         }
#     )

#     return Response({'detail': 'Vote submitted successfully.'}, status=status.HTTP_201_CREATED)