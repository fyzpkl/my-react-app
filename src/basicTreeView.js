import React, { useEffect, useState } from 'react';

function BasicTreeView() {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://your-allowed-origin.com") { // replace with your allowed origin
        console.log('Invalid origin:', event.origin);
        return;
      }

      if (event.data && event.data.source === 'SalesforceLWC') {
        const data = typeof event.data.treeData === 'string' ? JSON.parse(event.data.treeData) : event.data.treeData;
        setTreeData(data);
        console.log('Parsed Tree Data:', data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleNodeClick = (submissionId) => {
    console.log('Navigate to submission with ID:', submissionId);
    // Perform your navigation logic here, e.g., redirect to a different page
    // window.location.href = `/submission/${submissionId}`;
    // or using React Router: history.push(`/submission/${submissionId}`);
  };

  const renderGridItems = (nodes) => {
    if (!nodes) return null;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {nodes.map((node, index) => (
          <div key={index} style={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }}
               onClick={() => handleNodeClick(node.submissionId)}>
            <div>{node.name || 'Unnamed Node'}</div>
            <div>ID: {node.submissionId}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2>Submissions Grid</h2>
      {treeData ? renderGridItems(treeData.children) : <p>Loading submissions...</p>}
    </div>
  );
}

export default BasicTreeView;
