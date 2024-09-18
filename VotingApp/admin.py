from django.contrib import admin
from .models import UserProfile, Agenda, Option, Vote, OptionVoteCount, AgendaVoteCount

# Registering UserProfile model
admin.site.register(UserProfile)
admin.site.register(OptionVoteCount)
admin.site.register(AgendaVoteCount)

# Admin configuration for Agenda model
class AgendaAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'start_date', 'end_date']
    search_fields = ['name', 'description']
    list_filter = ['start_date', 'end_date']

admin.site.register(Agenda, AgendaAdmin)

# Admin configuration for Option model
class OptionAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'agenda_name', 'agenda_description',
        'agenda_start_date', 'agenda_end_date'
    ]
    
    def agenda_name(self, obj):
        return obj.agenda.name

    def agenda_description(self, obj):
        return obj.agenda.description

    def agenda_start_date(self, obj):
        return obj.agenda.start_date

    def agenda_end_date(self, obj):
        return obj.agenda.end_date

    # Optional: set column headers
    agenda_name.short_description = 'Agenda Name'
    agenda_description.short_description = 'Agenda Description'
    agenda_start_date.short_description = 'Start Date'
    agenda_end_date.short_description = 'End Date'



# Admin configuration for Vote model
class VoteAdmin(admin.ModelAdmin):
    list_display = ['user', 'agenda', 'option']
    search_fields = ['user__username', 'agenda__name', 'option__name']
    list_filter = ['agenda', 'option']



admin.site.register(Option, OptionAdmin)

# Admin configuration for Vote model

admin.site.register(Vote)
