import { useState, useEffect } from "react";
import triangle from "../assets/triangle.png"
import drive from "../assets/hard-drive.png"
import folder from "../assets/foldericon.png"

function FolderSmall (props) {
    const [open, setOpen] = useState(false)
    const [nameFromKey, setNameFromKey] = useState("Folder")
    const [children, setChildren] = useState(null)

    useEffect(() => {
        if(props.name == "Drive") {
            setOpen(true)
        }

        if(props.files && props.currentKey) {
            setNameFromKey(props.currentKey.substring(0, props.currentKey.length - 1).split("/").pop())
            const filtered = props.files.filter(ele => {
                const split = ele.Key.replace(props.currentKey, "").split("/")
                if(split.length == 2 && split[1] == "") {
                    return true
                }
                return false
            })
            setChildren(filtered)
        }
    }, [props.files])

    useEffect(() => {
        if(props.masterKey && props.masterKey == props.currentKey) {
            setOpen(true)
        }
    }, [props.masterKey])

    return (
        <div className="folderSmall">
            <div className={`folderName ${open ? "open" : ""}`} onClick={() => {setOpen(!open)}} style={{paddingLeft: 10 + props.level * 10 + "px"}}>
                {props.name == "Drive" ? <img className="driveImage" src={drive} /> : 
                <>
                    <img src={triangle} className="triangle" />
                    <img src={folder} className="folderImage" />
                </>
                }
                <p className={`${props.name == "Drive" ? "" : "clickableFolderName"}`} onClick={() => {
                    if(props.name != "Drive") {
                        props.setCurrentKey(props.currentKey)
                    }
                }}>{props.name ? props.name : nameFromKey}</p>
                {props.name == "Drive" ? <img src={triangle} className="triangle" /> : ""}
            </div>
            {open && children ? children.map((ele, i) => {return <FolderSmall key={ele.Key} level={props.level + 1} setCurrentKey={props.setCurrentKey} files={props.files} masterKey={props.masterKey} currentKey={ele.Key} />}) : ""}
        </div>
    );
}

export default FolderSmall;