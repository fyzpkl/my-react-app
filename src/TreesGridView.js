// import React, { useEffect, useState } from 'react';
// import BasicTreeView from './basicTreeView';
// import './TreesGridView.css'; // Make sure to create this CSS file for styling

// function TreesGridView() {
//   const [treeDatas, setTreeDatas] = useState([]);

//   useEffect(() => {
//     console.log("Use Effect working/");
//     const handleMessage = (event) => {
//       console.log("Message received:", event);
//       if (event.origin !== "https://enterprise-force-7539--partialsb.sandbox.lightning.force.com") {
//         console.log('Invalid origin:', event.origin);
//         return;
//       }

//       if (event.data && event.data.source === 'SalesforceLWC') {
//         const data = typeof event.data.treeData === 'string' ? JSON.parse(event.data.treeData) : event.data.treeData;
//         setTreeDatas(prevDatas => [...prevDatas, data]);
//         console.log('event.data:', event.data);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => {
//       window.removeEventListener('message', handleMessage);
//     };
//   }, []);

//   return (
//     <div className="trees-grid">
//       {treeDatas.map((data, index) => (
//         <BasicTreeView key={index} treeData={data} />
//       ))}
//     </div>
//   );
// }

// export default TreesGridView;
