import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Count
from channels.db import database_sync_to_async

class VoteCountConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "vote_count_group"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        # Optionally send initial data
        await self.send_vote_counts()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def update_vote_count(self, event):
        # This method is called when group_send is used with type 'update_vote_count'
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
        return list(
            Option.objects.annotate(vote_count=Count('vote'))
            .values('id', 'name', 'vote_count')
        )

    @database_sync_to_async

    def get_agenda_counts(self):
        from .models import Agenda
        return list(
            Agenda.objects.annotate(vote_count=Count('vote'))
            .values('id', 'name', 'description', 'vote_count')
        )
