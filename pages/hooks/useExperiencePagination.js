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
  }, [fullExperience.length, experienceLayout]);

  const getExperiencePages = useMemo(() => {
    if (experienceLayout === "summary") {
      return [];
    }

    if (experienceLayout === "paginated") {
      const pages = [];
      let currentPageItems = [];

      // Page layout constants
      const headerHeight = 70;
      const paddingHeight = 86;
      const availableHeight = pageHeight
        ? pageHeight - headerHeight - paddingHeight
        : 800;

      // Column state
      let leftColumnHeight = 0;
      let rightColumnHeight = 0;
      let currentIndex = 0;

      const addToColumn = (expItem, column) => {
        currentPageItems.push({
          ...expItem,
          column: column,
        });
      };

      const startNewPage = () => {
        if (currentPageItems.length > 0) {
          pages.push(currentPageItems);
        }
        currentPageItems = [];
        leftColumnHeight = 0;
        rightColumnHeight = 0;
      };

      const canFitInColumn = (itemHeight, columnHeight) => {
        return columnHeight + itemHeight <= availableHeight;
      };

      while (currentIndex < fullExperience.length) {
        const exp = fullExperience[currentIndex];

        // Skip experiences with no content
        if (!exp.responsibilities || exp.responsibilities.length === 0) {
          currentIndex++;
          continue;
        }

        // Get the height of this experience item (with some margin)
        const baseItemHeight = experienceHeights[currentIndex] || 150;
        const itemHeight = baseItemHeight + 24; // Add margin

        let placed = false;

        // Try to place in left column first
        if (canFitInColumn(itemHeight, leftColumnHeight)) {
          addToColumn(
            {
              exp,
              index: currentIndex,
            },
            "left"
          );
          leftColumnHeight += itemHeight;
          placed = true;
        }
        // If left column is full, try right column
        else if (canFitInColumn(itemHeight, rightColumnHeight)) {
          addToColumn(
            {
              exp,
              index: currentIndex,
            },
            "right"
          );
          rightColumnHeight += itemHeight;
          placed = true;
        }
        // If both columns are full, start new page and place in left column
        else {
          startNewPage();
          addToColumn(
            {
              exp,
              index: currentIndex,
            },
            "left"
          );
          leftColumnHeight = itemHeight;
          placed = true;
        }

        if (placed) {
          currentIndex++;
        }
      }

      // Add the last page if it has content
      if (currentPageItems.length > 0) {
        pages.push(currentPageItems);
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
