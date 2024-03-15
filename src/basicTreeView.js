import React, { useEffect, useState } from 'react';

function BasicTreeView() {
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Received message:', event);
      console.log('Data:', event.data);
      console.log('Source:', event.data.source);

      if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.my.salesforce.com/services/apexrest/") {
        // Validate the message origin
        return;
      }

      if (event.data && event.data.source === 'SalesforceLWC') {
        setReceivedMessage(event.data.recordId);
        // Additional logic for handling the received message
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div>
      {/* Render the received message */}
      {receivedMessage && <div>Received Message: {receivedMessage}</div>}
      {/* Additional UI elements */}
    </div>
  );
}

export default BasicTreeView;
