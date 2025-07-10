import './css/articles.css';
import '../common/design/design-tools.css';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from '../common/loadscreen/LoadingScreen';
import useAuth from '../../auth/hooks/useAuth';
import ArticleCard from './ArticleCard';
import { useArticleHandlers } from './hooks/articleHandlers';
import { motion, AnimatePresence } from 'motion/react'

function Articles() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const contentRefs = useRef({});
    const [textScale, setTextScale] = useState(1);

    const {
        articles,
        articlesComments,
        userLikesMap,
        expandedArticles,
        isLoading,
        isLoadingMore,
        hasMore,
        fetchData,
        handleDeleteArticle,
        handleReaction,
        requireAuthReaction,
        refreshArticleComments,
        handleLoadMore,
        toggleExpanded
    } = useArticleHandlers(user, {limit: 3});

    useEffect(() => {
        fetchData();
    }, [user.id]);


    return (
        <section className="articles-section">
            <h2>Articles</h2>
            {isLoading && articles.length === 0 ? (
                <LoadingScreen message="Loading Articles..." />
            ) : (
                <div className="articles-container">
                <AnimatePresence>
                    {articles.length > 0 ? articles.map(article => {
                        return (

                        <motion.div
                            key={article.id}
                            className="article-motion-wrapper"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.2, x: 450, y: 30 }}
                            transition={{ duration: 0.5 }}
                        >
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
                            onCommentAdded={refreshArticleComments} 
                            requireAuthReaction={requireAuthReaction}
                            currentStatus={userLikesMap[article.id]}
                        />
                        </motion.div>)
                    }) : <p className="no-content-msg">No Articles available..</p>}
                    </AnimatePresence>

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