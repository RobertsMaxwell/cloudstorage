import { useEffect } from "react"

function VerifyBanner(props) {
    return (
        props.user?.emailVerified ? "" :
        <div className="verifyBanner">
            <p>A verification email has been sent to <u>{props.user?.email}</u> <i>(Check your spam folder)</i></p>
        </div>
    )
}

export default VerifyBanner;