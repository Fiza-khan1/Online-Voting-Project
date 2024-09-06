from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


from rest_framework.validators import UniqueValidator

class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email is already taken')
        return value
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# Serializer for user login
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user is None:
            raise serializers.ValidationError("Invalid credentials")
        return {
            'user': user
        }


from .models import UserProfile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = UserProfile
        fields = ['id', 'bio', 'profile_picture', 'user', 'username', 'email']


# agenda/serializers.py
from .models import Agenda, Option

from rest_framework import serializers
from .models import Option

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'name', 'agenda']  # Ensure 'agenda' is included


class AgendaSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Agenda
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'options']

    def validate(self, data):
        """
        Check that the start_date is before the end_date.
        """
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError("End date must be after the start date.")

        return data

# VotingApp/serializers.py

from rest_framework import serializers
from .models import Vote, OptionVoteCount, AgendaVoteCount

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['user', 'agenda', 'option']

from rest_framework import serializers
from .models import OptionVoteCount, AgendaVoteCount

class OptionVoteCountSerializer(serializers.ModelSerializer):
    option_name = serializers.CharField(source='option.name', read_only=True)
    agenda_title = serializers.CharField(source='option.agenda.name', read_only=True)  # Get agenda name through option
    agenda_description = serializers.CharField(source='option.agenda.description', read_only=True)  # Get agenda description

    class Meta:
        model = OptionVoteCount
        fields = ['option', 'option_name', 'agenda_title', 'agenda_description', 'vote_count']

class AgendaVoteCountSerializer(serializers.ModelSerializer):
    agenda_name = serializers.CharField(source='agenda.name', read_only=True)
    agenda_title = serializers.CharField(source='agenda.name', read_only=True)
    agenda_description = serializers.CharField(source='agenda.description', read_only=True)
    class Meta:
        model = AgendaVoteCount
        fields = ['agenda', 'agenda_name', 'agenda_title', 'agenda_description', 'vote_count']
