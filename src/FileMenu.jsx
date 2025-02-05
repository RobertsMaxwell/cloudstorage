import { useEffect } from "react";

function FileMenu (props) {
    useEffect(() => {
        document.addEventListener("click", (e) => {
            if(e.target != props.dotsRef.current) {
                props.setFileMenu(false)
            }
        })
    }, [])
    
    return (
        <div className="fileMenu" onClick={(e) => {
            e.stopPropagation()
        }}>
            <button onClick={() => {
                props.setShareMenu(true)
                props.setFileMenu(false)
                }}>Share</button>
            <button onClick={() => {
                props.downloadFile()
                props.setFileMenu(false)
            }}>Download</button>
            <button onClick={() => {
                props.setDeletePopup(true)
                props.setFileMenu(false)
            }}>Delete</button>
        </div>
    )
}

export default FileMenu;