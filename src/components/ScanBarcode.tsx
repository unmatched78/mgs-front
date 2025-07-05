// import BarcodeScanner from "react-qr-barcode-scanner";

// const InventoryOverview = ({ compact = false }: { compact?: boolean }) => {
//   // ...
//   const handleScanBarcode = async (err: any, result: any) => {
//     if (result) {
//       try {
//         const response = await api.get(`/inventory/${result.text}/`);
//         toast.success(`Item found: ${response.data.name}`);
//         setSearchQuery(response.data.id); // Auto-fill search with scanned ID
//       } catch (err: any) {
//         toast.error("Item not found or invalid barcode");
//       }
//       setShowScanner(false);
//     }
//   };

//   // ...
//   return (
//     <div className="w-full bg-background p-4">
//       {showScanner && (
//         <Card className="mb-4">
//           <CardContent className="p-4">
//             <BarcodeScanner
//               onUpdate={handleScanBarcode}
//               width="100%"
//               height={256}
//             />
//             <Button className="mt-4" onClick={() => setShowScanner(false)}>
//               Cancel Scan
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//       {/* ... rest of the component */}
//     </div>
//   );
// };