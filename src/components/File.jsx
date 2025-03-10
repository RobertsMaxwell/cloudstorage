import { useState, useEffect, useRef } from "react"
import dots from "../assets/dots.png"
import folderIcon from "../assets/folder.png"
import FileMenu from "./FileMenu.jsx"
import DeletePopup from "./DeletePopup.jsx"
import videoIcon from "../assets/videoIcon.png"
import pdfIcon from "../assets/pdfIcon.png"
import imageIcon from "../assets/imageIcon.png"
import blankIcon from "../assets/blankIcon.png"
import txtIcon from "../assets/txtIcon.png"
import { getNeatSize } from "../pages/Dashboard.jsx"
import ShareMenu from "./ShareMenu.jsx"
import { get, ref } from "firebase/database"
import JSZip from "jszip"

function File(props) {
    const [type, setType] = useState("")
    const [fileMenu, setFileMenu] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [shareMenu, setShareMenu] = useState(false)
    const [folderSize, setFolderSize] = useState(0)
    const [shareLink, setShareLink] = useState(null)
    const dotsRef = useRef(null)

    const cleanFilePath = (props.currentKey + props.name).replace(/[.#$/\[\]]/g, "")

    useEffect(() => {
        if(props.name.includes(".")) {
            const tempSplit = props.name.split(".")
            setType(tempSplit[tempSplit.length - 1])
        } else if(props.name[props.name.length - 1] == "/") {
            setType("Folder")
    }
    get(ref(props.database, `users/${props.user.uid}/shared`))
    .then(data => {
        if(data.val()) {
            const fileKey = data.val()[cleanFilePath]
            if(fileKey) {
                setShareLink(fileKey)
            }
        }
    })
    }, [])

    const deleteFile = () => {
        props.user.getIdToken(false).then(token => {
            fetch("https://t19kdqk7ji.execute-api.us-east-1.amazonaws.com/prod/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": `${token}`
                },
                body: JSON.stringify({
                    prefix: props.currentKey + props.name
                })
            })
            .then(() => {
                props.loadFiles()
            })
        })
        return 
    }

    const downloadFile = async () => {
        const lastDownload = localStorage.getItem("lastDownload")
        if(lastDownload && Date.now() - lastDownload < 3000) {
            alert("Please wait a few seconds before downloading again")
            return
        } else if(props.downloading) {
            alert("Download already in progress")
            return
        } else {
            localStorage.setItem("lastDownload", Date.now())
        }
        props.setDownloading(true)
        props.user.getIdToken(false).then(async token => {
            console.log(props.currentKey)
            fetch(`https://t19kdqk7ji.execute-api.us-east-1.amazonaws.com/prod/download?key=${props.currentKey + props.name}&folder=${type == "Folder" ? "true" : "false"}&token=${token}`, {
                method: "GET"
            })
            .then(res => res.json())
            .then(async data => {
                if(type == "Folder") {
                    const zip = new JSZip()
                    for (const [i, url] of data.urls.entries()) {
                        const res = await fetch(url)
                        const blob = await res.blob()
                        const name = data.keys[i].replace(props.currentKey, "")
                        console.log(blob)
                        zip.file(name, blob)
                    }
                    const zipBuffer = await zip.generateAsync({type: "blob"})
                    const url = URL.createObjectURL(zipBuffer)
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = props.name.slice(0, -1) + ".zip";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    props.setDownloading(false)
                } else {
                    fetch(data.urls[0])
                    .then(async res => {
                        const url = URL.createObjectURL(await res.blob())
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = props.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        props.setDownloading(false)
                    })
                }
            })
            .catch(err => {
                props.setDownloading(false)
                alert(err)
            })
            // fetch(`https://t19kdqk7ji.execute-api.us-east-1.amazonaws.com/prod/download?key=${props.currentKey + props.name}&folder=${type == "Folder" ? "true" : "false"}&token=${token}`, {
            //     method: "GET"
            // })
            // .then(async res => {
            //     const url = URL.createObjectURL(await res.blob())
            //     const a = document.createElement('a');
            //     a.href = url;
            //     a.download = type == "Folder" ? props.name.slice(0, -1) + ".zip" : props.name;
            //     document.body.appendChild(a);
            //     a.click();
            //     document.body.removeChild(a);
            //     URL.revokeObjectURL(url);
            //     props.setDownloading(false)
            // })
        })
    }

    const checkIfBeingSwitched = () => {
        let tempName = props.name
        if(props.name[props.name.length - 1] == "/") {
            tempName = tempName.slice(0, -1)
        }
        return tempName.includes("/")
    }

    return (
        checkIfBeingSwitched() ? "" :
        <div className="file">
            <div className="file_name" onDoubleClick={() => {
                if(type == "Folder") {
                    props.setCurrentKey(props.currentKey + props.name)
                }
            }}>
                <img src={
                    type == "Folder" ? folderIcon : 
                    type == "mp4" || type == "mov" || type == "avi" || type == "mkv" ? videoIcon : 
                    type == "jpg" || type == "jpeg" || type == "png" || type == "gif" || type == "bmp" || type == "tiff" || type == "ico" || type == "webp" || type == "svg" ? imageIcon :
                    type == "txt" ? txtIcon :
                    type == "pdf" ? pdfIcon 
                    : blankIcon} />
                <p onClick={() => {
                    if(type == "Folder") {
                        props.setCurrentKey(props.currentKey + props.name)
                    }
                }} className={type == "Folder" ? "folder_name" : ""}>
                    {props.name[props.name.length - 1] == "/" ? props.name.slice(0, -1) : props.name}
                </p>
                <div className={`shareStatus ${shareLink ? "shareStatusActive" : "shareStatusEmpty"}`} />
            </div>
            <p className="file_type">{type}</p>
            <p className="file_size">{type == "Folder" ? "--" : getNeatSize(props.size)}</p>
            <p className="file_date">{props.date.toLocaleDateString("en-US", {year: "2-digit", month: "2-digit", day: "2-digit"})}</p>
            <div className={`file_options`}>
                <img className={`dots ${fileMenu || shareMenu ? "activeFileMenu" : ""}`} ref={dotsRef} src={dots} onClick={() => {
                    if(!shareMenu) {
                        setFileMenu(!fileMenu)
                    }
                }} />
                {fileMenu ? <FileMenu setShareMenu={setShareMenu} downloadFile={downloadFile} setFileMenu={setFileMenu} dotsRef={dotsRef} setDeletePopup={setDeletePopup} /> : ""}
                {shareMenu ? <ShareMenu shareLink={shareLink} setShareLink={setShareLink} database={props.database} user={props.user} setShareMenu={setShareMenu} name={props.name} fullKey={props.currentKey + props.name} /> : ""}
                {deletePopup ? <DeletePopup deleteFile={deleteFile} setDeletePopup={setDeletePopup} name={props.name} /> : ""}
            </div>
        </div>
    )
}

export default File;