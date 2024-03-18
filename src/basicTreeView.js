import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/x-tree-view';

function BasicTreeView() {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
        return;
      }

      if (event.data && event.data.source === 'SalesforceLWC') {
        const data = typeof event.data.treeData === 'string' ? JSON.parse(event.data.treeData) : event.data.treeData;
        setTreeData(data);
        console.log('Parsed Tree Data:', data);
      }
    };

    // Move the event listener addition outside of the handleMessage function
    window.addEventListener('message', handleMessage);

    // Cleanup event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const renderTreeItems = (nodes, path = '') => {
    if (!nodes) return null;
  
    return nodes.map((node, index) => {
      const nodeId = `${path}-${node.name}-${index}`;
      return (
        <TreeItem key={nodeId} nodeId={nodeId} label={node.name || 'Unnamed Node'}>
          {Array.isArray(node.children) ? renderTreeItems(node.children, nodeId) : null}
        </TreeItem>
      );
    });
  };
  

  console.log('Current Tree Data:', treeData); // Debugging

  return (
    <div>
      {treeData ? (
        <div>
          <h2>Tree Data:</h2>
          <TreeView>
            {renderTreeItems(treeData.children)}
          </TreeView>
        </div>
      ) : (
        <p>Loading tree data...</p>
      )}
    </div>
  );
}

export default BasicTreeView;
