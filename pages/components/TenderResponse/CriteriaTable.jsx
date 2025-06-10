
const CriteriaTable = ({ data, columnWidth = '25%' }) => {
  return (
    <div style={{ 
      overflow: 'hidden', 
      border: '1px solid #9ca3af' 
    }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th style={{ 
              padding: '12px', 
              textAlign: 'left', 
              borderRight: '1px solid #9ca3af', 
              width: columnWidth 
            }}>
              RFQTS
            </th>
            <th style={{ 
              padding: '12px', 
              textAlign: 'left' 
            }}>
              Response
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} style={{ borderTop: '1px solid #9ca3af' }}>
              <td style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '12px', 
                borderRight: '1px solid #9ca3af', 
                verticalAlign: 'top' 
              }}>
                {item.requirement}
              </td>
              <td style={{ 
                backgroundColor: '#ffffff', 
                padding: '12px' 
              }}>
                {item.response}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CriteriaTable;