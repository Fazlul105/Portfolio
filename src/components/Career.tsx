import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SQA & Testing Bootcamp</h4>
                <h5>Udemy / Professional Training</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Comprehensive training covering ISTQB testing techniques, manual testing,
              Agile methodologies (Scrum/Kanban), test plan authoring, test case design,
              JIRA bug tracking, Postman API testing, and JMeter performance testing.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Microsoft AI & Agent Programs</h4>
                <h5>Microsoft Learn & NetCom</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Completed Microsoft 365 Copilot Learning Path, Introduction to AI Skills
              for Nonprofits, and the Agent X Bangladesh Program in collaboration with Microsoft.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Sc. in Computer Science & Eng.</h4>
                <h5>BRAC University</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Expected graduation Sept 2026. Relevant coursework: Software Engineering,
              Database Systems, Data Structures, Algorithms, OOP. Undergraduate Thesis:
              Apartment Price Prediction in Dhaka Using Structural and Location Features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
