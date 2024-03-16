import React from 'react';
import { TreeView, TreeItem } from '@mui/x-tree-view';

function BasicTreeView({ treeData }) {
  const renderTreeItems = (nodes, path = '') => {
    if (!nodes) return null;
  
    return nodes.map((node, index) => {
      const nodeId = path ? `${path}-${index}` : `${index}`;
      return (
        <TreeItem key={nodeId} nodeId={nodeId} label={node.name}>
          {Array.isArray(node.children) && renderTreeItems(node.children, nodeId)}
        </TreeItem>
      );
    });
  };
  
  return (
<div style={{ width: '100%', height: 'auto' }}> 
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
