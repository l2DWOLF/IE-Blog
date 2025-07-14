import './css/profilepage.css';
import '../../common/design/design-tools.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'motion/react';
import useAuth from '../../../auth/hooks/useAuth';
import LoadingScreen from '../../common/loadscreen/LoadingScreen';
import { getUserProfile } from '../../../services/userServices';
import { handleException } from '../../../utils/errors/handleException';
import { LogOut, Home, UserCircle, FileEdit, Trash2, Star } from 'lucide-react';

function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchUser() {
        setIsLoading(true);
        try {
            const profile = await getUserProfile(user.id);
            setUserProfile(profile);
        } catch (err) {
            handleException(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (user?.id) fetchUser();
    }, [user?.id]);

    const handleEdit = () => {
        navigate('/edit-profile');
    };

    const handleDelete = () => {
        console.log("Delete account coming soon...");
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-title-bar">
                <h1 className="mirrored" data-text="Profile Page">Profile Page</h1>
                <div className="profile-nav-buttons">
                    <button onClick={() => navigate("/")}>
                        <Home className="card-icons" /> Home
                    </button>
                    <button onClick={() => navigate("/liked-articles")}>
                        <Star className="card-icons" /> Liked Articles
                    </button>
                    <button onClick={() => navigate("/my-articles")}>
                        <FileEdit className="card-icons" /> My Articles
                    </button>
                    <button onClick={logout}>
                        <LogOut className="card-icons" /> Logout
                    </button>
                </div>
            </div>

            <section className="profile-section">
                <h2>{user.username}'s Profile</h2>

                {isLoading || !userProfile ? (
                    <LoadingScreen message="Loading Profile..." />
                ) : (
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
                                                src={userProfile?.image || "https://images.unsplash.com/photo-1597001829726-0c49345a679b?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                            alt="Profile Avatar"
                                            className="profile-avatar"
                                        />
                                    </div>

                                    <div className="profile-info-container">
                                        <h3>Account Info</h3>
                                        <p><strong>ID:</strong> {user.id}</p>
                                        <p><strong>Username:</strong> {user.username}</p>
                                        <p><strong>Email:</strong> {user.email || "Sample@email.com"}</p>

                                        <div className="badges-container">
                                            {user?.is_admin && <p className="role-badge">🔧 Admin User</p>}
                                            {user?.is_mod && <p className="role-badge">🛡️ Moderator</p>}
                                            {user?.is_staff && <p className="role-badge">👤 Staff Member</p>}
                                        </div>
                                        
                                    </div>

                                    <div className="profile-details-container">
                                        <h3>Profile Details</h3>
                                        <div className="profile-info">
                                            <p><strong>Full Name:</strong> {userProfile?.first_name} {userProfile?.last_name} Placeholder Lastname</p>
                                            <p><strong>Location:</strong> {userProfile.location || 'New York'}</p>
                                            <p><strong>Birth Date:</strong> {userProfile.birth_date || 'N/A'}</p>
                                        </div>
                                        
                                        <p><strong>Bio:</strong> {userProfile.bio || 'N/A'}</p>
                                        
                                    </div>

                                    <div className="profile-card-btns">
                                        <button onClick={handleEdit}>
                                            <FileEdit className="card-icons" /> Edit Profile
                                        </button>
                                        <button onClick={handleDelete}>
                                            <Trash2 className="card-icons" /> Delete Account
                                        </button>
                                    </div>

                                    <div className="profile-timestamps">
                                        <p>Created at: {userProfile.created_at}</p>
                                        <p>Last update: {userProfile.updated_at}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </div>
    );
}

export default ProfilePage;
