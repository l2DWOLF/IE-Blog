import "./css/home.css"
import Articles from "../articles/Articles"
import {useSelector} from "react-redux"

function Home() {
    const user = useSelector((state) => state.user.user)
    return (<div className="home-div">
        <h1>IE Blog</h1>

        {user?.is_admin && <p>Hey Admin!</p>}
        {user?.is_mod && <p>Hey Moderator!</p>}
        <Articles />
    </div>)
}
export default Home