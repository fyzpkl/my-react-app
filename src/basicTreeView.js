import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/x-tree-view';

function BasicTreeView() {
  const [treeData, setTreeData] = useState(null);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
        return;
      }

      if (event.data && event.data.source === 'SalesforceLWC') {
        const data = typeof event.data.treeData === 'string' ? JSON.parse(event.data.treeData) : event.data.treeData;
        setTreeData(data);
        setRecordId(event.data.recordId);
        console.log('Parsed Tree Data:', data);
        console.log('Received Record ID:', event.data.recordId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleNodeClick = (submissionId) => {
    // This is where you define what happens when a node is clicked
    console.log('Node clicked:', submissionId);
    // For instance, you could navigate to a different page or perform some action
  };

  const renderTreeItems = (nodes, path = '') => {
    if (!nodes) return null;
    return nodes.map((node, index) => {
      const nodeId = `${path}-${node.name}-${index}`;
      return (
        <TreeItem 
          key={nodeId} 
          nodeId={nodeId} 
          label={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <a href="#" onClick={() => handleNodeClick(node.submissionId)}>
                {node.name || 'Unnamed Node'}
              </a>
              {node.submissionId && <span style={{ fontSize: 'smaller' }}>ID: {node.submissionId}</span>}
            </div>
          }>
          {Array.isArray(node.children) ? renderTreeItems(node.children, nodeId) : null}
        </TreeItem>
      );
    });
  };

  return (
    <div>
      <h2>Tree View</h2>
      {recordId && <p>Record ID: {recordId}</p>}
      {treeData ? (
        <TreeView>
          {renderTreeItems(treeData.children)}
        </TreeView>
      ) : (
        <p>Loading tree data...</p>
      )}
    </div>
  );
}

export default BasicTreeView;
