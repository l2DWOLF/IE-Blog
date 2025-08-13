import "./css/home.css"
import Articles from "../articles/Articles"
import useAuth from "../../auth/hooks/useAuth"
import { Home as HomeIcon, Star, FileEdit, LogOut, CircleUserRound } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { logoutHandler } from "../../auth/services/authService";
import { useDispatch } from "react-redux";

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useAuth();
    return (
    <div className="home-div">
        <div className="mirror-wrapper">
            <h1 className="mirrored" data-text="IE Blog">
                IE Blog</h1>
        </div>

        {user?.id &&
            <div className="greeting">

                <div className="greeting-top">
                    {user?.id && <p>Hello {user?.username} 🙋‍♂️</p>}

                    <div className="badges-container">
                        {user?.is_admin &&
                            <p className="role-badge">🔧 Admin User</p>}
                        {(user?.is_mod && !user?.is_staff) &&
                            <p className="role-badge">🛡️ Moderator</p>}
                        {(user?.is_staff && !user?.is_admin) &&
                            <p className="role-badge">👤 Admin Staff </p>}
                    </div>
                </div>

                <div className="profile-nav-buttons">
                    <span className="greeting-msg-span">Welcome Back !</span>
                <button title="Home" onClick={() => navigate("/")}>
                    <HomeIcon className="card-icons" /> Home
                </button>
                <button title="Liked articles" onClick={() => navigate("/liked-articles")}>
                    <Star className="card-icons" /> Liked Articles
                </button>
                {(user?.is_admin || user?.is_staff || user?.is_mod) &&
                    <button title="My articles" onClick={() => navigate("/my-articles")}>
                        <FileEdit className="card-icons" /> My Articles
                    </button>
                }
                <button title="Profile" onClick={() => navigate("/profile")}>
                        <CircleUserRound className="card-icons" /> Profile
                </button>
                <button title="Logout" onClick={() => {
                    logoutHandler(dispatch)
                }}>
                    <LogOut className="card-icons" /> Logout
                </button>
                </div>
        </div>}

        {!user?.id &&
            <div className="greeting">

                <div className="greeting-top">
                        {<p style={{ width: "100%" }}>Hello Guest! 🙋‍♂️</p>}
                </div>

                <div className="profile-nav-buttons">
                        <span className="greeting-msg-span">Register or Login to like articles and add comments.</span>
                    <button title="Home" onClick={() => navigate("/")}>
                        <HomeIcon className="card-icons" /> Home
                    </button>
                    <button title="Register" onClick={() => navigate("/register")}>
                        <Star className="card-icons" /> Register
                    </button>

                    <button title="Login" onClick={() => navigate("/login")}>
                        <FileEdit className="card-icons" /> Login
                    </button>
                </div>
        </div>}

        <Articles/>
    </div>)
}
export default Home