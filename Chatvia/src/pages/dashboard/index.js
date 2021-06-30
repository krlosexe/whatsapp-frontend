import React, {useEffect, useState} from 'react';

//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";

import {WhatsAppService} from '../../services'
import {AuthService} from '../../services'


    function Index(props){

        const [Conversations, setConversations] = useState([]);
        const [UsersAdvisers, setUsersAdvisers] = useState([]);

        useEffect(() => {
            getChats()
            getUsers()
        }, []);


        const getUsers = async () => {
            const users = await AuthService.GetUsers()
            setUsersAdvisers(users)
        };


        async function getChats(){
            await WhatsAppService.GetChats().then((data) =>{
                if(data){
                    setConversations(data)
                }
            })
        }

        return (
            <React.Fragment>
                {/* chat left sidebar */}
                <ChatLeftSidebar recentChatList={Conversations} />
                {/* user chat */}
                {Conversations.length > 0 &&
                    <UserChat recentChatList={Conversations} users_advisers = {UsersAdvisers}/>
                }
            </React.Fragment>
        );
    }


const mapStateToProps = (state) => {
    const { users } = state.Chat;
    return { users };
};

export default connect(mapStateToProps, {  })(Index);