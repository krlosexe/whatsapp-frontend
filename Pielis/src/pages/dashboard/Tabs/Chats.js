import React, { Component } from 'react';
import { Input, InputGroupAddon, InputGroup, Media, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

//simplebar
import SimpleBar from "simplebar-react";

//actions
import { setconversationNameInOpenChat, activeUser } from "../../../redux/actions"

//components
import OnlineUsers from "./OnlineUsers";


import {WhatsAppService} from '../../../services'

import {base_url, ApiWhatsapp} from '../../../Env'

import socketIOClient from "socket.io-client";
const ENDPOINT = `${ApiWhatsapp}/`;


class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchChat : "",
            recentChatList : this.props.recentChatList,
            ActiveUser     : 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.openUserChat = this.openUserChat.bind(this);

    }

    ResetTyping(jid){

        setTimeout(()=>{
            this.state.recentChatList.map((item, key)=>{
                if(item.jid == jid){
                    item.isTyping = false
                }
                
            })
    
            this.setState({
                recentChatList : this.state.recentChatList
            });
        }, 5000)
    }


    NewMessage(data){
         console.log(data, "NEW MESSAGE")
        // console.log("QUE PASO ¿?")


        if(data.presences){
            const precense = JSON.parse(JSON.stringify(data.presences).replace(`${data.jid}`, "contact"))

            //console.log(precense, "precense")

            if(precense.contact){
                const type     = precense.contact.lastKnownPresence

              //  console.log(type, "type")
                if(type == "composing"){
                  //  console.log(data.jid, "composing")
                    this.state.recentChatList.map((item, key)=>{
                        if(item.jid == data.jid){
                            item.isTyping = true
                        }
                        
                    })

                    this.setState({
                        recentChatList : this.state.recentChatList
                    });

                    this.ResetTyping(data.jid)
                
                }
            }

           // console.log(precense, "precense")
            
            
        }

        

        if(data.hasNewMessage && data.jid != 'status@broadcast'){

            if(data.messages[0].key.fromMe){
              //  WhatsAppService.RegisterChat(data.jid, data.messages[0])
            }
            if(!data.messages[0].key.fromMe){

               // WhatsAppService.RegisterChat(data.jid, data.messages[0])

                const conversationNew  = this.state.recentChatList.find( item => item.jid == data.jid )
                
               // console.log(conversationNew)
                let message = false
                if(conversationNew){
                    conversationNew.unRead = 1
                    conversationNew.id = 0

                    if(data.messages[0].message.conversation){
                        message = { 
                            "id":  conversationNew.messages.length + 1, 
                            "message": data.messages[0].message.conversation, 
                            "time": "01:05",
                            "userType": "receiver",
                            "isImageMessage" : false, 
                            "isFileMessage" : false 
                        }

                        let icon
                        if(conversationNew.profilePicture != "Null"){
                            icon =  conversationNew.profilePicture
                        }else{
                            icon =  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
                        }

                        var options = {
                            body: data.messages[0].message.conversation,
                            icon: conversationNew.profilePicture
                        }
                       new Notification(conversationNew.name, options)

                    }
                    


                    if(data.messages[0].message.imageMessage){
                        message = { 
                            "id":  conversationNew.messages.length + 1, 
                            "message": "..", 
                            "time"            : "01:05", 
                            "userType": "receiver", 
                            "isImageMessage"  : true, 
                            "isFileMessage"   : false,
                            "isAudioMessage"  : false,
                            "isVideoMessage"  : false,
                            "imageMessage"    : [ { 
                                image : data.messages[0].message.imageMessage.jpegThumbnail,
                                "url"            : data.messages[0].message.imageMessage.url,
                                "mediaKey"       : data.messages[0].message.imageMessage.mediaKey,
                            } ]
                        }
                    
                    }


                    if(message){
                   
                        if(this.state.recentChatList[parseInt(localStorage.getItem("active_user"))].jid != data.jid){
                            //console.log(this.state.recentChatList)
                            //console.log("LEFT ENTRO")
                            //console.log(this.state.recentChatList[parseInt(localStorage.getItem("active_user"))])
                            //console.log(parseInt(localStorage.getItem("active_user")))
    
                            //conversationNew.messages.push(message)
                        }
                        
                        let filtered = this.state.recentChatList.filter(function(item) { return item.jid != data.jid });
                        filtered.unshift(conversationNew)
                        
    
                        filtered.map((item, key)=>{
                            item.id = key
                        })

                        
    
                        this.setState({
                            recentChatList : filtered
                        });

                        

    
                    }

                }else{


                    let message = { 
                        "id":  1, 
                        "message": data.messages[0].message.conversation, 
                        "time": "01:05",
                        "userType": "receiver",
                        "isImageMessage" : false, 
                        "isFileMessage" : false 
                    }
                    
                    const chat = {
                        "id"             : 0,
                        "jid"            : data.jid,
                        "advisor"        : data.advisor,
                        "isGroup"        : false,
                        "messages"       : [message],
                        "name"           :  data.jid,
                       // "profilePicture" : item.imgUrl != "" ? item.imgUrl : "Null",
                       "profilePicture" :  "Null",
                        "roomType"       : "contact",
                        "status"         : "online",
                        "unRead"         : 1
                    } 

                    

                    if(localStorage.getItem("rol") == "administrador"){

                        let filtered = [...[chat], ...this.state.recentChatList]
                        filtered.map((item, key)=>{
                            item.id = key
                        })

                        this.setState({
                            recentChatList : filtered
                        });

                        new Notification("Mensaje nuevo: "+data.jid.split("@")[0])
                    }else{
                        console.log(data.advisor, "data.advisor")
                        if(localStorage.getItem("user_id") == data.advisor){

                            let filtered = [...[chat], ...this.state.recentChatList]
                            filtered.map((item, key)=>{
                                item.id = key
                            })

                            this.setState({
                                recentChatList : filtered
                            });

                            new Notification("Mensaje nuevo: "+data.jid.split("@")[0])
                        }
                    }
                    
                }
                
            }
            
        }
        
    }


    componentDidMount() {

        var li = document.getElementById("conversation" + this.props.active_user);
        if(li){
            li.classList.add("active");
        }

        const socket = socketIOClient(ENDPOINT);

        socket.on("chat-update", data => {
            this.NewMessage(data)
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
        //   this.setState({
        //     recentChatList : this.props.recentChatList
        //   });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.recentChatList !== nextProps.recentChatList) {
            this.setState({
                recentChatList: nextProps.recentChatList,
            });
        }
    }

    handleChange(e)  {
        this.setState({ searchChat : e.target.value });
        var search = e.target.value;
        let conversation = this.state.recentChatList;
        let filteredArray = [];
        
        //find conversation name from array
        for (let i = 0; i < conversation.length; i++) {
            if(conversation[i].name.toLowerCase().includes(search) || conversation[i].name.toUpperCase().includes(search))
                filteredArray.push(conversation[i]);
        }

        //set filtered items to state
        this.setState({ recentChatList : filteredArray })

        //if input value is blanck then assign whole recent chatlist to array
        if(search === "") this.setState({ recentChatList : this.props.recentChatList })
    }

    openUserChat(e,chat) {

        e.preventDefault();

        //find index of current chat in array
        var index = this.props.recentChatList.indexOf(chat);

        this.setState({ ActiveUser : chat.id })
  
        // set activeUser 
        this.props.activeUser(index);

        var chatList = document.getElementById("chat-list");
        var clickedItem = e.target;
        var currentli = null;

        if(chatList) {
            var li = chatList.getElementsByTagName("li");
            //remove coversation user
            for(var i=0; i<li.length; ++i){
                if(li[i].classList.contains('active')){
                    li[i].classList.remove('active');
                }
            }
            //find clicked coversation user
            for(var k=0; k<li.length; ++k){
                if(li[k].contains(clickedItem)) {
                    currentli = li[k];
                    break;
                } 
            }
        }

        //activation of clicked coversation user
        if(currentli) {
            currentli.classList.add('active');
        }

        var userChat = document.getElementsByClassName("user-chat");
        if(userChat) {
            userChat[0].classList.add("user-chat-show");
        }

        //removes unread badge if user clicks
        var unread = document.getElementById("unRead" + chat.id);
        if(unread) {
            unread.style.display="none";
        }
    }


     DateTime(messageTimestamp){    
        const datetime = parseInt(messageTimestamp)
        const date     = new Date(datetime * 1000)
        const day      = date.getDate()
        const month    = date.getMonth() + 1
        const year     = date.getFullYear()
        const time     = `${date.getHours()}:${date.getMinutes()}`

        console.log(time, "datetime")
        return `${day}/${month}/${year} ${time}`
    }


    
    render() {
        return (
            <React.Fragment>
                        <div>
                            <div className="px-4 pt-4">
                                <h4 className="mb-4">Chats</h4>
                                <div className="search-box chat-search-box">
                                    <InputGroup size="lg" className="mb-3 bg-light rounded-lg">
                                        <InputGroupAddon addonType="prepend">
                                            <Button color="link" className="text-muted pr-1 text-decoration-none" type="button">
                                                <i className="ri-search-line search-icon font-size-18"></i>
                                            </Button>
                                        </InputGroupAddon>
                                        <Input type="text" value={this.state.searchChat} onChange={(e) => this.handleChange(e)} className="form-control bg-light" placeholder="Search messages or users" />
                                    </InputGroup> 
                                </div>
                                {/* Search Box */}
                            </div> 

                            {/* online users */}
                            {/* <OnlineUsers /> */}

                            {/* Start chat-message-list  */}
                            <div className="px-2">
                                <h5 className="mb-3 px-3 font-size-16">Recent</h5>
                                <SimpleBar style={{ maxHeight: "100%" }} className="chat-message-list">

                                    <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
                                        {
                                            this.state.recentChatList.map((chat, key) =>


                                            (chat.advisor) ? 
                                                <li key={key} id={"conversation" + key} className={chat.unRead ? "unread" : chat.isTyping ?  "typing" :  key === this.props.active_user ? "active" : ""}>
                                                    <Link to="#" onClick={(e) => this.openUserChat(e, chat)}>
                                                        <Media>
                                                            {
                                                                chat.profilePicture === "Null" ?
                                                                    <div className={"chat-user-img " + chat.status +" align-self-center mr-3"}>
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                {chat.name.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                        {
                                                                            chat.status &&  <span className="user-status"></span>
                                                                        }
                                                                    </div>
                                                                :
                                                                    <div className={"chat-user-img " + chat.status +" align-self-center mr-3"}>
                                                                        <img src={chat.profilePicture} className="rounded-circle avatar-xs" alt="chatvia" />
                                                                        {
                                                                            chat.status &&  <span className="user-status"></span>
                                                                        }
                                                                    </div>
                                                            }
                                                            
                                                            <Media body className="overflow-hidden">
                                                                <h5 className="text-truncate font-size-15 mb-1">{chat.name}</h5>
                                                                <p className="chat-user-message text-truncate mb-0">
                                                                    {
                                                                        chat.isTyping ?
                                                                        <>
                                                                            typing<span className="animate-typing">
                                                                            <span className="dot ml-1"></span>
                                                                            <span className="dot ml-1"></span>
                                                                            <span className="dot ml-1"></span>
                                                                        </span>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {
                                                                                chat.messages && (chat.messages.length > 0 && chat.messages[(chat.messages).length - 1].isImageMessage === true) ? <i className="ri-image-fill align-middle mr-1"></i> : null
                                                                            }
                                                                            {
                                                                                chat.messages && (chat.messages.length > 0  && chat.messages[(chat.messages).length - 1].isFileMessage === true) ? <i className="ri-file-text-fill align-middle mr-1"></i> : null
                                                                            }
                                                                            {chat.messages && chat.messages.length > 0 ?  chat.messages[(chat.messages).length - 1].message : null}
                                                                       </>
                                                                    }

                                                    
                                                                    
                                                                </p>
                                                            </Media>
                                                            <div className="font-size-11">{chat.messages && chat.messages.length > 0 ?  this.DateTime(chat.messages[(chat.messages).length - 1].messageTimestamp)  : null}</div>
                                                            {chat.unRead === 0 ? null :
                                                                <div className="unread-message" id={"unRead" + chat.id}>
                                                                    <span className="badge badge-soft-danger badge-pill">{chat.messages && chat.messages.length > 0 ? chat.unRead >= 20 ? chat.unRead + "+" : chat.unRead  : ""}</span>
                                                                </div>
                                                            } 
                                                        </Media>
                                                    </Link>
                                                </li>

                                                :

                                                <li></li>
                                            )
                                        }
                                    </ul>
                                    </SimpleBar>
                                    
                            </div>
                            {/* End chat-message-list */}
                        </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    return { active_user };
};

export default connect(mapStateToProps, { setconversationNameInOpenChat, activeUser })(Chats);