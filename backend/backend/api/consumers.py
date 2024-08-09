import json

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User
from .models import Messages

class chatconsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender=self.scope['user'].id
        print(self.sender)
        self.receiver=self.scope['url_route']['kwargs']['receiver']

        if int(self.sender) > int(self.receiver):
            self.room_name=f'{self.sender}--{self.receiver}'
        else:
            self.room_name=f'{self.receiver}--{self.sender}'

        self.group_room_name='chat_%s' % self.room_name

        print(self.group_room_name)
        await self.channel_layer.group_add(
            self.group_room_name,
            self.channel_name
        )

        await self.accept()
    
    async def disconnect(self, close_code):
        # user=User.objects.get(id=self.scope['user'].id)
        # stat=UserStatus.objects.get(user=user)
        # stat.update(status=False)


        await self.channel_layer.group_discard(
            self.group_room_name,
            self.channel_name
        )

    
        
    async def receive(self,text_data):
        data=json.loads(text_data)
        # print(data['type'])
        type=data.get('type','')
        typing_indicator=data.get('bool','')
        type_icon_receiver=data.get('typing_icon_receiver','')
        message=data.get('message','')
        sender=data.get('sender','')
        receiver=data.get('receiver','')
        online_status=data.get('status','')
        print(type)

        if type=="message":
            await self.save_message(receiver,message)
            await self.channel_layer.group_send(
                self.group_room_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'receiver': receiver
                }
            )

           
        # elif type=='typing':
        #     await self.channel_layer.group_send(
        #         self.group_room_name,
        #         {
        #             'type': 'chat_typing',
        #             'typing_indicator': typing_indicator,
        #             'type_icon_receiver':type_icon_receiver
        #         }
        #     )
        # elif type=="online_status":
        #     await self.save_online_status(sender,online_status)
        #     await self.channel_layer.group_send(
        #         self.group_room_name,
        #         {
        #             'type': 'chat_online_status',
        #             'user':sender,
        #             'status':online_status
        #         }
        #     )
           
    # async def chat_online_status(self,event):
    #     sender=event['user']
    #     status=event['status']

    #     await self.send(text_data=json.dumps({
    #         'type':'online_status',
    #         'status':status,
    #         'user':sender
    #     }))

    # async def chat_typing(self,event):
    #     typing_indicator=event['typing_indicator']
    #     type_icon_receiver=event['type_icon_receiver']

    #     await self.send(text_data=json.dumps({
    #         'type':'typing',
    #         'bool':typing_indicator,
    #         'type_icon_receiver': type_icon_receiver
    #     }))

    async def chat_message(self,event):
        message=event['message']
        receiver=event['receiver']
        await self.send(text_data=json.dumps({
            'type':'message',
            'message':message,
            'sender':self.sender,
            'receiver':receiver
        }))

    @sync_to_async
    def save_message(self,receiver,message):
        sender=User.objects.get(id=self.sender)
        receiver=User.objects.get(id=receiver)

        Messages.objects.create(sender=sender,receiver=receiver,message=message)

    # @sync_to_async
    # def save_online_status(self,sender,online_status):
    #     users=User.objects.get(id=sender)
    #     status=UserStatus.objects.filter(user=users)
    #     if status.exists():
    #         status.update(status=online_status)
    #     else:
    #         UserStatus.objects.create(user=users,status=online_status)