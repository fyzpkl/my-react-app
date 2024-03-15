import React, { useEffect, useState } from 'react';

function App() {
    const [recordId, setRecordId] = useState('');

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
              setRecordId(event.data.recordId);
              // Additional logic for handling the recordId
          }
      };
  
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
  }, []);

      return (
        <div>
            {/* Your component UI */}
            {recordId && <div>Received Record ID: {recordId}</div>}
            {/* Additional UI elements */}
        </div>
    );
}

export default App;
