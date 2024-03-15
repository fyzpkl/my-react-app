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
    const [treeData, setTreeData] = useState([]);
  
    useEffect(() => {
      // Function to handle messages from the LWC
      const handleMessage = (event) => {
        // Perform origin and/or other security checks here
  
        // Check if the message has the expected format and source
        if (event.data && event.data.source === 'SalesforceLWC') {
          setTreeData(event.data.treeData);
        }
      };
  
      // Add event listener for messages from the parent window
      window.addEventListener('message', handleMessage);
  
      // Send a message to LWC to request data
      window.parent.postMessage({ request: 'fetchTreeData' }, '*'); // Replace '*' with Salesforce origin for security
  
      return () => {
        // Clean up the event listener
        window.removeEventListener('message', handleMessage);
      };
    }, []);
  
    return <Tree data={treeData} />;
  }
  
  export default App;