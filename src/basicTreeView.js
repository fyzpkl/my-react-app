import React, { useState, useEffect } from 'react';

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children?.length > 0;

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <li>
      <div onClick={toggleOpen} style={{ cursor: 'pointer' }}>
        {hasChildren && (isOpen ? '[-] ' : '[+] ')}
        {node.label}
      </div>
      {hasChildren && isOpen && (
        <ul>
          {node.children.map(childNode => (
            <TreeNode key={childNode.id} node={childNode} />
          ))}
        </ul>
      )}
    </li>
  );
};

const Tree = ({ data }) => {
  return (
    <ul>
      {data.map(treeNode => (
        <TreeNode key={treeNode.id} node={treeNode} />
      ))}
    </ul>
  );
};

// Sample data
function App() {
  const [recordId, setRecordId] = useState('');
  const [treeData, setTreeData] = useState([]);

  const handleFetchData = () => {
      // Logic to fetch tree data using recordId
      // This could be an API call or another method to fetch data
      // For example, you might want to send a message to the LWC with the recordId
      console.log("Fetching data for record ID:", recordId);

      // Sample implementation (replace this with actual data fetching)
      fetchTreeData(recordId);
  };

  const fetchTreeData = (id) => {
      // Placeholder: Fetch tree data based on recordId
      // Replace with actual fetching logic
      setTreeData([
          // ... Sample data structure based on fetched data ...
      ]);
  };

  useEffect(() => {
      // This effect could be for handling responses or other actions
      // If you are expecting a message from LWC, you can handle it here

      const handleMessage = (event) => {
          // Handle message
          if (event.data && event.data.source === 'SalesforceLWC') {
              setTreeData(event.data.treeData);
          }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
      <div>
          <input 
              type="text" 
              value={recordId} 
              onChange={(e) => setRecordId(e.target.value)} 
              placeholder="Enter Record ID"
          />
          <button onClick={handleFetchData}>Fetch Data</button>

          <Tree data={treeData} />
      </div>
  );
}

export default App;