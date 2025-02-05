import document from "./assets/document.png"
import dots from "./assets/dots.png"
import arrow from "./assets/right-arrow.png"
import folderIcon from "./assets/folder.png"
import { useEffect, useState } from "react"

import DeletePopup from "./DeletePopup"

function File (props) {
    return (
        <div className="file">
            <img className="fileImage" src={document} />
            <div className="fileInfo">
                <p className="fileName">{props.name}</p>
                <p className="fileSize">{props.size}</p>
            </div>
            <div className="dotMenu" onClick={(e) => {
                e.stopPropagation();
                props.setActiveDropdownKey(props.activeDropdownKey != props.index ? props.index : null)
            }}>
                <img src={dots} />
                {props.activeDropdownKey == props.index ? <div onClick={(e) => {}} className="dropdown">
                    <p onClick={() => {props.downloadCallback(props.file, props.name)}}>Download</p>
                    <p onClick={() => {props.openSharePopup(props.file)}}>Share Link</p>
                    <p onClick={() => {props.openDeletePopup(props.file)}}>Delete</p>
                </div> : ""}
            </div>
        </div>
    );
}

export default File;