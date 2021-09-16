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
   
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();


    const GoToMap = async (latitude, longiture) => {
        //window.open(` https://maps.google.com/maps?ll=${latitude},${longiture},&amp;z=16&amp;t=m&amp;hl=en-US&amp;gl=US&amp;mapclient=apiv3`);
        window.open(`https://maps.google.com/maps?q=${latitude}%2C${longiture}&z=17&hl=es`);

       

    }
    return (
        <React.Fragment>
            <ul className="list-inline message-img  mb-0">
                {/* image list */}
                {
               
                
                    <li key="1" className="list-inline-item message-img-list">
                            <div>
                                <Link to="#" onClick={() => GoToMap(props.degreesLatitude, props.degreesLongitude)} className="popup-img d-inline-block m-1" title="Project 1">
                                    <img src={`data:image/jpeg; base64,${props.image}`} alt="chat" className="rounded border" />
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
                    
                }

            </ul>
        </React.Fragment>
    );
}

export default ImageList;