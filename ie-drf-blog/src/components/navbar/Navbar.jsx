import "./css/navbar.css"
import {NavLink} from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth';

function Navbar() {
const {user, isLoggedIn} = useAuth();

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
                    </ul>
                </div>

                <div className="user-nav">
                <ul>
                {isLoggedIn ? ( <>
                
                    <li>
                        <NavLink to="/Profile">Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to="/logout">logout</NavLink>
                    </li>
                </> ) : ( <>
                    <li>
                        <NavLink to="/login">Login</NavLink>
                    </li>
                    <li>
                        <NavLink to="register">Register</NavLink>
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