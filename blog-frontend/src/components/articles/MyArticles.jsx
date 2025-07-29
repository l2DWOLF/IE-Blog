import ArticleFeed from './features/ArticleFeed';

function MyArticles() {
    return <ArticleFeed title="My Articles" mirrorTitle="My Articles" filterOwn={true} limit={100} />;
}
export default MyArticles;
