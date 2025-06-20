import './css/comments.css'

function Comment({comment}) {
    return ( 
    <div className="comment">
            <div className="comment-card">

                <div className="comment-content">
                    {comment.author_name}: 
                    <p className="root-comment">
                        {comment.content}
                    </p>
                </div>


                {comment.replies && comment.replies.length > 0 && (
                    <div className="comment-replies">
                        <p>Replies:</p>
                        {comment.replies.map(reply => (
                            <Comment key={reply.id} comment={reply} />
                        ))}
                    </div>
                )}
            </div>

    </div>
    );
    }
export default Comment;