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
        fields = '__all__'

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