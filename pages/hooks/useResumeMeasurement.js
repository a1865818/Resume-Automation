import { useCallback, useEffect, useRef, useState } from "react";

export const useResumeMeasurement = (
  resumeData,
  isHistoryView,
  experienceLayout
) => {
  const [resumeDimensions, setResumeDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [pageHeight, setPageHeight] = useState(null);
  const measurementRef = useRef({ hasInitialMeasurement: false });

  const measurePageHeight = useCallback(() => {
    const firstPageElement = document.getElementById("first-page");
    if (firstPageElement) {
      const rect = firstPageElement.getBoundingClientRect();
      let heightPx = rect.height;

      const buffer = 10;
      heightPx = Math.ceil(heightPx) + buffer;

      const heightMm = Math.round((heightPx * 25.4) / 96);

      console.log(
        "First page height measured:",
        heightPx,
        "px =",
        heightMm,
        "mm (includes buffer)"
      );
      setPageHeight(heightPx);

      setResumeDimensions((prev) => ({ ...prev, height: heightMm }));

      return heightPx;
    }
    return null;
  }, []);

  const remeasureResume = useCallback(() => {
    const resumeElement = document.getElementById("resume-content");
    if (resumeElement) {
      const actualContent = resumeElement.querySelector(
        'div[style*="width: 100%"]'
      );

      if (actualContent) {
        const contentRect = actualContent.getBoundingClientRect();
        const widthMm = (contentRect.width * 25.4) / 96;

        setResumeDimensions((prev) => ({ ...prev, width: widthMm }));
      }
    }

    measurePageHeight();
  }, [measurePageHeight]);

  useEffect(() => {
    if (isHistoryView || measurementRef.current.hasInitialMeasurement) {
      return;
    }

    const measureResume = () => {
      const resumeElement = document.getElementById("resume-content");
      if (resumeElement) {
        const actualContent = resumeElement.querySelector(
          'div[style*="width: 100%"]'
        );

        if (actualContent) {
          const contentRect = actualContent.getBoundingClientRect();
          const widthMm = Math.round((contentRect.width * 25.4) / 96);

          setResumeDimensions((prev) => ({ ...prev, width: widthMm }));
        }
      }

      setTimeout(() => {
        measurePageHeight();
        measurementRef.current.hasInitialMeasurement = true;
      }, 500);
    };

    const timer = setTimeout(measureResume, 300);

    const handleResize = () => {
      if (!measurementRef.current.hasInitialMeasurement) return;
      measureResume();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [isHistoryView, measurePageHeight]);

  // Reset measurement flag when key dependencies change
  useEffect(() => {
    measurementRef.current.hasInitialMeasurement = false;
  }, [resumeData?.profile?.name, experienceLayout]);

  return {
    resumeDimensions,
    pageHeight,
    measurePageHeight,
    remeasureResume,
    setResumeDimensions,
  };
};
