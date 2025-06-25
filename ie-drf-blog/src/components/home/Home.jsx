import "./css/home.css"
import Articles from "../articles/Articles"
import useAuth from "../../auth/hooks/useAuth"

function Home() {
    const {user} = useAuth();
    return (<div className="home-div">
        <h1>IE Blog</h1>

        {user?.is_admin && <p>Welcome Back {user.username} !</p>}
        {user?.is_mod && <p>Welcome Back {user.username}!</p>}
        <Articles />
    </div>)
}
export default Home