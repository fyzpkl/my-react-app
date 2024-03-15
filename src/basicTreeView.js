import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';

function BasicTreeView() {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Received message:', event);
      console.log('Data:', event.data);
      console.log('Source:', event.data.source);

      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
        // Validate the message origin
        return;
      }

      if (event.data && event.data.source === 'SalesforceLWC') {
        console.log('Received Salesforce LWC message:', event.data.treeData);
        setTreeData(event.data.treeData);
        // Additional logic for handling the received tree data
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  console.log('Received Tree Data:', treeData);

  const renderTreeItems = (nodes) => {
    return nodes.map((node) => (
      <TreeItem key={node.id} nodeId={node.id} label={node.label}>
        {node.children && node.children.length > 0 && renderTreeItems(node.children)}
      </TreeItem>
    ));
  };

  return (
    <div>
      {/* Render the received tree data */}
      {treeData.length > 0 && (
        <div>
          <h2>Tree Data:</h2>
          <TreeView>
            {renderTreeItems(treeData)}
          </TreeView>
        </div>
      )}
      {/* Additional UI elements */}
    </div>
  );
}

export default BasicTreeView;
