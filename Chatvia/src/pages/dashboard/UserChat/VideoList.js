import React, {useState, useEffect} from 'react';
import { Card } from "reactstrap";
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from "reactstrap";

import { Link } from "react-router-dom";
//i18n
import { useTranslation } from 'react-i18next';

//lightbox
import ReactImageVideoLightbox from 'react-image-video-lightbox';


import {WhatsAppService} from '../../../services'
//i18n
//import { useTranslation } from 'react-i18next';




function AudioList(props) {

    const [Player, setPlayer] = useState(false)
    const [Video, setVideo]   = useState(false)

     const getVideo = async (mediaKey, url) => {

        if(!props.base64Video){
            await WhatsAppService.DecrypVideo(mediaKey, url).then(async (data)=>{
                console.log(data.file, "DECRYP")
               await toggleLightbox(data.file)
            }).catch(function (response) {console.log(response)})
        }else{
            await toggleLightbox(props.base64Video)
        }
        
     }


     const toggleLightbox = (currentVideo) => {
        setVideo(currentVideo)
        setPlayer(true)
    } 

    const { t } = useTranslation();


    return (
        <React.Fragment>
            <Card className="p-2 mb-2">
                

                <ul className="list-inline message-img  mb-0">
                    {/* image list */}
                    <li className="list-inline-item message-img-list">
                        <div>
                            <Link to="#" onClick={() => getVideo(props.mediaKey, props.url)} className="popup-img d-inline-block m-1" title="Project 1">
                                <img src={`data:image/jpeg; base64,${props.poster}`} alt="chat" className="rounded border" />
                            </Link>
                        </div>
                        <div className="message-img-link">
                            <ul className="list-inline mb-0">
                                {
                                    <li className="list-inline-item">
                                    <Link to="#" onClick={() => getVideo(props.mediaKey, props.url)}>
                                        <i className="ri-download-2-line"></i>
                                    </Link>
                                </li>
                                }
                                <UncontrolledDropdown tag="li" className="list-inline-item">
                                <DropdownToggle tag="a">
                                    <i className="ri-more-fill"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                                    <DropdownItem>{t('Save')} <i className="ri-save-line float-right text-muted"></i></DropdownItem>
                                    <DropdownItem>{t('Forward')} <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                    <DropdownItem>{t('Delete')} <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                </DropdownMenu>
                                </UncontrolledDropdown>
                            </ul>
                        </div>
                    </li>
                            
                    { Player &&
                        <ReactImageVideoLightbox
                            data={[
                                {
                                    url: Video,
                                    type: "video",
                                    title: "some video"
                                }
                            ]}
                            startIndex={0}
                            showResourceCount={true}
                            onCloseCallback={() => setPlayer(false)}
                
                        />
                    }
                </ul>

            </Card>
        </React.Fragment>
    );
}

export default AudioList;