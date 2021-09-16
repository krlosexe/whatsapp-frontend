import React, { Component, useState , useEffect} from 'react';
import { Input, InputGroupAddon, InputGroup, Media, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

//simplebar
import SimpleBar from "simplebar-react";

//actions
import { setconversationNameInOpenChat, activeUser } from "../../../redux/actions"

//components
import OnlineUsers from "./OnlineUsers";

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3001/";

function Chats(props) {


    const [searchChat, setsearchChat]     = useState("")
    const [recentChatList, setrecentChatList] = useState([])


    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("chat-update", data => {
            NewMessage(data)
        });
      }, []);



      
    useEffect(() => {

        console.log(recentChatList, "recentChatList")
        var li = document.getElementById("conversation" + props.active_user);
        if(li){
            li.classList.add("active");
        }

        setrecentChatList(props.recentChatList)
      }, [props.recentChatList]);

      

      const NewMessage = (data) => {

        console.log(props.recentChatList, "recentChatList")
        console.log(data, "DATA")
      }





      const  handleChange = (e) =>  {

        setsearchChat(e.target.value)
        var search = e.target.value;

        let conversation = recentChatList;
        let filteredArray = [];
        
        //find conversation name from array
        for (let i = 0; i < conversation.length; i++) {
            if(conversation[i].name.toLowerCase().includes(search) || conversation[i].name.toUpperCase().includes(search))
                filteredArray.push(conversation[i]);
        }


        //setrecentChatList(filteredArray)

        //if input value is blanck then assign whole recent chatlist to array
       // if(search === "") setrecentChatList(props.recentChatList)
    }   



   const  openUserChat = (e,chat)=> {

        e.preventDefault();

        //find index of current chat in array
        var index = recentChatList.indexOf(chat);

        // set activeUser 
        props.activeUser(index);

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
                           
                        </InputGroup> 
                    </div>
                    {/* Search Box */}
                </div> 


                 {/* online users */}
                 <OnlineUsers />

                 {/* Start chat-message-list  */}


                 {/* Start chat-message-list  */}
                 <div className="px-2">
                    <h5 className="mb-3 px-3 font-size-16">Recent</h5>
                    <SimpleBar style={{ maxHeight: "100%" }} className="chat-message-list">

                        <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
                            { recentChatList.length > 0 &&
                                 recentChatList.map((chat, key) =>
                                    <li key={key} id={"conversation" + key} className={chat.unRead ? "unread" : chat.isTyping ?  "typing" :  key === props.active_user ? "active" : ""}>
                                        <Link to="#" onClick={(e) => openUserChat(e, chat)}>
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
                                                <div className="font-size-11">{chat.messages && chat.messages.length > 0 ?  chat.messages[(chat.messages).length - 1].time : null}</div>
                                                {chat.unRead === 0 ? null :
                                                    <div className="unread-message" id={"unRead" + chat.id}>
                                                        <span className="badge badge-soft-danger badge-pill">{chat.messages && chat.messages.length > 0 ? chat.unRead >= 20 ? chat.unRead + "+" : chat.unRead  : ""}</span>
                                                    </div>
                                                } 
                                            </Media>
                                        </Link>
                                    </li>
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

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    return { active_user };
};


export default connect(mapStateToProps, { setconversationNameInOpenChat, activeUser })(Chats);