// // // // hooks/useExperiencePagination.js
// // // import { useEffect, useMemo, useState } from "react";

// // // export const useExperiencePagination = (
// // //   fullExperience,
// // //   experienceLayout,
// // //   pageHeight
// // // ) => {
// // //   const [experienceHeights, setExperienceHeights] = useState({});

// // //   useEffect(() => {
// // //     if (experienceLayout !== "paginated" || fullExperience.length === 0) {
// // //       return;
// // //     }

// // //     const measureExperienceHeights = () => {
// // //       const heights = {};
// // //       fullExperience.forEach((exp, index) => {
// // //         const element = document.getElementById(`exp-measure-${index}`);
// // //         if (element) {
// // //           heights[index] = element.offsetHeight;
// // //         }
// // //       });
// // //       setExperienceHeights(heights);
// // //     };

// // //     const timer = setTimeout(measureExperienceHeights, 100);
// // //     return () => clearTimeout(timer);
// // //   }, [fullExperience.length, experienceLayout]); // Only depend on length, not the full array

// // //   const getExperiencePages = useMemo(() => {
// // //     if (experienceLayout === "summary") {
// // //       return [];
// // //     }

// // //     if (experienceLayout === "paginated") {
// // //       const pages = [];
// // //       let currentPage = [];

// // //       const headerHeight = 80;
// // //       const paddingHeight = 96;
// // //       const availableHeight = pageHeight
// // //         ? pageHeight - headerHeight - paddingHeight
// // //         : 800;

// // //       let leftColumnHeight = 0;
// // //       let rightColumnHeight = 0;

// // //       fullExperience.forEach((exp, index) => {
// // //         const itemHeight = experienceHeights[index] || 150;
// // //         const itemWithGap = itemHeight + 16;

// // //         const wouldGoToLeft = leftColumnHeight <= rightColumnHeight;

// // //         const fitsInDesignatedColumn = wouldGoToLeft
// // //           ? leftColumnHeight + itemWithGap <= availableHeight
// // //           : rightColumnHeight + itemWithGap <= availableHeight;

// // //         if (!fitsInDesignatedColumn && currentPage.length > 0) {
// // //           pages.push(currentPage);
// // //           currentPage = [exp];
// // //           leftColumnHeight = itemWithGap;
// // //           rightColumnHeight = 0;
// // //         } else {
// // //           currentPage.push(exp);
// // //           if (wouldGoToLeft) {
// // //             leftColumnHeight += itemWithGap;
// // //           } else {
// // //             rightColumnHeight += itemWithGap;
// // //           }
// // //         }
// // //       });

// // //       if (currentPage.length > 0) {
// // //         pages.push(currentPage);
// // //       }

// // //       return pages;
// // //     }

// // //     return [];
// // //   }, [experienceLayout, pageHeight, fullExperience, experienceHeights]);

// // //   return {
// // //     experienceHeights,
// // //     getExperiencePages,
// // //   };
// // // };

// import { useEffect, useMemo, useState } from "react";

// export const useExperiencePagination = (
//   fullExperience,
//   experienceLayout,
//   pageHeight
// ) => {
//   const [experienceHeights, setExperienceHeights] = useState({});

//   useEffect(() => {
//     if (experienceLayout !== "paginated" || fullExperience.length === 0) {
//       return;
//     }

//     const measureExperienceHeights = () => {
//       const heights = {};
//       fullExperience.forEach((exp, index) => {
//         const element = document.getElementById(`exp-measure-${index}`);
//         if (element) {
//           heights[index] = element.offsetHeight;
//         }
//       });
//       setExperienceHeights(heights);
//     };

//     const timer = setTimeout(measureExperienceHeights, 100);
//     return () => clearTimeout(timer);
//   }, [fullExperience.length, experienceLayout]);

//   // Helper function to split experience content
//   const splitExperienceContent = (exp, availableHeight, totalHeight) => {
//     if (!exp.responsibilities || !exp.responsibilities.length) {
//       return { first: { ...exp, responsibilities: [] }, second: null };
//     }

//     // Calculate approximate height per responsibility line
//     const avgLineHeight = 24; // Average height of a line in pixels
//     const baseTitleHeight = 50; // Height of title and date section

//     // Calculate how many responsibilities can fit
//     const availableLines = Math.floor(
//       (availableHeight - baseTitleHeight) / avgLineHeight
//     );

//     if (availableLines <= 0) {
//       // Not even enough space for the title, move the entire exp to next space
//       return { first: null, second: exp };
//     }

//     // Split responsibilities
//     const firstPartResponsibilities = exp.responsibilities.slice(
//       0,
//       availableLines
//     );
//     const secondPartResponsibilities =
//       exp.responsibilities.slice(availableLines);

//     if (secondPartResponsibilities.length === 0) {
//       // Everything fits in the first part
//       return { first: exp, second: null };
//     }

//     // Create the two parts
//     const firstPart = {
//       ...exp,
//       responsibilities: firstPartResponsibilities,
//       isSplit: true,
//       isFirstPart: true,
//     };

//     const secondPart = {
//       ...exp,
//       responsibilities: secondPartResponsibilities,
//       isSplit: true,
//       isSecondPart: true,
//       title: `${exp.title} (continued)`,
//       originalIndex: fullExperience.indexOf(exp), // Keep track of original experience
//     };

//     return { first: firstPart, second: secondPart };
//   };

//   const getExperiencePages = useMemo(() => {
//     if (experienceLayout === "summary") {
//       return [];
//     }

//     if (experienceLayout === "paginated") {
//       const pages = [];
//       let currentPage = [];

//       const headerHeight = 80;
//       const paddingHeight = 96;
//       const availableHeight = pageHeight
//         ? pageHeight - headerHeight - paddingHeight
//         : 800;

//       let leftColumnHeight = 0;
//       let rightColumnHeight = 0;
//       let currentIndex = 0;

//       while (currentIndex < fullExperience.length) {
//         const exp = fullExperience[currentIndex];
//         const itemHeight = experienceHeights[currentIndex] || 150;
//         const itemWithGap = itemHeight + 16;

//         // Initialize splitResult variable at the top of the loop
//         let splitResult = null;

//         // Try left column first
//         if (leftColumnHeight + itemWithGap <= availableHeight) {
//           // Item fits entirely in the left column
//           currentPage.push({
//             exp,
//             column: "left",
//             index: currentIndex,
//           });
//           leftColumnHeight += itemWithGap;
//           currentIndex++;
//         }
//         // Left column full or item doesn't fit completely - try to split
//         else {
//           const remainingHeight = availableHeight - leftColumnHeight;
//           splitResult = splitExperienceContent(
//             exp,
//             remainingHeight,
//             itemWithGap
//           );

//           if (splitResult.first) {
//             // Add first part to the left column
//             currentPage.push({
//               exp: splitResult.first,
//               column: "left",
//               index: currentIndex,
//               isSplit: true,
//             });
//             leftColumnHeight = availableHeight; // Left column is now full
//           }

//           if (splitResult.second) {
//             // Try to place the second part in the right column of the SAME page
//             if (rightColumnHeight + itemWithGap * 0.7 <= availableHeight) {
//               // Second part fits in right column of current page
//               currentPage.push({
//                 exp: splitResult.second,
//                 column: "right",
//                 index: currentIndex,
//                 isSplit: true,
//                 continuesFrom: "left",
//               });
//               rightColumnHeight += itemWithGap * 0.7; // Estimated height for second part
//               currentIndex++;
//             }
//             // If right column is also full, move to a new page
//             else {
//               // Finish current page
//               pages.push(currentPage);

//               // Start new page with second part in left column
//               currentPage = [
//                 {
//                   exp: splitResult.second,
//                   column: "left",
//                   index: currentIndex,
//                   isSplit: true,
//                 },
//               ];
//               leftColumnHeight = itemWithGap * 0.7;
//               rightColumnHeight = 0;
//               currentIndex++;
//             }
//           } else {
//             // Nothing to split, move to next item
//             currentIndex++;
//           }
//         }

//         // If left column is full but right has space, start filling right column
//         // with next experiences (only if we haven't just split an experience)
//         if (
//           splitResult &&
//           !splitResult.second &&
//           leftColumnHeight >= availableHeight &&
//           currentIndex < fullExperience.length
//         ) {
//           const nextExp = fullExperience[currentIndex];
//           const nextItemHeight = experienceHeights[currentIndex] || 150;
//           const nextItemWithGap = nextItemHeight + 16;

//           if (rightColumnHeight + nextItemWithGap <= availableHeight) {
//             // Next item fits entirely in the right column
//             currentPage.push({
//               exp: nextExp,
//               column: "right",
//               index: currentIndex,
//             });
//             rightColumnHeight += nextItemWithGap;
//             currentIndex++;
//           } else {
//             // If next item doesn't fit in right column, try to split it
//             const remainingHeightRight = availableHeight - rightColumnHeight;
//             const splitResultRight = splitExperienceContent(
//               nextExp,
//               remainingHeightRight,
//               nextItemWithGap
//             );

//             if (splitResultRight.first) {
//               // Add first part to the right column
//               currentPage.push({
//                 exp: splitResultRight.first,
//                 column: "right",
//                 index: currentIndex,
//                 isSplit: true,
//               });
//               rightColumnHeight = availableHeight; // Right column is now full
//             }

//             if (splitResultRight.second) {
//               // Finish current page since both columns are full
//               pages.push(currentPage);

//               // Start new page with second part in left column
//               currentPage = [
//                 {
//                   exp: splitResultRight.second,
//                   column: "left",
//                   index: currentIndex,
//                   isSplit: true,
//                 },
//               ];
//               leftColumnHeight = nextItemWithGap * 0.7;
//               rightColumnHeight = 0;
//             }

//             currentIndex++; // Move to next item
//           }
//         }
//         // Alternative approach - if left column is full but no split occurred
//         else if (
//           !splitResult &&
//           leftColumnHeight >= availableHeight &&
//           currentIndex < fullExperience.length
//         ) {
//           const nextExp = fullExperience[currentIndex];
//           const nextItemHeight = experienceHeights[currentIndex] || 150;
//           const nextItemWithGap = nextItemHeight + 16;

//           if (rightColumnHeight + nextItemWithGap <= availableHeight) {
//             // Next item fits entirely in the right column
//             currentPage.push({
//               exp: nextExp,
//               column: "right",
//               index: currentIndex,
//             });
//             rightColumnHeight += nextItemWithGap;
//             currentIndex++;
//           } else {
//             // If next item doesn't fit in right column, try to split it
//             const remainingHeightRight = availableHeight - rightColumnHeight;
//             const splitResultRight = splitExperienceContent(
//               nextExp,
//               remainingHeightRight,
//               nextItemWithGap
//             );

//             if (splitResultRight.first) {
//               // Add first part to the right column
//               currentPage.push({
//                 exp: splitResultRight.first,
//                 column: "right",
//                 index: currentIndex,
//                 isSplit: true,
//               });
//               rightColumnHeight = availableHeight; // Right column is now full
//             }

//             if (splitResultRight.second) {
//               // Finish current page since both columns are full
//               pages.push(currentPage);

//               // Start new page with second part in left column
//               currentPage = [
//                 {
//                   exp: splitResultRight.second,
//                   column: "left",
//                   index: currentIndex,
//                   isSplit: true,
//                 },
//               ];
//               leftColumnHeight = nextItemWithGap * 0.7;
//               rightColumnHeight = 0;
//             }

//             currentIndex++; // Move to next item
//           }
//         }

//         // If both columns are full, start a new page
//         if (
//           leftColumnHeight >= availableHeight &&
//           rightColumnHeight >= availableHeight
//         ) {
//           pages.push(currentPage);
//           currentPage = [];
//           leftColumnHeight = 0;
//           rightColumnHeight = 0;
//         }
//       }

//       // Add any remaining items on the last page
//       if (currentPage.length > 0) {
//         pages.push(currentPage);
//       }

//       return pages;
//     }

//     return [];
//   }, [experienceLayout, pageHeight, fullExperience, experienceHeights]);

//   return {
//     experienceHeights,
//     getExperiencePages,
//   };
// };

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

  // Helper function to split experience content
  const splitExperienceContent = (exp, availableHeight, totalHeight) => {
    if (!exp.responsibilities || !exp.responsibilities.length) {
      return { first: { ...exp, responsibilities: [] }, second: null };
    }

    // Calculate approximate height per responsibility line
    const avgLineHeight = 24; // Average height of a line in pixels
    const baseTitleHeight = 50; // Height of title and date section

    // Calculate how many responsibilities can fit
    const availableLines = Math.floor(
      (availableHeight - baseTitleHeight) / avgLineHeight
    );

    if (availableLines <= 0) {
      // Not even enough space for the title, move the entire exp to next space
      return { first: null, second: exp };
    }

    // Split responsibilities
    const firstPartResponsibilities = exp.responsibilities.slice(
      0,
      availableLines
    );
    const secondPartResponsibilities =
      exp.responsibilities.slice(availableLines);

    if (secondPartResponsibilities.length === 0) {
      // Everything fits in the first part
      return { first: exp, second: null };
    }

    // Create the two parts
    const firstPart = {
      ...exp,
      responsibilities: firstPartResponsibilities,
      isSplit: true,
      isFirstPart: true,
    };

    const secondPart = {
      ...exp,
      responsibilities: secondPartResponsibilities,
      isSplit: true,
      isSecondPart: true,
      title: `${exp.title} (continued)`,
      originalIndex: fullExperience.indexOf(exp), // Keep track of original experience
    };

    return { first: firstPart, second: secondPart };
  };

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

      let currentColumnHeight = 0;
      let currentColumn = "left"; // Start with left column
      let currentIndex = 0;

      const addToCurrentColumn = (expItem) => {
        currentPage.push({
          ...expItem,
          column: currentColumn,
        });
      };

      const switchToNextColumn = () => {
        if (currentColumn === "left") {
          currentColumn = "right";
          currentColumnHeight = 0;
        } else {
          // Both columns filled, start new page
          pages.push(currentPage);
          currentPage = [];
          currentColumn = "left";
          currentColumnHeight = 0;
        }
      };

      // Helper function to calculate actual height of split content
      const calculateSplitHeight = (responsibilities, baseTitleHeight = 50) => {
        const avgLineHeight = 24;
        return baseTitleHeight + responsibilities.length * avgLineHeight + 16; // +16 for margin
      };

      while (currentIndex < fullExperience.length) {
        const exp = fullExperience[currentIndex];
        const itemHeight = experienceHeights[currentIndex] || 150;
        const itemWithGap = itemHeight + 16;

        // Check if the full experience fits in current column
        if (currentColumnHeight + itemWithGap <= availableHeight) {
          // Experience fits entirely in current column
          addToCurrentColumn({
            exp,
            index: currentIndex,
          });
          currentColumnHeight += itemWithGap;
          currentIndex++;
        } else {
          // Experience doesn't fit entirely - check available space
          const remainingHeight = availableHeight - currentColumnHeight;

          // Only try to split if we have meaningful space (at least 100px)
          if (remainingHeight >= 100) {
            const splitResult = splitExperienceContent(
              exp,
              remainingHeight,
              itemWithGap
            );

            if (
              splitResult.first &&
              splitResult.first.responsibilities.length > 0
            ) {
              // Add first part to current column
              addToCurrentColumn({
                exp: splitResult.first,
                index: currentIndex,
                isSplit: true,
              });
              // Mark column as full
              currentColumnHeight = availableHeight;

              // Switch to next column/page
              switchToNextColumn();

              if (
                splitResult.second &&
                splitResult.second.responsibilities.length > 0
              ) {
                // Calculate actual height needed for second part
                const secondPartHeight = calculateSplitHeight(
                  splitResult.second.responsibilities
                );

                // Check if second part fits in new column
                if (secondPartHeight <= availableHeight) {
                  addToCurrentColumn({
                    exp: splitResult.second,
                    index: currentIndex,
                    isSplit: true,
                  });
                  currentColumnHeight += secondPartHeight;
                } else {
                  // Second part still too big, put it as-is and let next iteration handle it
                  addToCurrentColumn({
                    exp: splitResult.second,
                    index: currentIndex,
                    isSplit: true,
                  });
                  currentColumnHeight = availableHeight; // Mark as full
                }
              }
              currentIndex++;
            } else {
              // Can't split meaningfully, move entire experience to next column
              switchToNextColumn();
              addToCurrentColumn({
                exp,
                index: currentIndex,
              });
              currentColumnHeight += itemWithGap;
              currentIndex++;
            }
          } else {
            // Not enough space to split, move to next column
            switchToNextColumn();
            addToCurrentColumn({
              exp,
              index: currentIndex,
            });
            currentColumnHeight += itemWithGap;
            currentIndex++;
          }
        }

        // If current column is full, auto-switch to next column
        if (currentColumnHeight >= availableHeight) {
          switchToNextColumn();
        }
      }

      // Add any remaining items on the last page
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
