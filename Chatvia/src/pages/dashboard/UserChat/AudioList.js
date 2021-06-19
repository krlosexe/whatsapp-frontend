import React, {useState, useEffect} from 'react';
import { Card } from "reactstrap";
import {WhatsAppService} from '../../../services'
import ReactAudioPlayer from 'react-audio-player';


function AudioList(props) {

    const [Player, setPlayer] = useState(true)
    const [Audio, setAudio]   = useState(false)

    useEffect(() => {
        getFile(props.mediaKey, props.url)
    }, []);

    const getFile = async (mediaKey, url) => {

        if(!props.base64){

            await WhatsAppService.DecrypAudio(mediaKey, url).then(async (data)=>{
                console.log(data.file, "DECRYP")
                await setPlayer(true)
                await setAudio(data.file)
    
            }).catch(function (response) {console.log(response)})
        }else{
            await setPlayer(true)
            await setAudio(`data:audio/ogg;base64,${props.base64}`)
            
        }
     }

    return (
        <React.Fragment>
            <Card className="p-2 mb-2">
                {Player && Audio &&
                    <ReactAudioPlayer
                        src={Audio}
                        controls
                    />
                }

            </Card>
        </React.Fragment>
    );
}

export default AudioList;