import "./css/navbar.css"
import {NavLink} from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth';
import {useDispatch} from 'react-redux';
import { logoutHandler } from "../../auth/services/authService";

function Navbar() {
const dispatch = useDispatch();
const {isLoggedIn} = useAuth();

    return(
    <header>
        <div className="navbar">
            <div className="logo">
                <NavLink to="/">IE Blog</NavLink>
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
                            <NavLink to="/likedarticles">Liked Articles</NavLink>
                        </li>
                        <li>
                            <NavLink to="/myarticles">My Articles</NavLink>
                        </li>
                        <li>
                            <NavLink to="/addarticle">Add Article</NavLink>
                        </li>
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
                                logoutHandler(dispatch)}}>logout</button>
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