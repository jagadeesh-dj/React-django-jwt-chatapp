from django.shortcuts import render
from django.contrib.auth.models import User
# Create your views here.
from rest_framework.views import APIView
from .serializers import RegisterSerializer,MessageSerializer
from rest_framework.response import Response
from rest_framework import status,generics,permissions
from .models import Messages
from rest_framework.permissions import IsAuthenticated,AllowAny


class UserAuth(APIView):
    permission_classes=[AllowAny]
    def post(self, request):
        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data":serializer.data,"status":status.HTTP_201_CREATED})
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class UserList(generics.ListAPIView):
    serializer_class=RegisterSerializer
    permission_classes=[IsAuthenticated] 
    def get_queryset(self):
        user_id=self.request.user.id
        receivers=User.objects.exclude(id=user_id)
        return receivers

    # def list(self, request, *args, **kwargs):
    #     queryset = self.get_queryset()
    #     serializer = self.get_serializer(queryset, many=True)
    #     return Response({
    #         "receivers": serializer,
    #         "sender": self.request.user.id
    #     })
    
# class LogoutView(APIView):     
#     permission_classes = (permissions.IsAuthenticated,)     
#     def post(self, request):
#         try:               
#             refresh_token = request.data["refresh_token"]               
#             token = RefreshToken(refresh_token)               
#             token.blacklist()               
#             return Response(status=status.HTTP_205_RESET_CONTENT)          
#         except Exception as e:              
#             return Response(status=status.HTTP_400_BAD_REQUEST)

# class CreateMessage(APIView):
#     permission_classes = (permissions.AllowAny,)
#     def post(self,request):
#         serializer=MessageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'data':serializer.data,'status':status.HTTP_200_OK})
#         return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class MessageView(generics.ListAPIView):
    serializer_class=MessageSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        # sender=self.kwargs['sender_id']
        receiver=self.kwargs['receiver_id']
        message=Messages.objects.filter(sender=self.request.user,receiver=receiver) | Messages.objects.filter(sender=receiver,receiver=self.request.user).order_by('timestamp')
        return message

class CreateMessage(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            result=MessageView()
            return Response({"data":serializer.data,'status':status.HTTP_201_CREATED})
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class current_user(generics.ListAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=RegisterSerializer
    def get_queryset(self):
        receiver=self.kwargs['receiver_id']
        return User.objects.filter(id=receiver)

class loginuser(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=User.objects.get(id=request.user.pk)
        return Response({"data":user.pk})