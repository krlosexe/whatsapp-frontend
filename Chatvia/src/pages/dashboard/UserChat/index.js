import React, { useState,useEffect, useRef } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter, Alert, Spinner } from "reactstrap";
import { connect } from "react-redux";

import SimpleBar from "simplebar-react";

import { withRouter } from 'react-router-dom';

//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
import ImageList from "./ImageList";
import ChatInput from "./ChatInput";
import FileList from "./FileList";
import AudioList from "./AudioList";
import VideoList from "./VideoList";
import LinkList from "./LinkList";
import LocationList from "./LocationList";
import ContactList from "./ContactList";

//actions
import { openUserSidebar,setFullUser } from "../../../redux/actions";

//Import Images
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';

import {WhatsAppService} from '../../../services'

import {base_url, ApiWhatsapp} from '../../../Env'


import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

import socketIOClient from "socket.io-client";
const ENDPOINT = `${ApiWhatsapp}/`;


const window = (new JSDOM('')).window
const DOMPurify = createDOMPurify(window)


function UserChat(props) {
    
    const ref = useRef()
 
    const [modal, setModal]                    = useState(false)
    const [OpenReply, setOpenReply]            = useState(false)
    const [Message, setMessage]                = useState(false)
    const [NameContat, setNameContac]          = useState(false)
    const [NumberContac, setNumberContac]      = useState(false)
    const [Quoted, setQuoted]                  = useState(false)
    const [MessageForward, setMessageForward]  = useState([])

    let ContactsForward = []
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation()

    //demo conversation messages
    //userType must be required
    const [ allUsers ] = useState(props.recentChatList)
    //const [ chatMessages, setchatMessages ] = useState([])
    const [chatMessages, setchatMessages] = useState(props.recentChatList[props.active_user].messages);
    const [ Cursor, setCursor ] = useState("0")

    const [ Load, setLoad ] = useState(false)



    useEffect(() => {
        const socket = socketIOClient(ENDPOINT)

        socket.on("chat-update", data => {
            NewMessage(data)
        })
    }, [])


    useEffect(() => {

       // setchatMessages([])
        setchatMessages(props.recentChatList[props.active_user].messages);

        if(props.recentChatList[props.active_user].messages.length > 0){
            setCursor({
                fromMe : props.recentChatList[props.active_user].messages[0].key.fromMe,
                id     : props.recentChatList[props.active_user].messages[0].key.id,
            })
        }
       
        //getChats("0")
       
        if(localStorage.getItem("rol") != "administrador"){
            WhatsAppService.ChatRead(props.recentChatList[props.active_user].jid)
        }
        

        localStorage.setItem("active_user", props.active_user)

        ref.current.recalculate()
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }

        setQuoted(false)
    },[props.active_user, props.recentChatList])



    const AddContactsForward = (check, jid) =>{
        if(check){
            ContactsForward.push(jid)
        }else{
            if(ContactsForward.length > 0){
                for( var i = 0; i < ContactsForward.length; i++){ 
                    if ( ContactsForward[i] === jid) { 
                        ContactsForward.splice(i, 1); 
                    }
                }
            }
        }
    }



    const toggle = (modal, data) => {
        setMessageForward(data.chat)
        setModal(modal)
    }


    const Forward = () =>{
        WhatsAppService.ForwardingMessages(ContactsForward, MessageForward)
        setModal(false)
    }



    const NewMessage = async (data) => {

        

        if(data.messages){
           // console.log(data, "STATUS READ 1")
            if(data.messages[0].status == "READ"){
                //console.log(data.messages[0].key.id, "STATUS READ 2")
                //console.log(chatMessages, "chatMessages")
            }
        }

        
        if(data.hasNewMessage && data.jid != 'status@broadcast'){

            let userType
            if(data.messages[0].key.fromMe == false){
                userType = "receiver"
            }else{
                userType = "sender"
            }

            let message = false
            if(data.messages[0].message){
                await WhatsAppService.ProcessMessage(data.messages[0].message, chatMessages.length+1, userType).then((data)=>{
                    message = data
                })
            }
                
            if(message){
                const conversation = props.recentChatList.find( item => item.jid == data.jid )

                if(conversation){
                    conversation.messages.push(message)
                    if(props.recentChatList[parseInt(localStorage.getItem("active_user"))].jid == data.jid){
                        if(userType == "receiver"){
                            setchatMessages([...conversation.messages, ...chatMessages])  
                        }
                    }
                }else{

                    //console.log("FALTA CREAR EL CHAT")

                    // let message = { 
                    //     "id":  1, 
                    //     "message": data.messages[0].message.conversation, 
                    //     "time": "01:05",
                    //     "userType": "receiver",
                    //     "isImageMessage" : false, 
                    //     "isFileMessage" : false 
                    // }
                    
                    // const chat = {
                    //     "id"             : 0,
                    //     "jid"            : data.jid,
                    //     "advisor"        : data.advisor,
                    //     "isGroup"        : false,
                    //     "messages"       : [message],
                    //     "name"           :  data.jid,
                    //    // "profilePicture" : item.imgUrl != "" ? item.imgUrl : "Null",
                    //    "profilePicture" :  "Null",
                    //     "roomType"       : "contact",
                    //     "status"         : "online",
                    //     "unRead"         : 1
                    // } 

                    // let filtered = [...[chat], ...props.recentChatList]

                    // filtered.map((item, key)=>{
                    //     item.id = key
                    // })

                    // this.setState({
                    //     recentChatList : filtered
                    // });

                }
                
            }
            
        }
        
    }



    function urlify(text){ 
        var urlRegex = /(https?:\/\/[^\s]+)/g; 
        return text.replace(urlRegex, function(url) { 
            return '<a target="_blank" href="' + url.replace('<br', '') + '">' + url.replace('<br', '') + '</a>'; 
        }) 
    }


    const getChats = async (cursor) => {

        setLoad(true)
        await WhatsAppService.GetConversation(props.recentChatList[props.active_user].jid, cursor).then((data)=>{
            setCursor(data.cursor)
            setLoad(false)
            if(cursor == "0"){
                console.log(data.messages, "DATA:MESSAGES")
                setchatMessages(data.messages)
            }else{
                setchatMessages([...data.messages, ...chatMessages])
            }
        })
    };

    const addMessage = (message, type) => {
        var messageObj = null;

        const user = props.recentChatList[props.active_user].jid

        let d = new Date()
        var n = d.getSeconds()

        //matches the message type is text, file or image, and create object according to it
        switch (type) {
            case "textMessage":
                messageObj = {
                    id : chatMessages.length+1,
                    message : message,
                    time : "00:" + n,
                    userType : "sender",
                    image : avatar4,
                    isFileMessage : false,
                    isImageMessage : false,
                    quoted : Quoted
                }

                WhatsAppService.SendMmessageText(messageObj, user)

                break;

            case "fileMessage":
                messageObj = {
                    id : chatMessages.length+1,
                    message : 'file',
                    fileMessage : message.name,
                    size : message.size,
                    time : "00:" + n,
                    userType : "sender",
                    image : avatar4,
                    isFileMessage : true,
                    isImageMessage : false,
                    quoted : Quoted
                }

                console.log(message.fileBase64)
                console.log(message.type_file)
                console.log(message.extenxion)

                WhatsAppService.SendMmessageDocuments(message.fileBase64, user, message.extenxion)

                break;

            case "imageMessage":
                var imageMessage = [
                    { image : message },
                ]

                console.log(message)

                messageObj = {
                    id : chatMessages.length+1,
                    message : 'image',
                    imageMessage : imageMessage,
                    size : message.size,
                    time : "00:" + n,
                    userType : "sender",
                    image : avatar4,
                    isImageMessage : true,
                    isFileMessage : false,
                    quoted : Quoted
                }   

                WhatsAppService.SendMmessageImage(message, user)

                break;



                case "AudioMessage":

                    messageObj = {
                        "id"              : chatMessages.length+1,
                        "message"         :  "Audio", 
                        "time"            : "01:05", 
                        "userType"        : 'sender', 
                        "isImageMessage"  : false,
                        "isFileMessage"   : false, 
                        "isAudioMessage"  : true, 
                        "isVideoMessage"  : false, 
                        "fileAudio"       : "audio.mp3", 
                        "size"            : `100 Kb`,
                        "url"             : false,
                        'base64Audio'     : message,
                        "mediaKey"        : false,
                        "mimetype"        : false,
                        "quoted" : Quoted
                    } 

                    WhatsAppService.SendMmessageAudio(message, user)

                break;

                case "VideoMessage":

                    messageObj = {
                        "id"              : chatMessages.length+1,
                        "message"         :  "Video", 
                        "time"            : "01:05", 
                        "userType"        : "sender", 
                        "isImageMessage"  : false,
                        "isFileMessage"   : false, 
                        "isAudioMessage"  : false,
                        "isVideoMessage"  : true, 
                        "fileVideo"       : "video.mp4", 
                        'base64Video'     : message,
                        "size"            : `100 Kb`,
                        "url"             : false,
                        "mediaKey"        : false,
                        "mimetype"        : false,
                        "jpegThumbnail"   : false,
                        "quoted" : Quoted
                    } 

                    WhatsAppService.SendMmessageVideo(message, user)
                    
                break;
        
            default:
                break;
        }


        setQuoted(false)
        setOpenReply(false)

        

        //add message object to chat        
        setchatMessages([...chatMessages, messageObj])

        let copyallUsers = [...allUsers];
        copyallUsers[props.active_user].messages = [...chatMessages, messageObj];
        copyallUsers[props.active_user].isTyping = false;
        props.setFullUser(copyallUsers)

        scrolltoBottom()
    }

    function scrolltoBottom(){

        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }


    const deleteMessage = (id) => {
        let conversation = chatMessages;

        var filtered = conversation.filter(function (item) {
            return item.id !== id;
        })

        setchatMessages(filtered)
    }   


    const Reply = (data) => {
        setOpenReply(true)
        setMessage(data.message)
        setNameContac(props.recentChatList[props.active_user].name)
        setNumberContac(props.recentChatList[props.active_user].jid.split("@")[0])
        setQuoted(data.chat)
    }

    const SearchContact =(props)=> {
         const conversation = props.chats.find( item => item.jid == props.jid)
         if(conversation){
            return conversation.name
         }else{
             return props.jid.split("@")[0]
         }
         
    }


    const DateTime = (props) =>{    
        const datetime = parseInt(props.datetime)
        const date     = new Date(datetime * 1000)
        const day      = date.getDate()
        const month    = date.getMonth() + 1
        const year     = date.getFullYear()
        const time     = `${date.getHours()}:${date.getMinutes()}`

        console.log(time, "datetime")
        return `${day}/${month}/${year} ${time}`
    }

  

    

    const onDismiss = () => setOpenReply(false)


    
    return (
        <React.Fragment>
            <div className="user-chat w-100">
                
                <div className="d-lg-flex">

                    <div className={ props.userSidebar ? "w-70" : "w-100" }>

                        {/* render user head */}
                        <UserHead chats={props.recentChatList} users_advisers = {props.users_advisers}/> 

                            <SimpleBar
                                style={{ maxHeight: "100%" }}
                                ref={ref}
                                className="chat-conversation p-3 p-lg-4"
                                id="messages">
                            <ul className="list-unstyled mb-0">

                            

                            <center>
                                {Load &&
                                    <Spinner color="primary" />
                                }
                                {!Load &&
                                    <Button onClick={() => getChats(Cursor)} color="primary">Cargar Más</Button>
                                }

                            </center>
                            

                            
                                
                                {
                                    chatMessages.map((chat, key) => 
                                        // chat.isToday && chat.isToday === true ? <li key={"dayTitle" + key}> 
                                        //     <div className="chat-day-title">
                                        //         <span className="title">Today</span>
                                        //     </div>
                                        // </li> : 

                                        (chat) ? 

                                            (props.recentChatList[props.active_user].id && props.recentChatList[props.active_user].isGroup === true) ? 
                                            <li key={key} className={chat.userType === "sender" ? "right" : ""}>
                                                <div className="conversation-list">
                                                    
                                                    <div className="chat-avatar">
                                                    {chat.userType === "sender" ?   <img src={avatar1} alt="chatvia" /> : 
                                                        props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                <div className="chat-user-img align-self-center mr-3">
                                                                            <div className="avatar-xs">
                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                    {chat.userName && chat.userName.charAt(0)}                                                                                    
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                        :  <img src={props.recentChatList[props.active_user].profilePicture} alt="chatvia" />
                                                    }
                                                    </div>
                
                                                    <div className="user-chat-content">
                                                        <div className="ctext-wrap">
                                                            <div className="ctext-wrap-content">
                                                                {
                                                                    chat.message &&
                                                                        <p className="mb-0">
                                                                        { <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(chat.message) }} /> }
                                                                        </p>
                                                                }
                                                                {
                                                                    chat.imageMessage &&
                                                                        // image list component
                                                                        <ImageList images={chat.imageMessage} />
                                                                }
                                                                {
                                                                    chat.fileMessage &&
                                                                        //file input component
                                                                        <FileList fileName={chat.fileMessage} fileSize={chat.size} url = {chat.url} mediaKey={chat.mediaKey} mimetype={chat.mimetype}  />
                                                                }
                                                                {
                                                                    chat.isTyping &&
                                                                        <p className="mb-0">
                                                                            typing
                                                                            <span className="animate-typing">
                                                                                <span className="dot ml-1"></span>
                                                                                <span className="dot ml-1"></span>
                                                                                <span className="dot ml-1"></span>
                                                                            </span>
                                                                        </p>
                                                                }
                                                                {
                                                                    !chat.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{chat.time}</span></p>
                                                                }

                                                            
                                                            </div>
                                                            {
                                                                !chat.isTyping &&
                                                                    <UncontrolledDropdown className="align-self-start">
                                                                        <DropdownToggle tag="a">
                                                                            <i className="ri-more-2-fill"></i>
                                                                        </DropdownToggle>
                                                                        <DropdownMenu>
                                                                            <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem>{t('Save')} <i className="ri-save-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={() => deleteMessage(chat.id) }>Delete <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                            }
                                                            
                                                        </div>
                                                        {
                                                            <div className="conversation-name">{chat.userType === "sender" ? "" : chat.userName}</div>
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        :


                                            <li key={key} className={chat.userType === "sender" ? "right" : ""}>
                                                <div className="conversation-list">
                                                        {
                                                            //logic for display user name and profile only once, if current and last messaged sent by same receiver
                                                            chatMessages[key+1] ? chatMessages[key].userType === chatMessages[key+1].userType ? 
                                                            
                                                            <div className="chat-avatar">
                                                                <div className="blank-div"></div>
                                                            </div>
                                                            :  
                                                                <div className="chat-avatar">
                                                                    {chat.userType === "sender" ?   <img src={avatar1} alt="chatvia" /> : 
                                                                        props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                                <div className="chat-user-img align-self-center mr-3">
                                                                                            <div className="avatar-xs">
                                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                    {props.recentChatList[props.active_user].name.charAt(0)}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                        :  <img src={props.recentChatList[props.active_user].profilePicture} alt="chatvia" />
                                                                    }
                                                                </div>
                                                            :   <div className="chat-avatar">
                                                                    {chat.userType === "sender" ?   <img src={avatar1} alt="chatvia" /> : 
                                                                        props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                                <div className="chat-user-img align-self-center mr-3">
                                                                                            <div className="avatar-xs">
                                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                    {props.recentChatList[props.active_user].name.charAt(0)}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                        :  <img src={props.recentChatList[props.active_user].profilePicture} alt="chatvia" />
                                                                    }
                                                                </div>
                                                        }
                                                    
                
                                                    <div className="user-chat-content">
                                                        
                                                        {chat.userType == "sender" && 
                                                            <p>{chat.nameUser}</p>
                                                        }
                                                        
                                                        <div className="ctext-wrap">
                                                            <div className="ctext-wrap-content">



                                                                {chat.participant &&
                                                                    <SearchContact jid={chat.participant} chats = {props.recentChatList}/>
                                                                }


                                                                {chat.quotedMessage &&

                                                                    (chat.quotedMessage.contextInfo) ? 

                                                                        (chat.quotedMessage.contextInfo.quotedMessage) ?
                                                                    
                                                                            <Alert color="dark">

                                                                               {chat.quotedMessage.contextInfo.participant == process.env.REACT_APP_NUMBER_PHONE &&
                                                                                 <p>Yo</p>
                                                                               }

                                                                               {chat.quotedMessage.contextInfo.participant != process.env.REACT_APP_NUMBER_PHONE &&
                                                                                 <p>
                                                                                     
                                                                                     
                                                                                     
                                                                                     
                                                                                     <SearchContact jid={chat.quotedMessage.contextInfo.participant} chats = {props.recentChatList}/></p>
                                                                               }

                                                                                <p>{chat.quotedMessage.contextInfo.quotedMessage.conversation}</p>
                                                                            </Alert>
                                                                        :
                                                                        <p></p>

                                                                    :
                                                                    <p></p>
                                                                    
                                                                }




                                                                    {chat.quotedMessage &&

                                                                    (chat.quotedMessage.contextInfo) ? 

                                                                        (chat.quotedMessage.contextInfo.isForwarded) ?

                                                                            <small>Reenviado</small>
                                                                        :
                                                                        <p></p>

                                                                    :
                                                                    <p></p>

                                                                    }


                                                               

                                                                { chat.description &&
                                                                    <LinkList image={chat.jpegThumbnail} description = {chat.description} link = {chat.link} />

                                                                }
                                                                {
                                                                    chat.message &&
                                                                    <div dangerouslySetInnerHTML={{ __html: urlify(chat.message.replace(/\n/g, '<br />'))}} /> 
                                                                }


                                                                {
                                                                    chat.address &&
                                                                    <p> {chat.address} </p> 
                                                                }



                                                                {
                                                                    chat.vcard &&
                                                                    <ContactList name={chat.displayName} />
                                                                }





                                                                {
                                                                    chat.imageMessage &&
                                                                        // image list component
                                                                        <ImageList images={chat.imageMessage} />
                                                                }
                                                                {
                                                                    chat.fileMessage &&
                                                                        //file input component
                                                                        <FileList fileName={chat.fileMessage} fileSize={chat.size} url = {chat.url} mediaKey={chat.mediaKey} mimetype={chat.mimetype}/>
                                                                }


                                                                {
                                                                    chat.fileAudio &&
                                                                        //audio input component
                                                                        <AudioList fileName={chat.fileMessage} fileSize={chat.size} url = {chat.url} mediaKey={chat.mediaKey} mimetype={chat.mimetype} base64 = {chat.base64Audio}/>
                                                                }


                                                                {
                                                                    chat.fileVideo &&
                                                                        //video input component
                                                                        <VideoList fileName={chat.fileMessage} fileSize={chat.size} url = {chat.url} mediaKey={chat.mediaKey} poster = {chat.jpegThumbnail} base64Video = {chat.base64Video}/>
                                                                }

                                                                {
                                                                    chat.degreesLatitude &&
                                                                        //location input component
                                                                        <LocationList image={chat.jpegThumbnail} degreesLatitude={chat.degreesLatitude} degreesLongitude = {chat.degreesLongitude}/>
                                                                }


                                                            






                                                                
                                                                {
                                                                    chat.isTyping &&
                                                                        <p className="mb-0">
                                                                            typing
                                                                            <span className="animate-typing">
                                                                                <span className="dot ml-1"></span>
                                                                                <span className="dot ml-1"></span>
                                                                                <span className="dot ml-1"></span>
                                                                            </span>
                                                                        </p>
                                                                }
                                                                {
                                                                    !chat.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle"><DateTime datetime = {chat.messageTimestamp} /></span></p>
                                                                }
                                                            </div>
                                                            {
                                                                !chat.isTyping &&
                                                                    <UncontrolledDropdown className="align-self-start">
                                                                        <DropdownToggle tag="a">
                                                                            <i className="ri-more-2-fill"></i>
                                                                        </DropdownToggle>
                                                                        <DropdownMenu>
                                                                            <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={() => {Reply(chat)}}>{t('Reply')} <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={()=>toggle(true, chat)}>Forward <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={() => deleteMessage(chat.id) }>Delete <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                            }
                                                                
                                                        </div>
                                                        

                                                        {chat.userType === "sender" && chat.status == "READ" &&
                                                            <p className="color-blue"><i class="ri-check-double-line"></i></p>
                                                        }


                                                        {chat.userType === "sender" && chat.status == "DELIVERY_ACK" &&
                                                            <p><i class="ri-check-double-line"></i></p>
                                                        }

                                                        {chat.userType === "sender" && chat.status == "SERVER_ACK" &&
                                                            <p><i class="ri-check-line"></i></p>
                                                        }


                                                    


                                                        {
                                                            chatMessages[key+1] ? chatMessages[key].userType === chatMessages[key+1].userType ? null :  <div className="conversation-name">{chat.userType === "sender" ? "" : props.recentChatList[props.active_user].name}</div> : <div className="conversation-name">{chat.userType === "sender" ? "Admin" : props.recentChatList[props.active_user].name}</div>
                                                        }
                                                        {/* {
                                                            <div className="conversation-name">{chat.userType === "sender" ? "Admin" : props.recentChatList[props.active_user].name}</div>
                                                        } */}

                                                    </div>
                                                </div>
                                            </li>
                                        :

                                        <li></li>

                                        
                                    )
                                }
                                 </ul>
                                </SimpleBar>



                                <Modal backdrop="static" isOpen={modal} centered>
                                    <ModalHeader toggle={()=>setModal(false)}>Reenviar a ...</ModalHeader>
                                    <ModalBody>
                                        <CardBody className="p-2">
                                            <SimpleBar style={{maxHeight: "200px"}}>
                                                <SelectContact handleCheck={(e, jid) => AddContactsForward(e.target.checked, jid)}  contact = {props.recentChatList} />
                                            </SimpleBar>
                                            <ModalFooter className="border-0">
                                                <Button color="primary" onClick = {()=>Forward()}>Reenviar</Button>
                                            </ModalFooter>
                                        </CardBody>
                                    </ModalBody>
                                </Modal>

                       

                        {OpenReply &&
                            <Alert color="dark" toggle={onDismiss}>
                                <p>{NumberContac && NumberContac} - { NameContat && NameContat }</p>
                                {Message && <p>{Message}</p>}   
                            </Alert>
                        }
                        <ChatInput onaddMessage={addMessage} />

                       
                       
                    </div>

                    <UserProfileSidebar activeUser={props.recentChatList[props.active_user]} />

                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    const { userSidebar } = state.Layout;
    return { active_user,userSidebar };
};

export default withRouter(connect(mapStateToProps, { openUserSidebar,setFullUser })(UserChat))

