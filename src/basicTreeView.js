import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';

function BasicTreeView() {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
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
    if (!nodes || nodes.length === 0) {
      return null;
    }

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
