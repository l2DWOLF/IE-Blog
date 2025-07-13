import { useState } from "react";
import { articleLike, deleteArticle, getArticles } from "../../../services/articleServices";
import { getArticleComments } from "../../../services/commentServices";
import { handleException } from "../../../utils/errors/handleException";
import { infoMsg, successMsg } from "../../../utils/toastify/toast";

export function useArticleHandlers(user, options = {}) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [articles, setArticles] = useState([]);
    const [userLikesMap, setUserLikesMap] = useState({});
    const [articlesComments, setArticlesComments] = useState({});
    const [expandedArticles, setExpandedArticles] = useState({});
    const [activeCommentModal, setActiveCommentModal] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const { 
        filterOwn = false,
        filterByLiked = false,
        limit = 3,
    } = options; 

    const fetchData = async (offsetValue = 0, search = searchTerm) => {
        const isSearching = !!search?.trim();
        const effectiveLimit = isSearching? 100 : limit;

        if (offsetValue === 0) setIsLoading(true);
        else setIsLoadingMore(true);

        try {
            const serverArticles = await getArticles({ limit: effectiveLimit, offset: offsetValue, search});
            let results = serverArticles.results || [];

            if(filterOwn){
                results = results.filter(a => a.author_id === user.id);
            }

            if(filterByLiked){
                results = results.filter(a => (a.likes || []).some(
                    r => r.username === user?.username && r.status === 'like'
                ));
            };

            const likesMap = {};
            results.forEach(article => {
                const match = (article.likes || []).find(l => l.username === user?.username);
                if (match) {
                    likesMap[article.id] = match.status;
                }
            });

            const articleCommentPromises = results.map(article =>
                getArticleComments(article.id)
            );

            const commentsResults = await Promise.all(articleCommentPromises);
            const commentsMap = {};
            results.forEach((article, i) => {
                commentsMap[article.id] = commentsResults[i];
            });

            setArticles(prev => offsetValue === 0 ? results : [...prev, ...results]);
            setArticlesComments(prev => ({ ...prev, ...commentsMap }));
            setUserLikesMap(prev => ({ ...prev, ...likesMap }));

            if (filterOwn || filterByLiked) {
                setHasMore(false);
            } else {
                setHasMore(!!serverArticles.next);
            }
            setOffset(offsetValue);
        } catch (e) {
            handleException(e, { toast: true, alert: true });
        } finally {
            if (offsetValue === 0) setIsLoading(false);
            else setIsLoadingMore(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchTerm(query)
        setOffset(0);
        await fetchData(0, query);
    };

    const handleDeleteArticle = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this article?");
        if (!confirm) return;

        try {
            await deleteArticle(id);
            successMsg("Article was deleted successfully.");
            setArticles(prev => prev.filter(article => article.id !== id));
        } catch (err) {
            handleException(err);
        }
    };

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

            setUserLikesMap(prev => {
                const updated = { ...prev };
                if (isSameStatus) delete updated[articleId];
                else updated[articleId] = status;
                return updated;
            });

            setArticles(prev => {
                const updatedArticles = prev.map(a => {
                    if (a.id !== articleId) return a;

                    let updatedLikes = a.likes || [];
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
                return { ...a, likes: updatedLikes };
                });

                if (filterByLiked && (isSameStatus || status === "dislike")) {
                    return updatedArticles.filter(a =>
                        (a.likes || []).some(
                            l => l.username === user?.username && l.status === "like"
                        )
                    );
                }
            return updatedArticles;
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
        if (!user?.id) {
            infoMsg("Please login or register to like/dislike articles.");
            return false;
        }
        return true;
    };

    const handleAddComment = (articleId) => {
        const isModalOpen = document.querySelector('.modal-overlay');

        if(!user?.id){
            infoMsg("Please login or register to add a comment.")
        }
        else if(isModalOpen){
            infoMsg("Comment editor modal is already open.")
        }
        else{
            setActiveCommentModal(articleId);
        }
    };
    const closeCommentModal = () => setActiveCommentModal(null);

    const refreshArticleComments = async (articleId) => {
        try {
            const updatedComments = await getArticleComments(articleId);
            console.log("Updated Comments:", updatedComments);
            setArticlesComments(prev => ({
                ...prev, 
                [articleId]: updatedComments,
            }));
        } catch (e) {
            handleException(e);
        }
    };

    const handleLoadMore = () => {
        fetchData(offset + limit);
    };

    const toggleExpanded = (id) => {
        setExpandedArticles(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return {
        articles,
        articlesComments,
        userLikesMap,
        expandedArticles,
        isLoading,
        isLoadingMore,
        hasMore,
        closeCommentModal,
        activeCommentModal,
        fetchData,
        handleDeleteArticle,
        handleAddComment,
        handleReaction,
        requireAuthReaction,
        refreshArticleComments,
        handleLoadMore,
        toggleExpanded,
        handleSearch,
    };
}
