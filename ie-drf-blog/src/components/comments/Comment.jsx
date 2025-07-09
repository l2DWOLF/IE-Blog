import './css/comments.css';
import '../common/design/design-tools.css'
import CreateComment from './CreateComment'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


function Comment({ comment, depth = 0, onReplyClick }) {
    const [showReplyModal, setShowReplyModal] = useState(false);

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

    const handleReplyClick = () => {
        setShowReplyModal(true);
    };

    return (<>
        <AnimatePresence>
        {showReplyModal && (
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
            >
                <CreateComment
                    articleId={comment.article}
                    replyTo={comment.id}
                    onClose={closeModal}
                />
            </motion.div>
        )}
    </AnimatePresence>
        <div className={getClassForDepth(depth)}>

            <div className="comment-div custom-scrollbar-thin">
                <div className="comment-content">
                    <div className="comment">
                        <div className="comment-header">
                            <h5 className="comment-author">{comment.author_name}:</h5>
                            <button className="reply-button" onClick={() => handleReplyClick()}>
                                Reply to {depth === 0 ? 'Comment' : 'Reply'}
                            </button>
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
                            <Comment key={reply.id} comment={reply} depth={depth + 1} onReplyClick={onReplyClick} />
                        ))}
                    </div>
                )}
            </div>
        </div>
        </>);
}

export default Comment;
