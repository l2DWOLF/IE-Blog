import './css/articles.css';
import '../common/design/design-tools.css';
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, ThumbsUp, ThumbsDown, Edit3, Trash2 } from "lucide-react";
import { articleLike, deleteArticle, getArticles } from "../../services/articleServices";
import { getArticleComments } from '../../services/commentServices';
import Comment from '../comments/Comment';
import LoadingScreen from '../common/loadscreen/LoadingScreen';
import { canEditDelete, canLikeDislike } from '../../auth/utils/permissions';
import useAuth from '../../auth/hooks/useAuth';
import { handleException } from '../../utils/errors/handleException';
import { infoMsg, successMsg } from '../../utils/toastify/toast';

function Articles() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [articles, setArticles] = useState([]);
    const [userLikesMap, setUserLikesMap] = useState({});
    const [offset, setOffset] = useState(0);
    const limit = 3;
    const [hasMore, setHasMore] = useState(true);
    const [articlesComments, setArticlesComments] = useState({});
    const [expandedArticles, setExpandedArticles] = useState({});
    const contentRefs = useRef({});
    const [textScale, setTextScale] = useState(1);

    const fetchData = async (offsetValue = 0) => {
        if (offsetValue === 0) setIsLoading(true);
        else setIsLoadingMore(true);

        try {
            const serverArticles = await getArticles({ limit, offset: offsetValue });
            
            if (serverArticles.results && serverArticles.results.length > 0) {
                const articleCommentPromises = [];
                const likesMap = {};

                for (let article of serverArticles.results) {
                    const reaction = (article.likes || []).find(
                        r => r.username === user?.username && ['like', 'dislike'].includes(r.status)
                    );
                    likesMap[article.id] = reaction ? reaction.status : null;

                    articleCommentPromises.push(getArticleComments(article.id));
                }

                const commentsResults = await Promise.all(articleCommentPromises);
                const commentsMap = {};
                serverArticles.results.forEach((article, i) => {
                    commentsMap[article.id] = commentsResults[i];
                });

                setArticles(prev =>
                    offsetValue === 0 ? serverArticles.results : [...prev, ...serverArticles.results]
                );

                setArticlesComments(prev => ({ ...prev, ...commentsMap }));
                setUserLikesMap(prev => ({ ...prev, ...likesMap }));

                setHasMore(!!serverArticles.next);
                setOffset(offsetValue);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            handleException(e, { toast: true, alert: true });
        } finally {
            if (offsetValue === 0) setIsLoading(false);
            else setIsLoadingMore(false);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, [user]);

    async function handleDeleteArticle(id) {
        const confirm = window.confirm("Are you sure you want to delete this article?");
        if (!confirm) return;

        try {
            await deleteArticle(id);
            successMsg(`Article was deleted successfully.`);
            setArticles(prev => prev.filter(article => article.id !== id));
        } catch (err) {
            handleException(err);
        }
    }

    const handleReaction = async (articleId, status) => {
        const article = articles.find(a => a.id === articleId);
        if (!article) return;

        const currentStatus = userLikesMap[articleId] || '';
        const isSameStatus = currentStatus === status;

        const payload = isSameStatus
            ? { status: "remove", article: articleId }
            : { status, article: articleId };

        try {
            await articleLike(payload);
            setArticles(prev =>
                prev.map(article => {
                    if (article.id !== articleId) return article;
                    let updatedLikes = article.likes || [];
                    const existingReaction = updatedLikes.find(like => like.username === user?.username);

                    if (!existingReaction) {
                        updatedLikes = [...updatedLikes, { username: user?.username, status }];
                    } else if (isSameStatus) {
                        updatedLikes = updatedLikes.filter(like => like.username !== user?.username);
                    } else {
                        updatedLikes = updatedLikes.map(like =>
                            like.username === user?.username ? { ...like, status } : like
                        );
                    }
                    return { ...article, likes: updatedLikes };
                })
            );

            setUserLikesMap(prev => {
                const updated = { ...prev };
                if (isSameStatus) delete updated[articleId];
                else updated[articleId] = status;
                return updated;
            });

            successMsg(
                isSameStatus
                    ? `Your ${status} was removed`
                    : `The article was ${status === "like" ? "liked" : "disliked"}`
            );
        } catch (err) {
            handleException(err);
        }
    };

    const requireAuthReaction = () => {
        if (!user.id) {
            infoMsg("Please login or register to like/dislike articles.");
            return false;
        }
        return true;
    };

    const handleLoadMore = () => {
        fetchData(offset + limit);
    };

    const toggleExpanded = (id) => {
        setExpandedArticles(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <section className="articles-section">
            <h2>Articles</h2>
            {isLoading && articles.length === 0 ? (
                <LoadingScreen message="Loading Articles..." />
            ) : (
                <div className="articles-container">
                    {articles.length > 0 ? articles.map(article => {
                        const isExpanded = !!expandedArticles[article.id];
                        const maxContent = article.content.length > 1028;
                        const nestedComments = articlesComments[article.id] || [];
                        if (!contentRefs.current[article.id]) {
                            contentRefs.current[article.id] = React.createRef();
                        }
                        const contentRef = contentRefs.current[article.id];
                        const currentStatus = userLikesMap[article.id];

                        const handleToggle = () => {
                            if (isExpanded && contentRef.current) {
                                const offset = 100;
                                const elementTop = contentRef.current.getBoundingClientRect().top;
                                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                                window.scrollTo({
                                    top: elementTop + scrollTop - offset,
                                    behavior: 'smooth'
                                });
                            }
                            toggleExpanded(article.id);
                        };

                        return (
                            <div className="article-card" key={article.id}>
                                <h3>{article.title}</h3>
                                <div className="article-inner">
                                    <div className="article-content-wrapper">
                                        <div className="sticky-title">
                                            <div className="text-size-btns">
                                                <button onClick={() => setTextScale(prev => Math.min(prev + 0.1, 2))}>text+</button>
                                                <button onClick={() => setTextScale(prev => Math.max(prev - 0.1, 0.6))}>text-</button>
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

                                        <p style={{ fontSize: `${1.3 * textScale}rem` }} ref={contentRef} className={`article-content ${isExpanded ? "expanded" : ""}`}>
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
                                                    if (requireAuthReaction()) {
                                                        handleReaction(article.id, 'like');
                                                    }
                                                }}
                                                className={`reaction-btn ${currentStatus === 'like' ? 'active-like' : ''}`}
                                            >
                                                <ThumbsUp className="card-icons" />
                                            </button>

                                            <button
                                                title="Dislike Article"
                                                onClick={() => {
                                                    if (requireAuthReaction()) {
                                                        handleReaction(article.id, 'dislike');
                                                    }
                                                }}
                                                className={`reaction-btn ${currentStatus === 'dislike' ? 'active-dislike' : ''}`}
                                            >
                                                <ThumbsDown className="card-icons" />
                                            </button>

                                            {canEditDelete(user, article) && (
                                                <>
                                                    <button title="Edit Article" onClick={() => navigate(`edit-article/${article.id}`)}>
                                                        <Edit3 className="card-icons" />
                                                    </button>
                                                    <button title="Delete Article" onClick={() => handleDeleteArticle(article.id)}>
                                                        <Trash2 className="card-icons" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <div className="tags-container">
                                            <div className="tags-div">
                                                <h5>Categories:</h5>
                                                {article.tags.map((tag, id) => (
                                                    <div className="article-tag" key={id}><p>{tag}</p></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="article-stats"><br />
                                            likes: {article.likes.filter(like => like.status === "like").length || 0} | dislikes: {article.likes.filter(like => like.status === "dislike").length || 0} | comments: {nestedComments.length || 0}
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
                                                {nestedComments.length > 0 ? nestedComments.map(comment => (
                                                    <Comment key={comment.id} comment={comment} />
                                                )) : <p>No comments yet.</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : <p className="no-content-msg">No Articles Loaded..</p>}

                    {hasMore && (
                        <button className="load-more-btn" onClick={handleLoadMore} disabled={isLoadingMore}>
                            {isLoadingMore ? <LoadingScreen inline size="medium" /> : "Load More"}
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}

export default Articles;
