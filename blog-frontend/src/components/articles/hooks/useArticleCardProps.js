

export function useArticleCardProps({
    user, 
    contentRefs,
    textScale,
    setTextScale,
    handlers,
    navigate,
}) {
    return function getArticleCardProps(article){
        return{
            article,
            user,
            comments: handlers.articlesComments[article.id] || [],
            isExpanded: !!handlers.expandedArticles[article.id],
            contentRef: contentRefs.current[article.id],
            textScale,
            setTextScale,
            onToggleExpanded: handlers.toggleExpanded,
            onReaction: handlers.handleReaction,
            onDelete: handlers.handleDeleteArticle,
            onEdit: (id) => navigate(`/edit-article/${id}`),
            handleAddComment: handlers.handleAddComment,
            closeCommentModal: handlers.closeCommentModal,
            activeCommentModal: handlers.activeCommentModal,
            onCommentAdded: handlers.refreshArticleComments,
            requireAuthReaction: handlers.requireAuthReaction,
            currentStatus: handlers.userLikesMap[article.id],
        };
    };
};