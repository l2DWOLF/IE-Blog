import './css/comments.css'

function Comment({comment}) {
    return ( 
    <div className="comment-card">
            <div className="comment-div">

                <div className="comment-content">
                    <div className="comment">
                        <h5 className="comment-author">{comment.author_name}: </h5>
                        <p className="root-comment">
                            {comment.content}
                        </p>
                    </div>
                </div>


                {comment.replies && comment.replies.length > 0 && (
                    <div className="comment-replies">
                        <h6>Replies:</h6>
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