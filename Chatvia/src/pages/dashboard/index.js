import React, {useEffect, useState} from 'react';

//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";
import axios from 'axios';

import {WhatsAppService} from '../../services'

import img4 from "../../assets/images/small/img-4.jpg";


    function Index(props){

        const [Conversations, setConversations] = useState([]);

        useEffect(() => {

            getChats()

        }, []);


        async function getChats(){
            await WhatsAppService.GetChats().then(setConversations)
        }

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