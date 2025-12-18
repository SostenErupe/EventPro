# serializers.py - FIXED VERSION
from rest_framework import serializers
from django.utils import timezone
from datetime import datetime, time
from .models import CustomUser, Venue, Event, Booking, Payment, Attendance, Ticket

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = CustomUser
        fields = ['user_id', 'username', 'email', 'first_name', 'last_name', 
                 'password', 'date_joined']
        read_only_fields = ['user_id', 'date_joined']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['venue_id', 'venue_name', 'capacity', 'street', 'city', 
                 'state', 'pincode']
        read_only_fields = ['venue_id']  
    
    def validate_capacity(self, value):
        if value <= 0:
            raise serializers.ValidationError('Capacity must be greater than 0')
        elif value > 1000:
            raise serializers.ValidationError('Capacity cannot exceed 1000')
        return value

class EventSerializer(serializers.ModelSerializer):
    venue_name = serializers.CharField(source='venue.venue_name', read_only=True)
    
    class Meta:
        model = Event
        fields = ['event_id', 'event_name', 'event_date', 'event_starttime', 
                 'event_endtime', 'organizer', 'tickets_count', 'tickets_price', 
                 'available_tickets', 'venue', 'venue_name', 'created_at', 'updated_at']  
        read_only_fields = ['event_id', 'available_tickets', 'created_at', 'updated_at']  
    
    def validate(self, data):
        event_date = data.get('event_date')
        if event_date and event_date < timezone.now().date():
            raise serializers.ValidationError({"event_date": "Event date must be in the future"})
        
        start_time = data.get('event_starttime')
        end_time = data.get('event_endtime')
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError({"event_endtime": "End time must be after start time"})
        
        tickets_price = data.get('tickets_price')
        if tickets_price is not None and tickets_price < 0:
            raise serializers.ValidationError({"tickets_price": "Ticket price cannot be negative"})
        
        return data
    
    def validate_tickets_count(self, value):
        if value <= 0:
            raise serializers.ValidationError("Ticket count must be greater than 0!")
        if value > 10000:
            raise serializers.ValidationError("Ticket count cannot exceed 10000!")
        return value

class BookingSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source='event.event_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['booking_id', 'user', 'username', 'event', 'event_name', 'booking_date']
        read_only_fields = ['booking_id', 'booking_date']

class PaymentSerializer(serializers.ModelSerializer):
    booking_info = serializers.CharField(source='booking.booking_id', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['payment_id', 'booking', 'booking_info', 'payment_method', 'amount',
                 'payment_status', 'verification_status', 'verification_date',
                 'verified_by', 'verification_notes', 'payment_date']
        read_only_fields = ['payment_id', 'payment_date']

class AttendanceSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    event_name = serializers.CharField(source='event.event_name', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['attendance_id', 'user', 'username', 'event', 'event_name',
                 'date', 'status', 'checkin_time', 'created_at', 'updated_at']
        read_only_fields = ['attendance_id', 'created_at', 'updated_at', 'date']

class TicketSerializer(serializers.ModelSerializer):  
    event_name = serializers.CharField(source='event.event_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['ticket_id', 'event', 'event_name', 'user', 'username',
                 'purchase_date', 'quantity', 'total_price', 'status']
        read_only_fields = ['ticket_id', 'purchase_date', 'total_price']