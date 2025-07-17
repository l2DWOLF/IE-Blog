import { createContext, useContext, useEffect } from "react";
import useAuth from "../auth/hooks/useAuth";
import { useArticleHandlers } from "../components/articles/hooks/ArticleHandlers";

export const ArticleContext = createContext(null);

let resetArticlesExternal = () => {};
export const getResetArticles = () => resetArticlesExternal;

export const useArticleContext = () => {
    const context = useContext(ArticleContext);
    if(!context){
        throw new Error("useArticleContext must be used within an ArticleProvider")
    }
    return context;
};

export function ArticleProvider({children}){
    const {user} = useAuth();
    const articleHandlers = useArticleHandlers(user, {limit : 3});
    resetArticlesExternal = articleHandlers.resetArticles;
    
    useEffect(() => {
        if (!user) {
            articleHandlers.resetArticles();
        }
        articleHandlers.fetchData();
    }, [user]);

    return(
        <ArticleContext.Provider value={articleHandlers}>
            {children}
        </ArticleContext.Provider>
    );
};