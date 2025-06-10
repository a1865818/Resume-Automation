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
//       // Return null for both parts if no content - this will skip the experience entirely
//       return { first: null, second: null };
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

//       let currentColumnHeight = 0;
//       let currentColumn = "left"; // Start with left column
//       let currentIndex = 0;

//       const addToCurrentColumn = (expItem) => {
//         currentPage.push({
//           ...expItem,
//           column: currentColumn,
//         });
//       };

//       const switchToNextColumn = () => {
//         if (currentColumn === "left") {
//           currentColumn = "right";
//           currentColumnHeight = 0;
//         } else {
//           // Both columns filled, start new page
//           pages.push(currentPage);
//           currentPage = [];
//           currentColumn = "left";
//           currentColumnHeight = 0;
//         }
//       };

//       // Helper function to calculate actual height of split content
//       const calculateSplitHeight = (responsibilities, baseTitleHeight = 50) => {
//         const avgLineHeight = 24;
//         return baseTitleHeight + responsibilities.length * avgLineHeight + 16; // +16 for margin
//       };

//       while (currentIndex < fullExperience.length) {
//         const exp = fullExperience[currentIndex];

//         // Skip experiences with no responsibilities/content
//         if (!exp.responsibilities || exp.responsibilities.length === 0) {
//           currentIndex++;
//           continue;
//         }

//         const itemHeight = experienceHeights[currentIndex] || 150;
//         const itemWithGap = itemHeight + 16;

//         // Check if the full experience fits in current column
//         if (currentColumnHeight + itemWithGap <= availableHeight) {
//           // Experience fits entirely in current column
//           addToCurrentColumn({
//             exp,
//             index: currentIndex,
//           });
//           currentColumnHeight += itemWithGap;
//           currentIndex++;
//         } else {
//           // Experience doesn't fit entirely - check available space
//           const remainingHeight = availableHeight - currentColumnHeight;

//           // Only try to split if we have meaningful space (at least 100px)
//           if (remainingHeight >= 100) {
//             const splitResult = splitExperienceContent(
//               exp,
//               remainingHeight,
//               itemWithGap
//             );

//             if (
//               splitResult.first &&
//               splitResult.first.responsibilities &&
//               splitResult.first.responsibilities.length > 0
//             ) {
//               // Add first part to current column
//               addToCurrentColumn({
//                 exp: splitResult.first,
//                 index: currentIndex,
//                 isSplit: true,
//               });
//               // Mark column as full
//               currentColumnHeight = availableHeight;

//               // Switch to next column/page
//               switchToNextColumn();

//               if (
//                 splitResult.second &&
//                 splitResult.second.responsibilities &&
//                 splitResult.second.responsibilities.length > 0
//               ) {
//                 // Calculate actual height needed for second part
//                 const secondPartHeight = calculateSplitHeight(
//                   splitResult.second.responsibilities
//                 );

//                 // Check if second part fits in new column
//                 if (secondPartHeight <= availableHeight) {
//                   addToCurrentColumn({
//                     exp: splitResult.second,
//                     index: currentIndex,
//                     isSplit: true,
//                   });
//                   currentColumnHeight += secondPartHeight;
//                 } else {
//                   // Second part still too big, put it as-is and let next iteration handle it
//                   addToCurrentColumn({
//                     exp: splitResult.second,
//                     index: currentIndex,
//                     isSplit: true,
//                   });
//                   currentColumnHeight = availableHeight; // Mark as full
//                 }
//               }
//               currentIndex++;
//             } else {
//               // Can't split meaningfully, move entire experience to next column
//               switchToNextColumn();
//               addToCurrentColumn({
//                 exp,
//                 index: currentIndex,
//               });
//               currentColumnHeight += itemWithGap;
//               currentIndex++;
//             }
//           } else {
//             // Not enough space to split, move to next column
//             switchToNextColumn();
//             addToCurrentColumn({
//               exp,
//               index: currentIndex,
//             });
//             currentColumnHeight += itemWithGap;
//             currentIndex++;
//           }
//         }

//         // If current column is full, auto-switch to next column
//         if (currentColumnHeight >= availableHeight) {
//           switchToNextColumn();
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
      // Return null for both parts if no content - this will skip the experience entirely
      return { first: null, second: null };
    }

    // Calculate more accurate heights
    const avgLineHeight = 26; // Slightly increased for better accuracy
    const baseTitleHeight = 60; // Increased to account for title and period
    const marginBottom = 16; // Account for margin between items

    // Calculate how many responsibilities can fit
    const availableLines = Math.floor(
      (availableHeight - baseTitleHeight - marginBottom) / avgLineHeight
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
      const calculateSplitHeight = (responsibilities, baseTitleHeight = 60) => {
        const avgLineHeight = 26;
        const marginBottom = 16;
        return (
          baseTitleHeight +
          responsibilities.length * avgLineHeight +
          marginBottom
        );
      };

      while (currentIndex < fullExperience.length) {
        const exp = fullExperience[currentIndex];

        // Skip experiences with no responsibilities/content
        if (!exp.responsibilities || exp.responsibilities.length === 0) {
          currentIndex++;
          continue;
        }

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

          // Only try to split if we have meaningful space (at least 120px for better splitting)
          if (remainingHeight >= 120) {
            const splitResult = splitExperienceContent(
              exp,
              remainingHeight,
              itemWithGap
            );

            if (
              splitResult.first &&
              splitResult.first.responsibilities &&
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
                splitResult.second.responsibilities &&
                splitResult.second.responsibilities.length > 0
              ) {
                // Calculate actual height needed for second part
                const secondPartHeight = calculateSplitHeight(
                  splitResult.second.responsibilities
                );

                // Add second part to new column (it should fit since we have a fresh column)
                addToCurrentColumn({
                  exp: splitResult.second,
                  index: currentIndex,
                  isSplit: true,
                });
                currentColumnHeight += secondPartHeight;
              }
              currentIndex++;
            } else {
              // Can't split meaningfully, move entire experience to next column
              switchToNextColumn();

              // Check if full experience fits in new column
              if (itemWithGap <= availableHeight) {
                addToCurrentColumn({
                  exp,
                  index: currentIndex,
                });
                currentColumnHeight += itemWithGap;
              } else {
                // Even full column isn't enough, add it anyway and mark as full
                addToCurrentColumn({
                  exp,
                  index: currentIndex,
                });
                currentColumnHeight = availableHeight;
              }
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
