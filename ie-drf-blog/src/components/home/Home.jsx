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
        
        {user?.id && <p>Welcome Back {user?.username}!</p>}
        {user?.is_admin && <p> You have superuser permissions.</p>}
        {(user?.is_mod && !user?.is_staff) && <p> You have moderator permissions.</p>}
        {user?.is_staff && <p>You have admin staff permissions.</p>}
        <Articles />
    </div>)
}
export default Home