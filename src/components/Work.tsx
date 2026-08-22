import { useState, useRef, useEffect } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const projects = [
  {
    title: "Web & Mobile Testing Suite",
    category: "Software Quality Assurance (SQA)",
    tools: "JIRA, TestLink, Trello, Agile (Scrum), ISTQB Standards, Test Plans",
    image: "/images/placeholder.webp",
  },
  {
    title: "API & Performance Testing",
    category: "Automated & Load Testing",
    tools: "Postman, JMeter, SQL Queries, REST APIs, JSON Parsing, Stress Tests",
    image: "/images/placeholder.webp",
  },
  {
    title: "Apartment Price Prediction",
    category: "Thesis & Data Science",
    tools: "Python, Data Preprocessing, Feature Engineering, Prediction Models",
    image: "/images/placeholder.webp",
  },
  {
    title: "Bracu Bazaar Marketplace",
    category: "MERN Full Stack Web App",
    tools: "React.js, Node.js, Express.js, MongoDB, REST APIs, Auth",
    image: "/images/placeholder.webp",
  },
  {
    title: "Database Validation System",
    category: "Database & Data Integrity",
    tools: "MySQL, PostgreSQL, MongoDB, Robust SQL Queries, Backend Validation",
    image: "/images/placeholder.webp",
  },
  {
    title: "Microsoft Agent X & AI",
    category: "AI & Cloud Collaboration",
    tools: "Microsoft Copilot, AI Tools, Agile Workflows, Cloud Solutions",
    image: "/images/placeholder.webp",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const workElem = document.getElementById("work");
      if (!workElem) return;
      const rect = workElem.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-header">
          <h2 className="reveal-up">
            My <span>Work</span>
          </h2>
          <div className="work-controls">
            <div className="work-counter">
              <span className="work-counter-current">0{currentIndex + 1}</span>
              <span className="work-counter-divider">/</span>
              <span className="work-counter-total">0{projects.length}</span>
            </div>
            <div className="work-arrows">
              <button
                className="work-arrow-btn"
                onClick={handlePrev}
                aria-label="Previous project"
                data-cursor="disable"
              >
                <FiChevronLeft />
              </button>
              <button
                className="work-arrow-btn"
                onClick={handleNext}
                aria-label="Next project"
                data-cursor="disable"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div
          className="work-carousel-wrapper reveal-up"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="work-carousel-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {projects.map((project, index) => (
              <div
                className={`work-slide ${index === currentIndex ? "active" : ""}`}
                key={index}
              >
                <div className="work-box">
                  <div className="work-info">
                    <div className="work-title">
                      <h3>0{index + 1}</h3>
                      <div>
                        <h4>{project.title}</h4>
                        <p className="work-category">{project.category}</p>
                      </div>
                    </div>
                    <div className="work-tools-title">Tools & Features</div>
                    <div className="work-tags-container">
                      {project.tools.split(",").map((tool, i) => (
                        <span key={i} className="work-tag">
                          {tool.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <WorkImage image={project.image} alt={project.title} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="work-pagination">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`work-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to project ${index + 1}`}
              data-cursor="disable"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
