// 1. Import React and useState, useEffect hooks
import React, { useEffect, useState } from 'react';

// 2. Define the BasicTreeView functional component
function BasicTreeView() {
  // 3. Declare state variables for storing tree data
  const [treeData, setTreeData] = useState(null);
  // 4. Declare your Salesforce domain (replace with the actual domain)
  const salesforceInstance = 'https://enterprise-force-7539--partialsb.sandbox.lightning.force.com/';

  // 5. useEffect hook to handle incoming messages
  useEffect(() => {
    const handleMessage = (event) => {
      // 6. Check the origin of the incoming message for security
      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
        return;
      }

      // 7. Check if the message is from your Salesforce LWC
      if (event.data && event.data.source === 'SalesforceLWC') {
        // 8. Parse the tree data from the message
        const data = typeof event.data.treeData === 'string' ? JSON.parse(event.data.treeData) : event.data.treeData;
        // 9. Update the treeData state with the parsed data
        setTreeData(data);
      }
    };

    // 10. Add an event listener for the 'message' event
    window.addEventListener('message', handleMessage);

    // 11. Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // 12. Function to handle node (grid item) click
  const handleNodeClick = (submissionId) => {
    // Open the Salesforce record in a new window
    const objectUrl = `${salesforceInstance}lightning/r/Submission_Group__c/${submissionId}/view`;
    window.open(objectUrl, '_blank');
  };
  const handleShowChildren = (nodeId) => {
    // Logic to toggle visibility of children or navigate to child node
    console.log('Show children for node:', nodeId);
  };

  // 15. Function to render grid items
  const renderGridItems = (nodes, path = '') => {
    if (!nodes) return null;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {nodes.map((node, index) => {
          const nodeId = `${path}-${node.name}-${index}`;
          return (
            <div key={nodeId} style={{ padding: '10px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div onClick={() => handleShowChildren(nodeId)} style={{ cursor: 'pointer' }}>
                {node.name || 'Unnamed Node'}
              </div>
              {node.submissionId && (
                <div onClick={() => handleNodeClick(node.submissionId)} style={{ cursor: 'pointer', fontSize: 'smaller' }}>
                  ID: {node.submissionId}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // 16. The component's return statement that renders the UI
  return (
    <div>
      <h2>Submissions Grid</h2>
      {treeData ? renderGridItems(treeData.children) : <p>Loading submissions...</p>}
    </div>
  );
}

// 17. Export the component
export default BasicTreeView;
