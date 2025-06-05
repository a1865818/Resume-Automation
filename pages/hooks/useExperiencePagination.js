// hooks/useExperiencePagination.js
import { useEffect, useMemo, useState } from "react";

export const useExperiencePagination = (
  fullExperience,
  experienceLayout,
  pageHeight
) => {
  const [experienceHeights, setExperienceHeights] = useState({});

  useEffect(() => {
    if (experienceLayout !== "paginated" || fullExperience.length === 0) {
      return;
    }

    const measureExperienceHeights = () => {
      const heights = {};
      fullExperience.forEach((exp, index) => {
        const element = document.getElementById(`exp-measure-${index}`);
        if (element) {
          heights[index] = element.offsetHeight;
        }
      });
      setExperienceHeights(heights);
    };

    const timer = setTimeout(measureExperienceHeights, 100);
    return () => clearTimeout(timer);
  }, [fullExperience.length, experienceLayout]); // Only depend on length, not the full array

  const getExperiencePages = useMemo(() => {
    if (experienceLayout === "summary") {
      return [];
    }

    if (experienceLayout === "paginated") {
      const pages = [];
      let currentPage = [];

      const headerHeight = 80;
      const paddingHeight = 96;
      const availableHeight = pageHeight
        ? pageHeight - headerHeight - paddingHeight
        : 800;

      let leftColumnHeight = 0;
      let rightColumnHeight = 0;

      fullExperience.forEach((exp, index) => {
        const itemHeight = experienceHeights[index] || 150;
        const itemWithGap = itemHeight + 16;

        const wouldGoToLeft = leftColumnHeight <= rightColumnHeight;

        const fitsInDesignatedColumn = wouldGoToLeft
          ? leftColumnHeight + itemWithGap <= availableHeight
          : rightColumnHeight + itemWithGap <= availableHeight;

        if (!fitsInDesignatedColumn && currentPage.length > 0) {
          pages.push(currentPage);
          currentPage = [exp];
          leftColumnHeight = itemWithGap;
          rightColumnHeight = 0;
        } else {
          currentPage.push(exp);
          if (wouldGoToLeft) {
            leftColumnHeight += itemWithGap;
          } else {
            rightColumnHeight += itemWithGap;
          }
        }
      });

      if (currentPage.length > 0) {
        pages.push(currentPage);
      }

      return pages;
    }

    return [];
  }, [experienceLayout, pageHeight, fullExperience, experienceHeights]);

  return {
    experienceHeights,
    getExperiencePages,
  };
};
