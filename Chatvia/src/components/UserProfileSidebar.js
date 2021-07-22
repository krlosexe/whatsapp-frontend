import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Button, Card, Media, Badge, Input } from "reactstrap";

//Simple bar
import SimpleBar from "simplebar-react";

//components
import AttachedFiles from "./AttachedFiles";
import CustomCollapse from "./CustomCollapse";

//actions
import { closeUserSidebar } from "../redux/actions";

//i18n
import { useTranslation } from 'react-i18next';

//image
import avatar7 from "../assets/images/users/avatar-7.jpg";

import {CrmService} from "../services";


function UserProfileSidebar(props) {
    
    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [files] = useState([
        { name : "Admin-A.zip", size : "12.5 MB", thumbnail : "ri-file-text-fill" },
        { name : "Image-1.jpg", size : "4.2 MB", thumbnail : "ri-image-fill" },
        { name : "Image-2.jpg", size : "3.1 MB", thumbnail : "ri-image-fill" },
        { name : "Landing-A.zip", size : "6.7 MB", thumbnail : "ri-file-text-fill" },
    ]);


    const [textname, settextname]                     = useState("")
    const [textidentification, settextidentification] = useState("")
    const [telefono, settelefono]                     = useState("")
    const [textemail, settextemail]                   = useState("")

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();



    useEffect(() => {
        getClient()
    }, [props.activeUser.jid]);


    const getClient = () =>{
        CrmService.GetClient(props.activeUser.jid).then((response)=>{
            settextname(response.nombres)
            settextidentification(response.identificacion)
            settelefono(response.telefono)
            settextemail(response.email)
        }).catch(()=>{
            settextname("")
            settextidentification("")
            settelefono("")
            settextemail("")
        })
    }

    const toggleCollapse1 = () => {
        setIsOpen1(!isOpen1);
        setIsOpen2(false);
        setIsOpen3(false);
    };

    const toggleCollapse2 = () => {
        setIsOpen2(!isOpen2);
        setIsOpen1(false);
        setIsOpen3(false);
    };

    const toggleCollapse3 = () => {
        setIsOpen3(!isOpen3);
        setIsOpen1(false);
        setIsOpen2(false);
    };
    

    // closes sidebar
    const closeuserSidebar=()=> {
        props.closeUserSidebar();
    }


    const handleChangeName = e => {
        settextname(e.target.value)
    }


    const handleChangIdentificacion = e => {
        settextidentification(e.target.value)
    }

    const handleChangeTelefono = e => {
        settelefono(e.target.value)
    }

    const handleChangeEmail = e => {
        settextemail(e.target.value)
    }


    const SaveClient = e => {

        const data = {
            "name"         : textname,
            "identificacion"  : textidentification,
            "telefono"        : telefono,
            "email"           : textemail,
            "origen"          : "Sistema de WhatsApp",
           // "id_line"         : process.env.REACT_APP_ID_LINE,
            "id_user_asesora" : process.env.REACT_APP_USER_ID,
            "jid"             : props.activeUser.jid
        }

        console.log(data)
        CrmService.RegisterClient(data).then((response)=>{
            alert("El Px se registro con exito")
        }).catch(error => alert("El Px ya se encuentra en Base de Datos"));
    }

    

    // style={{display: props.userSidebar  ? "block" : "none"}}
    return (
        <React.Fragment>
           <div style={{display: (props.userSidebar === true)  ? "block" : "none"}} className="user-profile-sidebar">
                        <div className="px-3 px-lg-4 pt-3 pt-lg-4">
                            <div className="user-chat-nav text-right">
                                <Button color="none" type="button" onClick={closeuserSidebar} className="nav-btn" id="user-profile-hide">
                                    <i className="ri-close-line"></i>
                                </Button>
                            </div>
                        </div>

                        <div className="text-center p-4 border-bottom">

                            <div className="mb-4 d-flex justify-content-center">
                                {
                                    props.activeUser.profilePicture ==="Null" ?
                                        <div className="avatar-lg">
                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-24">
                                                {props.activeUser.name.charAt(0)}
                                            </span>
                                        </div>
                                    : <img src={props.activeUser.profilePicture} className="rounded-circle avatar-lg img-thumbnail" alt="chatvia" />
                                }
                                
                            </div>

                            <h5 className="font-size-16 mb-1 text-truncate">{props.activeUser.name}</h5>
                            <p className="text-muted text-truncate mb-1">
                            {(() => {
                                                                                    switch (props.activeUser.status) {
                                                                                        case "online":
                                                                                            return (
                                                                                                <>
                                                                                                    <i className="ri-record-circle-fill font-size-10 text-success mr-1"></i>
                                                                                                </>
                                                                                            )
                                                                        
                                                                                        case "away":
                                                                                            return (
                                                                                                <>
                                                                                                    <i className="ri-record-circle-fill font-size-10 text-warning mr-1"></i>
                                                                                                </>
                                                                                            )

                                                                                        case "offline":
                                                                                            return (
                                                                                                <>
                                                                                                    <i className="ri-record-circle-fill font-size-10 text-secondary mr-1"></i>
                                                                                                </>
                                                                                            )

                                                                                        default:
                                                                                            return;
                                                                                    }
                                                                                })()}
                                
                                Active</p>
                        </div>
                        {/* End profile user */}

                        {/* Start user-profile-desc */}
                        <SimpleBar style={{ maxHeight: "100%" }} className="p-4 user-profile-desc">
                            <div className="text-muted">
                                <p className="mb-4">"{t('If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual.')}"</p>
                            </div>

                            <div id="profile-user-accordion" className="custom-accordion">
                                <Card className="shadow-none border mb-2">
                                    {/* import collaps */}
                                        <CustomCollapse
                                            title = "Datos del Paciente"
                                            iconClass = "ri-user-2-line"
                                            isOpen={isOpen1}
                                            toggleCollapse={toggleCollapse1}
                                        >
                                            <div>
                                                <p className="text-muted mb-1">Nombre y Apellido</p>
                                                <Input type="text" value={textname} onChange={handleChangeName} className="form-control form-control-lg bg-light border-light"/>
                                            </div>


                                            <div>
                                                <p className="text-muted mb-1 mt-3">Identificacion</p>
                                                <Input type="text" value={textidentification} onChange={handleChangIdentificacion} className="form-control form-control-lg bg-light border-light"/>
                                            </div>


                                            <div>
                                                <p className="text-muted mb-1 mt-3">Telefono</p>
                                                <Input type="text" value={telefono} onChange={handleChangeTelefono} className="form-control form-control-lg bg-light border-light"/>
                                            </div>


                                            <div>
                                                <p className="text-muted mb-3 mt-3">Email</p>
                                                <Input type="text" value={textemail} onChange={handleChangeEmail} className="form-control form-control-lg bg-light border-light"/>
                                            </div>


                                            <Button onClick={SaveClient} color="primary" className="font-size-16 btn-lg chat-send waves-effect waves-light mt-3">
                                                Guardar <i className="ri-send-plane-2-fill"></i>
                                            </Button>

                                        </CustomCollapse>
                                </Card>
                                {/* End About card */}


                                {
                                    props.activeUser.isGroup === true &&
                                    <Card className="mb-1 shadow-none border">
                                        {/* import collaps */}
                                        <CustomCollapse
                                                title = "Members"
                                                iconClass = "ri-group-line"
                                                isOpen={isOpen3}
                                                toggleCollapse={toggleCollapse3}
                                            >
                                                        <Card className="p-2 mb-2">
                                                            <Media className="align-items-center">
                                                                            <div className="chat-user-img align-self-center mr-3">
                                                                                        <div className="avatar-xs">
                                                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                S
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                <Media body>
                                                                    <div className="text-left">
                                                                        <h5 className="font-size-14 mb-1">{t('Sara Muller')}
                                                                        <Badge color="danger" className="badge-soft-danger float-right">{t('Admin')}</Badge>
                                                                        </h5>
                                                                        {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                                                                    </div>
                                                                </Media>
                                                            </Media>
                                                        </Card>

                                                        <Card className="p-2 mb-2">
                                                            <Media className="align-items-center">
                                                                            <div className="chat-user-img align-self-center mr-3">
                                                                                        <div className="avatar-xs">
                                                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                O
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                <Media body>
                                                                    <div className="text-left">
                                                                        <h5 className="font-size-14 mb-1">{t('Ossie Wilson')}</h5>
                                                                        {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                                                                    </div>
                                                                </Media>
                                                            </Media>
                                                        </Card>

                                                        <Card className="p-2 mb-2">
                                                            <Media className="align-items-center">
                                                                <div className="chat-avatar">
                                                                    
                                                                    <img src={avatar7} className="rounded-circle chat-user-img avatar-xs mr-3" alt="chatvia" />
                                                                </div>
                                                                <Media body>
                                                                    <div className="text-left">
                                                                        <h5 className="font-size-14 mb-1">{t('Paul Haynes')}</h5>
                                                                        {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                                                                    </div>
                                                                </Media>
                                                            </Media>
                                                        </Card>
                                            </CustomCollapse>
                                    </Card>
                                }
                            </div>
                        </SimpleBar>
                        {/* end user-profile-desc */}
                        </div>
                
         
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const { users,active_user } = state.Chat;
    const { userSidebar } = state.Layout;
    return { users,active_user,userSidebar };
};

export default connect(mapStateToProps, { closeUserSidebar })(UserProfileSidebar);