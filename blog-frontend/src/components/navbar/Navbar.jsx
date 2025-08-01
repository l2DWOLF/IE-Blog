import "./css/navbar.css"
import "./css/mobile-navbar.css"
import { useState } from "react";
import { X, Menu, Search } from "lucide-react";
import {NavLink} from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth';
import {useDispatch} from 'react-redux';
import { logoutHandler } from "../../auth/services/authService";
import { isUserAccess, modArticlesAccess } from "../../auth/utils/permissions";
import { useArticleSearch } from "../articles/hooks/useArticleSearch";
import { useArticleContext } from "../../contexts/ArticleContext";
import { motion, AnimatePresence } from 'motion/react'

function Navbar() {
const dispatch = useDispatch();
const {user, isLoggedIn} = useAuth();
const {handleSearch} = useArticleContext();
const {shouldEnableSearch, inputValue, onSearchChange, clearSearch} = useArticleSearch(handleSearch);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isClosing, setIsClosing] = useState(false);

    const closeMenu = () => {
        setIsClosing(true);
        
        setTimeout(() => {
            setIsMobileMenuOpen(false);
            setIsClosing(false);
        }, 100);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return(
    <header className="navbar-header">
        <div className="navbar">
            <div className="logo">
                    <NavLink to="/" className="mirrored" 
                    data-text="IE Blog" onClick={scrollToTop}>IE Blog</NavLink>
            </div>

            {shouldEnableSearch && (
                <div className="search-bar sb-mobile">
                    <input type="text" placeholder="Search Articles.." onChange={onSearchChange} value={inputValue} />
                    {inputValue ? (
                        <button onClick={clearSearch} className="search-icon-btn" title="Clear Search">
                            <X size={19} />
                        </button>
                    ) : (
                        <span className="search-icon">
                            <Search size={19} />
                        </span>
                    )}
                </div>
            )}

            <div className="nav-wrapper">
                <div className="site-nav">
                    <ul>
                        <li>
                                <NavLink to="/" onClick={scrollToTop}>Home</NavLink>
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
                        <input name="searchbar" type="text" placeholder="Search Articles.." onChange={onSearchChange} value={inputValue} />
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
                            <button className="nav-logout-btn" title="Logout" onClick={() => {
                                        logoutHandler(dispatch); 
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
            
            {/* Mobile Menu */}
                <button className="mobile-menu-toggle" title="Mobile menu"
                onClick={() => {
                    if (isMobileMenuOpen) {
                        closeMenu();
                    } else {
                        setIsMobileMenuOpen(true);
                    }
                }}>
                {isMobileMenuOpen ? <X size={35} className="menu-icon menu-x"/> : <Menu size={35} className="menu-icon menu-burger"/>}
            </button>

            <AnimatePresence>
                {isMobileMenuOpen && ( <>
                
                <motion.div
                    className="mobile-menu-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                <div className="mobile-menu-wrapper">
                    <div className={`menu-wires ${isMobileMenuOpen ? 'menu-open' : ''} ${isClosing ? 'menu-closing' : ''}`}>

                        <div className="wire wire-left" />
                        <div className="wire wire-center" />
                        <div className="wire wire-right" />
                    </div>
                <motion.div className="mobile-menu"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'tween', ease: 'easeIn', duration: 0.5 }}
                >
                    <ul className="mobile-links">
                        <li><NavLink to="/" onClick={() => {
                            scrollToTop(); setIsMobileMenuOpen(false)
                        }}>Home</NavLink></li>
                        <li><NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</NavLink></li>
                        {isUserAccess(user) && <li><NavLink to="/liked-articles" onClick={() => setIsMobileMenuOpen(false)}>Liked Articles</NavLink></li>}
                        {modArticlesAccess(user) && <li><NavLink to="/my-articles" onClick={() => setIsMobileMenuOpen(false)}>My Articles</NavLink></li>}
                        {modArticlesAccess(user) && <li><NavLink to="/add-article" onClick={() => setIsMobileMenuOpen(false)}>Add Article</NavLink></li>}
                        {isLoggedIn ? (<>
                            <li><NavLink to="/Profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</NavLink></li>
                            <li><button title="Logout" onClick={() => { logoutHandler(dispatch); setIsMobileMenuOpen(false); }}>Logout</button></li>
                        </>) : (<>
                            <li><NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</NavLink></li>
                            <li><NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</NavLink></li>
                        </>)}
                    </ul>
                </motion.div>
                </div>
                </>)}
            </AnimatePresence>
        </div>
    </header>
    )
}
export default Navbar