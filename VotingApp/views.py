from django.shortcuts import render
from rest_framework import generics

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
from django.db import transaction
from datetime import date

from .models import Vote  # Make sure this import is correct

# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Agenda, Vote, Option
from .serializers import AgendaSerializer, OptionSerializer
class AgendaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer
@api_view(['GET'])
def check_vote_status(request, agenda_id):
    """
    Check if the user has already voted for a specific agenda.
    """
    user = request.user
    
    try:
        agenda = Agenda.objects.get(id=agenda_id)
    except Agenda.DoesNotExist:
        return Response({"detail": "Agenda not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user has already voted
    vote = Vote.objects.filter(user=user, agenda=agenda).first()
    if vote:
        # User has voted, return vote details
        return Response({
            "has_voted": True,
            "voted_option_id": vote.option.id,
            "voted_option_name": vote.option.name
        }, status=status.HTTP_200_OK)
    else:
        # User has not voted, return the agenda details
        agenda_serializer = AgendaSerializer(agenda)
        return Response({
            "has_voted": False,
            "agenda": agenda_serializer.data
        }, status=status.HTTP_200_OK)



from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Agenda, Option
from .serializers import AgendaSerializer, OptionSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Agenda
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin
from .models import Agenda, Option
from .serializers import AgendaSerializer, OptionSerializer
from django.utils.dateparse import parse_date
from .serializers import AgendaSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Agenda, Option
from .serializers import AgendaSerializer, OptionSerializer
from django.utils.dateparse import parse_date
import datetime

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin
from .models import Agenda, Option
from .serializers import AgendaSerializer, OptionSerializer
from django.utils.dateparse import parse_date
import datetime

from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin
from django.utils.dateparse import parse_date
import datetime
from rest_framework.generics import UpdateAPIView


from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Agenda, Option
from .serializers import AgendaSerializer, OptionSerializer

from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import UpdateAPIView
from .models import Agenda, Option
from .serializers import AgendaSerializer

from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import UpdateAPIView
from .models import Agenda, Option
from .serializers import AgendaSerializer
from rest_framework import generics
from rest_framework.response import Response
from .models import Agenda, Option
from .serializers import AgendaSerializer

from rest_framework import generics
from rest_framework.response import Response
from .models import Agenda, Option
from .serializers import AgendaSerializer
from rest_framework import generics
from rest_framework.response import Response
from .models import Agenda, Option
from .serializers import AgendaSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Agenda
from .serializers import AgendaSerializer
from django.shortcuts import get_object_or_404

from rest_framework.viewsets import ModelViewSet
# views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Agenda, Option
from .serializers import AgendaSerializer, OptionSerializer

from .serializers import AgendaSerializer, OptionSerializer
class AgendaViewSet(ModelViewSet):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer

    def destroy(self, request, *args, **kwargs):
        agenda = self.get_object()

        # Delete all related votes first
        agenda.vote_set.all().delete()

        # Now delete the agenda
        agenda.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = [AllowAny]

class AgendaUpdateView(APIView):
    def put(self, request, pk, format=None):
        # Get the agenda object or return a 404 if not found
        agenda = get_object_or_404(Agenda, pk=pk)

        # Deserialize and validate the incoming data
        serializer = AgendaSerializer(agenda, data=request.data)

        if serializer.is_valid():
            # Save the updated agenda and options
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Return errors if validation fails
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # Inside your update view (or logic that updates Agenda)

def update(self, request, *args, **kwargs):
    agenda = self.get_object()  # Fetch the agenda object
    # Get the options sent in the request
    new_options = request.data.get('options', [])
    new_option_ids = [opt['id'] for opt in new_options]

    # Remove options that are not in the new list
    options_to_remove = agenda.options.exclude(id__in=new_option_ids)
    for option in options_to_remove:
        option.delete()  # or you can use agenda.options.remove(option)

    # Add new options that are not already related to the agenda
    for option_id in new_option_ids:
        if not agenda.options.filter(id=option_id).exists():
            Option.objects.create(agenda=agenda, id=option_id)

    # Update other fields in Agenda
    agenda.name = request.data.get('name', agenda.name)
    agenda.description = request.data.get('description', agenda.description)
    agenda.start_date = request.data.get('start_date', agenda.start_date)
    agenda.end_date = request.data.get('end_date', agenda.end_date)
    agenda.save()

    return Response({'message': 'Agenda updated successfully'})




# class AgendaUpdateView(GenericAPIView, UpdateModelMixin):
#     queryset = Agenda.objects.all()
#     serializer_class = AgendaSerializer

#     def put(self, request, *args, **kwargs):
#         return self.update(request, *args, **kwargs)

#     def patch(self, request, *args, **kwargs):
#         return self.update(request, *args, **kwargs)

#     from django.db import transaction
#     def update(self, request, *args, **kwargs):
#         data = request.data
#         options_data = data.pop('options', [])
#         agenda_instance = self.get_object()

#         # Validate dates
#         start_date = parse_date(data.get('start_date'))
#         end_date = parse_date(data.get('end_date'))
#         today = parse_date(str(datetime.date.today()))

#         if not start_date or not end_date:
#             return Response(
#                 {"detail": "Start date and end date are required."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         if start_date < today:
#             return Response(
#                 {"detail": "Start date must be today or in the future."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         if start_date > end_date:
#             return Response(
#                 {"detail": "Start date cannot be after end date."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # Update agenda
#         agenda_serializer = self.get_serializer(agenda_instance, data=data, partial=True)
#         if agenda_serializer.is_valid():
#             updated_agenda = agenda_serializer.save()
#         else:
#             return Response(
#                 agenda_serializer.errors,
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # Get current options for the agenda
#         current_options = set(Option.objects.filter(agenda=updated_agenda).values_list('id', flat=True))
#         new_option_ids = set(option_data.get('id') for option_data in options_data if option_data.get('id'))

#         # Delete options that are not in the new list
#         options_to_delete = current_options - new_option_ids
#         Option.objects.filter(id__in=options_to_delete).delete()

#         # Update or create options
#         for option_data in options_data:
#             option_id = option_data.get('id')
#             if option_id:
#                 try:
#                     option = Option.objects.get(id=option_id, agenda=updated_agenda)
#                     option_serializer = OptionSerializer(option, data=option_data, partial=True)
#                 except Option.DoesNotExist:
#                     return Response(
#                         {"detail": f"Option with id {option_id} does not exist."},
#                         status=status.HTTP_400_BAD_REQUEST
#                     )
#             else:
#                 option_data['agenda'] = updated_agenda.id
#                 option_serializer = OptionSerializer(data=option_data)

#             if option_serializer.is_valid():
#                 option_serializer.save()
#             else:
#                 return Response(
#                     {"detail": f"Invalid option data: {option_serializer.errors}"},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#         return Response(
#             agenda_serializer.data,
#             status=status.HTTP_200_OK
#         )

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date
from .models import Agenda, Option
from .serializers import AgendaSerializer, OptionSerializer

class AgendaCreateView(APIView):
    def post(self, request, *args, **kwargs):
        print('Auth Token:', request.auth)
        data = request.data
        options_data = data.pop('options', [])

        # Validate dates
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {"detail": "Start date and end date are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure dates are in the correct format
        try:
            start_date = date.fromisoformat(start_date)
            end_date = date.fromisoformat(end_date)
        except ValueError:
            return Response(
                {"detail": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if start_date is today or in the future
        if start_date < date.today():
            return Response(
                {"detail": "Start date cannot be in the past."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if start_date > end_date:
            return Response(
                {"detail": "Start date cannot be after end date."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create agenda
        agenda_serializer = AgendaSerializer(data=data)
        if agenda_serializer.is_valid():
            agenda = agenda_serializer.save()

            # Validate options
            if len(options_data) < 2:
                return Response(
                    {"detail": "At least 2 options are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create options
            for option_data in options_data:
                option_data['agenda'] = agenda.id
                option_serializer = OptionSerializer(data=option_data)
                if option_serializer.is_valid():
                    option_serializer.save()
                else:
                    return Response(
                        {"detail": f"Invalid option data: {option_serializer.errors}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            return Response(
                agenda_serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            agenda_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

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

# class AgendaDetailView(generics.RetrieveAPIView):
#     queryset = Agenda.objects.all()
#     serializer_class = AgendaSerializer
#     permission_classes = [AllowAny]



from .serializers import AgendaSerializer, OptionSerializer

# class AgendaUpdateView(generics.UpdateAPIView):
#     queryset = Agenda.objects.all()
#     serializer_class = AgendaSerializer

class AgendaDeleteView(generics.DestroyAPIView):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer

    def perform_destroy(self, instance):
        # Delete related votes
        Vote.objects.filter(agenda=instance).delete()
        
        # Delete related options
        Option.objects.filter(agenda=instance).delete()

        # Now delete the agenda
        instance.delete()
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

from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Agenda, Option, Vote
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_vote(request):
    username = request.data.get('username')
    agenda_id = request.data.get('agenda')
    option_id = request.data.get('option')
    
    try:
        user = User.objects.get(username=username)
        user_profile = UserProfile.objects.get(user=user)
        agenda = Agenda.objects.get(id=agenda_id)
        option = Option.objects.get(id=option_id)
    except (User.DoesNotExist, Agenda.DoesNotExist, Option.DoesNotExist):
        return Response({'detail': 'Invalid user, agenda, or option.'}, status=status.HTTP_400_BAD_REQUEST)

    profile_picture_url = user_profile.profile_picture.url if user_profile.profile_picture else None
    print("Profile picture ", profile_picture_url)  # Verify if profile picture URL is correctly set

    existing_vote = Vote.objects.filter(user=user, agenda=agenda).first()

    if existing_vote:
        existing_vote.option = option
        existing_vote.save()
        timestamp = timezone.now().isoformat()

        async_to_sync(get_channel_layer().group_send)(
            f"user_{user.id}",
            {
                "type": "user_vote_notification",
                "message": f'Your vote for {option.name} in {agenda.name} has been updated successfully ',
                "profile_picture": profile_picture_url,  # Ensure profile picture is part of this message
                 "timestamp": timestamp
            }
        )
    else:
        Vote.objects.create(user=user, agenda=agenda, option=option)

    channel_layer = get_channel_layer()

    # Send vote count updates
    async_to_sync(channel_layer.group_send)(
        "vote_count_group",
        {
            "type": "update_vote_count",
            "option_counts": get_option_counts(),
            "agenda_counts": get_agenda_counts(),
        }
    )

    # Send general vote notification with profile picture
    async_to_sync(channel_layer.group_send)(
        "vote_notifications",
        {
            "type": "new_vote_notification",
            "message": f"{user.username} voted for {option.name} in {agenda.name}",
            "option_id": option_id,
            "agenda_id": agenda_id,
            "profile_picture": profile_picture_url,  
            "timestamp": timestamp

        }
    )

    # Verify if the profile picture is included in the notification data
    print(f"Notification Data: {user.username} voted for {option.name} with profile picture {profile_picture_url}")

    return Response({'detail': 'Vote submitted successfully.'}, status=status.HTTP_201_CREATED)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_vote(request):
#     username = request.data.get('username')
#     agenda_id = request.data.get('agenda')
#     option_id = request.data.get('option')
#     user = User.objects.get(username=username)
#     user_profile = UserProfile.objects.get(user=user)
#     print("PROFILE : ",user_profile)

#     try:
#         user = User.objects.get(username=username)
#         user_profile = UserProfile.objects.get(user=user)
#         agenda = Agenda.objects.get(id=agenda_id)
#         option = Option.objects.get(id=option_id)
#     except (User.DoesNotExist, Agenda.DoesNotExist, Option.DoesNotExist):
#         return Response({'detail': 'Invalid user, agenda, or option.'}, status=status.HTTP_400_BAD_REQUEST)
#     profile_picture_url = user_profile.profile_picture.url if user_profile.profile_picture else None
#     print("Profile picture ", profile_picture_url)
#     existing_vote = Vote.objects.filter(user=user, agenda=agenda).first()

#     if existing_vote:
#         existing_vote.option = option
#         existing_vote.save()

#         async_to_sync(get_channel_layer().group_send)(
#             f"user_{user.id}",
#             {
#                 "type": "user_vote_notification",
#                 "message": f'Your vote for {option.name} in {agenda.name} has been updated successfully.',
#                 "profile_picture": profile_picture_url,
#             }
#         )
#     else:
#         Vote.objects.create(user=user, agenda=agenda, option=option)

#     channel_layer = get_channel_layer()

#     async_to_sync(channel_layer.group_send)(
#         "vote_count_group",
#         {
#             "type": "update_vote_count",
#             "option_counts": get_option_counts(),
#             "agenda_counts": get_agenda_counts(),
#             "profile_picture": profile_picture_url,

#         }
#     )

#     async_to_sync(channel_layer.group_send)(
#         "vote_notifications",
#         {
#             "type": "new_vote_notification",
#             "message": f"{user.username} voted for {option.name} in {agenda.name}.",
#             "option_id": option_id,
#             "agenda_id": agenda_id,
#             "profile_picture": profile_picture_url
#         }
#     )

#     return Response({'detail': 'Vote submitted successfully.'}, status=status.HTTP_201_CREATED)

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
#     username = request.data.get('username')
#     agenda_id = request.data.get('agenda')
#     option_id = request.data.get('option')
#     try:
#         user = User.objects.get(username=username)
#         agenda = Agenda.objects.get(id=agenda_id)
#         option = Option.objects.get(id=option_id)
#     except (User.DoesNotExist, Agenda.DoesNotExist, Option.DoesNotExist):
#         return Response({'detail': 'Invalid user, agenda, or option.'}, status=status.HTTP_400_BAD_REQUEST)

#     existing_vote = Vote.objects.filter(user=user, agenda=agenda).first()

#     if existing_vote:
#         # User has already voted, so update the existing vote
#         existing_vote.option = option
#         existing_vote.save()

#         # Notify the user about the vote change
#         async_to_sync(get_channel_layer().group_send)(
#             f"user_{user.id}",
#             {
#                 "type": "user_vote_notification",
#                 "message": f'Your vote for {option.name} in {agenda.name} has been updated successfully.',
#             }
#         )

#     else:
#         # Create a new vote if there isn't one
#         Vote.objects.create(user=user, agenda=agenda, option=option)

#     channel_layer = get_channel_layer()

#     async_to_sync(channel_layer.group_send)(
#         "vote_count_group",
#         {
#             "type": "update_vote_count",
#             "option_counts": get_option_counts(),
#             "agenda_counts": get_agenda_counts(),
#         }
#     )

#     async_to_sync(channel_layer.group_send)(
#         "vote_notifications",
#         {
#             "type": "new_vote_notification",
#             "message": f"{user.username} voted for {option.name} in {agenda.name}.",
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
# @permission_classes([IsAuthenticated])
# def create_vote(request):
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

#     Vote.objects.create(user=user, agenda=agenda, option=option)

#     channel_layer = get_channel_layer()

#     async_to_sync(channel_layer.group_send)(
#         "vote_count_group",
#         {
#             "type": "update_vote_count",
#             "option_counts": get_option_counts(),
#             "agenda_counts": get_agenda_counts(),
#         }
#     )

#     # Notify all users
#     async_to_sync(channel_layer.group_send)(
#         "vote_notifications",
#         {
#             "type": "new_vote_notification",
#             "message": f"{user.username} voted for {option.name} in {agenda.name}.",
#             "option_id": option_id,
#             "agenda_id": agenda_id
#         }
#     )

#     # Notify the specific user
#     async_to_sync(channel_layer.group_send)(
#         f"user_{user.id}",  # Unique group name for the user
#         {
#             "type": "user_vote_notification",
#             "message": f'Your vote for {option.name} in {agenda.name} has been registered.',
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