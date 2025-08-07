import { useEffect, useMemo, useState } from "react";

export const useExperiencePagination = (
  fullExperience,
  experienceLayout,
  pageHeight
) => {
  const [itemHeights, setItemHeights] = useState({});
  const [pageLayoutMeasurements, setPageLayoutMeasurements] = useState({
    headerHeight: 325, // fallback
    paddingHeight: 96, // fallback
    availableHeight: 645 // fallback
  });

  useEffect(() => {
    if (experienceLayout !== "paginated" || fullExperience.length === 0) {
      return;
    }

    const measureItemHeights = () => {
      const heights = {};

      // DYNAMIC MEASUREMENT: Measure actual page layout components
      const measurePageLayout = () => {
        let measuredHeaderHeight = 325; // fallback
        let measuredPaddingHeight = 96; // fallback

        // Try to measure the actual page header from an existing experience page or first page
        const pageHeaderElement = document.querySelector('[style*="height: 155px"]') ||
          document.querySelector('[style*="backgroundColor: black"]') ||
          document.querySelector('div[style*="color: white"][style*="padding: 1rem 1.5rem"]');

        if (pageHeaderElement) {
          measuredHeaderHeight = pageHeaderElement.offsetHeight;
          console.log('📏 Measured page header height:', measuredHeaderHeight, 'px');
        } else {
          console.log('⚠️ Could not find page header element, using fallback:', measuredHeaderHeight, 'px');
        }

        // Try to measure actual padding from experience page container  
        const experiencePageContainer = document.querySelector('div[style*="padding: 1.5rem"]') ||
          document.querySelector('div[style*="flex: 1"][style*="overflowY: hidden"]');

        if (experiencePageContainer) {
          const computedStyle = window.getComputedStyle(experiencePageContainer);
          const topPadding = parseFloat(computedStyle.paddingTop) || 0;
          const bottomPadding = parseFloat(computedStyle.paddingBottom) || 0;
          measuredPaddingHeight = topPadding + bottomPadding;
          console.log('📏 Measured padding height:', measuredPaddingHeight, 'px (top:', topPadding, '+ bottom:', bottomPadding, ')');
        } else {
          console.log('⚠️ Could not find experience page container, using fallback padding:', measuredPaddingHeight, 'px');
        }

        // Calculate available height
        const calculatedAvailableHeight = pageHeight
          ? pageHeight - measuredHeaderHeight - measuredPaddingHeight
          : 645; // fallback

        console.log('📏 Page Layout Measurements:', {
          pageHeight,
          headerHeight: measuredHeaderHeight,
          paddingHeight: measuredPaddingHeight,
          availableHeight: calculatedAvailableHeight
        });

        setPageLayoutMeasurements({
          headerHeight: measuredHeaderHeight,
          paddingHeight: measuredPaddingHeight,
          availableHeight: calculatedAvailableHeight
        });

        return { measuredHeaderHeight, measuredPaddingHeight, calculatedAvailableHeight };
      };

      // Measure page layout first
      const layoutMeasurements = measurePageLayout();

      // Measure each individual component
      fullExperience.forEach((exp, expIndex) => {
        if (!exp.responsibilities || exp.responsibilities.length === 0) return;

        // Measure title + period header with validation
        const headerElement = document.getElementById(`exp-header-${expIndex}`);
        if (headerElement) {
          const headerHeight = headerElement.offsetHeight;

          // Validate measurement is reasonable (headers should be 40-120px)
          if (headerHeight >= 40 && headerHeight <= 120) {
            heights[`header-${expIndex}`] = headerHeight;
            console.log(`✅ Header ${expIndex} height measured:`, headerHeight, 'px');
          } else {
            console.warn(`⚠️ Header ${expIndex} height seems incorrect:`, headerHeight, 'px. Element:', headerElement);
          }
        } else {
          console.warn(`❌ Header element not found: exp-header-${expIndex}`);
        }

        // Measure each responsibility bullet point with validation
        exp.responsibilities.forEach((resp, respIndex) => {
          const bulletElement = document.getElementById(
            `exp-bullet-${expIndex}-${respIndex}`
          );
          if (bulletElement) {
            const bulletHeight = bulletElement.offsetHeight;

            // Validate measurement is reasonable (bullets should be 20-200px)
            if (bulletHeight >= 20 && bulletHeight <= 200) {
              heights[`bullet-${expIndex}-${respIndex}`] = bulletHeight;
              console.log(`✅ Bullet ${expIndex}-${respIndex} height measured:`, bulletHeight, 'px (text:', resp.substring(0, 50) + '...)');
            } else {
              console.warn(`⚠️ Bullet ${expIndex}-${respIndex} height seems incorrect:`, bulletHeight, 'px. Text:', resp.substring(0, 50) + '...');
            }
          } else {
            console.warn(`❌ Bullet element not found: exp-bullet-${expIndex}-${respIndex}`);
          }
        });
      });

      console.log("📊 All measured heights:", heights);
      console.log("📈 Total measurements captured:", Object.keys(heights).length);

      // Summary of measurement status
      const headerMeasurements = Object.keys(heights).filter(key => key.startsWith('header-')).length;
      const bulletMeasurements = Object.keys(heights).filter(key => key.startsWith('bullet-')).length;
      const totalExpected = fullExperience.reduce((total, exp) => total + 1 + (exp.responsibilities?.length || 0), 0);

      console.log("📋 Measurement Summary:", {
        headersMeasured: headerMeasurements,
        bulletsMeasured: bulletMeasurements,
        totalMeasured: headerMeasurements + bulletMeasurements,
        totalExpected: totalExpected,
        completeness: Math.round(((headerMeasurements + bulletMeasurements) / totalExpected) * 100) + '%'
      });

      setItemHeights(heights);
    };

    // Multiple measurement attempts for better reliability
    const timer1 = setTimeout(measureItemHeights, 100);  // Quick first attempt
    const timer2 = setTimeout(measureItemHeights, 300);  // Second attempt after elements settle
    const timer3 = setTimeout(measureItemHeights, 600);  // Final attempt for complex content

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [fullExperience.length, experienceLayout, pageHeight]);

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

      // USE DYNAMIC MEASUREMENTS instead of hardcoded values
      const { headerHeight, paddingHeight, availableHeight } = pageLayoutMeasurements;

      console.log("🎯 Using dynamic measurements for pagination:", {
        headerHeight,
        paddingHeight,
        availableHeight,
        pageHeight
      });

      // Safety check: Ensure we have reasonable available height
      let workingAvailableHeight = availableHeight;
      if (availableHeight < 200) {
        console.warn("⚠️ Available height too small for content:", availableHeight, "px. Using fallback.");
        // Use a more reasonable fallback
        workingAvailableHeight = pageHeight ? Math.max(pageHeight * 0.6, 400) : 600;
        console.log("🔄 Using fallback available height:", workingAvailableHeight, "px");
      }

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
        // More conservative buffer to prevent any cut-off
        const marginBuffer = 32; // Increased buffer significantly to prevent cut-off
        const totalRequiredHeight = columnHeight + itemHeight + marginBuffer;
        const fits = totalRequiredHeight <= workingAvailableHeight;

        console.log(
          `🔍 Can fit ${itemHeight}px in column?`,
          {
            currentHeight: columnHeight,
            itemHeight: itemHeight,
            marginBuffer: marginBuffer,
            totalRequired: totalRequiredHeight,
            workingAvailableHeight: workingAvailableHeight,
            remainingSpace: workingAvailableHeight - columnHeight,
            fits: fits
          }
        );
        return fits;
      };

      const getNextAvailableColumn = (itemHeight) => {
        // Additional safety: check if we have minimum viable space remaining
        const minimumRemainingSpace = 60; // Minimum space needed for any content

        // Try left column first
        if (canFitInColumn(itemHeight, leftColumnHeight) &&
          (workingAvailableHeight - leftColumnHeight) >= minimumRemainingSpace) {
          return "left";
        }
        // Try right column
        if (canFitInColumn(itemHeight, rightColumnHeight) &&
          (workingAvailableHeight - rightColumnHeight) >= minimumRemainingSpace) {
          return "right";
        }

        console.log("❌ No suitable column found:", {
          itemHeight,
          leftColumnHeight,
          rightColumnHeight,
          leftRemaining: workingAvailableHeight - leftColumnHeight,
          rightRemaining: workingAvailableHeight - rightColumnHeight,
          minimumRequired: minimumRemainingSpace
        });

        // Both columns full or insufficient space
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
          // More accurate fallback calculation for headers based on actual component styles
          // Base: padding(4px*2) + marginBottom(0.5rem=8px) = 16px
          // Title: fontSize(0.875rem≈14px) + lineHeight(1.2) + marginBottom(0.25rem=4px) = ~21px
          // Period: fontSize(0.875rem≈14px) + lineHeight(1.2) = ~17px  
          // Company (optional): fontSize(0.75rem≈12px) + margin(0.125rem=2px) = ~14px
          const baseHeaderHeight = 16 + 21 + 17; // 54px
          const companyHeight = exp.company ? 14 : 0;
          const estimatedHeaderHeight = baseHeaderHeight + companyHeight;

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
          // Accurate fallback calculation based on actual component styles
          const responsibilityText = exp.responsibilities[currentRespIndex];

          // Based on actual ExperienceBullet styles:
          // Container: padding(2px*2) + marginBottom(0.25rem=4px) + marginLeft(0.25rem=4px) = 12px
          // Text: fontSize(0.885rem≈14.16px) + lineHeight(1.25) = ~17.7px per line
          // Bullet span: fontSize(0.875rem≈14px) + marginRight(0.5rem=8px) = included in container

          const containerPadding = 12; // padding + margins
          const lineHeightPx = 17.7; // fontSize * lineHeight
          const avgCharPerLine = 45; // More accurate for the column width

          const estimatedLines = Math.max(1, Math.ceil(responsibilityText.length / avgCharPerLine));
          const estimatedBulletHeight = Math.ceil(containerPadding + (estimatedLines * lineHeightPx));

          const measuredHeight = itemHeights[`bullet-${currentExpIndex}-${currentRespIndex}`];
          const bulletHeight = measuredHeight || estimatedBulletHeight;

          console.log(
            `📋 Processing bullet ${currentRespIndex} for exp ${currentExpIndex}:`,
            {
              textLength: responsibilityText.length,
              estimatedLines,
              estimatedHeight: estimatedBulletHeight,
              measuredHeight: measuredHeight || 'not measured',
              finalHeight: bulletHeight,
              usingEstimate: !measuredHeight,
              text: responsibilityText.substring(0, 60) + '...'
            }
          );

          const availableColumn = getNextAvailableColumn(bulletHeight);

          if (availableColumn === null) {
            // Both columns full, start new page
            console.log("🚫 Both columns full, starting new page for bullet:", {
              bulletHeight,
              leftColumnHeight,
              rightColumnHeight,
              workingAvailableHeight,
              leftUnused: workingAvailableHeight - leftColumnHeight,
              rightUnused: workingAvailableHeight - rightColumnHeight
            });
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
              console.log(`✅ Placed bullet in LEFT column. New height: ${leftColumnHeight}px (${workingAvailableHeight - leftColumnHeight}px remaining)`);
            } else {
              rightColumnHeight += bulletHeight + 4;
              console.log(`✅ Placed bullet in RIGHT column. New height: ${rightColumnHeight}px (${workingAvailableHeight - rightColumnHeight}px remaining)`);
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
  }, [experienceLayout, pageHeight, fullExperience, itemHeights, pageLayoutMeasurements]);

  return {
    itemHeights,
    getExperiencePages,
    pageLayoutMeasurements,
  };
};
