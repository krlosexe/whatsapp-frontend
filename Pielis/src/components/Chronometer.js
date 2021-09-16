import React from 'react';
import {useEffect, useState} from "react"


function Chronometer(){
    const [diff, setDiff]       = useState(null)
    const [initial, setInitial] = useState(null)

    const tick = () =>{
        setDiff(new Date(+new Date() - initial))
    }

    const start = () =>{ setInitial(+new Date()) }


    useEffect(() => {
        start()
    }, [])


    useEffect(() => {
        if(initial){
            requestAnimationFrame(tick)
        }
    }, [initial])


    useEffect(() => {
        if(diff){
            requestAnimationFrame(tick)
        }
    }, [diff])

    const timeFormat = (date)=>{
        if(!date) return "00:00:00"

        let mm = date.getUTCMinutes()
        let ss = date.getSeconds()
        let cm = Math.round(date.getMilliseconds() / 10)

        mm = mm < 10 ? "0"+mm : mm
        ss = ss < 10 ? "0"+ss : ss
        cm = cm < 10 ? "0"+cm : cm

        return `${mm}:${ss}`
    }

    return (
        <React.Fragment>
            <div>
                <p><div className="blob red"></div></p>
                <p>{timeFormat(diff)}</p>
            </div>
        </React.Fragment>
    )
}
export default Chronometer