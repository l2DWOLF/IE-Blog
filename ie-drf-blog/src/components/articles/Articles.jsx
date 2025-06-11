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
        <h1>Articles:</h1>
        <p>here</p>
        <p>here2</p>
        <p>here3</p>

        <div>
        {
            articles.map((article) => (
            <div className="articles-container">
                <p key={article?.id}></p>
                <p>{article?.title}</p>
                <p>{article?.content}</p>
            </div>   
            ))
        }
        </div>

</section>)
}
export default Articles