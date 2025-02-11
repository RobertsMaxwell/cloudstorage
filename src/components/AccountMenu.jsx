import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

function AccountMenu(props) {
    const nav = useNavigate()
    
    useEffect(() => {
        const checkClick = (e) => {
            if(e.target.parentElement.className != "accountButton") {
                props.setAccountMenu(false)
            }
        }

        document.addEventListener("click", checkClick)

        return () => {
            document.removeEventListener("click", checkClick)
        }
    }, [])
    
    return (
        <div className="accountMenu">
            <div className="logOut" onClick={() => {
                signOut(props.auth)
                .then(() => {
                    nav("/")
                })
            }}>
                Log Out
            </div>
        </div>
    )
}

export default AccountMenu;