import ExperienceBulletTable from "./ExperienceBulletTable";
import ExperienceHeaderTable from "./ExperienceHeaderTable";

// Table-based ExperienceItemSecondPage component
const ExperienceItemSecondPageTable = ({ item }) => {
    console.log('ExperienceItemSecondPageTable received item:', item);
    
    if (!item) {
      console.warn('ExperienceItemSecondPageTable: No item provided');
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ color: 'red', fontSize: '12px' }}>NO ITEM</td>
            </tr>
          </tbody>
        </table>
      );
    }
  
    if (item.type === 'header') {
      return <ExperienceHeaderTable exp={item.exp} content={item.content} />;
    }
  
    if (item.type === 'bullet') {
      return (
        <ExperienceBulletTable 
          content={item.content} 
          expIndex={item.expIndex}
          respIndex={item.respIndex}
        />
      );
    }
  
    console.warn('ExperienceItemSecondPageTable: Unknown item type:', item.type);
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ color: 'red', fontSize: '12px' }}>
              UNKNOWN TYPE: {item.type}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  export default ExperienceItemSecondPageTable;