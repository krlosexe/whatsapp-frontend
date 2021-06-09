import axios from 'axios';
import React, {useEffect, useState} from 'react';

const WhatsApp = () => ({
    
    GetChats : async () => {
        try {

            const req = 'http://127.0.0.1:3001/whatsapp/get/chats'
                try {
                    const response = await axios.post(req)

                    let Chats = []

                     await response.data.chats.map(async (item, key)=>{
                    
                        let messages = []
                        let conversations

                        await item.messages.map(async (item2, key2)=>{

                            let userType
                            if(item2.key.fromMe == false){
                                userType = "receiver"
                            }else{
                                userType = "sender"
                            }

                            if(item2.message){
                                if(item2.message.conversation){
                                   let message = { 
                                        "id": key2, "message": item2.message.conversation, "time": "01:05", "userType": userType, "isImageMessage" : false, "isFileMessage" : false 
                                    }
                                    await messages.push(message)
                                }
                                
                                if(item2.message.imageMessage){
                                    let message
                                   
                                    message = { 
                                        "id"             : key2, "message": item2.message.conversation, 
                                        "time"           : "01:05", "userType": userType, 
                                        "isImageMessage" : true, 
                                        "isFileMessage"  : false,
                                        "imageMessage"   : [ { 
                                            image : item2.message.imageMessage.jpegThumbnail,
                                            "url"            : item2.message.imageMessage.url,
                                            "mediaKey"       : item2.message.imageMessage.mediaKey,
                                       } ]
                                    }
                                   await messages.push(message)
                                 
                                }
                                
                                if(item2.message.documentMessage){
                                    let message
                                    message = { 
                                        "id"             : key2,
                                        "message"        :  "Documento", 
                                        "time"           : "01:05", 
                                        "userType"       : userType, 
                                        "isImageMessage" : false,
                                        "isFileMessage"  : true, 
                                        "fileMessage"    : item2.message.documentMessage.fileName, 
                                        "size"           : `${item2.message.documentMessage.fileLength} Kb`,
                                        "url"            : item2.message.documentMessage.url,
                                        "mediaKey"       : item2.message.documentMessage.mediaKey,
                                        "mimetype"       : item2.message.documentMessage.mimetype,
                                    }
                                   await messages.push(message)
                                }
                                 
                            }
                            
                        })
                       
                        conversations = {
                            "id"             : key,
                            "isGroup"        : false,
                            "messages"       : messages,
                            "name"           : item.name,
                            "profilePicture" : item.imgUrl != "" ? item.imgUrl : "Null",
                            "roomType"       : "contact",
                            "status"         : "online",
                            "unRead"         : 0
                        }

                        if(item.name){
                            await Chats.push(conversations)
                        }
                        
                    })

                   return Chats
                    
                } catch (error) {
                    console.log(error)
                }

        } catch (error) {
            console.log(error)
        }
    },


    DecrypImage : async (mediaKey, url) => {

     
        var bodyFormData = new FormData();
        bodyFormData.append('mediakey', mediaKey)
        bodyFormData.append('filenc', url)

        const response = await axios({ method: "post",
                                        url: "http://31.220.60.218:5000/decrypt",
                                        data: bodyFormData,
                                        headers: { "Content-Type": "multipart/form-data" }})

        return response

    },



    DecrypDocument : async (mediaKey, url, extension) => {

     
        var bodyFormData = new FormData();
        bodyFormData.append('mediakey', mediaKey)
        bodyFormData.append('filenc', url)
        bodyFormData.append('extension', extension)

        const response = await axios({ method: "post",
                                        url: "http://31.220.60.218:5000/decrypt/document",
                                        data: bodyFormData,
                                        headers: { "Content-Type": "multipart/form-data" }})

        return response

    }





});

export default WhatsApp



