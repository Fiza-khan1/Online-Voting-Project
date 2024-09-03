from django.shortcuts import render
from .serializers import UserRegisterSerializer, UserLoginSerializer
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate,logout
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