import "./css/home.css"
import Articles from "../articles/Articles"
import useAuth from "../../auth/hooks/useAuth"

function Home() {
    const {user} = useAuth();
    return (<div className="home-div">
        <div className="mirror-wrapper">
            <h1 className="mirrored" data-text="IE Blog">
                IE Blog</h1>
        </div>
        

        {user?.is_admin && <p>Welcome Back {user.username} !</p>}
        {user?.is_mod && <p>Welcome Back {user.username}!</p>}
        <Articles />
    </div>)
}
export default Home