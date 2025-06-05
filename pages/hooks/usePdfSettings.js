import { useState } from "react";
import { Margin, Resolution } from "react-to-pdf";

export const usePdfSettings = (resumeDimensions) => {
  const [pdfSettings, setPdfSettings] = useState({
    method: "save",
    resolution: Resolution.HIGH,
    format: "A4",
    orientation: "landscape",
    margin: Margin.NONE,
    mimeType: "image/jpeg",
    qualityRatio: 0.92,
    compress: true,
    useCORS: true,
    customWidth: 0,
    customHeight: 0,
  });

  const updatePdfSetting = (key, value) => {
    setPdfSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //   // Update PDF settings when dimensions change
  //   const updateDimensions = (width, height) => {
  //     setPdfSettings((prev) => ({
  //       ...prev,
  //       customWidth: width,
  //       customHeight: height,
  //     }));
  //   };

  return {
    pdfSettings,
    updatePdfSetting,
    // updateDimensions,
    setPdfSettings,
  };
};
