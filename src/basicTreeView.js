import React, { useEffect, useState } from 'react';

function BasicTreeView() {
  const [treeData, setTreeData] = useState(null);
  const salesforceInstance = 'https://enterprise-force-7539--partialsb.sandbox.lightning.force.com/';
  const [selectedSubmissionGroupId, setSelectedSubmissionGroupId] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [parsedResponse, setParsedResponse] = useState(null); // New state for parsed API response
  const [companyId, setCompanyId] = useState(null);
  const [handledById, setHandledById] = useState(null);
  const [clickedNodeInfo, setClickedNodeInfo] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Message received:', event);
      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
        return;
      }

    if (event.data && event.data.source === 'SalesforceLWC') {

        const data = typeof event.data.treeData === 'string' ? JSON.parse(event.data.treeData) : event.data.treeData;
        setTreeData(data);
        setSelectedSubmissionGroupId(data.groupId); 
        setCompanyId(event.data.companyId); 
        setHandledById(event.data.currentUserId);
    }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (apiResponse) {
        try {
            // Parse the response and extract "Created Objects"
            const data = JSON.parse(apiResponse);
            const createdObjects = data["Created Objects"] ? JSON.parse(data["Created Objects"]) : null;
            setParsedResponse({ ...data, createdObjects });
        } catch (error) {
            // Handle any parsing errors
            console.error('Error parsing API response:', error);
            setParsedResponse(null);
        }
    }
  }, [apiResponse]);


  const handleNodeClick = (submissionId) => {
    const objectUrl = `${salesforceInstance}lightning/r/Submission_Group__c/${submissionId}/view`;
    window.open(objectUrl, '_blank');
  };

  const toggleChildrenVisibility = (node) => {
    node.isExpanded = !node.isExpanded;
    setTreeData({ ...treeData });
  };

  const handleRunSubmission = async (submissionGroupId) => {
    setIsSubmitting(true);
    
    const requestBody = {
      "submission_group": submissionGroupId,
      "handled_by": handledById, 
      "company_id": companyId
    };
    try {
      const response = await fetch('https://mk-be-0f3c24a58a9b.herokuapp.com/run_submission_group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error running submission:', error);
      setApiResponse('Error: Could not complete submission'); 
    } finally {
      setIsSubmitting(false);
      setButtonClicked(true);

    }
   };
   const handleNodeClickAction = (node) => {
    // Check if the clicked node is of type "Create Master Ingredient"
    if (node.type === 'Create Master Ingredient' || node.type === 'Use Master Ingredient ID In Child') {
      // Set the information of the clicked node to display
      setClickedNodeInfo({
        name: node.masterIngredientName || 'N/A',
        expirationDate: node.expirationDate ? node.expirationDate.toString() : 'N/A',
        kid: node.kid || 'N/A',
        passover: node.passover ? 'Yes' : 'No',
        uidInfo: node.uidInfo || 'N/A',
        ukd: node.ukd || 'N/A',
        dpm: node.dpm || 'N/A'
      });
    } else {
      // Reset clickedNodeInfo if the clicked node is not of type "Create Master Ingredient"
      setClickedNodeInfo(null);
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
            <div 
              onClick={() => handleNodeClick(node.masterIngredientId, 'MasterIngredient__c')}
              style={clickableStyle}>
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
              <div onClick={() => handleNodeClick(node.submissionId)} style={clickableStyle}>
                Click To Go Submission
              </div>
            )}
            </div>
          {hasChildren && node.isExpanded && renderGridItems(node.children, level + 1)}
        </React.Fragment>
      );
    });
  };
  const renderApiResponseTable = () => {
    if (!parsedResponse || !parsedResponse.createdObjects) {
        return null;
    }
    return (
      <table style={tableStyle}>
          <thead>
              <tr>
                  <th style={thStyle}>Object Name</th>
              </tr>
          </thead>
          <tbody>
              {parsedResponse.createdObjects.map((obj, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={tdStyle}>
                        <a href={`${salesforceInstance}lightning/r/${obj.objectType}/${obj.objectId}/view`} 
                           target="_blank" 
                           style={clickableStyle}>
                          {obj.objectName || "Unnamed Object"}
                        </a>
                      </td>
                  </tr>
              ))}
          </tbody>
        </table>
    );
  };
  const renderUserFriendlyMessage = () => {
    if (!parsedResponse) return null;

    if (parsedResponse.status === "Success") {
        return <h3>Successfull - Created Objects</h3>;
    } else if (parsedResponse.status === "Error" || parsedResponse.error) {
        // Assuming an error field for demonstration
        return <h3 style={{ color: 'red' }}>Error: {parsedResponse.errorMessage}</h3>;
    } else {
        return <h3>Operation Status: {parsedResponse.status}</h3>;
    }
};
  const clickableStyle = {
    flex: 1,
    padding: '10px',
    borderRight: '1px solid #ddd',
    cursor: 'pointer',
    color: '#007bff', // Softer blue color
    textDecoration: 'none' // Remove underline
  };
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  };

  const thStyle = {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px',
      border: '1px solid #ddd',
  };

  const tdStyle = {
      padding: '8px',
      border: '1px solid #ddd',
      textAlign: 'left',
  };

  return (
    <div style={{ position: 'relative' }}>
      <h2>Group Submission</h2>
      {!buttonClicked && (
        <button
          onClick={() => handleRunSubmission(selectedSubmissionGroupId)}
          disabled={isSubmitting}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '10px 20px',
            backgroundColor: '#4CAF50', // Green background
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isSubmitting ? 'default' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isSubmitting ? 'Running...' : 'Run Submission Group'}
        </button>
      )}
      {treeData ? renderGridItems(treeData.children) : <p>Loading submissions...</p>}
  
      {apiResponse && (
        <div>
          {renderUserFriendlyMessage()} {/* Render user-friendly message */}
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}></pre>
          {renderApiResponseTable()} {/* Render the API response table */}
          {/* Display the clicked node information in a popover */}
          {clickedNodeInfo && (
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #ddd',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              zIndex: 1000
            }}>
              <p>Name: {clickedNodeInfo.name}</p>
              <p>Expiration Date: {clickedNodeInfo.expirationDate}</p>
              <p>KID: {clickedNodeInfo.kid}</p>
              <p>Passover: {clickedNodeInfo.passover}</p>
              <p>UID Info: {clickedNodeInfo.uidInfo}</p>
              <p>UKD: {clickedNodeInfo.ukd}</p>
              <p>DPM: {clickedNodeInfo.dpm}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
}

export default BasicTreeView;
