import { useState } from "react";
import "./index.css"

function EmailConfirmationPopup(props) {
    const [emailCode, setEmailCode] = useState("")

    const codeLength = 6

    return (
        <div className="emailConfirmationPopupContainer">
            <div className="emailConfirmationPopup">
                <h1>Verify your email</h1>
                <p>A code was sent to <b>{props.email}</b></p>
                <p className="wrongEmail">Wrong email?</p>
                <input type="text" value={emailCode} onChange={e => {
                    if(!isNaN(e.target.value) && e.target.value.length <= codeLength) {
                        setEmailCode(e.target.value)
                    }
                }} />
                
                <button onClick={() => {
                    
                }}>Verify</button>
            </div>
        </div>
    );
}

export default EmailConfirmationPopup;