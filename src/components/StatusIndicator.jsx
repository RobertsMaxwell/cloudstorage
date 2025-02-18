import "../styles/StatusIndicator.css";

function StatusIndicator(props) {
  return (
    <div className="statusIndicator">
      <p>{props.text}</p>
      <span className="loader"></span>
    </div>
  );
}

export default StatusIndicator;