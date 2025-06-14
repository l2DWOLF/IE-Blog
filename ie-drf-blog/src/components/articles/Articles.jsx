import './css/articles.css'
import { useState, useEffect } from "react"
import { getAllArticles } from "../../../services/articleServices";



function Articles() {
    let [articles, setArticles] = useState([]);


    useEffect(() => {
        const fetchArticles = async () => {
            try{
                let serverArticles = await getAllArticles();
                setArticles(serverArticles.results)
                console.log(serverArticles.results[1].tags);
                
            } catch(e) {
                console.error(e)
            }
        };
        fetchArticles();
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
                        {article?.tags.map((tag) => (
                            <p className="article-tag">{tag}</p>
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
            </div>   
            ))
        }
        </div>

</section>)
}
export default Articles