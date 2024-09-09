from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/vote-count/$', consumers.VoteCountConsumer.as_asgi()),
]
# routing.py
