import './css/comments.css';
import '../common/design/design-tools.css';
import CreateComment from './CreateComment';
import EditComment from './EditComment';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalPortal from '../common/modal/ModalPortal';
import useAuth from '../../auth/hooks/useAuth';
import { infoMsg } from '../../utils/toastify/toast';
import { User } from 'lucide-react';


function Comment({ comment, depth = 0, onReplyClick, onCommentAdded }) {
    const {user} = useAuth();
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [modalType, setModalType] = useState("");

    const getClassForDepth = (depth) => {
        switch (depth) {
            case 0:
                return 'comment-card';
            case 1:
                return 'reply reply-level-1';
            case 2:
                return 'reply reply-level-2';
            default:
                return 'reply reply-nested';
        }
    };

    const closeModal = () => {
        setShowReplyModal(false);
    }

    const handleReplyClick = (modalType) => {
        const isModalOpen = document.querySelector('.modal-overlay');
        
        if(!user.id){
            infoMsg("Please login or register to add comments and replies.")
        } 
        else if(isModalOpen){
            infoMsg("Comment editor modal is already open.")
        } else {
            setModalType(modalType)
            setShowReplyModal(true);
        }
    };

    return (<>
        <AnimatePresence>
        {showReplyModal && ( 
        <ModalPortal>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
            >
                {modalType === "create" && <CreateComment
                    articleId={comment.article}
                    replyTo={comment.id}
                    onClose={closeModal}
                    onCommentAdded={onCommentAdded}
                />}
                
                {modalType === "edit" && 
                    <EditComment
                        comment={comment}
                        onClose={closeModal}
                        onCommentAdded={onCommentAdded}
                />}
            </motion.div>
        </ModalPortal>)}
    </AnimatePresence>
        <div className={getClassForDepth(depth)}>

            <div className="comment-div custom-scrollbar-thin">
                <div className="comment-content">
                    <div className="comment">
                        <div className="comment-header">
                            <h5 className="comment-author">{comment.author_name}:</h5>

                            <div className="comment-btns">

                                {(user.username === comment.author_name || user.is_admin) && (
                                    <button className="edit-reply-btn" onClick={() => handleReplyClick("edit")}>Edit</button>
                                )}
                                

                                <button className="reply-button" onClick={() => handleReplyClick("create")}>
                                    Reply to {depth === 0 ? 'Comment' : 'Reply'}
                                </button>

                                {(user.username === comment.author_name || user.is_admin) && (
                                    <button className="edit-reply-btn">Delete</button>
                                )}
                                
                            </div>
                        </div>

                        <p className={depth === 0 ? 'root-comment' : 'nested-comment'}>
                            {comment.content}
                        </p>
                    </div>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                    <div className="comment-replies">
                        {depth === 0 && <h6> Replies:</h6>}
                        {comment.replies.map(reply => (
                            <Comment key={reply.id} comment={reply} depth={depth + 1} onReplyClick={onReplyClick} onCommentAdded={onCommentAdded} />
                        ))}
                    </div>
                )}
            </div>
        </div>
        </>);
}

export default Comment;
