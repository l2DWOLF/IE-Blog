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
                <p>tags: {article?.tags}</p>
            
            </div>   
            ))
        }
        </div>

</section>)
}
export default Articles