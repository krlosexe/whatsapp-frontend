import React from 'react';
import { Card, Media, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";

//i18n
import { useTranslation } from 'react-i18next';



function FileList(props) {

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const GoToLink = async (url,) => {
        window.open(url);
     }


    return (
        <React.Fragment>
            <Card className="p-2 mb-2">
                <Media className="align-items-center">
                    <div className="avatar-sm mr-3">
                        <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                            {props.image &&
                                <Link to="#" onClick={() => GoToLink(props.link)} className="popup-img d-inline-block m-1" title="Project 1">
                                    <img src={`data:image/jpeg; base64,${props.image}`} alt="chat" width = "61" className="rounded border" />
                                </Link>
                            }
                        </div>

                    </div>
                    <Media body>
                        <div className="text-left">
                                <Link to="#" onClick={() => GoToLink(props.link)} className="popup-img d-inline-block m-1" title="Project 1">
                                    <p className="text-muted font-size-13 mb-0">{props.description}</p>
                            </Link>
                            
                        </div>
                    </Media>
    
                    <div className="ml-4">
                        <ul className="list-inline mb-0 font-size-20">
                            
                            <UncontrolledDropdown tag="li" className="list-inline-item">
                                <DropdownToggle tag="a" className="dropdown-toggle text-muted">
                                    <i className="ri-more-fill"></i>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>{t('Share')} <i className="ri-share-line float-right text-muted"></i></DropdownItem>
                                    <DropdownItem>{t('Delete')} <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </ul>
                    </div>
                </Media>
            </Card>
        </React.Fragment>
    );
}

export default FileList;