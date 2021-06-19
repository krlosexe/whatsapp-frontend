import React, { useState } from 'react';
import { Button, Input, Row, Col, UncontrolledTooltip, ButtonDropdown, DropdownToggle, DropdownMenu, Label, Form } from "reactstrap";
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'


import OpusMediaRecorderView from './OpusMediaRecorderView'
import {WhatsAppService} from '../../../services'

function ChatInput(props) {
    const [textMessage, settextMessage] = useState("");
    const [AudioBase64, setAudioBase64] = useState("");
    const [VideoBase64, setVideoBase64] = useState(false);
    const [isOpen, setisOpen] = useState(false);
    const [file, setfile] = useState({
        name : "",
        size : ""
    });
    const [fileImage, setfileImage] = useState("")

    const toggle = () => setisOpen(!isOpen);


    //function for text input value change
    const handleChange = e => {
        settextMessage(e.target.value)
    }

    //function for add emojis
    const addEmoji = e => {
        let emoji = e.native;
        settextMessage(textMessage+emoji)
    };

    //function for file input change
    const handleFileChange = async (e) => {
        if(e.target.files.length !==0 ){

            const type_file   = e.target.files[0].type
            const extenxion   = type_file.split("/")[1]
            console.log(type_file, extenxion)
           
            if(e.target.files[0].type == 'video/mp4'){
                setVideoBase64(await toBase64(e.target.files[0]))
            }else{
                setfile({   
                    name : e.target.files[0].name,
                    size : e.target.files[0].size,
                    extenxion,
                    type_file,
                    fileBase64 : await toBase64(e.target.files[0])
                })
            }

        }

        
        
    }

    //function for image input change
    const handleImageChange = async (e) => {

        if(e.target.files.length !==0 ){
            //setfileImage(URL.createObjectURL(e.target.files[0]))
            setfileImage(await toBase64(e.target.files[0]))
             
        }
        
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", "").replace("data:image/jpg;base64,", ""));
        reader.onerror = error => reject(error);
    });




    //function for send data to onaddMessage function(in userChat/index.js component)
    const onaddMessage = (e, textMessage, audio = false) => {

        e.preventDefault();
        //if text value is not emptry then call onaddMessage function
        if(textMessage !== "") {
            props.onaddMessage(textMessage, "textMessage");
            settextMessage("");
        }


        if(VideoBase64 != false){
            props.onaddMessage(VideoBase64.replace("data:video/mp4;base64,", ""), "VideoMessage");
            setVideoBase64(false);
        }

        //if file input value is not empty then call onaddMessage function
        if(file.name !== "") {
            file.fileBase64  = file.fileBase64.replace(`data:${file.type_file};base64,`, "")
            props.onaddMessage(file, "fileMessage");
            setfile({
                name : "",
                size : ""
            })
        }

        //if image input value is not empty then call onaddMessage function
        if(fileImage !== "") {
            props.onaddMessage(fileImage, "imageMessage");
            setfileImage("")
        }

        if(audio){
            props.onaddMessage(audio.replace("data:audio/ogg;base64,", ""), "AudioMessage");
            setAudioBase64("")
        }
    }

    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-top mb-0">
                            <Form onSubmit={(e) => onaddMessage(e, textMessage)} >



                            <div className="App">
                                <OpusMediaRecorderView
                                    onDataAvailable={(e) => {

                                        let reader = new window.FileReader();
                                        reader.onloadend = async function() {
                                            const data = reader.result;

                                            await setAudioBase64(data)
                                            await onaddMessage(e, "", data)
                                            //console.log(data);
                                        };

                                        reader.readAsDataURL(e.data);
                                    }}
                                    render={({ state, start, stop, pause, resume }) => (
                                        <div>
                                        <p>{state}</p>
                                        <button onClick={start}>Start Recording</button>
                                        <button onClick={stop}>Stop Recording</button>
                                        </div>
                                    )}
                                    />
                            </div>




                            {/* <AudioReactRecorder state={recordState} onStop={onStop} type="audio/mp3"/>
 
                            <button onClick={start}>Start</button>
                            <button onClick={stop}>Stop</button> */}


                                <Row noGutters>
                                    <Col>
                                        <div>
                                            <Input type="text" value={textMessage} onChange={handleChange} className="form-control form-control-lg bg-light border-light" placeholder="Enter Message..." />
                                        </div>
                                    </Col>
                                    <Col xs="auto">
                                        <div className="chat-input-links ml-md-2">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                <ButtonDropdown className="emoji-dropdown" direction="up" isOpen={isOpen} toggle={toggle}>
                                                    <DropdownToggle id="emoji" color="link" className="text-decoration-none font-size-16 btn-lg waves-effect">
                                                        <i className="ri-emotion-happy-line"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-lg-right">
                                                        <Picker onSelect={addEmoji} />
                                                    </DropdownMenu>
                                                    </ButtonDropdown>
                                                    <UncontrolledTooltip target="emoji" placement="top">
                                                        Emoji
                                                    </UncontrolledTooltip>
                                                </li>
                                                <li className="list-inline-item input-file">
                                                    <Label id="files" className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                                        <i className="ri-attachment-line"></i>
                                                    <Input onChange={(e) => handleFileChange(e)} type="file" name="fileInput" size="60" />
                                                    </Label>   
                                                    <UncontrolledTooltip target="files" placement="top">
                                                        Attached File
                                                    </UncontrolledTooltip>
                                                </li>
                                                <li className="list-inline-item input-file">
                                                    <Label id="images" className="mr-1 btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                                        <i className="ri-image-fill"></i>
                                                    <Input onChange={(e) => handleImageChange(e)} accept="image/*" type="file" name="fileInput" size="60" />
                                                    </Label>   
                                                    <UncontrolledTooltip target="images" placement="top">
                                                        Images
                                                    </UncontrolledTooltip>
                                                </li>


                                                <li>

                                                


                                                </li>
                                                <li className="list-inline-item">
                                                    <Button type="submit" color="primary" className="font-size-16 btn-lg chat-send waves-effect waves-light">
                                                        <i className="ri-send-plane-2-fill"></i>
                                                    </Button>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
        </React.Fragment>
    );
}

export default ChatInput;