import '../css/articles.css';
import '../css/mobile-articles.css';

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from '../../common/loadscreen/LoadingScreen';
import useAuth from '../../../auth/hooks/useAuth';
import ArticleCard from '../ArticleCard';
import { useArticleCardProps } from '../hooks/useArticleCardProps';
import { motion, AnimatePresence } from 'framer-motion';
import { useArticleContext } from '../../../contexts/ArticleContext';


function ArticleFeed({
    title = "Articles",
    mirrorTitle = "",
    filterOwn = false,
    filterByLiked = false,
    limit = 3,
    customClass = "",
}) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const contentRefs = useRef({});
    const [textScale, setTextScale] = useState(1);

    const {
        articles,
        setArticles,
        articlesComments,
        userLikesMap,
        expandedArticles,
        isLoading,
        setIsLoading,
        isLoadingMore,
        hasMore,
        fetchData,
        handleDeleteArticle,
        handleAddComment,
        closeCommentModal,
        activeCommentModal,
        handleReaction,
        requireAuthReaction,
        refreshArticleComments,
        handleLoadMore,
        toggleExpanded,
        setViewMode,
        viewMode,
        setLimit,
    } = useArticleContext();

    const getCardProps = useArticleCardProps({
        user,
        contentRefs,
        textScale,
        setTextScale,
        handlers: {
            articlesComments,
            expandedArticles,
            handleReaction,
            handleDeleteArticle,
            toggleExpanded,
            handleAddComment,
            closeCommentModal,
            activeCommentModal,
            refreshArticleComments,
            requireAuthReaction,
            userLikesMap,
        },
        navigate
    });

    useEffect(() => {
        const newMode = filterByLiked ? "liked" : filterOwn ? "own" : "all";

        if (viewMode !== newMode) {
            setIsLoading(true);
            setViewMode(newMode);
            setArticles([]);
        }
        if (limit !== undefined) setLimit(limit);
    }, [filterByLiked, filterOwn, limit]);

    return (
        <div className={`article-feed-wrapper ${customClass}`}>
            {mirrorTitle && (
                <div className="mirror-wrapper">
                    <h1 className="mirrored" data-text={mirrorTitle}>
                        {mirrorTitle}
                    </h1>
                </div>
            )}

            <section className="article-feed-section">
                <h2>{title} <p>Count: {articles.length}</p></h2>

                {isLoading && articles.length === 0 ? (
                    <LoadingScreen message="Loading Articles..." />
                ) : (
                <div className="articles-container">
                    <AnimatePresence>
                        {articles.length > 0 ? articles.map(article => (
                            <motion.div
                                key={article.id}
                                className="article-motion-wrapper"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, x: -200, scale: 0.7 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ArticleCard {...getCardProps(article)} />
                            </motion.div>
                        )) : <p className="no-content-msg">No Articles Loaded..</p>}
                    </AnimatePresence>

                    {hasMore && (
                        <button className="load-more-btn" title="load more" onClick={handleLoadMore} disabled={isLoadingMore}>
                            {isLoadingMore ? <LoadingScreen inline size="medium" /> : "Load More"}
                        </button>
                    )}
                </div>
                )}
            </section>
        </div>
    );
}
export default ArticleFeed;
