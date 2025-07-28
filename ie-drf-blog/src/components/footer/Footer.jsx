import "./css/footer.css"
import "./css/mobile-footer.css"
import {NavLink} from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth';

import { isUserAccess, modArticlesAccess } from "../../auth/utils/permissions";

function Footer() {
const {user, isLoggedIn} = useAuth();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return(
    <footer className="footer-wrapper">
        <div className="footer">
            <div className="footer-logo">
                    <NavLink to="/" className="mirrored" 
                    data-text="IE Blog" onClick={scrollToTop}>IE Blog</NavLink>
            </div>

            <div className="footer-nav-wrapper">
                <div className="site-nav">
                    <ul>
                        <li>
                                <NavLink to="/" onClick={scrollToTop}>Home</NavLink>
                        </li>
                        <li className="hide-footer-li">
                            <NavLink to="/about">About</NavLink>
                        </li>

                        {isUserAccess(user) && 
                            <li className="hide-footer-li">
                                <NavLink to="/liked-articles">Liked Articles</NavLink>
                            </li>
                        }
                        {modArticlesAccess(user) &&
                            <li className="hide-footer-li">
                            <NavLink to="/my-articles">My Articles</NavLink>
                            </li>
                        }
                        {modArticlesAccess(user) && 
                            <li className="hide-footer-li">
                            <NavLink to="/add-article">Add Article</NavLink>
                            </li>
                        }
                        {isLoggedIn ? (<>
                            <li>
                                <NavLink to="/Profile">Profile</NavLink>
                            </li>
                        </>) : (<>
                            <li>
                                <NavLink to="/login">Login</NavLink>
                            </li>
                            <li>
                                <NavLink to="/register">Register</NavLink>
                            </li>
                        </>)}
                    </ul>
                </div>
            </div>
        </div>
    </footer>
    )
}
export default Footer