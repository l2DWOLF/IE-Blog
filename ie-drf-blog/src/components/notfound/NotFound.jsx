import "./notfound.css";
import { Link } from "react-router-dom";


function NotFound() {
    return (
        <div className="notfound-container">
            <h1 className="notfound-title">404</h1>
            <p className="notfound-message">The page you're looking for doesn't exist.</p>
            <Link to="/" className="notfound-link">
                ← Back to Home
            </Link>
        </div>
    );
}
export default NotFound;