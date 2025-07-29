import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
    getArticles,
    articleLike,
    deleteArticle,
} from '../services/articleServices';
import { getArticleComments } from '../services/commentServices';
import { handleException } from '../utils/errors/handleException';
import { infoMsg, successMsg } from '../utils/toastify/toast';
import useAuth from '../auth/hooks/useAuth';

const ArticleContext = createContext();

let resetArticlesExternal = () => { };
export const getResetArticles = () => resetArticlesExternal;
let fetchDataExternal = () => { };
export const getFetchData = () => fetchDataExternal;


export function ArticleProvider({ children }) {
    const {user} = useAuth();
    const [articles, setArticles] = useState([]);
    const [articlesComments, setArticlesComments] = useState({});
    const [userLikesMap, setUserLikesMap] = useState({});
    const [expandedArticles, setExpandedArticles] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeCommentModal, setActiveCommentModal] = useState(null);
    const [limit, setLimit] = useState(3);
    const [viewMode, setViewMode] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [offset, setOffset] = useState(0);
    const didMountRef = useRef(false);
    const fetchInProgress = useRef(false);
    

    // 🧠 Track previous values to avoid triggering fetchData multiple times
    const previousViewMode = useRef(viewMode);
    const previousSearchTerm = useRef(searchTerm);

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            return;
        }

        const modeChanged = previousViewMode.current !== viewMode;
        const searchChanged = previousSearchTerm.current !== searchTerm;

        if (modeChanged || searchChanged) {
            previousViewMode.current = viewMode;
            previousSearchTerm.current = searchTerm;

            setOffset(0);
            fetchData(0, searchTerm);
        }
    }, [viewMode, searchTerm]);


    const fetchData = async (newOffset = 0, search = searchTerm) => {
        if (fetchInProgress.current) return;

        fetchInProgress.current = true;
        if (newOffset === 0) setIsLoading(true);
        else setIsLoadingMore(true);

        try {
            const effectiveLimit = search?.trim() ? 100 : limit;
            const res = await getArticles({
                limit: effectiveLimit,
                offset: newOffset,
                search,
            });
            let fetchedArticles = res.results || [];

            if (viewMode === "own" && user?.id) {
                fetchedArticles = fetchedArticles.filter((a) => a.author_id === user.id);
            } else if (viewMode === "liked" && user?.username) {
                fetchedArticles = fetchedArticles.filter((a) =>
                    (a.likes || []).some(
                        (l) => l.username === user.username && l.status === 'like'
                    )
                );
            }

            const likesMap = {};
            fetchedArticles.forEach((article) => {
                const match = (article.likes || []).find((l) => l.username === user?.username);
                if (match) likesMap[article.id] = match.status;
            });

            const commentsList = await Promise.all(
                fetchedArticles.map((a) => getArticleComments(a.id))
            );
            const commentsMap = {};
            fetchedArticles.forEach((a, i) => {
                commentsMap[a.id] = commentsList[i];
            });

            setArticles((prev) => (newOffset === 0 ? fetchedArticles : [...prev, ...fetchedArticles]));
            setOffset(newOffset);
            setArticlesComments((prev) => ({ ...prev, ...commentsMap }));
            setUserLikesMap((prev) => (newOffset === 0 ? likesMap : { ...prev, ...likesMap }));
            setHasMore(viewMode === 'all' ? !!res.next : false);


        } catch (err) {
            handleException(err);
        } finally {
            fetchInProgress.current = false;
            if (newOffset === 0) setIsLoading(false);
            else setIsLoadingMore(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchTerm(query);
        await fetchData(0, query);
    };

    const handleLoadMore = async () => {
        await fetchData(articles.length, searchTerm);
    };

    const toggleExpanded = (id) => {
        setExpandedArticles((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleReaction = async (articleId, status) => {
        const article = articles.find((a) => a.id === articleId);
        if (!article || !user) return;

        const currentStatus = userLikesMap[articleId] || '';
        const isSameStatus = currentStatus === status;
        const payload = isSameStatus ? { status: 'remove', article: articleId } : { status, article: articleId };

        try {
            await articleLike(payload);
            setUserLikesMap((prev) => {
                const updated = { ...prev };
                if (isSameStatus) delete updated[articleId];
                else updated[articleId] = status;
                return updated;
            });

            setArticles((prev) => {
                const updatedArticles = prev.map((a) => {
                    if (a.id !== articleId) return a;

                    let updatedLikes = a.likes || [];
                    const existing = updatedLikes.find((l) => l.username === user.username);

                    if (!existing) updatedLikes.push({ username: user.username, status });
                    else if (isSameStatus) updatedLikes = updatedLikes.filter((l) => l.username !== user.username);
                    else updatedLikes = updatedLikes.map((l) => l.username === user.username ? { ...l, status } : l);

                    return { ...a, likes: updatedLikes };
                });

                if (viewMode === "liked" && (isSameStatus || status === "dislike")) {
                    return updatedArticles.filter((a) =>
                        (a.likes || []).some(
                            (l) => l.username === user.username && l.status === "like"
                        )
                    );
                }

                return updatedArticles;
            });

            successMsg(isSameStatus ? `Your ${status} was removed` : `The article was ${status}d`);
        } catch (err) {
            handleException(err);
        }
    };

    const handleDeleteArticle = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this article?");
        if (!confirmDelete) return;

        try {
            await deleteArticle(id);
            setArticles((prev) => prev.filter((a) => a.id !== id));
            successMsg("Article deleted successfully.");
        } catch (err) {
            handleException(err);
        }
    };

    const handleAddComment = (articleId) => {
        const isModalOpen = document.querySelector('.modal-overlay');
        
        if (!user?.id) {
            infoMsg("Please login or register to add a comment.");
        } else if (isModalOpen) {
            infoMsg("Comment editor modal is already open.");
        } else {
            setActiveCommentModal(articleId);
        }
    };

    const closeCommentModal = () => setActiveCommentModal(null);

    const requireAuthReaction = () => {
        if (!user?.id) {
            infoMsg("Please login or register to like/dislike articles.");
            return false;
        }
        return true;
    };

    const refreshArticleComments = async (articleId) => {
        try {
            const updatedComments = await getArticleComments(articleId);
            setArticlesComments((prev) => ({
                ...prev,
                [articleId]: updatedComments,
            }));
        } catch (e) {
            handleException(e);
        }
    };

    const resetArticles = () => {
        setArticles([]);
        setUserLikesMap({});
        setArticlesComments({});
        setExpandedArticles({});
        setSearchTerm("");
    };

    const contextValue = {
        articles,
        setArticles,
        articlesComments,
        userLikesMap,
        expandedArticles,
        isLoading,
        setIsLoading,
        isLoadingMore,
        hasMore,
        activeCommentModal,
        limit,
        viewMode,
        setLimit,
        setViewMode,
        fetchData,
        handleSearch,
        handleLoadMore,
        toggleExpanded,
        handleReaction,
        handleDeleteArticle,
        handleAddComment,
        closeCommentModal,
        requireAuthReaction,
        refreshArticleComments,
        resetArticles,
    };


    return (
        <ArticleContext.Provider value={contextValue}>
            {children}
        </ArticleContext.Provider>
    );
}

export function useArticleContext() {
    return useContext(ArticleContext);
}
