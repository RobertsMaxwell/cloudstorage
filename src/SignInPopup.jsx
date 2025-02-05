import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import google from "./assets/google.png"
import github from "./assets/github.png"
import close from "./assets/close.png"

function SignInPopup (props) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    return (
        <div className="signInContainer" onClick={() => {props.setSignInPopup(false)}}>
            <div className="signInPopup" onClick={e => {e.stopPropagation()}}>
                <h1>Sign In</h1>
                <input type="text" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                <button className="logIn" onClick={() => {
                    signInWithEmailAndPassword(props.auth, email, password)
                    .then(user => {
                        navigate("/dashboard")
                        props.setSignInPopup(false)
                    })
                    .catch(e => {
                        alert(e.message)
                    })
                    props.setSignInPopup(false)
                }}>Sign In</button>
                <div className="divider">
                    <div className="line" />
                    <p>or</p>
                    <div className="line" />
                </div>
                <div className="serviceGroup">
                    <img className="google" src={google} onClick={() => {
                        const provider = new GoogleAuthProvider()
                        signInWithPopup(props.auth, provider)
                        .then(data => {
                            props.setSignInPopup(false)
                            navigate("/dashboard")
                        })
                        .catch(e => {
                            alert(e.message)
                        })
                        
                    }}  />
                    <img className="github" src={github} onClick={() => {
                        const provider = new GithubAuthProvider()
                        signInWithPopup(props.auth, provider)
                        .then(data => {
                            props.setSignInPopup(false)
                            navigate("/dashboard")
                        })
                        .catch(e => {
                            alert(e.message)
                        })
                    }}/>
                </div>
                {props.phone ? 
                <div className="exit">
                    <img src={close} onClick={() => {props.setSignInPopup(false)}} />
                </div> 
                : ""}
            </div>
        </div>
    );
}

export default SignInPopup;