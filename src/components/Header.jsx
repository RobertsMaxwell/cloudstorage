import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css"

import menu from "../assets/menu.png"

function Header(props) {
    const navigate = useNavigate()
    const headerRef = useRef(null)
    const handleScroll = () => {
        const scrollValue = window.scrollY
        
        if(scrollValue == 0) {
            headerRef.current.classList.remove("animate")
            void headerRef.current.offsetWidth;
            headerRef.current.classList.add("reverse")
        } else {
            headerRef.current.classList.remove("reverse")
            void headerRef.current.offsetWidth;
            headerRef.current.classList.add("animate")
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <div ref={headerRef} className="header">
            <h2>Cloud Storage</h2>
            {props.phone ? 
            <img className="menu" src={menu} onClick={() => {props.setMenuPopup(true)}} />
            :
            props.user 
            ? 
            <button className="account" onClick={() => {
                navigate("/dashboard")
            }}>Dashboard</button>
            :
            <>
                <button className="signin" onClick={() => {
                    props.setSignInPopup(true)
                }}>Sign in</button>
                <button className="signup" onClick={() => {
                    const element = document.querySelector(".animWrapper")
                    element.scrollIntoView({behavior: "smooth", block: "center"})
                }}>Get Started</button>
            </>}
            
        </div>
    );
}

export default Header;