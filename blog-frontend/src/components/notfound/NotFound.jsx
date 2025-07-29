import "./notfound.css";
import { Link } from "react-router-dom";


function NotFound() {
    return (
        <div className="notfound-container">
            <div className="mirror-wrapper">
                <h1 className="mirrored notfound-title" data-text="404">
                    404</h1>
            </div>
            <p className="notfound-message">The page you're looking for doesn't exist.</p>
            <Link to="/" className="notfound-link">
                ← Back to Home
            </Link>
        </div>
    );
}
export default NotFound;