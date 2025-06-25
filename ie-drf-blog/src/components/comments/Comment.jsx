import './css/comments.css';

function Comment({ comment, depth = 0, onReplyClick }) {
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

    const handleReplyClick = () => {
        if (onReplyClick) {
            onReplyClick(comment.id); // Pass the comment ID to the parent
        }
    };

    return (
        <div className={getClassForDepth(depth)}>
            <div className="comment-div">
                <div className="comment-content">
                    <div className="comment">
                        <div className="comment-header">
                            <h5 className="comment-author">{comment.author_name}:</h5>
                            <button className="reply-button" onClick={handleReplyClick}>
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
                        {depth === 1 && <h6> Nested Replies:</h6>}
                        {comment.replies.map(reply => (
                            <Comment key={reply.id} comment={reply} depth={depth + 1} onReplyClick={onReplyClick} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;
