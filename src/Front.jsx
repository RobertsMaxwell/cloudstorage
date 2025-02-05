import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Front.css"
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import rightArrow from "./assets/right-arrow.png"
import google from "./assets/google.png"
import github from "./assets/github.png"

function Front(props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const navigate = useNavigate()
  
  const [firstClick, setFirstClick] = useState(false)

  const signUpRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add("in-view")
        }
      })
    }, {threshold: .4})
    
    observer.observe(signUpRef.current)
  }, [])

  const handleNewUser = async (user) => {
    const token = await user.getIdToken()
    await fetch("http://54.87.129.15:3000/handleNewUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
    })
  }

  return (
    <div className="front">
      <div className="landing">
        <div className="title">
          <h1>Store and share</h1>
          <p>Securely store your files on Amazon S3</p>
          <button onClick={() => {
            const element = document.querySelector(".animWrapper")
            element.scrollIntoView({behavior: "smooth", block: "center"})
          }}>Get Started <img src={rightArrow} /></button>
        </div>
      </div>
      <div className="account">
        <div className="animWrapper" ref={signUpRef}>
          <div className="title">
            <h1>Sign up now</h1>
            <p>Get 1 GB of free storage</p>
          </div>
          <div className="errorGroup">
            <p className="error">{firstClick ? getErrorMessage("email") : ""}</p>
            <input type="text" placeholder="Email address" onChange={e => {setEmail(e.target.value)}} value={email} />
          </div>
          <div className="passwordGroup">
            <div className="errorGroup">
              <input type="password" placeholder="Password" onChange={e => {setPassword(e.target.value)}} value={password} />
              <p className="error">{firstClick ? getErrorMessage("password") : ""}</p>
            </div>
            <div className="errorGroup">
              <input type="password" placeholder="Retype Password" onChange={e => {setConfirmPassword(e.target.value)}} value={confirmPassword} />
              <p className="error">{firstClick ? getErrorMessage("confirm") : ""}</p>
            </div>
          </div>
          <button disabled={props.user} className="createButton" onClick={() => {
            setFirstClick(true)
            if(getErrorMessage("all") == "") {
              setFirstClick(false)
              createUserWithEmailAndPassword(props.auth, email, password)
              .then(async data => {
                sendEmailVerification(data.user)
                await handleNewUser(data.user)
                navigate("/dashboard")
              })
              .catch(e => {
                alert(e.message)
              })
            }
          }}>Create Account</button>
          <div className="divider">
            <div className="line" />
            <p>or</p>
            <div className="line" />
          </div>
          <div className="serviceLoginGroup">
            <button className="google" onClick={() => {
              const provider = new GoogleAuthProvider()
              signInWithPopup(props.auth, provider)
              .then(async data => {
                await handleNewUser(data.user)
                navigate("/dashboard")
              })
              .catch(e => {
                alert(e.message)
              })
            }}><img src={google} /> Login with Google</button>
            <button className="github" onClick={() => {
              const provider = new GithubAuthProvider()
              signInWithPopup(props.auth, provider)
              .then(async data => {
                await handleNewUser(data.user)
                navigate("/dashboard")
              })
              .catch(e => {
                alert(e.message)
              })
            }}><img src={github} /> Login with GitHub</button>
          </div>
        </div>
      </div>
    </div>
  )

  function getErrorMessage(inputType) {
    if(inputType == "email" || inputType == "all") {
      if(!validateEmail(email)) {
        return "Enter a valid email"
      }
    }
    
    if(inputType == "password" || inputType == "all") {
        if(password.length > 30) {
          return "Password is too long"
        } else if (password.length < 5) {
          return "Password must be longer than 5 characters"
        }
    }
    
    if(inputType == "confirm" || inputType == "all") {
        if(password != confirmPassword) {
          return "Passwords dont match"
        }
    } 
    
    return ""
  }

  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
}

export default Front