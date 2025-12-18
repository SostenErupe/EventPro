from rest_framework import serializers
from .models import CustomUser, Venue, Event, Booking, Payment, Attendance, Ticket

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['user_id', 'date_joined']

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['venue_id', 'venue_name', 'capacity', 'street', 'city', 'state', 'pincode']
        read_only_feilds = ['venue_id']

        def validate_capacity(self, value):
            if value <= 0:
                raise serializers.ValidationError('Capacity must be greater than 0')
            elif value > 1000:
                raise serializers.ValidationError('Capacity cannot exceed 1000')
            return value

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['event_id', 'event_name','event_date', 'event_starttime', 'event_endtime', 
                  'organizer', 'tickets_count', 'tickets_price', 'available_tickets', 'venue_id'
                  'created_at', 'updated_at']
        read_onlyfields = ['event_id', 'available_tickets', 'created_at', 'updated_at']

        def validate(self, data):
            from django.utils import timezone
            from datetime import datetime

            event_date = datetime.strptime(data.get('event_date'), '%Y-%m-%d').date()
            if event_date < timezone.now().date():
                raise serializers.ValidationError({"event_date": "Event date must be in the future"})
            
            start_time = datetime.strptime(data.get('event_starttime'), '%H:%M').time()
            end_time = datetime.strptime(data.get('event_endtime'), '%H:%M').time()
            if start_time > end_time:
                raise serializers.ValidationError({"event_endtime": "End time must be after start time"})
            
            if data.get('tickets_price', 0) < 0:
                raise serializers.ValidationError({"tickets_price", "Ticket price cannot be negative"})
            
            return data
        
        def validate_tickets_count(self, value):
            if value < 0:
                raise serializers.ValidationError("Ticket count must be greater than 0!")
            if value > 10000:
                raise serializers.ValidationError("Ticket count cannot excede 10000!")
            return value
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class TickectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'