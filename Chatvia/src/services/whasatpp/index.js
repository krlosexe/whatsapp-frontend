import axios from 'axios';
import React, {useEffect, useState} from 'react';

const WhatsApp = () => ({
    
    GetChats : async () => {
        try {

            const req = 'http://127.0.0.1:3001/whatsapp/get/chats'
                try {
                    const response = await axios.post(req, {id_user : localStorage.getItem("user_id")})

                    let Chats = []

                     let count = 0
                     await response.map(async (item, key)=>{
                         
                        
                        if(item){
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
                                        messages.push(ProcessMessage(item2.message, key2, userType, ""))
                                    }
                                    
                                    if(item2.message.imageMessage){
                                        messages.push(ProcessMessage(item2.message, key2, userType, ""))
                                    }
                                    
                                    if(item2.message.documentMessage){
                                        messages.push(ProcessMessage(item2.message, key2, userType, ""))
                                    }


                                    if(item2.message.audioMessage){
                                        messages.push(ProcessMessage(item2.message, key2, userType, ""))
                                    }



                                    if(item2.message.videoMessage){
                                        messages.push(ProcessMessage(item2.message, key2, userType, ""))
                                    }


                                    if(item2.message.extendedTextMessage){
                                        messages.push(ProcessMessage(item2.message, key2, userType, ""))
                                    }

                                    if(item2.message.locationMessage){
                                        messages.push(ProcessMessage(item2.message, key2, userType, ""))
                                    }



                                    if(item2.message.contactMessage){
                                        messages.push(ProcessMessage(item2.message, key2, userType, ""))
                                    }

                                }
                                
                            })

                            
                            conversations = {
                                "id"             : count,
                                "jid"            : item.jid,
                                "isGroup"        : false,
                                "messages"       : messages,
                                "name"           : item.name,
                                "advisor"        : item.advisor,
                                "profilePicture" : item.profilePicture,
                                "roomType"       : "contact",
                                "status"         : "online",
                                "unRead"         : 0
                            }   


                            if(!item.name){
                                conversations.name = item.jid.split("@")[0]
                            }

                            count++
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



    GetConversation : async (jid, cursor_data) => {
     
        const data = {
            "number" : jid,
            "paginate" : 10,
            "cursor": cursor_data
        }

        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/get/conversation",
                                        data,
                                    })

            

        const conversations = Promise.all(response.messages.map(async (item2, key2)=>{

            let userType
            if(item2.key.fromMe == false){
                userType = "receiver"
            }else{
                userType = "sender"
            }


            const data = {
                jid,
                "id" : item2.key.id
            }

            let userName = ""

            
            const valid = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/verify/message",
                                        data
            })
            if(valid.messages){
                userName = valid.messages[0].user_name
            }else{
                userName = ""
            }

            if(item2.message){
                let chatresponse = {}
                if(item2.message.conversation){
                    chatresponse =  ProcessMessage(item2.message, key2, userType, userName)
                    
                }   
                
                if(item2.message.imageMessage){
                    chatresponse =  ProcessMessage(item2.message, key2, userType, userName)
                    
                }
                
                if(item2.message.documentMessage){
                    chatresponse =  ProcessMessage(item2.message, key2, userType, userName)
                    
                }


                if(item2.message.audioMessage){
                    chatresponse =  ProcessMessage(item2.message, key2, userType, userName)
                    
                }



                if(item2.message.videoMessage){
                    chatresponse =  ProcessMessage(item2.message, key2, userType, userName)
                    
                }


                if(item2.message.extendedTextMessage){
                    chatresponse =  ProcessMessage(item2.message, key2, userType, userName)
                    
                }

                if(item2.message.locationMessage){
                    chatresponse =  ProcessMessage(item2.message, key2, userType, userName)
                }



                if(item2.message.contactMessage){
                    chatresponse =  ProcessMessage(item2.message, key2, userType, userName)
                }

                return chatresponse
                
            }

            
        }))

       
        const messages = await conversations.then((data)=>{
            return data
        })
        const cursor = response.cursor
        return {messages, cursor}

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
    },


    DecrypAudio : async (mediaKey, url) => {

        var bodyFormData = new FormData();
        bodyFormData.append('mediakey', mediaKey)
        bodyFormData.append('filenc', url)

        const response = await axios({ method: "post",
                                        url: "http://31.220.60.218:5000/decrypt/audio",
                                        data: bodyFormData,
                                        headers: { "Content-Type": "multipart/form-data" }})

        return response
    },

    DecrypVideo : async (mediaKey, url) => {

        var bodyFormData = new FormData();
        bodyFormData.append('mediakey', mediaKey)
        bodyFormData.append('filenc', url)

        const response = await axios({ method: "post",
                                        url: "http://31.220.60.218:5000/decrypt/video",
                                        data: bodyFormData,
                                        headers: { "Content-Type": "multipart/form-data" }})

        return response
    },

    SendMmessageText : async (messageObj, user) => {

        var bodyFormData = {
            "message" : messageObj.message,
            user,
            user_name : localStorage.getItem("name"),
            user_id   : localStorage.getItem("user_id")
        }
        console.log(bodyFormData)
        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/send/message/text",
                                        data: bodyFormData})

        return response
    },

    SendMmessageImage : async (image, user) => {
        var bodyFormData = { 
            image, 
            user ,
            user_name : localStorage.getItem("name"),
            user_id   : localStorage.getItem("user_id")
        }
        console.log(bodyFormData)
        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/send/message/image",
                                        data: bodyFormData})

        return response
    },

    SendMmessageAudio : async (audio, user) => {
        var bodyFormData = { 
            audio, 
            user,
            user_name : localStorage.getItem("name"),
            user_id   : localStorage.getItem("user_id")
        }
        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/send/message/audio",
                                        data: bodyFormData})
        return response
    },

    SendMmessageVideo : async (video, user) => {
        var bodyFormData = {
            video, 
            user,
            user_name : localStorage.getItem("name"),
            user_id   : localStorage.getItem("user_id")
        }
        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/send/message/video",
                                        data: bodyFormData})
        return response
    },


    SendMmessageDocuments : async (file, user, extension) => {
        var bodyFormData = {
            file, 
            extension,
            user,
            user_name : localStorage.getItem("name"),
            user_id   : localStorage.getItem("user_id")
        }
        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/send/message/document",
                                        data: bodyFormData})
        return response
    },

    ProcessMessage : async (data, key2, userType) => {
       return ProcessMessage(data, key2, userType)
    },

    ChatRead : (jid) => {
        const response = axios.get(`http://127.0.0.1:3001/whatsapp/read/chat/${jid}`)
        return response
    },


    RegisterChat : (jid, message) => {
        console.log("GUARDANDO Y BUSCANDO CHAT")
        const data = {
            jid,
            message
        }
        const response = axios.post(`http://127.0.0.1:3001/whatsapp/register/chat`, data)
        return response
    },


    RegisterChat : (jid, message) => {
        console.log("GUARDANDO Y BUSCANDO CHAT")
        const data = {
            jid,
            message
        }
        const response = axios.post(`http://127.0.0.1:3001/whatsapp/register/chat`, data)
        return response
    },

    

    AssignAdvisor: (jid, user_id) => {
        console.log("Asignando Asesor")
        const data = {
            jid,
            user_id
        }
        const response = axios.post(`http://127.0.0.1:3001/whatsapp/assign/advisor`, data)
        return response
    }
    

}); 


function ProcessMessage(data, key2, userType, userName){

    if(data.conversation){
        let message = { 
             "id": key2, 
             "message": data.conversation, 
             "time": "01:05",
             "userType": userType,
             "isImageMessage" : false, 
             "isFileMessage" : false 
         }

         if(userType == "sender"){
           message.nameUser = userName
         }
         return message
     }
     
     if(data.imageMessage){
         let message
         message = { 
             "id"              : key2, "message": data.conversation, 
             "time"            : "01:05", "userType": userType, 
             "message"         : data.imageMessage.caption,
             "isImageMessage"  : true, 
             "isFileMessage"   : false,
             "isAudioMessage"  : false,
             "isVideoMessage"  : false,
             "imageMessage"    : [ { 
                 image : data.imageMessage.jpegThumbnail,
                 "url"            : data.imageMessage.url,
                 "mediaKey"       : data.imageMessage.mediaKey,
            } ]
         }
        return message
      
     }
     
     if(data.documentMessage){
         let message
         message = { 
             "id"             : key2,
             "message"        :  "Documento", 
             "time"           : "01:05", 
             "userType"       : userType, 
             "isImageMessage" : false,
             "isFileMessage"   : true, 
             "isAudioMessage"  : false, 
             "isVideoMessage"  : false,
             "fileMessage"    : data.documentMessage.fileName, 
             "size"           : `${data.documentMessage.fileLength} Kb`,
             "url"            : data.documentMessage.url,
             "mediaKey"       : data.documentMessage.mediaKey,
             "mimetype"       : data.documentMessage.mimetype,
         }
        return message
     }


     if(data.audioMessage){
         let message
         message = { 
             "id"              : key2,
             "message"         :  "Audio", 
             "time"            : "01:05", 
             "userType"        : userType, 
             "isImageMessage"  : false,
             "isFileMessage"   : false, 
             "isAudioMessage"  : true, 
             "isVideoMessage"  : false, 
             "base64Audio"     : false,
             "fileAudio"       : "audio.mp3", 
             "size"            : `${data.audioMessage.fileLength} Kb`,
             "url"             : data.audioMessage.url,
             "mediaKey"        : data.audioMessage.mediaKey,
             "mimetype"        : data.audioMessage.mimetype,
         }
        return message
     }



     if(data.videoMessage){
         let message
         message = { 
             "id"              : key2,
             "message"         :  "Video", 
             "time"            : "01:05", 
             "userType"        : userType, 
             "isImageMessage"  : false,
             "isFileMessage"   : false, 
             "isAudioMessage"  : false,
             "isVideoMessage"  : true, 
             "fileVideo"       : "video.mp4", 
             "base64Video"     : false,
             "size"            : `${data.videoMessage.fileLength} Kb`,
             "url"             : data.videoMessage.url,
             "mediaKey"        : data.videoMessage.mediaKey,
             "mimetype"        : data.videoMessage.mimetype,
             "jpegThumbnail"   : data.videoMessage.jpegThumbnail
         }
        return message
     }


     if(data.extendedTextMessage){
         let message
         message = { 
             "id"              : key2,
             "message"         : data.extendedTextMessage.text,
             "description"     : data.extendedTextMessage.description,
             "link"            : data.extendedTextMessage.matchedText,
             "time"            : "01:05", 
             "userType"        : userType, 
             "isImageMessage"  : false,
             "isFileMessage"   : false, 
             "isAudioMessage"  : false,
             "isVideoMessage"  : false,
             "jpegThumbnail"   : data.extendedTextMessage.jpegThumbnail
         }

         if(userType == "sender"){
           message.nameUser = userName
         }
        return message
     }

     if(data.locationMessage){
         let message
         message = { 
             "id"                 : key2,
             "message"            : data.locationMessage.name,
             "address"            : data.locationMessage.address,
             "degreesLatitude"    : data.locationMessage.degreesLatitude,
             "degreesLongitude"   : data.locationMessage.degreesLongitude,
             "time"               : "01:05", 
             "userType"           : userType, 
             "isImageMessage"     : false,
             "isFileMessage"      : false, 
             "isAudioMessage"     : false,
             "isVideoMessage"     : false,
             "jpegThumbnail"      : data.locationMessage.jpegThumbnail
         }
        return message
     }



     if(data.contactMessage){
         let message
         message = { 
             "id"                 : key2,
             "message"            : "Contacto",
             "displayName"        : data.contactMessage.displayName,
             "time"               : "01:05", 
             "userType"           : userType, 
             "isImageMessage"     : false,
             "isFileMessage"      : false, 
             "isAudioMessage"     : false,
             "isVideoMessage"     : false,
             "vcard"              : data.contactMessage.vcard
         }
        return message
     }

}

export default WhatsApp



