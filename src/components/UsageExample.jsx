import "../styles/UsageExample.css"
import { useState } from "react";
import placeholder from "../assets/600x400.svg"

function UsageExample () {
    const [selected, setSelected] = useState(0)
    
    return (
        <div className="usageExample">
            <p className="title">Free File Storage</p>
            <p className="desc">Personal file storage service created by github.com/asdjAadasdsa that<br/>allows you to upload and store your files in the cloud.</p>
            <div className="features">
                <img src={placeholder} />
                <div className="featSelect">
                    <div className={`fileStructure ${selected == 0 ? "selected" : ""}`} onClick={() => {setSelected(0)}}>
                        <div className="absoluteContainer">
                            <p className="featTitle">Robust file structure</p>
                            <p className="featDetails">Organize your files into folders and subfolders to keep them structured and easy to find.</p>
                        </div>
                    </div>
                    <div className={`seamlessUpload ${selected == 1 ? "selected" : ""}`} onClick={() => {setSelected(1)}}>
                    <div className="absoluteContainer">
                            <p className="featTitle">Frictionless upload</p>
                            <p className="featDetails">Upload your files or folders and instantly integrate it into your existing folder structure.</p>
                        </div>
                    </div>
                    <div className={`sharing ${selected == 2 ? "selected" : ""}`} onClick={() => {setSelected(2)}}>
                    <div className="absoluteContainer">
                            <p className="featTitle">Shareable links</p>
                            <p className="featDetails">Create a shareable link to your file or folder for seamless access. You can regenerate or delete the link at any time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsageExample