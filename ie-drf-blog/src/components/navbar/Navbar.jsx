import "./css/navbar.css"
import {NavLink} from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth';
import {useDispatch} from 'react-redux';
import { logoutHandler } from "../../auth/services/authService";
import { canAddArticles } from "../../auth/utils/permissions";

function Navbar() {
const dispatch = useDispatch();
const {user, isLoggedIn} = useAuth();

    return(
    <header>
        <div className="navbar">
            <div className="logo">
                    <NavLink to="/" className="mirrored" data-text="IE Blog">IE Blog</NavLink>
            </div>

            <div className="nav-wrapper">
                <div className="site-nav">
                    <ul>
                        <li>
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/about">About</NavLink>
                        </li>
                        <li>
                            <NavLink to="/liked-articles">Liked Articles</NavLink>
                        </li>
                        <li>
                            <NavLink to="/my-articles">My Articles</NavLink>
                        </li>
                        {canAddArticles(user) && 
                        <li>
                            <NavLink to="/add-article">Add Article</NavLink>
                        </li>}
                        <li>
                            <NavLink to="/crm">CRM</NavLink>
                        </li>
                    </ul>
                </div>

                <div className="user-nav">
                    <ul>
                    {isLoggedIn ? ( <>
                    
                        <li>
                            <NavLink to="/Profile">Profile</NavLink>
                        </li>
                        <li>
                            <button onClick={() => {
                                logoutHandler(dispatch)}}>Logout</button>
                        </li>
                    </> ) : ( <>
                        <li>
                            <NavLink to="/login">Login</NavLink>
                        </li>
                        <li>
                            <NavLink to="/register">Register</NavLink>
                        </li>
                    </> )}
                        
                    </ul>
                </div>

            </div>

        </div>
    </header>
    )
}
export default Navbar