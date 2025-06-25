import './css/articles.css'
import { useState, useEffect } from "react"
import { User, ThumbsUp, ThumbsDown, Edit3, Trash2} from "lucide-react";
import { getAllArticles } from "../../services/articleServices";
import { getArticleComments } from '../../services/commentServices';
import Comment from '../comments/Comment'
import LoadingScreen from '../common/loadscreen/LoadingScreen';
import { canEditDelete, canLikeDislike } from '../../auth/utils/permissions';
import useAuth from '../../auth/hooks/useAuth';

function Articles() {
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [articlesComments, setArticlesComments] = useState({});
    const [expandedArticles, setExpandedArticles] = useState({});
    const [textScale, setTextScale] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try{
                const serverArticles = await getAllArticles();
                setArticles(serverArticles.results);

                const commentsMap = {};
                for (let article of serverArticles.results){
                    const articleComments = await getArticleComments(article.id);
                    commentsMap[article.id] = articleComments;
                };
                setArticlesComments(commentsMap);
            } catch(e) {
                console.error(e)
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [])

    const toggleExpanded = (id) => {
        setExpandedArticles(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return( <section className="articles-section">
        <h2>Articles</h2>

        { isLoading ? (
            <LoadingScreen />
        ) : (
        <div className="articles-container">
        {
            articles.map((article) => {
            const isExpanded = !!expandedArticles[article.id];
            const maxContent = article.content.length > 1028;
            const nestedComments = articlesComments[article.id] || [];
            
            return (
            <div className="article-card" key={article?.id}>

                <h3>{article?.title}</h3>

                <div className="article-inner">
                        <div className="article-info">
                            <div className="article-metadata">
                                <div className="author-info">
                                    <p>Author:</p>
                                    <User size={20} /><h4>  {article?.author_name}</h4>
                                </div>
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
                            <div className="timestamps">
                                <p>Created at: {article?.created_at}</p>
                                <p>last update: {article?.updated_at}</p>
                            </div>
                        </div>

                        <div className={`article-content ${isExpanded ? "expanded" : ""}`}>
                            <div className="text-size-btns">
                                <button onClick={() => setTextScale(prev => Math.min(prev + 0.1, 2))}>text+</button>
                                <button onClick={() => setTextScale(1)}>reset</button>
                                <button onClick={() => setTextScale(prev => Math.max(prev - 0.1, 0.6))}>text-</button>
                            </div>
                            

                            <p style={{ fontSize: `${1 * textScale}rem`}} >{article?.content}</p>
                            {maxContent && (
                                <button className="read-more-btn" onClick={() => toggleExpanded(article.id)} aria-expanded={isExpanded}>
                                    {isExpanded ? "Read Less.." : "Read More.."}
                                </button>
                            )}
                        </div>

                        <div className="article-stats">
                            likes: 40 | dislikes: 5 | comments: {nestedComments.length || 0} | stars: 95 users  
                        </div>
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

                        <div className="comments-div">
                            <h3>Comments:</h3>

                            <div className="comments-container">
                                {nestedComments.length > 0 ? nestedComments.map(comment => (
                                    <Comment key={comment.id} comment={comment} />
                                )) : (
                                    <p>No comments yet.</p>
                                )}
                            </div>
                        </div>
                </div>
                
            </div>   
            )
            
            })
        }
        </div>)}

</section>)}
export default Articles