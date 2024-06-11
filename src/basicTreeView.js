import React, { useEffect, useState } from 'react';
import './BasicTreeView.css';
import Modal from './Modal';

function BasicTreeView() {
  const [treeData, setTreeData] = useState(null);
  const salesforceInstance = 'https://enterprise-force-7539--partialsb.sandbox.lightning.force.com/';
  const [selectedSubmissionGroupId, setSelectedSubmissionGroupId] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [handledById, setHandledById] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

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
        const data = JSON.parse(apiResponse);
        const createdObjects = data["Created Objects"] ? JSON.parse(data["Created Objects"]) : null;
        setParsedResponse({ ...data, createdObjects });
      } catch (error) {
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

  const keyLabels = {
    ukd: "Ukd",
    uidInfo: "Uid",
    kid: "Kid",
    type: "Type",
    passover: "Passover",
    objectName: "Ingredient Name",
    expirationDate: "Expiration Date",
    dpm: "DPM",
  };

  const propertiesToShow = new Set(['ukd', 'uidInfo', 'kid', 'passover', 'objectName', 'expirationDate', 'dpm']);

  const renderObjectProperties = (obj) => {
    return Object.entries(obj)
      .filter(([key, value]) => propertiesToShow.has(key))
      .map(([key, value], index) => {
        const label = keyLabels[key] || key;
        return <p key={index}>{`${label}: ${value}`}</p>;
      });
  };

  const handleDetailClick = (node) => {
    const content = (
      <div>
        <h3>{node.name || 'Unnamed Node'}</h3>
        {renderObjectProperties(node)}
      </div>
    );
    setModalContent(content);
    setModalIsOpen(true);
  };

  const handleFlagClick = (node) => {
    const content = (
      <div>
        <h3>Flag for {node.name || 'Unnamed Node'}</h3>
        <p>{node.flag}</p>
      </div>
    );
    setModalContent(content);
    setModalIsOpen(true);
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

      const isVendor = node.type === 'Create Vendor';
      const isBrand = node.type === 'Create Brand';
      const isMasterIngredient = node.type === 'Use Master Ingredient ID In Child' || node.type === 'Create Master Ingredient';
      const isCompanyIngredient = node.type === 'Create Company Ingredient';
      const isGroup = node.type === 'Create Group';

      return (
        <React.Fragment key={nodeId}>
          <div style={{
            padding: '10px',
            border: '1px solid #ddd',
            flexDirection: 'column',
            marginLeft: `${level * 20}px`,
            backgroundColor
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #ddd', cursor: hasChildren ? 'pointer' : 'default' }}
                onClick={() => hasChildren && toggleChildrenVisibility(node)}>
                {node.name || 'Unnamed Node'}
              </div>

              {isVendor && (
                <div className="special-node-details-row" style={{ marginLeft: `${level * 20 + 20}px` }}>
                  <div className="special-node-detail-cell">Name : {node.objectName || 'Not available'}</div>
                </div>
              )}
              {isBrand && (
                <div className="special-node-details-row" style={{ marginLeft: `${level * 20 + 20}px` }}>
                  <div className="special-node-detail-cell">Name : {node.objectName || 'Not available'}</div>
                </div>
              )}
              {isCompanyIngredient && (
                <div className="special-node-details-row" style={{ marginLeft: `${level * 20 + 20}px` }}>
                  <div className="special-node-detail-cell">Name : {node.objectName || 'Not available'}</div>
                </div>
              )}
              {isGroup && (
                <div className="special-node-details-row" style={{ marginLeft: `${level * 20 + 20}px` }}>
                  <div className="special-node-detail-cell">Name : {node.objectName || 'Not available'}</div>
                </div>
              )}
              {isMasterIngredient && (
                <div className="special-node-details-row">
                  <button onClick={() => handleDetailClick(node)} className="info-button">
                    Click for More Info
                  </button>
                </div>
              )}
              {node.agencyId && (
                <div onClick={() => handleNodeClick(node.agencyId, 'Agency__c')} style={clickableStyle}>
                  Agency Name: {node.agencyName || 'No Agency'}
                </div>
              )}
              {node.brandId && (
                <div onClick={() => handleNodeClick(node.brandId, 'Brand__c')} style={clickableStyle}>
                  Brand Name: {node.brandName || 'No Brand'}
                </div>
              )}
              {node.masterIngredientId && (
                <div onClick={() => handleNodeClick(node.masterIngredientId, 'MasterIngredient__c')} style={clickableStyle}>
                  Master Ingredient: {node.masterIngredientName || 'No Master Ingredient'}
                </div>
              )}
              {node.companyIngredientId && (
                <div onClick={() => handleNodeClick(node.companyIngredientId, 'CompanyIngredient__c')} style={clickableStyle}>
                  Company Ingredient: {node.companyIngredientName || 'No Company Ingredient'}
                </div>
              )}
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
      return <h3>Successfully Created Objects</h3>;
    } else if (parsedResponse.status === "Error" || parsedResponse.error) {
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
    color: '#007bff',
    textDecoration: 'none'
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

  const renderFlags = (nodes) => {
    const flaggedNodes = [];

    const traverseNodes = (nodes) => {
      nodes.forEach(node => {
        if (node.flag) {
          flaggedNodes.push(node);
        }
        if (node.children && node.children.length > 0) {
          traverseNodes(node.children);
        }
      });
    };

    traverseNodes(nodes);

    return flaggedNodes.length > 0 ? (
      <div style={{ marginBottom: '20px' }}>
        <h3>Flags</h3>
        {flaggedNodes.map((node, index) => (
          <button
            key={index}
            style={{
              marginBottom: '10px',
              cursor: 'pointer',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '5px'
            }}
            onClick={() => handleFlagClick(node)}
          >
            {node.name || 'Unnamed Node'}: {node.flag}
          </button>
        ))}
      </div>
    ) : null;
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
            backgroundColor: '#4CAF50',
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
      {treeData && renderFlags(treeData.children)}
      {treeData ? renderGridItems(treeData.children) : <p>Loading submissions...</p>}
      <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
      {apiResponse && (
        <div>
          {renderUserFriendlyMessage()}
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}></pre>
          {renderApiResponseTable()}
        </div>
      )}
    </div>
  );
}

export default BasicTreeView;
