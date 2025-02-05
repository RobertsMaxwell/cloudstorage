import "./Header.css"
import close from "./assets/close.png"

function MenuPopup (props) {
    return (
        <div className="menuPopup">
            <img src={close} onClick={() => {props.setMenuPopup(false)}} />
            <button className="signIn" onClick={() => {
                props.setSignInPopup(true)
                props.setMenuPopup(false)
            }}>Sign In</button>
            <button className="signUp" onClick={() => {
                props.setMenuPopup(false)
                const element = document.querySelector(".animWrapper")
                element.scrollIntoView({behavior: "smooth", block: "center"})
            }}>Get Started</button>
        </div>
    );
}

export default MenuPopup;