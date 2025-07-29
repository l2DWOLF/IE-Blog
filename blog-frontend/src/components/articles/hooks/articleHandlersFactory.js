/*import { articleLike, deleteArticle, getArticles } from "../../../services/articleServices";
import { getArticleComments } from "../../../services/commentServices";
import { handleException } from "../../../utils/errors/handleException";
import { infoMsg, successMsg } from "../../../utils/toastify/toast";

export function createArticleHandlers({
    user,
    defaultValues,
    articlesState,
    userLikesState,
    commentsState,
    expandedState,
    commentModalState,
    isLoadingState,
    isLoadingMoreState,
    searchTermState,
    offsetState,
    hasMoreState,
}) {
    const [articles, setArticles] = articlesState;
    const [userLikesMap, setUserLikesMap] = userLikesState;
    const [articlesComments, setArticlesComments] = commentsState;
    const [expandedArticles, setExpandedArticles] = expandedState;
    const [activeCommentModal, setActiveCommentModal] = commentModalState;
    const [isLoading, setIsLoading] = isLoadingState;
    const [isLoadingMore, setIsLoadingMore] = isLoadingMoreState;
    const [searchTerm, setSearchTerm] = searchTermState;
    const [offset, setOffset] = offsetState;
    const [hasMore, setHasMore] = hasMoreState;

    const {
        limit = 3,
        filterOwn = false,
        filterByLiked = false,
    } = defaultValues || {};

    const fetchData = async (offsetValue = 0, search = searchTerm) => {
        const isSearching = !!search?.trim();
        const effectiveLimit = isSearching ? 100 : limit;

        offsetValue === 0 ? setIsLoading(true) : setIsLoadingMore(true);

        try {
            const serverArticles = await getArticles({ limit: effectiveLimit, offset: offsetValue, search });
            let results = serverArticles.results || [];

            if (filterOwn) {
                results = results.filter(a => a.author_id === user?.id);
            }

            if (filterByLiked) {
                results = results.filter(a => (a.likes || []).some(
                    r => r.username === user?.username && r.status === 'like'
                ));
            }

            const likesMap = {};
            if (user?.username) {
                results.forEach(article => {
                    const match = (article.likes || []).find(l => l.username === user.username);
                    if (match) likesMap[article.id] = match.status;
                });
            }

            const commentsResults = await Promise.all(results.map(a => getArticleComments(a.id)));
            const commentsMap = {};
            results.forEach((article, i) => {
                commentsMap[article.id] = commentsResults[i];
            });

            setArticles(prev => offsetValue === 0 ? results : [...prev, ...results]);
            setArticlesComments(prev => ({ ...prev, ...commentsMap }));
            setUserLikesMap(prev => offsetValue === 0 ? likesMap : { ...prev, ...likesMap });

            setHasMore(filterOwn || filterByLiked ? false : !!serverArticles.next);
            setOffset(offsetValue);
        } catch (e) {
            handleException(e, { toast: true, alert: true });
        } finally {
            offsetValue === 0 ? setIsLoading(false) : setIsLoadingMore(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchTerm(query);
        await fetchData(0, query);
    };

    const handleDeleteArticle = async (id) => {
        if (!window.confirm("Delete this article?")) return;

        try {
            await deleteArticle(id);
            successMsg("Article deleted.");
            setArticles(prev => prev.filter(a => a.id !== id));
        } catch (e) {
            handleException(e);
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
                const updated = prev.map(a => {
                    if (a.id !== articleId) return a;

                    let updatedLikes = a.likes || [];
                    const existing = updatedLikes.find(l => l.username === user?.username);

                    if (!existing) {
                        updatedLikes.push({ username: user?.username, status });
                    } else if (isSameStatus) {
                        updatedLikes = updatedLikes.filter(l => l.username !== user?.username);
                    } else {
                        updatedLikes = updatedLikes.map(l =>
                            l.username === user?.username ? { ...l, status } : l
                        );
                    }

                    return { ...a, likes: updatedLikes };
                });

                if (filterByLiked && (isSameStatus || status === 'dislike')) {
                    return updated.filter(a =>
                        a.likes.some(l => l.username === user?.username && l.status === "like")
                    );
                }

                return updated;
            });

            successMsg(isSameStatus ? `Removed ${status}` : `Article ${status}d`);
        } catch (e) {
            handleException(e);
        }
    };

    const requireAuthReaction = () => {
        if (!user?.id) {
            infoMsg("Login to like/dislike.");
            return false;
        }
        return true;
    };

    const handleAddComment = (articleId) => {
        if (!user?.id) return infoMsg("Login to comment.");
        if (document.querySelector('.modal-overlay')) return infoMsg("Comment modal already open.");
        setActiveCommentModal(articleId);
    };

    const closeCommentModal = () => setActiveCommentModal(null);

    const refreshArticleComments = async (articleId) => {
        try {
            const updated = await getArticleComments(articleId);
            setArticlesComments(prev => ({ ...prev, [articleId]: updated }));
        } catch (e) {
            handleException(e);
        }
    };

    const resetArticles = () => {
        setArticles([]);
        setUserLikesMap({});
        setArticlesComments({});
        setExpandedArticles({});
        setOffset(0);
        setSearchTerm("");
    };

    const handleLoadMore = () => fetchData(offset + limit);

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
        resetArticles,
    };
}
