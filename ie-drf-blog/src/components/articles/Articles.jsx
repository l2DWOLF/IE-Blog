import './css/articles.css'
import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, Edit3, Trash2} from "lucide-react";
import { getAllArticles } from "../../services/articleServices";
import { getAllComments } from '../../services/commentServices';
import Comment from '../comments/Comment'
import LoadingScreen from '../common/loadscreen/LoadingScreen';

function Articles() {
    const [isLoading, setIsLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [comments, setComments] = useState([]);
    const [expandedArticles, setExpandedArticles] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try{
                const serverArticles = await getAllArticles();
                const serverComments = await getAllComments();
            
                setArticles(serverArticles.results)
                setComments(serverComments)
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
            const nestedComments = comments.filter((c) => c.article === article.id);
            
            return (
            <div className="article-card" key={article?.id}>

                <h3>{article?.title}</h3>
                <h4>Article By: {article?.author_name}</h4>
                <p>Created at: {article?.created_at}</p>
                <p>last update: {article?.updated_at}</p>
                <div className={`article-content ${isExpanded ? "expanded" : ""}`}>
                        <p>{article?.content}</p>
                </div>
                    {maxContent && (
                        <button className="read-more-btn" onClick={() => toggleExpanded(article.id)} aria-expanded={isExpanded}>
                            {isExpanded ? "Read Less.." : "Read More.."}
                        </button>
                    )}
                
                <div className="card-btns">
                    {(article?.id) && (
                        <button title="Like this Article">
                            <ThumbsUp className="card-icons" />
                        </button>
                    )}
                    {(article?.id) && (
                        <button title="Dislike this Article">
                            <ThumbsDown className="card-icons" />
                        </button>
                    )}
                    {(article?.id) && (
                        <>
                            <button title="Edit this Article">
                                <Edit3 className="card-icons" />
                            </button>
                        </>
                    )}
                    {(article?.id) && (
                        <>
                            <button title="Delete this Article">
                                <Trash2 className="card-icons" />
                            </button>
                        </>
                    )}
                </div>

                <div className="tags-container">
                    <h5>Categories</h5>
                    <div className="tags-div">
                        {article?.tags.map((tag, id) => (
                            <p className="article-tag" key={id}>{tag}</p>
                        ))}
                    </div>
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
            )
            
            })
        }
        </div>)}

</section>)}
export default Articles