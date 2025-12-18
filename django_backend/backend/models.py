# models.py - FIXED VERSION
from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class CustomUser(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True) 
    password = models.CharField(max_length=128)  
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

class Venue(models.Model):
    venue_id = models.AutoField(primary_key=True)
    venue_name = models.CharField(max_length=100)
    capacity = models.IntegerField()
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.IntegerField()
    
    def __str__(self):
        return self.venue_name

class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    event_name = models.CharField(max_length=100)
    event_date = models.DateField()
    event_starttime = models.TimeField() 
    event_endtime = models.TimeField()    
    organizer = models.CharField(max_length=100)
    tickets_count = models.IntegerField()
    tickets_price = models.FloatField()
    available_tickets = models.IntegerField()
    venue = models.ForeignKey(Venue, on_delete=models.SET_NULL, null=True)  # Renamed to venue (not venue_id)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.event_name
    
    def save(self, *args, **kwargs):
        # Set available_tickets equal to tickets_count when creating
        if not self.pk:  # New event
            self.available_tickets = self.tickets_count
        super().save(*args, **kwargs)

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('canceled', 'Canceled')
    ]

    ticket_id = models.AutoField(primary_key=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add=True)
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Ticket {self.ticket_id} - {self.event.event_name}"
        
class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE) 
    booking_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.booking_id} - {self.user.username}"
    
class Payment(models.Model):
    VERIFICATION_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected') 
    ]
    
    payment_id = models.AutoField(primary_key=True)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, null=True)
    payment_method = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=50)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_CHOICES, default='pending')
    verification_date = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_payments')
    verification_notes = models.TextField(blank=True)
    payment_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment {self.payment_id} - {self.amount}"
    
class Attendance(models.Model):
    STATUS_CHOICES = [  
        ('present', 'Present'),
        ('absent', 'Absent')
    ]

    attendance_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True) 
    date = models.DateField(auto_now_add=True) 
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='absent')
    checkin_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.status}"