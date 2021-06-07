import React, {useEffect, useState} from 'react';

//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";
import axios from 'axios';

import WhatsApp from '../../services/whasatpp'

import img4 from "../../assets/images/small/img-4.jpg";


    function Index(props){

        const [Conversations, setConversations] = useState([]);

        useEffect(() => {
            const GetData = async ()=>{
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
                                
                                console.log("INIT IMAGE")
                                if(item2.message.imageMessage){
                                    let message
                                   
                                   
                                   /* var bodyFormData = new FormData();
                                    bodyFormData.append('mediakey', item2.message.imageMessage.mediaKey)
                                    bodyFormData.append('filenc', item2.message.imageMessage.url)


                                    const reponse = await axios({ method: "post",
                                                                  url: "http://31.220.60.218:5000/decrypt",
                                                                  data: bodyFormData,
                                                                  headers: { "Content-Type": "multipart/form-data" }})
                                    .then(async function (response) {

                                        

                                        return response.file
                                    })
                                    .catch(function (response) {console.log(response);
                                    });*/


                                    message = { 
                                        "id"             : key2, "message": item2.message.conversation, 
                                        "time"           : "01:05", "userType": userType, 
                                        "isImageMessage" : true, 
                                        "isFileMessage"  : false,
                                        "imageMessage"   : [ { 
                                            image : item2.message.imageMessage.jpegThumbnail
                                       } ]
                                    }
                                   await messages.push(message)



                                   // console.log(response, "IMAGEN")

                                    console.log("FINISH IMAGE")
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
                            console.log(conversations, "conversations")
                            await Chats.push(conversations)
                        }
                        
                    })


                    console.log(Chats, "CHATS")

                   await setConversations(Chats)
                    
                } catch (error) {
                    console.log(error)
                }
            }
            GetData()
        }, []);

        return (
            <React.Fragment>
                {/* chat left sidebar */}
                <ChatLeftSidebar recentChatList={Conversations} />
                {/* user chat */}
                {Conversations.length > 0 &&
                    <UserChat recentChatList={Conversations} />
                }
            </React.Fragment>
        );
    }


const mapStateToProps = (state) => {
    const { users } = state.Chat;
    return { users };
};

export default connect(mapStateToProps, {  })(Index);