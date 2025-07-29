import "./css/about.css"

function About() {
    return ( <div className="about-section">
        <div className="mirror-wrapper">
            <h1 className="mirrored" data-text="About us">
                About us</h1>
        </div>
        <div className="about-p-container">
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
        </div>

        <p className="dedication">
            In loving memory of Philippe Haussmann
            <br />
            A brilliant mind and a generous spirit.
            <br/>Your guidance shaped my coding path, your presence is missed.
            <br/>This project is dedicated to you.
        </p>

    </div> );
}
export default About;