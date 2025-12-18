# views.py - COMPLETE DRF VIEWSETS
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Q, Count, Sum
from django.shortcuts import get_object_or_404

from .models import CustomUser, Venue, Event, Booking, Payment, Attendance, Ticket
from .serializers import (
    CustomUserSerializer, VenueSerializer, EventSerializer,
    BookingSerializer, PaymentSerializer, AttendanceSerializer,
    TicketSerializer
)

# ============ CUSTOM USER VIEWS ============
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return Response({'detail': 'Not authenticated'}, status=401)
    
    @action(detail=True, methods=['get'])
    def bookings(self, request, pk=None):
        """Get all bookings for a user"""
        user = self.get_object()
        bookings = Booking.objects.filter(user=user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def attendance(self, request, pk=None):
        """Get attendance record for a user"""
        user = self.get_object()
        attendance = Attendance.objects.filter(user=user)
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)

# ============ VENUE VIEWS ============
class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    @action(detail=True, methods=['get'])
    def events(self, request, pk=None):
        """Get all events at this venue"""
        venue = self.get_object()
        events = Event.objects.filter(venue=venue)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get venues available for a specific date"""
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({'error': 'Date parameter required'}, status=400)
        
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)
        
        # Find venues with no events on that date
        booked_venue_ids = Event.objects.filter(event_date=target_date).values_list('venue_id', flat=True)
        available_venues = Venue.objects.exclude(venue_id__in=booked_venue_ids)
        
        serializer = self.get_serializer(available_venues, many=True)
        return Response(serializer.data)

# ============ EVENT VIEWS ============
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Event.objects.all()
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(event_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(event_date__lte=end_date)
        
        # Filter by organizer
        organizer = self.request.query_params.get('organizer')
        if organizer:
            queryset = queryset.filter(organizer__icontains=organizer)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(tickets_price__gte=float(min_price))
        if max_price:
            queryset = queryset.filter(tickets_price__lte=float(max_price))
        
        # Filter by available tickets
        available_only = self.request.query_params.get('available_only')
        if available_only and available_only.lower() == 'true':
            queryset = queryset.filter(available_tickets__gt=0)
        
        return queryset.order_by('event_date', 'event_starttime')
    
    @action(detail=True, methods=['post'])
    def book_ticket(self, request, pk=None):
        """Book a ticket for this event"""
        event = self.get_object()
        user = request.user
        
        # Check if user is authenticated
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
        
        quantity = request.data.get('quantity', 1)
        
        # Validate quantity
        if not isinstance(quantity, int) or quantity <= 0:
            return Response({'error': 'Invalid quantity'}, status=400)
        
        # Check ticket availability
        if event.available_tickets < quantity:
            return Response({'error': f'Only {event.available_tickets} tickets available'}, status=400)
        
        # Calculate total price
        total_price = event.tickets_price * quantity
        
        # Create booking
        booking = Booking.objects.create(
            user=user,
            event=event
        )
        
        # Create ticket
        ticket = Ticket.objects.create(
            event=event,
            user=user,
            quantity=quantity,
            total_price=total_price,
            status='confirmed'
        )
        
        # Update available tickets
        event.available_tickets -= quantity
        event.save()
        
        # Create payment record
        payment = Payment.objects.create(
            booking=booking,
            payment_method=request.data.get('payment_method', 'cash'),
            amount=total_price,
            payment_status='completed',
            verification_status='verified'
        )
        
        # Return response with all created objects
        return Response({
            'message': 'Ticket booked successfully',
            'booking_id': booking.booking_id,
            'ticket_id': ticket.ticket_id,
            'payment_id': payment.payment_id,
            'total_price': total_price,
            'available_tickets': event.available_tickets
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def attendees(self, request, pk=None):
        """Get all attendees for this event"""
        event = self.get_object()
        tickets = Ticket.objects.filter(event=event, status='confirmed')
        attendees = [ticket.user for ticket in tickets]
        serializer = CustomUserSerializer(attendees, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        """Check in a user for this event"""
        event = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'error': 'user_id required'}, status=400)
        
        user = get_object_or_404(CustomUser, user_id=user_id)
        
        # Check if user has a ticket
        ticket = Ticket.objects.filter(event=event, user=user, status='confirmed').first()
        if not ticket:
            return Response({'error': 'User does not have a confirmed ticket'}, status=400)
        
        # Check if already checked in
        existing_attendance = Attendance.objects.filter(event=event, user=user).first()
        if existing_attendance:
            if existing_attendance.status == 'present':
                return Response({'error': 'User already checked in'}, status=400)
            existing_attendance.status = 'present'
            existing_attendance.checkin_time = timezone.now()
            existing_attendance.save()
            serializer = AttendanceSerializer(existing_attendance)
        else:
            # Create new attendance record
            attendance = Attendance.objects.create(
                user=user,
                event=event,
                status='present',
                checkin_time=timezone.now()
            )
            serializer = AttendanceSerializer(attendance)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events"""
        today = timezone.now().date()
        upcoming_events = Event.objects.filter(event_date__gte=today).order_by('event_date')
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search events by name"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Search query required'}, status=400)
        
        events = Event.objects.filter(
            Q(event_name__icontains=query) |
            Q(organizer__icontains=query) |
            Q(venue__venue_name__icontains=query)
        )
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

# ============ BOOKING VIEWS ============
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own bookings"""
        if self.request.user.is_authenticated:
            return Booking.objects.filter(user=self.request.user)
        return Booking.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        
        # Check if user owns this booking
        if booking.user != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        
        # Check if event has already passed
        if booking.event.event_date < timezone.now().date():
            return Response({'error': 'Cannot cancel past event'}, status=400)
        
        # Update ticket status
        ticket = Ticket.objects.filter(event=booking.event, user=request.user).first()
        if ticket:
            ticket.status = 'canceled'
            ticket.save()
            
            # Return tickets to available pool
            booking.event.available_tickets += ticket.quantity
            booking.event.save()
        
        # Update payment status
        payment = Payment.objects.filter(booking=booking).first()
        if payment:
            payment.payment_status = 'refunded'
            payment.save()
        
        # Delete booking (or mark as canceled)
        booking.delete()
        
        return Response({'message': 'Booking cancelled successfully'})

# ============ PAYMENT VIEWS ============
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own payments"""
        if self.request.user.is_authenticated:
            # Get bookings for current user
            user_bookings = Booking.objects.filter(user=self.request.user)
            return Payment.objects.filter(booking__in=user_bookings)
        return Payment.objects.none()
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a payment (admin only)"""
        payment = self.get_object()
        
        # Check if user is admin/organizer
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)
        
        verification_status = request.data.get('verification_status')
        notes = request.data.get('verification_notes', '')
        
        if verification_status not in ['verified', 'rejected']:
            return Response({'error': 'Invalid verification status'}, status=400)
        
        payment.verification_status = verification_status
        payment.verification_notes = notes
        payment.verification_date = timezone.now()
        payment.verified_by = request.user
        payment.save()
        
        # Update ticket status based on payment verification
        if payment.booking:
            ticket = Ticket.objects.filter(event=payment.booking.event, user=payment.booking.user).first()
            if ticket:
                if verification_status == 'verified':
                    ticket.status = 'confirmed'
                else:
                    ticket.status = 'canceled'
                ticket.save()
        
        serializer = self.get_serializer(payment)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending payments (admin only)"""
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)
        
        pending_payments = Payment.objects.filter(verification_status='pending')
        serializer = self.get_serializer(pending_payments, many=True)
        return Response(serializer.data)

# ============ ATTENDANCE VIEWS ============
class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own attendance"""
        if self.request.user.is_authenticated:
            return Attendance.objects.filter(user=self.request.user)
        return Attendance.objects.none()
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's attendance"""
        today = timezone.now().date()
        attendance = Attendance.objects.filter(user=request.user, date=today)
        serializer = self.get_serializer(attendance, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def event_attendance(self, request):
        """Get attendance for a specific event (organizer only)"""
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response({'error': 'event_id required'}, status=400)
        
        event = get_object_or_404(Event, event_id=event_id)
        
        # Check if user is organizer
        if request.user.username != event.organizer and not request.user.is_staff:
            return Response({'error': 'Not authorized'}, status=403)
        
        attendance = Attendance.objects.filter(event=event)
        serializer = self.get_serializer(attendance, many=True)
        
        # Add summary statistics
        present_count = attendance.filter(status='present').count()
        absent_count = attendance.filter(status='absent').count()
        
        return Response({
            'event': event.event_name,
            'total_attendees': attendance.count(),
            'present': present_count,
            'absent': absent_count,
            'attendance_rate': (present_count / attendance.count() * 100) if attendance.count() > 0 else 0,
            'attendance_list': serializer.data
        })

# ============ TICKET VIEWS ============
class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own tickets"""
        if self.request.user.is_authenticated:
            return Ticket.objects.filter(user=self.request.user)
        return Ticket.objects.none()
    
    @action(detail=True, methods=['post'])
    def validate(self, request, pk=None):
        """Validate a ticket (for event check-in)"""
        ticket = self.get_object()
        
        # Check if ticket belongs to requesting user
        if ticket.user != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        
        # Check if ticket is confirmed
        if ticket.status != 'confirmed':
            return Response({'error': f'Ticket is {ticket.status}'}, status=400)
        
        # Check if event date is today
        if ticket.event.event_date != timezone.now().date():
            return Response({'error': 'Event is not today'}, status=400)
        
        return Response({
            'valid': True,
            'ticket_id': ticket.ticket_id,
            'event': ticket.event.event_name,
            'user': ticket.user.username,
            'quantity': ticket.quantity
        })
    
    @action(detail=False, methods=['get'])
    def upcoming_tickets(self, request):
        """Get upcoming event tickets"""
        today = timezone.now().date()
        tickets = Ticket.objects.filter(
            user=request.user,
            event__event_date__gte=today,
            status='confirmed'
        ).order_by('event__event_date')
        
        serializer = self.get_serializer(tickets, many=True)
        return Response(serializer.data)