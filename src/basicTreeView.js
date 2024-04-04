import React, { useEffect, useState } from 'react';

function BasicTreeView() {
  const [treeData, setTreeData] = useState(null);
  const salesforceInstance = 'https://enterprise-force-7539--partialsb.sandbox.lightning.force.com/';
  const [selectedSubmissionGroupId, setSelectedSubmissionGroupId] = useState(null);
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
        return;
      }

      if (event.data && event.data.source === 'SalesforceLWC') {
        const data = typeof event.data.treeData === 'string' ? JSON.parse(event.data.treeData) : event.data.treeData;
        setTreeData(data);
        const groupId = data.groupId; 
        setSelectedSubmissionGroupId(groupId);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState(null);

  const handleRunSubmission = async (submissionGroupId) => {
    setIsSubmitting(true);
    const requestBody = {
      "submission_group": submissionGroupId, // Dynamic ID
      "handled_by": "005Hp00000iLBIQIA4", // Hardcoded for now
      "company_id": "001Dy000010kEjjIAE" // Hardcoded for now
    };

    try {
      const response = await fetch('https://mk-be-0f3c24a58a9b.herokuapp.com/run_submission_group', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      setIsSubmitting(false);
      setSubmissionResponse(data.message || 'Success');
      alert(data.message || 'Success'); // Simple alert, can be replaced with a modal for better UX
    } catch (error) {
      console.error('Error running submission:', error);
      setIsSubmitting(false);
      setSubmissionResponse('Error: Could not complete submission');
      alert('Error: Could not complete submission');
    }
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
          {/* Agency Name */}
          {node.agencyId && (
            <div onClick={() => handleNodeClick(node.agencyId, 'Agency__c')} style={clickableStyle}>
              Agency Name: {node.agencyName || 'No Agency'}
            </div>
          )}

          {/* Brand Name */}
          {node.brandId && (
            <div onClick={() => handleNodeClick(node.brandId, 'Brand__c')} style={clickableStyle}>
              Brand Name: {node.brandName || 'No Brand'}
            </div>
          )}

          {/* Master Ingredient Name */}
          {node.masterIngredientId && (
            <div onClick={() => handleNodeClick(node.masterIngredientId, 'MasterIngredient__c')} style={clickableStyle}>
              Master Ingredient: {node.masterIngredientName || 'No Master Ingredient'}
            </div>
          )}

          {/* Company Ingredient Name */}
          {node.companyIngredientId && (
            <div onClick={() => handleNodeClick(node.companyIngredientId, 'CompanyIngredient__c')} style={clickableStyle}>
              Company Ingredient: {node.companyIngredientName || 'No Company Ingredient'}
            </div>
          )}

          {/* Vendor Name */}
          {node.vendorId && (
            <div onClick={() => handleNodeClick(node.vendorId, 'Vendor__c')} style={clickableStyle}>
              Vendor Name: {node.vendorName || 'No Vendor'}
            </div>
          )}
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
  const clickableStyle = {
    flex: 1,
    padding: '10px',
    borderRight: '1px solid #ddd',
    cursor: 'pointer',
    color: '#007bff', // Softer blue color
    textDecoration: 'none' // Remove underline
  };
  return (
    <div>
      <h2>Submissions Grid</h2>
      {treeData ? renderGridItems(treeData.children) : <p>Loading submissions...</p>}
        <button onClick={() => handleRunSubmission(selectedSubmissionGroupId)} disabled={isSubmitting}>
            {isSubmitting ? 'Running...' : 'Run Submission Group'}
        </button>
      {submissionResponse && <div>{submissionResponse}</div>}
    </div>
  );
}

export default BasicTreeView;
