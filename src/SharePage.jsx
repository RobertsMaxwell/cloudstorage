import { useParams, useNavigate } from "react-router-dom"    
import "./SharePage.css"
import blankIcon from "./assets/blankIcon.png"
import folderIcon from "./assets/folder.png"
import videoIcon from "./assets/videoIcon.png"
import imageIcon from "./assets/imageIcon.png"
import txtIcon from "./assets/txtIcon.png"
import pdfIcon from "./assets/pdfIcon.png"
import { useEffect, useState } from "react"
import { getNeatSize } from "./Dashboard"

function SharePage(props) {
    const { fileID } = useParams()
    const [file, setFile] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        fetch("http://54.87.129.15:3000/getFileHeader", {
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
            setFile({fullKey: data.key, name: data.name, size: data.ContentLength, type: data.type})
        })
    }, [])

    const downloadFile = async () => {
        fetch(`http://54.87.129.15:3000/downloadPublicFile/?id=files/-${fileID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(async res => {
            console.log("completed")
            const url = URL.createObjectURL(await res.blob())
            const a = document.createElement('a')
            a.href = url
            a.download = file.name
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        })
        // const zip = new JSZip()
        
        // if(file?.type == "Folder") {
        //     const findFiles = new ListObjectsV2Command({Bucket: props.bucket, Prefix: file.fullKey})
        //     const data = await props.client.send(findFiles)
            
        //     for(let i = 0; i < data.Contents.length; i++) {
        //         const getFile = new GetObjectCommand({Bucket: props.bucket, Key: data.Contents[i].Key})
        //         const fileResult = await props.client.send(getFile)
                
        //         let previousKey = file.fullKey.slice(0, file.fullKey.length - 1)
        //         previousKey = previousKey.slice(0, previousKey.lastIndexOf("/"))
        //         zip.file(data.Contents[i].Key.replace(`${previousKey}/`, ""), new Blob([await fileResult.Body.transformToByteArray()]))
        //     }

        //     const completedFile = await zip.generateAsync({type: "blob"})
        //     const link = document.createElement("a")
        //     link.href = window.URL.createObjectURL(completedFile)
        //     link.download = "download.zip"
        //     document.body.appendChild(link)
        //     link.dispatchEvent(new MouseEvent("click"))
        //     document.body.removeChild(link)

        // } else {
        //     const getFile = new GetObjectCommand({Bucket: props.bucket, Key: file.fullKey})
        //     const url = await getSignedUrl(props.client, getFile, {expiresIn: 60})
        //     window.location.href = url
        // }
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