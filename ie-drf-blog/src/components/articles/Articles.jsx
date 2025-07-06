import './css/articles.css';
import '../common/design/design-tools.css';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { articleLike, deleteArticle, getArticles } from "../../services/articleServices";
import { getArticleComments } from '../../services/commentServices';
import LoadingScreen from '../common/loadscreen/LoadingScreen';
import useAuth from '../../auth/hooks/useAuth';
import { handleException } from '../../utils/errors/handleException';
import { infoMsg, successMsg } from '../../utils/toastify/toast';
import ArticleCard from './ArticleCard';

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
    }, [user.id]);

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
                    return (
                        <ArticleCard key={article.id}
                        article={article}
                        user={user}
                        comments={articlesComments[article.id] || []}
                        isExpanded={!!expandedArticles[article.id]}
                        contentRef={contentRefs.current[article.id]}
                        textScale={textScale}
                        setTextScale={setTextScale}
                        onToggleExpanded={toggleExpanded}
                        onReaction={handleReaction}
                        onDelete={handleDeleteArticle}
                        onEdit={(id) => navigate(`edit-article/${id}`)}
                        requireAuthReaction={requireAuthReaction}
                        currentStatus={userLikesMap[article.id]}
                        />);
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