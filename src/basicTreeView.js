import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/x-tree-view'; // Updated import statement

function BasicTreeView() {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
        // Validate the message origin
        return;
      }

      if (event.data && event.data.source === 'SalesforceLWC') {
        setTreeData(event.data.treeData);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const renderTreeItems = (nodes) => {
    if (!nodes) return null;

    return nodes.map((node) => (
      <TreeItem key={node.data.Id} nodeId={node.data.Id} label={node.data.Name}>
        {node.children && node.children.length > 0 && renderTreeItems(node.children)}
      </TreeItem>
    ));
  };

  return (
    <div>
      {/* Render the tree data */}
      {treeData && (
        <div>
          <h2>Tree Data:</h2>
          <TreeView>
            {renderTreeItems(treeData.children)}
          </TreeView>
        </div>
      )}
    </div>
  );
}

export default BasicTreeView;
