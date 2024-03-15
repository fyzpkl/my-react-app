import React from 'react';
import BasicTreeView from './basicTreeView'; // Update the import to your BasicTreeView component

function App() {
  return (
    <div>
        <input 
            type="text" 
            value={recordId} 
            onChange={(e) => setRecordId(e.target.value)} 
            placeholder="Enter Record ID" 
        />
        <button onClick={handleFetchData}>Fetch Data</button>

        <Tree data={treeData} />
    </div>
  );
}

export default App;
