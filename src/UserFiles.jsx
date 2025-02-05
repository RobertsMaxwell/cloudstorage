// import "./UserFiles.css"
import File from "./File.jsx"
import Folder from "./Folder.jsx"
import { useEffect, useRef, useState } from "react"
import { getNeatSize } from "./UploadPopup.jsx"

import {ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3"

import DeletePopup from "./DeletePopup.jsx"
import SharePopup from "./SharePopup.jsx"
import UploadPopup from "./UploadPopup.jsx"
import { useNavigate } from "react-router-dom"

function UserFiles (props) {
    const [uploadPopup, setUploadPopup] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [sharePopup, setSharePopup] = useState(false)
    const [files, setFiles] = useState(null)
    const [totalSize, setTotalSize] = useState(0)
    const [maxSize, setMaxSize] = useState(10000000)

    const [lastSelectedFile, setLastSelectedFile] = useState(null)
    const [activeDropdownKey, setActiveDropdownKey] = useState(null)

    const sizeBarRef = useRef(null)

    const nav = useNavigate()

    useEffect(() => {
        document.body.addEventListener('click', () => {
            setActiveDropdownKey(null)
        })
    }, [])

    useEffect(() => {
        if(files) {
            let sum = 0
            files.forEach(ele => {sum += ele.Size})
            setTotalSize(sum)
            sizeBarRef.current.style.width = `${100 * (sum / maxSize)}%`
        }
    }, [files])

    const download = (file, name) => {
        const command = new GetObjectCommand({Bucket: props.bucket, Key: file.Key})
        props.client.send(command)
        .then(data => {
            console.log(data)
            data.Body.transformToByteArray()
            .then(bytes => {
                let blob = new Blob([bytes])
                console.log(blob.size)
                const link = document.createElement("a")
                link.href = window.URL.createObjectURL(blob)
                link.download = name
                
                document.body.appendChild(link)
    
                link.dispatchEvent(new MouseEvent('click'))
    
                document.body.removeChild(link)
            })
        })
        .catch(e => {
            console.log(e)
        })
    }

    const deleteEntry = (file) => {
        const command = new DeleteObjectCommand({Bucket: props.bucket, Key: file.Key})
        props.client.send(command)
        .then(data => {
            console.log("DELETED")
            console.log(data)
        })
        .catch(e => {
            console.log(e)
        })
    }

    const openDeletePopup = (file) => {
        setLastSelectedFile(file)
        setDeletePopup(true)
    }

    const openSharePopup = (file) => {
        setLastSelectedFile(file)
        setSharePopup(true)
    }

    return (
        <>
            <div className="userFiles">
                <div className="leftInfo">
                    <button onClick={() => {setUploadPopup(true)}}>Upload File</button>
                    <p>{`${getNeatSize(totalSize)} used of ${getNeatSize(maxSize)}`}</p>
                    <div className="sizeBar">
                        <div className="sizeBarInner" ref={sizeBarRef}></div>
                    </div>
                </div>
                <div className="fileDisplay">
                    {files ? files.map((ele, i) => <File key={i} index={i} openSharePopup={openSharePopup} openDeletePopup={openDeletePopup} file={ele} downloadCallback={download} activeDropdownKey={activeDropdownKey} setActiveDropdownKey={setActiveDropdownKey} name={ele.Key.replace(`${props.user.uid}/`, "")} size={getNeatSize(ele.Size)} />) : ""}
                    <button onClick={() => {
                        if(props.client) {
                            const command = new ListObjectsV2Command({Bucket: props.bucket, Prefix: `${props.user.uid}/`})
                            props.client.send(command)
                            .then(data => {
                                setFiles(data.Contents)
                            })
                            .catch(error => {console.log(error)})
                        }
                    }}>CHECK</button>
                </div>
            </div>
            {sharePopup ? <SharePopup database={props.database} user={props.user} file={lastSelectedFile} setSharePopup={setSharePopup} /> : ""}
            {deletePopup ? <DeletePopup user={props.user} file={lastSelectedFile} deleteCallback={deleteEntry} setDeletePopup={setDeletePopup} /> : ""}
            {uploadPopup ? <UploadPopup totalSize={totalSize} maxSize={maxSize} user={props.user} bucket={props.bucket} client={props.client} setUploadPopup={setUploadPopup} /> : ""}
        </>
    );
}

export default UserFiles;