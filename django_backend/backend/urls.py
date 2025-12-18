# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomUserViewSet, VenueViewSet, EventViewSet,
    BookingViewSet, PaymentViewSet, AttendanceViewSet,
    TicketViewSet
)

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'venues', VenueViewSet)
router.register(r'events', EventViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]