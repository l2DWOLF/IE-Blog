import "./css/navbar.css"
import "./css/mobile-navbar.css"
import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import {NavLink} from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth';
import {useDispatch} from 'react-redux';
import { logoutHandler } from "../../auth/services/authService";
import { isUserAccess, modArticlesAccess } from "../../auth/utils/permissions";
import { useArticleSearch } from "../articles/hooks/useArticleSearch";
import { useArticleContext } from "../../contexts/ArticleContext";
import { useDebounce } from "../../hooks/useDebounce";

function Navbar() {
const dispatch = useDispatch();
const {user, isLoggedIn} = useAuth();
const {handleSearch} = useArticleContext();
const { resetArticles } = useArticleContext();
const {shouldEnableSearch, inputValue, onSearchChange, clearSearch} = useArticleSearch(handleSearch);

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

                        {isUserAccess(user) && 
                            <li>
                                <NavLink to="/liked-articles">Liked Articles</NavLink>
                            </li>
                        }
                        {modArticlesAccess(user) &&
                            <li>
                            <NavLink to="/my-articles">My Articles</NavLink>
                            </li>
                        }
                        {modArticlesAccess(user) && 
                            <li>
                            <NavLink to="/add-article">Add Article</NavLink>
                            </li>
                        }
                        {false && 
                            <li>
                                Pending implementation.
                                <NavLink to="/crm">CRM</NavLink>
                            </li>
                        }
                        
                    </ul>
                </div>
                {shouldEnableSearch && (
                    <div className="search-bar">
                        <input type="text" placeholder="Search Articles.." onChange={onSearchChange} value={inputValue} />
                        {inputValue ? (
                            <button onClick={clearSearch} className="search-icon-btn" title="Clear Search">
                                <X size={18} />
                            </button>
                        ) : (
                            <span className="search-icon">
                                <Search size={18} />
                            </span>
                        )}
                    </div>
                )}
                

                <div className="user-nav">
                    <ul>
                    {isLoggedIn ? ( <>
                    
                        <li>
                            <NavLink to="/Profile">Profile</NavLink>
                        </li>
                        <li>
                            <button className="nav-logout-btn" onClick={() => {
                                        logoutHandler(dispatch); 
                                        /* resetArticles(); */
                            }}>Logout</button>
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