import './css/articles.css'
import '../common/design/design-tools.css'
import React, { useState, useEffect, useRef } from "react";
import { User, ThumbsUp, ThumbsDown, Edit3, Trash2 } from "lucide-react";
import { getArticles } from "../../services/articleServices";
import { getArticleComments } from '../../services/commentServices';
import Comment from '../comments/Comment';
import LoadingScreen from '../common/loadscreen/LoadingScreen';
import { canEditDelete, canLikeDislike } from '../../auth/utils/permissions';
import useAuth from '../../auth/hooks/useAuth';
import { handleException } from '../../utils/errors/handleException';

function Articles() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [articles, setArticles] = useState([]);
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
                setArticles(prev =>
                    offsetValue === 0 ? serverArticles.results :
                        [...prev, ...serverArticles.results]
                );

                const commentsMap = {};
                for (let article of serverArticles.results) {
                    const articleComments = await getArticleComments(article.id);
                    commentsMap[article.id] = articleComments;
                };
                setArticlesComments(prev => ({ ...prev, ...commentsMap }));
                setHasMore(!!serverArticles.next);
                setOffset(offsetValue);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error(e)
            handleException(e, { toast: true, alert: true })
        } finally {
            if (offsetValue === 0) setIsLoading(false);
            else setIsLoadingMore(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [])

    const handleLoadMore = () => {
        fetchData(offset + limit)
    };

    const toggleExpanded = (id) => {
        setExpandedArticles(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <section className="articles-section">
            <h2>Articles</h2>

        {isLoading && articles.length === 0 ? (
            <LoadingScreen message="Loading Articles..."/>
        ) : (
        <div className="articles-container">
            {articles && articles.length > 0 ? 
                (articles.map((article) => {
                    const isExpanded = !!expandedArticles[article.id];
                    const maxContent = article.content.length > 1028;
                    const nestedComments = articlesComments[article.id] || [];
                    if (!contentRefs.current[article.id]) {
                        contentRefs.current[article.id] = React.createRef();
                    }
                    const contentRef = contentRefs.current[article.id];

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
                        <div className="article-card" key={article?.id}>

                            <h3>{article?.title}</h3>
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
                                                <span className="author-label">Author:
                                                </span>
                                                <h4 className="author-name">{article?.author_name}</h4>
                                            </div>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: `${1 * textScale}rem` }} ref={contentRef} className={`article-content ${isExpanded ? "expanded" : ""}`} >
                                        {article?.content}
                                    </p>
                                    {maxContent && (
                                        <button className="read-more-btn" onClick={() => handleToggle(article.id)} aria-expanded={isExpanded}>
                                            {isExpanded ? "Read Less.." : "Read More.."}
                                        </button>)}
                                </div>

                                <div className="article-info-container">
                                    <div className="card-btns">
                                        {canLikeDislike(user, article) &&
                                            (<>
                                                {(article?.id) && (
                                                    <button title="Like Article">
                                                        <ThumbsUp className="card-icons" />
                                                    </button>
                                                )}
                                                {(article?.id) && (
                                                    <button title="Dislike Article">
                                                        <ThumbsDown className="card-icons" />
                                                    </button>
                                                )}
                                            </>)}
                                        {canEditDelete(user, article) &&
                                            (<>
                                                {(article?.id) && (
                                                    <>
                                                        <button title="Edit Article">
                                                            <Edit3 className="card-icons" />
                                                        </button>
                                                    </>
                                                )}
                                                {(article?.id) && (
                                                    <>
                                                        <button title="Delete Article">
                                                            <Trash2 className="card-icons" />
                                                        </button>
                                                    </>
                                                )}
                                            </>)}
                                    </div>
                                    <div className="tags-container">
                                        <div className="tags-div">
                                            <h5>Categories:</h5>
                                            {article?.tags.map((tag, id) => (
                                                <div className="article-tag" key={id}>
                                                    <p>{tag}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="article-stats"><br />
                                        likes: 40 | dislikes: 5 | comments: {nestedComments.length || 0} | stars: 95 users
                                    </div>
                                    <div className="timestamps">
                                        <p>Created at: {article?.created_at}</p>
                                        <p>last update: {article?.updated_at}</p>
                                    </div>
                                </div>

                                <div className="article-engagement-container">
                                    <div className="comments-div">
                                        <h3>Comments:</h3>
                                        <div className="comments-container custom-scrollbar-thin">
                                            {nestedComments.length > 0 ? nestedComments.map(comment => (
                                                <Comment key={comment.id} comment={comment} />
                                            )) : (
                                                <p>No comments yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                })) : (<p className="no-content-msg">No Articles Loaded..</p>)   
            }
        {hasMore && (
            <button className="load-more-btn" onClick={handleLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? <LoadingScreen inline size="medium" /> : "Load More"}
            </button>
        )}
        </div>)}
    </section>)
}
export default Articles