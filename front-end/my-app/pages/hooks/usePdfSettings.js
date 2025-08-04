import { useState } from "react";
import { Margin, Resolution } from "react-to-pdf";

export const usePdfSettings = (resumeDimensions) => {
  const [pdfSettings, setPdfSettings] = useState({
    method: "save",
    resolution: Resolution.NORMAL,
    format: "custom",
    orientation: "landscape",
    margin: Margin.NONE,
    mimeType: "image/jpeg",
    qualityRatio: 1,
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

  return {
    pdfSettings,
    updatePdfSetting,
    // updateDimensions,
    setPdfSettings,
  };
};
