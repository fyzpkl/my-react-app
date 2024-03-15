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
  const [selectedRecordId, setSelectedRecordId] = useState('');

  const handleFetchData = () => {
    console.log("Fetching data for record ID:", recordId);
    setSelectedRecordId(recordId); // Update the selectedRecordId state
    fetchTreeData(recordId);
};

  const fetchTreeData = (id) => {
    // Example: Fetching data from an API endpoint
    const apiUrl = `https://your-api-endpoint.com/data/${id}`; // Replace with your actual API URL

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            setTreeData(data); // Assuming the API returns the data in the correct format
        })
        .catch(error => {
            console.error('Error fetching tree data:', error);
            // Handle any errors here, such as setting an error message in your state
        });
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

        {selectedRecordId && <div>Selected Record ID: {selectedRecordId}</div>}

        <Tree data={treeData} />
      </div>
  );
}

export default App;