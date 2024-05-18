import { CSSProperties } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import styles from "./liveView.module.css"
const liveBox:CSSProperties = {
    backgroundColor: "#fff",
    backgroundImage:"linear-gradient(to top right, #A2CCFD 5%, white 60%)"
}

const LiveView =() =>{
    return(
        <div className="container shadow-inner max-w-lg my-4 p-3 flex flex-col justify-evenly rounded-lg" style={liveBox}>
            <div className="w-full flex justify-evenly items-center p-2">
                <Avatar style={{height:"100px", width:"100px"}}>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col justify-evenly items-center'>
                    <h3 className='text-lg'>
                        Arpit K. Bhal
                    </h3>
                    <div className='flex justify-between gap-3'>
                        <span>{`Age: ${27}`}</span>
                        <span>{`Male`}</span>
                    </div>
                </div>
            </div>
            <ul className={`grid grid-cols-3 grid-flow-row gap-2 ${styles.PatientInfo}`}>
                <li>
                    <h4>7</h4>
                    <small>Days in ICU</small>
                </li>
                <li>
                    <h4>120</h4>
                    <small>SpO2</small>
                </li>
                <li>
                    <h4>100/80</h4>
                    <small>Blood Pressure</small>
                </li>
                <li>
                    <h4>75</h4>
                    <small>Heart Rate</small>
                </li>
                <li>
                    <h4>37.5 C</h4>
                    <small>Temperature</small>
                </li>
            </ul>
        </div>
    )
}

export default LiveView;