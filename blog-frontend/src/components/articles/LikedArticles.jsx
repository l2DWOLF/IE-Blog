import ArticleFeed from './features/ArticleFeed';

function LikedArticles() {
    return <ArticleFeed title="My Liked Articles" mirrorTitle="Liked Articles" filterByLiked={true} limit={100} />;
}
export default LikedArticles;
