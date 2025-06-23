import './css/comments.css'

function Comment({comment}) {
    return ( 
    <div className="comment">
            <div className="comment-card">

                <div className="comment-content">
                    <h4 className="comment-author">{comment.author_name}: </h4>
                    <p className="root-comment">
                        {comment.content}
                    </p>
                </div>


                {comment.replies && comment.replies.length > 0 && (
                    <div className="comment-replies">
                        <h5>Replies:</h5>
                        {comment.replies.map(reply => (
                            <div className="reply" key={reply.id}>
                                <p className="reply-author">{reply.author_name}:</p>
                                <p>{reply.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

    </div>
    );
    }
export default Comment;