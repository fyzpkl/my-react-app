import React, { useEffect, useState, useCallback } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

function BasicTreeView() {
  const [treeData, setTreeData] = useState([]);

  // Convert your tree data to the format required by react-sortable-tree
  const convertToSortableTreeFormat = useCallback((nodes) => {
    return nodes.map(node => ({
      title: node.name,
      children: convertToSortableTreeFormat(node.children || [])
    }));
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
        return;
      }

      if (event.data && event.data.source === 'SalesforceLWC') {
        const data = typeof event.data.treeData === 'string' ? JSON.parse(event.data.treeData) : event.data.treeData;
        setTreeData(convertToSortableTreeFormat(data.children));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [convertToSortableTreeFormat]);

  return (
    <div style={{ height: 400 }}>
      <h2>Tree Data:</h2>
      <SortableTree
        treeData={treeData}
        onChange={newTreeData => setTreeData(newTreeData)}
      />
    </div>
  );
}

export default BasicTreeView;
