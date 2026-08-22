import { useEffect, useRef, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import Marquee from "react-fast-marquee";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const isTriggered = useRef(false);

  useEffect(() => {
    if (percent >= 100 && !isTriggered.current) {
      isTriggered.current = true;
      // Show 100% clearly before transitioning
      const timer1 = setTimeout(() => {
        setLoaded(true);
      }, 250);

      const timer2 = setTimeout(() => {
        setClicked(true);
      }, 650);

      const timer3 = setTimeout(() => {
        import("./utils/initialFX").then((module) => {
          try {
            if (module.initialFX) {
              module.initialFX();
            }
          } catch (err) {
            console.error("initialFX error:", err);
          }
          setIsLoading(false);
        });
      }, 1100);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [percent, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  const handleEnter = () => {
    setLoaded(true);
    setClicked(true);
    setTimeout(() => {
      import("./utils/initialFX").then((module) => {
        try {
          if (module.initialFX) module.initialFX();
        } catch (err) {
          console.error("initialFX error:", err);
        }
        setIsLoading(false);
      });
    }, 400);
  };

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          FAZLUL
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <Marquee>
            <span> Full Stack Developer (MERN)</span>{" "}
            <span>SQA & Quality Assurance Engineer</span>{" "}
            <span> Full Stack Developer (MERN)</span>{" "}
            <span>SQA & Quality Assurance Engineer</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
          onClick={handleEnter}
          style={{ cursor: "pointer" }}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;
  let isAssetLoaded = false;

  const timer = setInterval(() => {
    if (!isAssetLoaded) {
      if (percent < 85) {
        percent += 1;
        setLoading(percent);
      }
    } else {
      if (percent < 100) {
        percent += 1;
        setLoading(percent);
      } else {
        clearInterval(timer);
      }
    }
  }, 18);

  function clear() {
    isAssetLoaded = true;
    percent = 100;
    setLoading(100);
    clearInterval(timer);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      isAssetLoaded = true;
      const checkInterval = setInterval(() => {
        if (percent >= 100) {
          clearInterval(checkInterval);
          resolve(100);
        }
      }, 10);
    });
  }

  return { loaded, percent, clear };
};

