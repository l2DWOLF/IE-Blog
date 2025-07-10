import React from "react";
import { User, ThumbsUp, ThumbsDown, Edit3, Trash2 } from "lucide-react";
import Comment from "../comments/Comment";
import { canEditDelete } from "../../auth/utils/permissions";

function ArticleCard({
    article,
    user,
    comments = [],
    isExpanded,
    contentRef,
    textScale,
    onToggleExpanded,
    onReaction,
    onDelete,
    onEdit,
    onCommentAdded,
    requireAuthReaction,
    setTextScale,
    currentStatus,
}) {
    const maxContent = article.content.length > 512;

    const handleToggle = () => {
        if (isExpanded && contentRef?.current) {
            const offset = 100;
            const elementTop = contentRef.current.getBoundingClientRect().top;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            window.scrollTo({
                top: elementTop + scrollTop - offset,
                behavior: "smooth",
            });
        }
        onToggleExpanded(article.id);
    };
    return (
        <div className="article-card">
            <h3>{article.title}</h3>
            <div className="article-inner">
                <div className="article-content-wrapper">
                    <div className="sticky-title">
                        <div className="text-size-btns">
                            <button onClick={() => setTextScale((prev) => Math.min(prev + 0.1, 2))}>text+</button>
                            <button onClick={() => setTextScale((prev) => Math.max(prev - 0.1, 0.6))}>text-</button>
                            <button onClick={() => setTextScale(1)}>reset</button>
                        </div>
                        <div className="article-metadata">
                            <div className="author-info">
                                <User size={18} className="author-icon" />
                                <span className="author-label">Author:</span>
                                <h4 className="author-name">{article.author_name}</h4>
                            </div>
                        </div>
                    </div>

                    <p
                        style={{ fontSize: `${1.3 * textScale}rem` }}
                        ref={contentRef}
                        className={`article-content ${isExpanded ? "expanded" : ""}`}
                    >
                        {article.content}
                    </p>

                    {maxContent && (
                        <button className="read-more-btn" onClick={handleToggle} aria-expanded={isExpanded}>
                            {isExpanded ? "Read Less.." : "Read More.."}
                        </button>
                    )}
                </div>

                <div className="article-info-container">
                    <div className="card-btns">
                        <button
                            title="Like Article"
                            onClick={() => {
                                if (requireAuthReaction()) onReaction(article.id, "like");
                            }}
                            className={`reaction-btn ${currentStatus === "like" ? "active-like" : ""}`}
                        >
                            <ThumbsUp className="card-icons" />
                        </button>

                        <button
                            title="Dislike Article"
                            onClick={() => {
                                if (requireAuthReaction()) onReaction(article.id, "dislike");
                            }}
                            className={`reaction-btn ${currentStatus === "dislike" ? "active-dislike" : ""}`}
                        >
                            <ThumbsDown className="card-icons" />
                        </button>

                        {canEditDelete(user, article) && (
                            <>
                                <button title="Edit Article" onClick={() => onEdit(article.id)}>
                                    <Edit3 className="card-icons" />
                                </button>
                                <button title="Delete Article" onClick={() => onDelete(article.id)}>
                                    <Trash2 className="card-icons" />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="tags-container">
                        <div className="tags-div">
                            <h5>Categories:</h5>
                            {article.tags.map((tag, id) => (
                                <div className="article-tag" key={id}>
                                    <p>{tag}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="article-stats">
                        <br />
                        likes: {article.likes.filter((l) => l.status === "like").length || 0} |
                        dislikes: {article.likes.filter((l) => l.status === "dislike").length || 0} |
                        comments: {comments.length || 0}
                    </div>

                    <div className="timestamps">
                        <p>Created at: {article.created_at}</p>
                        <p>last update: {article.updated_at}</p>
                    </div>
                </div>

                <div className="article-engagement-container">
                    <div className="comments-div">
                        <h3>Comments:</h3>
                        <div className="comments-container custom-scrollbar-thin">
                            {comments.length > 0 ? (
                                comments.map((comment) => <Comment key={comment.id} comment={comment} onCommentAdded={async () => onCommentAdded(article.id)} />)
                            ) : (
                                <p>No comments yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticleCard;
