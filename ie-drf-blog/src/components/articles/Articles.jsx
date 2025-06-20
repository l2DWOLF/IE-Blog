import './css/articles.css'
import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, Edit3, Trash2} from "lucide-react";
import { getAllArticles } from "../../../services/articleServices";
import { getAllComments } from '../../../services/commentServices';
import Comment from '../comments/Comment'

function Articles() {
    const [articles, setArticles] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const serverArticles = await getAllArticles();
                const serverComments = await getAllComments();
            
                setArticles(serverArticles.results)
                setComments(serverComments)
                console.log(serverComments);
                
            } catch(e) {
                console.error(e)
            }
        };
        fetchData();
    }, [])


    return( <section className="articles-section">
        <h2>Articles:</h2>

        <div className="articles-container">
        {
            articles.map((article) => {
            
            const nestedComments = comments.filter((c) => c.article === article.id);
            
            return (
            <div className="article-card" key={article?.id}>

                <h3>{article?.title}</h3>
                <h4>Article By: {article?.author_name}</h4>
                <p className="article-content">{article?.content}</p>
                <p>Created at: {article?.created_at}</p>
                <p>last update: {article?.updated_at}</p>

                <div className="tags-container">
                    <p>categories:</p>

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
            </div>   
            )
            
            })
        }
        </div>

</section>)}
export default Articles