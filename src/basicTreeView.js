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
        setTreeData(event.data.treeData);
        console.log('Received TreeData:', event.data.treeData);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const renderTreeItems = (nodes) => {
    if (!nodes) return null;

    return nodes.map((node) => (
      <TreeItem key={node.data.Id} nodeId={node.data.Id} label={node.data.Name}>
        {Array.isArray(node.children) && renderTreeItems(node.children)}
      </TreeItem>
    ));
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
