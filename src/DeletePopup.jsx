function DeletePopup (props) {
    return (
        <div className="deletePopupContainer" onClick={() => {
            props.setDeletePopup(false)
        }}>
            <div className="deletePopup" onClick={(e) => {
                e.stopPropagation()
            }}>
                <h1>Delete</h1>
                <p>Are you sure you want to delete "{props.name}"?</p>
                <div className="buttonGroup">
                    <button className="cancel" onClick={() => {props.setDeletePopup(false)}}>Cancel</button>
                    <button className="confirm" onClick={() => {
                        props.deleteFile()
                    }}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default DeletePopup;
