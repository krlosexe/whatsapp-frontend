import React, {useState, useEffect} from 'react';
import { Card } from "reactstrap";
import {WhatsAppService} from '../../../services'
//i18n
//import { useTranslation } from 'react-i18next';
import ReactAudioPlayer from 'react-audio-player';



function AudioList(props) {

    /* intilize t variable for multi language implementation */
    /*const { t } = useTranslation();*/

    const [Player, setPlayer] = useState(true)
    const [Audio, setAudio]   = useState(false)

    useEffect(() => {
        getFile(props.mediaKey, props.url)
    }, []);

    const getFile = async (mediaKey, url) => {
        await WhatsAppService.DecrypAudio(mediaKey, url).then(async (data)=>{
            console.log(data.file, "DECRYP")
           // window.open(data.file);
            await setPlayer(true)
            await setAudio(data.file)
        }).catch(function (response) {console.log(response)})

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