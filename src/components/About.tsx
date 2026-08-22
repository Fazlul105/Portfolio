import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h2 className="reveal-up">
          A bit about <span>me</span>
        </h2>
        <div className="about-info">
          <p className="reveal-up">
            I am a final-year CS undergrad at BRAC University, specializing in
            Software Quality Assurance, full-stack development, and test
            automation. My expertise spans building scalable web applications
            and ensuring product quality through rigorous manual and automated
            testing (JMeter, Postman, JIRA). Recently, I’ve completed the
            Microsoft Agent X Bangladesh Program and the Microsoft 365 Copilot
            Learning Path, broadening my skills in AI solutions and cloud
            collaboration. With a strong foundation in both development and QA, I
            aim to deliver robust, high-performing software that meets user needs
            seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
