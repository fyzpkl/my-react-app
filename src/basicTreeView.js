import React, { useEffect, useState } from 'react';

function BasicTreeView() {
  const [treeData, setTreeData] = useState(null);
  const salesforceInstance = 'https://enterprise-force-7539--partialsb.sandbox.lightning.force.com/';

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
        return;
      }

      if (event.data && event.data.source === 'SalesforceLWC') {
        const data = typeof event.data.treeData === 'string' ? JSON.parse(event.data.treeData) : event.data.treeData;
        setTreeData(data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleNodeClick = (submissionId) => {
    const objectUrl = `${salesforceInstance}lightning/r/Submission_Group__c/${submissionId}/view`;
    window.open(objectUrl, '_blank');
  };

  const toggleChildrenVisibility = (node) => {
    node.isExpanded = !node.isExpanded;
    setTreeData({ ...treeData });
  };

  const renderGridItems = (nodes, level = 0) => {
    if (!nodes) return null;

    const baseBackgroundColors = ['#f0f8ff', '#e6f2ff', '#cce0ff', '#b3cfff', '#99bfff'];
    const colorAdjustmentForNoChildren = '#ffe6e6';

    return nodes.map((node, index) => {
      const nodeId = `node-${index}`;
      const hasChildren = node.children && node.children.length > 0;
      let backgroundColor = baseBackgroundColors[level % baseBackgroundColors.length];
      if (!hasChildren) {
        backgroundColor = colorAdjustmentForNoChildren;
      }

      return (
        <React.Fragment key={nodeId}>
          <div style={{ 
            padding: '10px', 
            border: '1px solid #ddd', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginLeft: `${level * 20}px`, 
            backgroundColor 
          }}>
            <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #ddd', cursor: hasChildren ? 'pointer' : 'default' }}
                 onClick={() => hasChildren && toggleChildrenVisibility(node)}>
              {node.name || 'Unnamed Node'}
            </div>
            {/* Additional fields */}
            {node.agencyId && (
              <div onClick={() => handleNodeClick(node.agencyId, 'Agency__c')} style={{ flex: 1, padding: '10px', borderRight: '1px solid #ddd', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                {node.agencyName || 'No Agency'}
              </div>
            )}
            {/* More columns for each field */}
            {/* ... */}
            {/* Visual cue for clickable element */}
            {node.submissionId && (
              <div onClick={() => handleNodeClick(node.submissionId)} style={{ cursor: 'pointer', fontSize: 'smaller', color: 'blue', textDecoration: 'underline' }}>
                Click To Go Submission
              </div>
            )}
          </div>
          {hasChildren && node.isExpanded && renderGridItems(node.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div>
      <h2>Submissions Grid</h2>
      {treeData ? renderGridItems(treeData.children) : <p>Loading submissions...</p>}
    </div>
  );
}

export default BasicTreeView;
