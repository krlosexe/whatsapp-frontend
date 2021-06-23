import axios from 'axios';
import React, {useEffect, useState} from 'react';

const WhatsApp = () => ({
    
    GetChats : async () => {
        try {

            const req = 'http://127.0.0.1:3001/whatsapp/get/chats'
                try {
                    const response = await axios.post(req)

                    let Chats = []

                     let count = 0
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

                                //console.log(ProcessMessage(item2.message, key2, userType))
                                //messages.push(ProcessMessage(item2.message, key2, userType))
                               // console.log(messages)

                                if(item2.message.conversation){
                                   let message = { 
                                        "id": key2, "message": item2.message.conversation, "time": "01:05", "userType": userType, "isImageMessage" : false, "isFileMessage" : false 
                                    }

                                   
                                    await messages.push(message)
                                }
                                
                                if(item2.message.imageMessage){
                                    let message
                                   
                                    message = { 
                                        "id"              : key2, "message": item2.message.conversation, 
                                        "time"            : "01:05", "userType": userType, 
                                        "message"         : item2.message.imageMessage.caption,
                                        "isImageMessage"  : true, 
                                        "isFileMessage"   : false,
                                        "isAudioMessage"  : false,
                                        "isVideoMessage"  : false,
                                        "imageMessage"    : [ { 
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
                                        "isFileMessage"   : true, 
                                        "isAudioMessage"  : false, 
                                        "isVideoMessage"  : false,
                                        "fileMessage"    : item2.message.documentMessage.fileName, 
                                        "size"           : `${item2.message.documentMessage.fileLength} Kb`,
                                        "url"            : item2.message.documentMessage.url,
                                        "mediaKey"       : item2.message.documentMessage.mediaKey,
                                        "mimetype"       : item2.message.documentMessage.mimetype,
                                    }
                                   await messages.push(message)
                                }


                                if(item2.message.audioMessage){
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
                                        "size"            : `${item2.message.audioMessage.fileLength} Kb`,
                                        "url"             : item2.message.audioMessage.url,
                                        "mediaKey"        : item2.message.audioMessage.mediaKey,
                                        "mimetype"        : item2.message.audioMessage.mimetype,
                                    }
                                   await messages.push(message)
                                }



                                if(item2.message.videoMessage){
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
                                        "size"            : `${item2.message.videoMessage.fileLength} Kb`,
                                        "url"             : item2.message.videoMessage.url,
                                        "mediaKey"        : item2.message.videoMessage.mediaKey,
                                        "mimetype"        : item2.message.videoMessage.mimetype,
                                        "jpegThumbnail"   : item2.message.videoMessage.jpegThumbnail
                                    }
                                   await messages.push(message)
                                }


                                if(item2.message.extendedTextMessage){
                                    let message
                                    message = { 
                                        "id"              : key2,
                                        "message"         : item2.message.extendedTextMessage.text,
                                        "description"     : item2.message.extendedTextMessage.description,
                                        "link"            : item2.message.extendedTextMessage.matchedText,
                                        "time"            : "01:05", 
                                        "userType"        : userType, 
                                        "isImageMessage"  : false,
                                        "isFileMessage"   : false, 
                                        "isAudioMessage"  : false,
                                        "isVideoMessage"  : false,
                                        "jpegThumbnail"   : item2.message.extendedTextMessage.jpegThumbnail
                                    }
                                   await messages.push(message)
                                }

                                if(item2.message.locationMessage){
                                    let message
                                    message = { 
                                        "id"                 : key2,
                                        "message"            : item2.message.locationMessage.name,
                                        "address"            : item2.message.locationMessage.address,
                                        "degreesLatitude"    : item2.message.locationMessage.degreesLatitude,
                                        "degreesLongitude"   : item2.message.locationMessage.degreesLongitude,
                                        "time"               : "01:05", 
                                        "userType"           : userType, 
                                        "isImageMessage"     : false,
                                        "isFileMessage"      : false, 
                                        "isAudioMessage"     : false,
                                        "isVideoMessage"     : false,
                                        "jpegThumbnail"      : item2.message.locationMessage.jpegThumbnail
                                    }
                                   await messages.push(message)
                                }



                                if(item2.message.contactMessage){
                                    let message
                                    message = { 
                                        "id"                 : key2,
                                        "message"            : "Contacto",
                                        "displayName"        : item2.message.contactMessage.displayName,
                                        "time"               : "01:05", 
                                        "userType"           : userType, 
                                        "isImageMessage"     : false,
                                        "isFileMessage"      : false, 
                                        "isAudioMessage"     : false,
                                        "isVideoMessage"     : false,
                                        "vcard"              : item2.message.contactMessage.vcard
                                    }
                                   await messages.push(message)
                                }



                            }
                            
                        })

                        conversations = {
                            "id"             : count,
                            "jid"            : item.jid,
                            "isGroup"        : false,
                            "messages"       : messages,
                            "name"           : item.name,
                           // "profilePicture" : item.imgUrl != "" ? item.imgUrl : "Null",
                           "profilePicture" :  "Null",
                            "roomType"       : "contact",
                            "status"         : "online",
                            "unRead"         : 0
                        }

                        if(item.name){
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

            
        let messages = []

        await response.messages.map(async (item2, key2)=>{

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
                        "id"              : key2, "message": item2.message.conversation, 
                        "time"            : "01:05", "userType": userType, 
                        "message"         : item2.message.imageMessage.caption,
                        "isImageMessage"  : true, 
                        "isFileMessage"   : false,
                        "isAudioMessage"  : false,
                        "isVideoMessage"  : false,
                        "imageMessage"    : [ { 
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
                        "isFileMessage"   : true, 
                        "isAudioMessage"  : false, 
                        "isVideoMessage"  : false,
                        "fileMessage"    : item2.message.documentMessage.fileName, 
                        "size"           : `${item2.message.documentMessage.fileLength} Kb`,
                        "url"            : item2.message.documentMessage.url,
                        "mediaKey"       : item2.message.documentMessage.mediaKey,
                        "mimetype"       : item2.message.documentMessage.mimetype,
                    }
                   await messages.push(message)
                }


                if(item2.message.audioMessage){
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
                        "size"            : `${item2.message.audioMessage.fileLength} Kb`,
                        "url"             : item2.message.audioMessage.url,
                        "mediaKey"        : item2.message.audioMessage.mediaKey,
                        "mimetype"        : item2.message.audioMessage.mimetype,
                    }
                   await messages.push(message)
                }



                if(item2.message.videoMessage){
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
                        "size"            : `${item2.message.videoMessage.fileLength} Kb`,
                        "url"             : item2.message.videoMessage.url,
                        "mediaKey"        : item2.message.videoMessage.mediaKey,
                        "mimetype"        : item2.message.videoMessage.mimetype,
                        "jpegThumbnail"   : item2.message.videoMessage.jpegThumbnail
                    }
                   await messages.push(message)
                }


                if(item2.message.extendedTextMessage){
                    let message
                    message = { 
                        "id"              : key2,
                        "message"         : item2.message.extendedTextMessage.text,
                        "description"     : item2.message.extendedTextMessage.description,
                        "link"            : item2.message.extendedTextMessage.matchedText,
                        "time"            : "01:05", 
                        "userType"        : userType, 
                        "isImageMessage"  : false,
                        "isFileMessage"   : false, 
                        "isAudioMessage"  : false,
                        "isVideoMessage"  : false,
                        "jpegThumbnail"   : item2.message.extendedTextMessage.jpegThumbnail
                    }
                   await messages.push(message)
                }

                if(item2.message.locationMessage){
                    let message
                    message = { 
                        "id"                 : key2,
                        "message"            : item2.message.locationMessage.name,
                        "address"            : item2.message.locationMessage.address,
                        "degreesLatitude"    : item2.message.locationMessage.degreesLatitude,
                        "degreesLongitude"   : item2.message.locationMessage.degreesLongitude,
                        "time"               : "01:05", 
                        "userType"           : userType, 
                        "isImageMessage"     : false,
                        "isFileMessage"      : false, 
                        "isAudioMessage"     : false,
                        "isVideoMessage"     : false,
                        "jpegThumbnail"      : item2.message.locationMessage.jpegThumbnail
                    }
                   await messages.push(message)
                }



                if(item2.message.contactMessage){
                    let message
                    message = { 
                        "id"                 : key2,
                        "message"            : "Contacto",
                        "displayName"        : item2.message.contactMessage.displayName,
                        "time"               : "01:05", 
                        "userType"           : userType, 
                        "isImageMessage"     : false,
                        "isFileMessage"      : false, 
                        "isAudioMessage"     : false,
                        "isVideoMessage"     : false,
                        "vcard"              : item2.message.contactMessage.vcard
                    }
                   await messages.push(message)
                }



            }
            
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
            user
        }
        console.log(bodyFormData)
        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/send/message/text",
                                        data: bodyFormData})

        return response
    },

    SendMmessageImage : async (image, user) => {
        var bodyFormData = { image, user }
        console.log(bodyFormData)
        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/send/message/image",
                                        data: bodyFormData})

        return response
    },

    SendMmessageAudio : async (audio, user) => {
        var bodyFormData = { audio, user }
        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/send/message/audio",
                                        data: bodyFormData})
        return response
    },

    SendMmessageVideo : async (video, user) => {
        var bodyFormData = {video, user }
        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/send/message/video",
                                        data: bodyFormData})
        return response
    },


    SendMmessageDocuments : async (file, user, extension) => {
        var bodyFormData = {file, extension, user}
        const response = await axios({ method: "post",
                                        url: "http://127.0.0.1:3001/whatsapp/send/message/document",
                                        data: bodyFormData})
        return response
    },



    


}); 


function ProcessMessage(data, key2, userType){



    if(data.conversation){
        let message = { 
             "id": key2, "message": data.conversation, "time": "01:05", "userType": userType, "isImageMessage" : false, "isFileMessage" : false 
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



