import { useState } from "react";
import "../styles/Dashboard.css"
import FolderSmall from "../components/FolderSmall.jsx"
import File from "../components/File.jsx"
import account from "../assets/account.png"
import arrowRight from "../assets/right-arrow.png"
import arrow from "../assets/down-arrow.png"
import upload from "../assets/upload.png"
import glass from "../assets/glass.png"
import create from "../assets/create.png"
import home from "../assets/home.png"
import close from "../assets/close.png"
import homeFilled from "../assets/homeFilled.png"
import { useEffect } from "react";
import CreateFolderMenu from "../components/CreateFolderMenu.jsx"
import UploadMenu from "../components/UploadMenu.jsx"
import AccountMenu from "../components/AccountMenu.jsx"
import StatusIndicator from "../components/StatusIndicator.jsx";
import { useNavigate } from "react-router-dom"

function Dashboard (props) {
    const [files, setFiles] = useState(null)
    const [size, setSize] = useState(0)
    const maxSize = 100000000

    const [currentKey, setCurrentKey] = useState(null)
    const [createFolderMenu, setCreateFolderMenu] = useState(false)
    const [uploadMenu, setUploadMenu] = useState(false)
    const [accountMenu, setAccountMenu] = useState(false)
    const [fileSubset, setFileSubset] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [order, setOrder] = useState(null)

    const nav = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if(props.user) {
            setCurrentKey(props.user.uid + "/")
            if(files == null) {
                loadFiles()
            }
        } else if (!props.loadingAuth) {
            nav("/")
        }
    }, [props.user])

    useEffect(() => {
        if(files && currentKey) {
            let temp = []
            Object.entries(files).forEach(([key, value]) => {
                const filtered = value.Key.replace(currentKey, "").split("/").filter(ele => ele != "")
                if(filtered.length == 1) {
                    temp.push(value)
                }
            })
            setFileSubset(temp)
            setSize(Object.entries(files).reduce((acc, [key, value]) => acc + value.Size, 0))
            setLoading(false)
        }
    }, [files, currentKey])

    const loadFiles = () => {
        props.auth.currentUser.getIdToken(false).then((token) => {
            fetch("https://t19kdqk7ji.execute-api.us-east-1.amazonaws.com/prod/files", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": `${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setFiles(data.map(ele => {
                    return {
                        Key: ele.Key,
                        LastModified: new Date(ele.LastModified),
                        Size: ele.Size
                    }
                }))
            })
            .catch(err => {
                console.log(err)
            })
        })
    }

    const sortingFunction = (a, b) => {
        switch (order) {
            case "nameDown":
                return a.Key.replace(`${currentKey}`, "").localeCompare(b.Key.replace(`${currentKey}`, ""))
            case "nameUp":
                return b.Key.replace(`${currentKey}`, "").localeCompare(a.Key.replace(`${currentKey}`, ""))
            case "sizeDown":
                return a.Size - b.Size
            case "sizeUp":
                return b.Size - a.Size
            case "dateDown":
                return a.LastModified - b.LastModified
            case "dateUp":
                return b.LastModified - a.LastModified
            default:
                return
        }
    }

    return (
    <>
        <div className="dashboard">
            <div className={`left ${props.phone ? "phoneLeft" : ""}`} >
                <h1>Cloud Storage</h1>
                <div className="folders">
                    <div className={`folderSmall ${currentKey == props.user?.uid + "/" ? "activeFolder" : ""}`}>
                        <div className="folderName" onClick={() => {setCurrentKey(props.user.uid + "/")}}>
                            <img src={currentKey == props.user?.uid + "/" ? homeFilled : home} className="homeImage" />
                            <p>Home</p>
                        </div>
                    </div>
                    <FolderSmall level={1} name="Drive" files={files} masterKey={currentKey} currentKey={props.user?.uid + "/"} setCurrentKey={setCurrentKey} />
                </div>
                <div className="size">
                    <div className="bar">
                        <div className="bar_fill" style={{width: `${size / maxSize * 100}%`}} />
                    </div>
                    <div className="size_text">
                        <p>{getNeatSize(size)} used of {getNeatSize(maxSize)}</p>
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="dashboard_header">
                    <div className={`search ${search ? "searchActive" : ""}`}>
                        <img className="glass" src={glass} />
                        <img className="close" src={close} style={{display: search ? "block" : "none"}} onClick={() => {setSearch("")}} />
                        <input type="text" placeholder="Search" value={search} onChange={(e) => {
                            setSearch(e.target.value)
                        }} />
                    </div>
                    <div className="accountButton" onClick={() => {
                        setAccountMenu(!accountMenu)
                    }}>
                        <img src={account} />
                        {accountMenu ? <AccountMenu setAccountMenu={setAccountMenu} auth={props.auth} /> : ""}
                    </div>
                </div>
                <div className="functions">
                    <div className="path">
                        {currentKey ? currentKey.split("/").filter(ele => ele != "").map((ele, i) => <div key={i}><p onClick={() => {
                            const newKey = currentKey.split("/").slice(0, i + 1).join("/") + "/"
                            setCurrentKey(newKey)
                            }}>{ele == props.user.uid ? "Drive" : ele}</p> <img src={arrowRight} /></div>) : ""}
                    </div>
                    <div className="buttons">
                        <button className="create" onClick={() => {
                            if(props.verified) {
                                setCreateFolderMenu(!createFolderMenu)
                            } else {
                                alert("Please verify your email to create folders")
                            }
                        }}>
                            <img src={create} />
                            Create Folder
                        </button>
                        {createFolderMenu ? <CreateFolderMenu loadFiles={loadFiles} setCreateFolderMenu={setCreateFolderMenu} user={props.user} client={props.client} bucket={props.bucket} currentKey={currentKey} /> : ""}
                        <button className={`upload ${uploadMenu ? "activeUploadMenu" : ""}`} onClick={() => { 
                            if(props.verified) {
                                setUploadMenu(!uploadMenu)
                            } else {
                                alert("Please verify your email to upload files")
                            }
                        }}>
                            <img src={upload} />
                            Upload
                            <img src={arrow} />
                            {uploadMenu ? <UploadMenu setUploading={setUploading} loadFiles={loadFiles} setUploadMenu={setUploadMenu} user={props.user} client={props.client} bucket={props.bucket} currentKey={currentKey} size={size} maxSize={maxSize}/> : ""}
                        </button>
                    </div>
                </div>
                <div className="files">
                    <div className="title_file">
                        <p className="file_name" onClick={() => {order == "nameDown" ? setOrder("nameUp") : setOrder("nameDown")}}>Name</p>
                        <p className="file_type">Type</p>
                        <p className="file_size" onClick={() => {order == "sizeDown" ? setOrder("sizeUp") : setOrder("sizeDown")}}>Size</p>
                        <p className="file_date" onClick={() => {order == "dateDown" ? setOrder("dateUp") : setOrder("dateDown")}}>Date added</p>
                        <div className="file_options" />
                    </div>
                    {fileSubset ? fileSubset.filter(ele => {return search ? ele.Key.replace(`${currentKey}`, "").toLowerCase().includes(search.toLowerCase()) : true}).sort(sortingFunction).map((ele, i) => <File downloading={downloading} setDownloading={setDownloading} loadFiles={loadFiles} user={props.user} database={props.database} client={props.client} bucket={props.bucket} date={ele.LastModified} key={ele.Key} name={ele.Key.replace(`${currentKey}`, "")} size={ele.Size} currentKey={currentKey} setCurrentKey={setCurrentKey} />) : ""}
                    {fileSubset?.length == 0 ? <div className="noFiles">
                        <h1>No Files or Folders found in <i>{currentKey?.replace(`${props.user.uid}/`, "Drive/")}</i></h1>
                        <p>Try uploading a file or creating a folder</p>
                    </div> : ""}
                </div>
            </div>
        </div>
        <div className={`loading ${loading ? "" : "loadingEnd"}`}>
            <span className="dashboard_loader"></span>
        </div>
        {downloading || uploading ? <StatusIndicator text={downloading ? "Downloading" : "Uploading"} /> : ""}
    </>
    );
}

export function getNeatSize (messySize) {
    switch(true) {
        case messySize < 1000:
            return `${Math.round(messySize)} B`
        case messySize < 1000000:
            return `${Math.round(messySize / 1000)} KB`
        case messySize < 1000000000:
            return `${Math.round(messySize / 1000000)} MB`
        case messySize < 1000000000000:
            return `${Math.round(messySize / 1000000000)} GB`
    }
}

export default Dashboard;