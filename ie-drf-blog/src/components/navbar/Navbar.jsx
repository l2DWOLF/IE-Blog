import {NavLink, useNavigate} from 'react-router-dom'
import "./css/navbar.css"


function Navbar() {
    let nav = useNavigate();

    let x = 9;
    if(x !== 9){
        nav("/");
    };


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
                        <li>
                            <NavLink to="/login">Login</NavLink>
                        </li>
                        <li>
                            <NavLink to="register">Register</NavLink>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </header>
    )
}
export default Navbar