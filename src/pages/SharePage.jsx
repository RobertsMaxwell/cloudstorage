import { useParams, useNavigate } from "react-router-dom"    
import "../styles/SharePage.css"
import blankIcon from "../assets/blankIcon.png"
import folderIcon from "../assets/folder.png"
import videoIcon from "../assets/videoIcon.png"
import imageIcon from "../assets/imageIcon.png"
import txtIcon from "../assets/txtIcon.png"
import pdfIcon from "../assets/pdfIcon.png"
import { useEffect, useState } from "react"
import { getNeatSize } from "./Dashboard"
import JSZip from "jszip"

function SharePage(props) {
    const { fileID } = useParams()
    const [file, setFile] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        fetch("https://t19kdqk7ji.execute-api.us-east-1.amazonaws.com/prod/getFileHeader", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                key: `files/-${fileID}`
            })
        })
        .then((res) => res.json())
        .then((data) => {
            setFile({fullKey: data.key, name: data.name, size: data.type == "folder" ? data.folderSize : data.ContentLength, type: data.type})
        })
    }, [])

    const downloadFile = async () => {
        const lastDownload = localStorage.getItem("lastDownload")
        if(lastDownload && Date.now() - lastDownload < 3000) {
            return
        } else {
            localStorage.setItem("lastDownload", Date.now())
        }
        fetch(`https://t19kdqk7ji.execute-api.us-east-1.amazonaws.com/prod/downloadPublicFile?id=files/-${fileID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => res.json())
        .then(async data => {
            if(file.type == "folder") {
                const zip = new JSZip()
                for (const [i, url] of data.urls.entries()) {
                    const res = await fetch(url)
                    const blob = await res.blob()
                    const userId = data.keys[i].slice(0, data.keys[i].indexOf("/") + 1)
                    const name = data.keys[i].replace(userId, "")
                    console.log(blob)
                    zip.file(name, blob)
                }
                const zipBuffer = await zip.generateAsync({type: "blob"})
                const url = URL.createObjectURL(zipBuffer)
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name + ".zip";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                fetch(data.urls[0])
                .then(async res => {
                    const url = URL.createObjectURL(await res.blob())
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                })
            }
        })
        .catch(err => {
            alert(err)
        })
        // .then(async res => {
        //     console.log("completed")
        //     const url = URL.createObjectURL(await res.blob())
        //     const a = document.createElement('a')
        //     a.href = url
        //     a.download = file.name
        //     document.body.appendChild(a)
        //     a.click()
        //     document.body.removeChild(a)
        //     URL.revokeObjectURL(url)
        // })
        // .catch(err => {
        //     console.log(err)
        // })
    }

    return (
        <div className="sharePage">
            <div className="shareHeader">
                <h1>Cloud Storage</h1>
                <button onClick={() => {
                    navigate("/")
                }}>Get Started</button>
            </div>
            <div className="fileDisplay">
                <img src={
                    file?.type == "folder" ? folderIcon : 
                    file?.type == "mp4" || file?.type == "mov" || file?.type == "avi" || file?.type == "mkv" ? videoIcon : 
                    file?.type == "jpg" || file?.type == "jpeg" || file?.type == "png" || file?.type == "gif" || file?.type == "bmp" || file?.type == "tiff" || file?.type == "ico" || file?.type == "webp" || file?.type == "svg" ? imageIcon :
                    file?.type == "txt" ? txtIcon :
                    file?.type == "pdf" ? pdfIcon 
                    : blankIcon} />
                <div className="fileInfo">
                    <p className="fileName">{file?.name}</p>
                    -
                    <p className="fileSize">{getNeatSize(file?.size)}</p>
                </div>
                {file ? <button onClick={downloadFile}>Download</button> : ""}
            </div>
        </div>
    )
}

export default SharePage