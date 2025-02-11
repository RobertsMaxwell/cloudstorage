import { useEffect, useRef, useState } from "react";
function CreateFolderMenu(props) {
    const [folderName, setFolderName] = useState("")
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current.focus()
    }, [])

    return (
        <div className="createFolderMenuContainer" onClick={() => {props.setCreateFolderMenu(false)}}>
            <div className="createFolderMenu" onClick={(e) => {
                e.stopPropagation()
            }}>
                <p>New Folder</p>
                <input type="text" placeholder="Name" value={folderName} onChange={(e) => {
                    setFolderName(e.target.value)
                }} ref={inputRef} />
                <div className="buttons">
                    <button onClick={() => {props.setCreateFolderMenu(false)}}>Cancel</button>
                    <button onClick={() => {
                        if(folderName) {
                            props.user.getIdToken(false).then(token => {
                                fetch(`https://t19kdqk7ji.execute-api.us-east-1.amazonaws.com/prod/createFolder`, {
                                    method: "POST",
                                    headers: {
                                        "token": token,
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        key: props.currentKey + folderName + "/",
                                    })

                                })
                                .then(() => {
                                    props.loadFiles()
                                    props.setCreateFolderMenu(false)
                                })
                            })
                        }
                    }}>Create</button>
                </div>
            </div>

        </div>
    )
}

export default CreateFolderMenu;    