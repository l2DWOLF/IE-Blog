import './css/profilepage.css';
import './css/mobile-profilepage.css';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from 'motion/react';
import useAuth from '../../../auth/hooks/useAuth';
import LoadingScreen from '../../common/loadscreen/LoadingScreen';
import { deleteUser, getPublicProfile, getUserInfo, getUserProfile } from '../../../services/userServices';
import { handleException } from '../../../utils/errors/handleException';
import { LogOut, HomeIcon, CircleUserRound, FileEdit, Trash2, Star } from 'lucide-react';
import EditProfileForm from './EditProfileForm';
import { logoutHandler } from '../../../auth/services/authService';
import { useDispatch } from 'react-redux';
import { successMsg } from '../../../utils/toastify/toast';

function ProfilePage() {
    const { id } = useParams();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [publicProfile, setPublicProfile] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [profileObj, setProfileObj] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const viewingOwnProfile = !id || id === String(user?.id);
    let userId = id || user?.id;

    async function fetchUser() {
        setIsLoading(true);
        try {
            if(!viewingOwnProfile){
                const publicProfileData = await getPublicProfile(userId);
                setPublicProfile(publicProfileData);
            } else {
                const [userInfo, profile] = await Promise.all([
                    getUserInfo(userId),
                    getUserProfile(userId),
                ])
                setUserInfo(userInfo);
                setUserProfile(profile);
            };
        } catch (err) {
            handleException(err);
            setPublicProfile(null);
            setUserInfo(null);
            setUserProfile(null);
            setProfileObj(null);
        } finally {
            setIsLoading(false);
        };
    };

    useEffect(() => {
        if (userId !== "") fetchUser();
    }, [userId]);

    useEffect(() => {
        if(viewingOwnProfile && userInfo && userProfile){
            setProfileObj({...userInfo, ...userProfile});
        } else if (!viewingOwnProfile && publicProfile){
            setProfileObj(publicProfile);
        }
    }, [viewingOwnProfile, userInfo, userProfile, publicProfile]);

    const handleCancel = () => setIsEditing(false);
    const handleDelete = async () => {
        const confirm = window.confirm(`Are you sure you want to delete your account?`);
        if (!confirm) return;
        setIsLoading(true);
        try {
            await deleteUser(profileObj?.id);
            successMsg(`User ${profileObj?.username} was deleted successfully.`);
            if(viewingOwnProfile){
                const autoLogout = true;
                logoutHandler(dispatch, autoLogout);
            } else {
                fetchUser();
            };
        } catch (err) {
            handleException(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div className="profile-wrapper">
        <div className="profile-title-bar">
            <h1 className="mirrored" data-text="Profile Page">Profile Page</h1>
                {user?.id &&
                    <div className="greeting">
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
        </div>

        {isLoading ? (
            <LoadingScreen message="Loading Profile..." />
            ) : ( profileObj?.username ? (
            <section className="profile-section">
            <h2>{profileObj?.username}'s Profile</h2>
                <div className="profile-container">
                    <AnimatePresence>
                        <motion.div
                        className="profile-card-motion"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.2, x: 450, y: 30 }}
                        transition={{ duration: 0.5 }}
                        >
                        <div className="profile-card">
                            <div className="profile-avatar-wrapper">
                                <img
                                src={profileObj?.image || "https://images.unsplash.com/photo-1717864477200-d4d1f112c792?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                alt="Profile Avatar"
                                className="profile-avatar"
                                />
                            </div>
                            {(viewingOwnProfile || user?.is_admin || user?.is_staff) && ( 
                                <div className="profile-card-btns">
                                    <button title="Edit profile" onClick={() => setIsEditing(true)}>
                                        <FileEdit className="card-icons" /> Edit Profile
                                    </button>
                                    <button title="Delete profile" onClick={handleDelete}>
                                        <Trash2 className="card-icons" /> Delete Account
                                    </button>
                                </div>
                            )}

                            {isEditing ? (
                                <EditProfileForm profileObj={profileObj}
                                    refetch={fetchUser} onCancel={handleCancel} />
                            ) : (<>
                            <div className="profile-info-container">
                                <h3>Account Info</h3>
                                <div className="account-info">
                                    <div className="info-field">
                                        <strong>User ID:</strong> <p>#{profileObj?.id}</p>
                                    </div>
                                    <div className="info-field">
                                        <strong>Username:</strong> <p>{profileObj?.username}</p>
                                    </div>
                                    {viewingOwnProfile &&
                                        <div className="info-field">
                                            <strong>Email:</strong> <p>{profileObj?.email}</p>
                                        </div>
                                    }
                                </div>

                                <div className="badges-container">
                                    {(profileObj?.admin_status) && (<p className="role-badge">🔧 Admin User</p>)}
                                    {profileObj?.mod_status && (<p className="role-badge">🛡️ Moderator</p>)}
                                    {(profileObj?.staff_admin_status) && (<p className="role-badge">👤 Admin Staff </p>)}
                                </div>
                            </div>

                            <div className="profile-details-container">
                                <h3>Profile Details</h3>
                                <div className="profile-info">
                                    <div className="info-field">
                                        <strong>Full Name:</strong> <p>{profileObj?.first_name} {profileObj?.last_name}</p>
                                    </div>
                                    <div className="info-field">
                                        <strong>Location:</strong> <p>{profileObj?.location}</p>
                                    </div>
                                    <div className="info-field">
                                        <strong>Birth Date:</strong> <p>{profileObj?.birth_date}</p>
                                    </div>
                                </div>
                                <div className="info-field bio-field">
                                    <strong>Bio:</strong> <p>{profileObj?.bio || 'N/A'}</p>
                                </div>
                            </div> </>)}

                            <div className="profile-timestamps">
                                <p>Created at: {profileObj?.created_at}</p>
                                <p>Last update: {profileObj?.updated_at}</p>
                            </div>
                        </div>
                        </motion.div>
                    </AnimatePresence>
                </div> 
        </section>) : (
            <div className="loading-wrapper">
                <p>User doesn't exist...</p>
                <button title="Home" onClick={() => navigate("/")}>
                    <HomeIcon className="card-icons" /> Home
                </button>
            </div>)
        )}
    </div>
    );
}
export default ProfilePage;
