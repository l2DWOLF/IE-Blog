import './css/articles.css'
import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, Edit3, Trash2} from "lucide-react";
import { getAllArticles } from "../../../services/articleServices";
import { getAllComments } from '../../../services/commentServices';



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
            articles.map((article) => (
            <div className="article-card" key={article?.id}>

                <p>Author: {article.author_name}</p>
                
                <p>{article?.title}</p>
                <p>{article?.content}</p>
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
                        <div className="comment">
                            <p>Great article, very useful thanks! </p>
                            <p>by: comment author</p>
                        </div>
                        <div className="comment">
                            <p>Incredible! Thank you!!! </p>
                            <p>by: comment 2 author 2</p>
                        </div>
                    </div>
                    
                </div>

                <div className="card-btns">
                    {(article?.id) && (
                        <button title="Like this Article">
                            <ThumbsUp className="card-icons"/>
                        </button>
                    )}
                    {(article?.id) && (
                        <button title="Dislike this Article">
                            <ThumbsDown className="card-icons"/>
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
            ))
        }
        </div>

</section>)}
export default Articles