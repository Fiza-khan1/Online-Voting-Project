import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class VoteCountConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "vote_count_group"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        await self.send_vote_counts()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def update_vote_count(self, event):
        await self.send_vote_counts()

    async def send_vote_counts(self):
        option_counts = await self.get_option_counts()
        agenda_counts = await self.get_agenda_counts()
        await self.send(text_data=json.dumps({
            'option_counts': option_counts,
            'agenda_counts': agenda_counts,
        }))

    @database_sync_to_async
    def get_option_counts(self):
        from .models import Option
        from django.db.models import Count

        return list(
            Option.objects
            .annotate(vote_count=Count('vote'))
            .values('id', 'name', 'agenda__name', 'vote_count')
        )

    @database_sync_to_async
    def get_agenda_counts(self):
        from .models import Agenda
        from django.db.models import Count

        return list(
            Agenda.objects
            .annotate(vote_count=Count('vote'))
            .values('id', 'name', 'description', 'vote_count')
        )

from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        from rest_framework.authtoken.models import Token

        # Extract token from query parameters
        token = self.scope['query_string'].decode().split('token=')[-1]
        from django.contrib.auth.models import AnonymousUser
        
        if token:
            # Try to authenticate the token asynchronously
            try:
                token_instance = await database_sync_to_async(Token.objects.get)(key=token)
                self.user = await sync_to_async(lambda: token_instance.user)()
            except Token.DoesNotExist:
                self.user = AnonymousUser()
        else:
            self.user = AnonymousUser()
        
        # Assign group name based on the user
        if isinstance(self.user, AnonymousUser):
            self.user_group_name = "anonymous"
        else:
            self.user_group_name = f"user_{self.user.id}"
        
        self.notification_group_name = "vote_notifications"
        
        print("User group name:", self.user_group_name)

        # Add the user to both the user and notification groups
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )
        
        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Remove the user from the groups when they disconnect
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )
        
        await self.channel_layer.group_discard(
            self.notification_group_name,
            self.channel_name
        )

    # Handler for 'user_vote_notification' event
    async def user_vote_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_vote_notification',
            'message': event['message'],
        }))

    # Handler for 'new_vote_notification' event
    async def new_vote_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_vote_notification',
            'message': event['message'],
            'option_id': event['option_id'],
            'agenda_id': event['agenda_id']
        }))
