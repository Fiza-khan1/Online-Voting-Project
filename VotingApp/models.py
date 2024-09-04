from django.db import models
from django.contrib.auth.models import User
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to the default User model
    bio = models.TextField(blank=True, null=True)  # Optional biography field
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)  # Optional profile picture field

    def __str__(self):
        return self.user.username
