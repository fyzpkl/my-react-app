import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';

function BasicTreeView() {
  const [groupIds, setGroupIds] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Received message:', event);
      console.log('Data:', event.data);
      console.log('Source:', event.data.source);

      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
        console.log('Invalid origin:', event.origin);
        // Validate the message origin
        return;
      }

      if (event.data && event.data.source === 'SalesforceLWC') {
        console.log('Received Salesforce LWC message:', event.data.groupIds);
        setGroupIds(event.data.groupIds);
        // Additional logic for handling the received message
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  console.log('Received Group IDs:', groupIds);

  return (
    <div>
      {/* Render the received group IDs */}
      {groupIds.length > 0 && (
        <div>
          <h2>Group IDs:</h2>
          <TreeView>
            {groupIds.map(groupId => (
              <TreeItem key={groupId} nodeId={groupId} label={groupId} />
            ))}
          </TreeView>
        </div>
      )}
      {/* Additional UI elements */}
    </div>
  );
}

export default BasicTreeView;
