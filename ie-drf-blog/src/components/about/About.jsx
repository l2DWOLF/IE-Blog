import "./css/about.css"

function About() {
    return ( <div className="about-section">
        <h1>About Us</h1>
        <p className="about-p">
            Welcome to IE-Blog!
            <br /><br />
            We're a team of passionate writers, developers, and creatives who believe in the power of sharing ideas and experiences through thoughtful, engaging content.
            <br /><br />
            This blog was built with love using React for the frontend and Django on the backend - combining a seamless user experience with a robust and secure framework. 
            <br />
            Whether you're here for the tech deep dives, personal stories, or curated insights, our mission is to bring you content that's not only informative but also genuinely enjoyable.
            <br /><br />
            What We Write About
            <br />
            💻 Technology & Development - Tutorials, project breakdowns, and discussions on modern tools and frameworks.
            <br />
            ✍️ Personal Growth - Reflections, lessons, and inspiration for navigating life and work.
            <br />
            🌍 Community & Culture - Stories that connect people, highlight diverse perspectives, and spark meaningful dialogue.
            <br /><br />
            Our Goal
            We're here to create a space where curiosity thrives. Whether you're a fellow developer, a curious reader, or someone just stopping by, we hope our blog adds something valuable to your day.
        </p>
    </div> );
}

export default About;