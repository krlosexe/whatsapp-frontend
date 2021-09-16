import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Media, Button, Input, Row, Col, FormGroup, Label } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { openUserSidebar,setFullUser } from "../../../redux/actions";


import {WhatsAppService} from '.././../../services'


function UserHead(props) {

  // console.log(props.chats, "CHATEANDO")
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);

    const toggle = () => setDropdownOpen(!dropdownOpen);
    const toggle1 = () => setDropdownOpen1(!dropdownOpen1);

    const [Advisor, setAdvisor] = useState("");

    useEffect(() => {
        console.log(props.chats[props.active_user].advisor, "ADVISOR")
        if(props.chats[props.active_user].advisor){
            setAdvisor(props.chats[props.active_user].advisor)
        }else{
            setAdvisor("")
        }
        
    }, [props.chats[props.active_user].jid]);


    const openUserSidebar = (e) => {
        e.preventDefault();
        props.openUserSidebar();
    }       


    function closeUserChat(e){
        e.preventDefault();
        var userChat = document.getElementsByClassName("user-chat");
        if(userChat) {
            userChat[0].classList.remove("user-chat-show");
        }
    }

    function deleteMessage()
    {
         let allUsers = props.chats;
        let copyallUsers = allUsers;
        copyallUsers[props.active_user].messages =  [];
       
        props.setFullUser(copyallUsers);
    }

    function onDropdownSelected(e) {
        WhatsAppService.AssignAdvisor(props.chats[props.active_user].jid, e.target.value)
        setAdvisor(e.target.value)
       
    }


    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-bottom">
                            <Row className="align-items-center">
                                <Col sm={4} xs={4}>
                                    <Media className="align-items-center">
                                        <div className="d-block d-lg-none mr-2">
                                            <Link to="#" onClick={(e) => closeUserChat(e)} className="user-chat-remove text-muted font-size-16 p-2">
                                            <i className="ri-arrow-left-s-line"></i></Link>
                                        </div>
                                        {
                                            props.chats[props.active_user].profilePicture !== "Null" ?
                                                <div className="mr-3">
                                                    <img src={props.chats[props.active_user].profilePicture} className="rounded-circle avatar-xs" alt="chatvia" />
                                                </div>
                                            :   <div className="chat-user-img align-self-center mr-3">
                                                    <div className="avatar-xs">
                                                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                            {props.chats[props.active_user].name.charAt(0)}
                                                        </span>
                                                    </div>
                                                </div>
                                        }
                                        
                                        <Media body className="overflow-hidden">
                                            <h5 className="font-size-16 mb-0 text-truncate">
                                            <Link to="#" onClick={(e) => openUserSidebar(e)} className="text-reset user-profile-show">
                                            {props.chats[props.active_user].name} - {props.chats[props.active_user].jid.split("@")[0]}
                                            </Link> 
                                                                                {(() => {
                                                                                    switch (props.chats[props.active_user].status) {
                                                                                        case "online":
                                                                                            return (
                                                                                                <>
                                                                                                    <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ml-1"></i>
                                                                                                </>
                                                                                            )
                                                                        
                                                                                        case "away":
                                                                                            return (
                                                                                                <>
                                                                                                    <i className="ri-record-circle-fill font-size-10 text-warning d-inline-block ml-1"></i>
                                                                                                </>
                                                                                            )

                                                                                        case "offline":
                                                                                            return (
                                                                                                <>
                                                                                                    <i className="ri-record-circle-fill font-size-10 text-secondary d-inline-block ml-1"></i>
                                                                                                </>
                                                                                            )

                                                                                        default:
                                                                                            return;
                                                                                    }
                                                                                })()}
                                                                        
                                            </h5>
                                        </Media>
                                    </Media>
                                </Col>


                                <Col sm={4} xs={4}>
                                    <FormGroup>
                                        <Label for="selectAdviser">Asesor</Label>
                                        <Input type="select" name="select" id="selectAdviser" onChange={onDropdownSelected} value={Advisor}>
                                            <option>Seleccione</option>
                                            {props.users_advisers.map(fbb =>
                                                <option key={fbb.key} value={fbb._id}>{fbb.name}</option>
                                            )};
                                        </Input>
                                    </FormGroup>
                                </Col>


                                <Col sm={4} xs={4} >
                                    <ul className="list-inline user-chat-nav text-right mb-0">
                                        
                                        <li className="list-inline-item">
                                            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                                                <DropdownToggle color="none" className="btn nav-btn " type="button" >
                                                    <i className="ri-search-line"></i>
                                                </DropdownToggle>
                                                <DropdownMenu right className="p-0  dropdown-menu-md">
                                                    <div className="search-box p-2">
                                                        <Input type="text" className="form-control bg-light border-0" placeholder="Search.." />
                                                    </div>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </li>
    
                                        <li className="list-inline-item d-none d-lg-inline-block">
                                            <Button type="button" color="none" onClick={(e) => openUserSidebar(e)} className="nav-btn user-profile-show">
                                                <i className="ri-user-2-line"></i>
                                            </Button>
                                        </li>
    
                                        <li className="list-inline-item">
                                            <Dropdown isOpen={dropdownOpen1} toggle={toggle1} >
                                                <DropdownToggle className="btn nav-btn " color="none" type="button" >
                                                    <i className="ri-more-fill"></i>
                                                </DropdownToggle>
                                                <DropdownMenu right>
                                                    <DropdownItem className="d-block d-lg-none user-profile-show" onClick={(e) => openUserSidebar(e)}>View profile <i className="ri-user-2-line float-right text-muted"></i></DropdownItem>
                                                    <DropdownItem>Archive <i className="ri-archive-line float-right text-muted"></i></DropdownItem>
                                                    <DropdownItem>Muted <i className="ri-volume-mute-line float-right text-muted"></i></DropdownItem>
                                                    <DropdownItem onClick={(e)=>deleteMessage(e)}>Delete <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </li>
                                        
                                    </ul>
                                </Col>
                            </Row>
                        </div>
        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    const { users,active_user } = state.Chat;
    return { ...state.Layout,users,active_user };
};

export default connect(mapStateToProps, { openUserSidebar,setFullUser })(UserHead);