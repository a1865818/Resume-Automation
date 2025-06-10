
const InfoTable = ({ data }) => {
  return (
    <div style={{ 
      overflow: 'hidden', 
      border: '1px solid #9ca3af' 
    }}>
      <table style={{ width: '100%' }}>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={index} 
              style={{ 
                borderBottom: index < data.length - 1 ? '1px solid #9ca3af' : 'none' 
              }}
            >
              <td style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '12px', 
                fontWeight: '600', 
                borderRight: '1px solid #9ca3af', 
                width: '25%' 
              }}>
                {item.label}
              </td>
              <td style={{ 
                backgroundColor: '#ffffff', 
                padding: '12px' 
              }}>
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InfoTable;