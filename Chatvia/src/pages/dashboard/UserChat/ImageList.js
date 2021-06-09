import React, { useState } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Link } from "react-router-dom";
import {WhatsAppService} from '../../../services'
//i18n
import { useTranslation } from 'react-i18next';

//lightbox
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function ImageList(props) {
    const [isOpen, setisOpen] = useState(false);
    const [currentImage, setcurrentImage] = useState(null);
    const [images] = useState(props.images);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const toggleLightbox = (currentImage) => {
        console.log(currentImage)
        setisOpen(!isOpen);
        setcurrentImage(currentImage);
    } 


    const getImage = async (mediaKey, url) => {
       await WhatsAppService.DecrypImage(mediaKey, url).then(async (data)=>{
            console.log(data.file, "DECRYP")
           await toggleLightbox(data.file)
        }).catch(function (response) {console.log(response)})
    }
    return (
        <React.Fragment>
            <ul className="list-inline message-img  mb-0">
                {/* image list */}
                {
                    images.map((imgMsg, key) =>
                
                    <li key={key} className="list-inline-item message-img-list">
                            <div>
                                <Link to="#" onClick={() => getImage(imgMsg.mediaKey, imgMsg.url)} className="popup-img d-inline-block m-1" title="Project 1">
                                    <img src={`data:image/jpeg; base64,${imgMsg.image}`} alt="chat" className="rounded border" />
                                </Link>
                            </div>
                            <div className="message-img-link">
                                <ul className="list-inline mb-0">
                                    {/*
                                        <li className="list-inline-item">
                                        <Link to="#" onClick={() => getImage(imgMsg.mediaKey, imgMsg.url)}>
                                            <i className="ri-download-2-line"></i>
                                        </Link>
                                    </li>
                                    */}
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
                    )
                }

                                                                {isOpen && (
                                                                    <Lightbox
                                                                        mainSrc={currentImage}
                                                                        onCloseRequest={toggleLightbox}
                                                                        imageTitle="Project 1"
                                                                    />
                                                                )}
                                                        
            </ul>
        </React.Fragment>
    );
}

export default ImageList;