import { useEffect, useRef } from "react";
import { push, ref, remove, update } from "firebase/database"

function ShareMenu (props) {
    const shareMenuRef = useRef(null)
    const cleanFilePath = props.fullKey.replace(/[.#$/\[\]]/g, "")

    useEffect(() => {
        const handleClick = () => {
            props.setShareMenu(false)
        }

        document.addEventListener("click", handleClick)

        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])

    return (
        <div ref={shareMenuRef} className="shareMenu" onClick={(e) => {
            e.stopPropagation()
        }}>
            <div className="shareInfo">
                <p>{props.name}</p>
                <div className={`shareStatus ${props.shareLink ? "shareStatusActive" : ""}`} />
            </div>
            <div className="shareLink">
                <p>{props.shareLink ? `${window.location.origin}/file/${props.shareLink.slice(1)}` : "Not sharing"}</p>
            </div>
            <div className="shareOptions">
                <button onClick={() => {
                    remove(ref(props.database, "files/" + props.shareLink))
                    remove(ref(props.database, `users/${props.user.uid}/shared/${cleanFilePath}`))
                    props.setShareLink(null)
                }}>Destroy</button>
                <button onClick={() => {
                    if(props.shareLink) {
                        remove(ref(props.database, "files/" + props.shareLink))
                        remove(ref(props.database, `users/${props.user.uid}/shared/${cleanFilePath}`))
                        props.setShareLink(null)
                    }

                    const fileRef = ref(props.database, `files`)
                    const userRef = ref(props.database, `users/${props.user.uid}/shared`)

                    const fileID = push(fileRef, props.fullKey).key
                    update(userRef, {[cleanFilePath]: fileID})
                    props.setShareLink(fileID)
                }}>Generate Link</button>
            </div>
        </div>
    )
}

export default ShareMenu;