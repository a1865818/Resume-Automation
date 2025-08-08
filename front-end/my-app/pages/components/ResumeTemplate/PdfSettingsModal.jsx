import { Resolution } from 'react-to-pdf';

const PdfSettingsModal = ({
  showPdfSettings,
  setShowPdfSettings,
  pdfSettings,
  updatePdfSetting,
  resumeDimensions,
  pageHeight,
  remeasureResume,
  isHistoryView
}) => {
  if (isHistoryView || !showPdfSettings) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }} 
      onClick={() => setShowPdfSettings(false)}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '24px' }}>
          PDF Generation Settings (Height Consistency)
        </h3>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Download Method */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Download Method:
            </label>
            <select 
              value={pdfSettings.method} 
              onChange={(e) => updatePdfSetting('method', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="save">Save to Downloads</option>
              <option value="open">Open in New Tab</option>
            </select>
          </div>

          {/* Resolution */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Resolution:
            </label>
            <select 
              value={pdfSettings.resolution} 
              onChange={(e) => updatePdfSetting('resolution', parseInt(e.target.value))}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value={Resolution.LOW}>Low (Fast)</option>
              <option value={Resolution.NORMAL}>Normal</option>
              <option value={Resolution.MEDIUM}>Medium</option>
              <option value={Resolution.HIGH}>High (Recommended)</option>
            </select>
          </div>

          {/* Page Format */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Page Format:
            </label>
            <select 
              value={pdfSettings.format} 
              onChange={(e) => updatePdfSetting('format', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="A4">A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
              <option value="tabloid">Tabloid</option>
              <option value="custom">
                Custom ({resumeDimensions.width}mm × {resumeDimensions.height}mm)
              </option>
            </select>
          </div>

          {/* Custom Dimensions */}
          {pdfSettings.format === 'custom' && (
            <div style={{ 
              backgroundColor: '#f9fafb', 
              padding: '16px', 
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                Custom Dimensions
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                    Width (mm):
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={pdfSettings.customWidth}
                    onChange={(e) => updatePdfSetting('customWidth', parseFloat(e.target.value) || 0)}
                    style={{ 
                      width: '100%', 
                      padding: '6px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                    Height (mm):
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={pdfSettings.customHeight}
                    onChange={(e) => updatePdfSetting('customHeight', parseFloat(e.target.value) || 0)}
                    style={{ 
                      width: '100%', 
                      padding: '6px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={remeasureResume}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Re-measure Heights
                </button>
              </div>
            </div>
          )}
   {/* Orientation */}
              <div>
             <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
               Orientation:
             </label>
             <select 
               value={pdfSettings.orientation} 
               onChange={(e) => updatePdfSetting('orientation', e.target.value)}
               style={{ 
                 width: '100%', 
                 padding: '8px', 
                 border: '1px solid #d1d5db', 
                 borderRadius: '6px',
                 fontSize: '14px'
               }}
             >
               <option value="portrait">Portrait</option>
               <option value="landscape">Landscape</option>
             </select>
           </div>
        
          {/* Quality Ratio */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Quality: {Math.round(pdfSettings.qualityRatio * 100)}%
            </label>
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.1" 
              value={pdfSettings.qualityRatio}
              onChange={(e) => updatePdfSetting('qualityRatio', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
          <button
            onClick={() => setShowPdfSettings(false)}
            style={{
              backgroundColor: '#6B7280',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => setShowPdfSettings(false)}
            style={{
              backgroundColor: '#4F46E5',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfSettingsModal;