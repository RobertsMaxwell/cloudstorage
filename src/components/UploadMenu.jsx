import folderUpload from "../assets/folderUpload.png"
import fileUpload from "../assets/fileUpload.png"
import { useEffect, useRef } from "react";

function UploadMenu(props) {
    const uploadMenuRef = useRef(null);
    
    useEffect(() => {
        const checkClick = e => {
            if(e.target != document.querySelector(".upload")) {
                props.setUploadMenu(false);
            }
        }
        
        document.addEventListener("click", checkClick);

        return () => {
            document.removeEventListener("click", checkClick);
        }
    }, []);

    return (
        <div className="uploadMenu" ref={uploadMenuRef} onClick={e => e.stopPropagation()}>
            <div className="uploadFolder" onClick={async () => {
                const dirHandle = await window.showDirectoryPicker()
                const formData = new FormData();
                
                const traverse = async (dirHandle, previousPath) => {
                    const currentDirectory = previousPath + dirHandle.name + "/"

                    formData.append("folderPaths[]", currentDirectory)
                    for await (const entry of dirHandle.values()) {
                        if(entry.kind === "file") {
                            formData.append("files[]", await entry.getFile())
                            formData.append("paths[]", currentDirectory + entry.name)
                        } else {
                            await traverse(entry, currentDirectory)
                        }
                    }
                }

                await traverse(dirHandle, "")

                let folderSize = 0;
                for(let [key, value] of formData.entries()) {
                    if(key.includes("file")) {
                        folderSize += value.size;
                    }
                }

                if(props.size + folderSize > props.maxSize) {
                    alert("You have reached the maximum size of your drive. Please delete some files or folders to upload this folder.");
                    return;
                }

                props.user.getIdToken(false).then(token => {
                    formData.append("token", token);
                    formData.append("key", props.currentKey);
                    fetch("https://t19kdqk7ji.execute-api.us-east-1.amazonaws.com/prod/upload", {
                        method: "POST",
                        body: formData
                    })
                    .then(() => {
                        props.loadFiles()
                    })
                })
                
            }}>
                <img src={folderUpload} />
                <p>Upload Folder</p>
            </div>
            <div className="uploadFile" onClick={() => {
                const folderInput = document.createElement("input");
                folderInput.type = "file";
                folderInput.style.display = "none";
                folderInput.addEventListener("change", (e) => {
                    const fileSize = e.target.files[0].size;
                    if(props.size + fileSize > props.maxSize) {
                        alert("You have reached the maximum size of your drive. Please delete some files or folders to upload this file.");
                        return;
                    }
                    props.user.getIdToken(false).then(token => {
                        const formData = new FormData();
                        formData.append("token", token);
                        formData.append("key", props.currentKey);
                        formData.append("paths[]", e.target.files[0].name);
                        formData.append("file", e.target.files[0]);

                        fetch("https://t19kdqk7ji.execute-api.us-east-1.amazonaws.com/prod/upload", {
                            method: "POST",
                            body: formData
                        })
                        .then(() => {
                            props.loadFiles()
                        })
                    })
                })
                document.body.appendChild(folderInput);
                folderInput.click();
            }}>
                <img src={fileUpload} />
                <p>Upload File</p>
            </div>
        </div>
    )
}

export default UploadMenu;