from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        notifications = Notification.objects.filter(
            recipient=request.user
        )

        serializer = NotificationSerializer(
            notifications,
            many=True
        )

        return Response(
            {
                "count": notifications.count(),
                "notifications": serializer.data
            },
            status=status.HTTP_200_OK
        )


class MarkNotificationReadView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, notification_id):

        try:
            notification = Notification.objects.get(
                id=notification_id,
                recipient=request.user
            )

        except Notification.DoesNotExist:

            return Response(
                {
                    "message": "Notification not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        notification.is_read = True
        notification.save()

        return Response(
            {
                "message": "Notification marked as read."
            },
            status=status.HTTP_200_OK
        )
        