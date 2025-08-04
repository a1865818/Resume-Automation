import { useEffect, useMemo, useState } from "react";

export const useExperiencePagination = (
  fullExperience,
  experienceLayout,
  pageHeight
) => {
  const [itemHeights, setItemHeights] = useState({});

  useEffect(() => {
    if (experienceLayout !== "paginated" || fullExperience.length === 0) {
      return;
    }

    const measureItemHeights = () => {
      const heights = {};

      // Measure each individual component
      fullExperience.forEach((exp, expIndex) => {
        if (!exp.responsibilities || exp.responsibilities.length === 0) return;

        // Measure title + period header
        const headerElement = document.getElementById(`exp-header-${expIndex}`);
        if (headerElement) {
          heights[`header-${expIndex}`] = headerElement.offsetHeight;
          console.log(`Header ${expIndex} height:`, headerElement.offsetHeight);
        }

        // Measure each responsibility bullet point
        exp.responsibilities.forEach((_, respIndex) => {
          const bulletElement = document.getElementById(
            `exp-bullet-${expIndex}-${respIndex}`
          );
          if (bulletElement) {
            heights[`bullet-${expIndex}-${respIndex}`] =
              bulletElement.offsetHeight;
            console.log(
              `Bullet ${expIndex}-${respIndex} height:`,
              bulletElement.offsetHeight
            );
          }
        });
      });

      console.log("All measured heights:", heights);
      setItemHeights(heights);
    };

    const timer = setTimeout(measureItemHeights, 200); // Increased timeout
    return () => clearTimeout(timer);
  }, [fullExperience.length, experienceLayout]);

  const getExperiencePages = useMemo(() => {
    console.log("getExperiencePages called with:", {
      experienceLayout,
      fullExperienceLength: fullExperience.length,
      pageHeight,
      itemHeightsCount: Object.keys(itemHeights).length,
    });

    if (experienceLayout === "summary") {
      return [];
    }

    if (experienceLayout === "paginated") {
      const pages = [];
      let currentPageItems = [];

      // Page layout constants
      //   const headerHeight = 240; // Actual header height from PageHeader component
      //   const headerHeight = 340; // Adjusted header height for pagination
      const headerHeight = 325; // Adjusted header height for pagination

      const paddingHeight = 96; // 1.5rem * 2 (top + bottom padding)
      const availableHeight = pageHeight
        ? pageHeight - headerHeight - paddingHeight
        : 645; // 800 - 155 = 645

      console.log("Available height for content:", availableHeight);

      // Column state
      let leftColumnHeight = 0;
      let rightColumnHeight = 0;
      let currentExpIndex = 0;
      let currentRespIndex = 0;
      let isProcessingHeader = true;

      const addToColumn = (item, column) => {
        console.log(`Adding ${item.type} to ${column} column:`, item);
        currentPageItems.push({
          ...item,
          column: column,
        });
      };

      const startNewPage = () => {
        if (currentPageItems.length > 0) {
          console.log(
            "Starting new page. Current page has items:",
            currentPageItems.length
          );
          pages.push([...currentPageItems]);
        }
        currentPageItems = [];
        leftColumnHeight = 0;
        rightColumnHeight = 0;
      };

      const canFitInColumn = (itemHeight, columnHeight) => {
        const marginBuffer = 8; // Reduced buffer for more accurate fitting
        const fits =
          columnHeight + itemHeight + marginBuffer <= availableHeight;
        console.log(
          `Can fit ${itemHeight}px in column (current: ${columnHeight}px, available: ${availableHeight}px)?`,
          fits
        );
        return fits;
      };

      const getNextAvailableColumn = (itemHeight) => {
        // Try left column first
        if (canFitInColumn(itemHeight, leftColumnHeight)) {
          return "left";
        }
        // Try right column
        if (canFitInColumn(itemHeight, rightColumnHeight)) {
          return "right";
        }
        // Both columns full
        return null;
      };

      // Process all experiences
      while (currentExpIndex < fullExperience.length) {
        const exp = fullExperience[currentExpIndex];
        console.log(`Processing experience ${currentExpIndex}:`, exp.title);

        // Skip experiences with no content
        if (!exp.responsibilities || exp.responsibilities.length === 0) {
          console.log("Skipping experience with no responsibilities");
          currentExpIndex++;
          continue;
        }

        // Process header (title + period)
        if (isProcessingHeader) {
          // Better fallback calculation for headers
          const estimatedHeaderHeight = exp.company ? 75 : 55; // Account for company name
          const headerHeight =
            itemHeights[`header-${currentExpIndex}`] || estimatedHeaderHeight;
          console.log(
            `Processing header for exp ${currentExpIndex}, height:`,
            headerHeight
          );

          const availableColumn = getNextAvailableColumn(headerHeight);

          if (availableColumn === null) {
            // Both columns full, start new page
            console.log("Both columns full, starting new page for header");
            startNewPage();
            // Place header in left column of new page
            addToColumn(
              {
                type: "header",
                expIndex: currentExpIndex,
                exp: exp,
                content: {
                  title: exp.title,
                  period: exp.period,
                  company: exp.company,
                },
              },
              "left"
            );
            leftColumnHeight += headerHeight + 8;
          } else {
            // Place header in available column
            addToColumn(
              {
                type: "header",
                expIndex: currentExpIndex,
                exp: exp,
                content: {
                  title: exp.title,
                  period: exp.period,
                  company: exp.company,
                },
              },
              availableColumn
            );

            if (availableColumn === "left") {
              leftColumnHeight += headerHeight + 8;
            } else {
              rightColumnHeight += headerHeight + 8;
            }
          }

          isProcessingHeader = false;
          currentRespIndex = 0;
          continue;
        }

        // Process responsibility bullets
        if (currentRespIndex < exp.responsibilities.length) {
          // Better fallback calculation for bullets based on text length
          const responsibilityText = exp.responsibilities[currentRespIndex];
          const estimatedBulletHeight = Math.max(
            20,
            Math.ceil(responsibilityText.length / 60) * 20
          );
          const bulletHeight =
            itemHeights[`bullet-${currentExpIndex}-${currentRespIndex}`] ||
            estimatedBulletHeight;
          console.log(
            `Processing bullet ${currentRespIndex} for exp ${currentExpIndex}, height:`,
            bulletHeight
          );

          const availableColumn = getNextAvailableColumn(bulletHeight);

          if (availableColumn === null) {
            // Both columns full, start new page
            console.log("Both columns full, starting new page for bullet");
            startNewPage();
            // Place bullet in left column of new page
            addToColumn(
              {
                type: "bullet",
                expIndex: currentExpIndex,
                respIndex: currentRespIndex,
                exp: exp,
                content: {
                  text: exp.responsibilities[currentRespIndex],
                  isFirstBullet: currentRespIndex === 0,
                },
              },
              "left"
            );
            leftColumnHeight += bulletHeight + 4;
          } else {
            // Place bullet in available column
            addToColumn(
              {
                type: "bullet",
                expIndex: currentExpIndex,
                respIndex: currentRespIndex,
                exp: exp,
                content: {
                  text: exp.responsibilities[currentRespIndex],
                  isFirstBullet: currentRespIndex === 0,
                },
              },
              availableColumn
            );

            if (availableColumn === "left") {
              leftColumnHeight += bulletHeight + 4;
            } else {
              rightColumnHeight += bulletHeight + 4;
            }
          }

          currentRespIndex++;
          continue;
        }

        // Finished processing current experience, move to next
        console.log(`Finished processing experience ${currentExpIndex}`);
        currentExpIndex++;
        isProcessingHeader = true;
        currentRespIndex = 0;
      }

      // Add the last page if it has content
      if (currentPageItems.length > 0) {
        console.log("Adding final page with items:", currentPageItems.length);
        pages.push([...currentPageItems]);
      }

      console.log("Final pages generated:", pages.length, "pages");
      return pages;
    }

    return [];
  }, [experienceLayout, pageHeight, fullExperience, itemHeights]);

  return {
    itemHeights,
    getExperiencePages,
  };
};
