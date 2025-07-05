// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import {
//   AlertCircle,
//   BarChart2,
//   Camera,
//   Clock,
//   Download,
//   Filter,
//   Package,
//   Search,
//   TrendingDown,
//   TrendingUp,
// } from "lucide-react";

// interface InventoryItem {
//   id: string;
//   name: string;
//   category: string;
//   quantity: number;
//   unit: string;
//   expiryDate: string;
//   stockLevel: "Low" | "Medium" | "High";
//   price: number;
//   lastUpdated: string;
// }

// const InventoryOverview = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [showScanner, setShowScanner] = useState(false);

//   // Mock data for inventory items
//   const inventoryItems: InventoryItem[] = [
//     {
//       id: "001",
//       name: "Beef Sirloin",
//       category: "Beef",
//       quantity: 45,
//       unit: "kg",
//       expiryDate: "2023-12-15",
//       stockLevel: "Medium",
//       price: 15.99,
//       lastUpdated: "2023-11-28",
//     },
//     {
//       id: "002",
//       name: "Pork Chops",
//       category: "Pork",
//       quantity: 12,
//       unit: "kg",
//       expiryDate: "2023-12-10",
//       stockLevel: "Low",
//       price: 12.5,
//       lastUpdated: "2023-11-27",
//     },
//     {
//       id: "003",
//       name: "Chicken Breast",
//       category: "Poultry",
//       quantity: 78,
//       unit: "kg",
//       expiryDate: "2023-12-08",
//       stockLevel: "High",
//       price: 9.99,
//       lastUpdated: "2023-11-29",
//     },
//     {
//       id: "004",
//       name: "Lamb Leg",
//       category: "Lamb",
//       quantity: 8,
//       unit: "kg",
//       expiryDate: "2023-12-12",
//       stockLevel: "Low",
//       price: 18.75,
//       lastUpdated: "2023-11-26",
//     },
//     {
//       id: "005",
//       name: "Turkey Mince",
//       category: "Poultry",
//       quantity: 35,
//       unit: "kg",
//       expiryDate: "2023-12-14",
//       stockLevel: "Medium",
//       price: 8.5,
//       lastUpdated: "2023-11-28",
//     },
//   ];

//   // Filter inventory items based on search query and category
//   const filteredItems = inventoryItems.filter((item) => {
//     const matchesSearch =
//       item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.id.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory =
//       selectedCategory === "all" || item.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // Count items by stock level
//   const lowStockCount = inventoryItems.filter(
//     (item) => item.stockLevel === "Low",
//   ).length;
//   const expiringCount = inventoryItems.filter((item) => {
//     const expiryDate = new Date(item.expiryDate);
//     const today = new Date();
//     const diffTime = expiryDate.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays <= 7;
//   }).length;

//   // Mock data for charts
//   const categories = ["Beef", "Pork", "Poultry", "Lamb", "Seafood"];

//   const getStockLevelColor = (level: "Low" | "Medium" | "High") => {
//     switch (level) {
//       case "Low":
//         return "destructive";
//       case "Medium":
//         return "warning";
//       case "High":
//         return "success";
//       default:
//         return "default";
//     }
//   };

//   const handleScanBarcode = () => {
//     setShowScanner(!showScanner);
//     // In a real implementation, this would activate the device camera
//   };

//   return (
//     <div className="w-full bg-background p-4">
//       <Tabs
//         defaultValue="overview"
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="w-full"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <TabsList>
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="stock">Stock Levels</TabsTrigger>
//             <TabsTrigger value="expiring">Expiring Products</TabsTrigger>
//             <TabsTrigger value="trends">Trends</TabsTrigger>
//           </TabsList>
//           <div className="flex items-center space-x-2">
//             <Button variant="outline" size="sm" onClick={handleScanBarcode}>
//               <Camera className="h-4 w-4 mr-2" />
//               {showScanner ? "Cancel Scan" : "Scan Barcode/QR"}
//             </Button>
//             <Button variant="outline" size="sm">
//               <Download className="h-4 w-4 mr-2" />
//               Export
//             </Button>
//           </div>
//         </div>

//         {showScanner && (
//           <Card className="mb-4">
//             <CardContent className="p-4">
//               <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-md">
//                 <Camera className="h-12 w-12 text-muted-foreground mb-2" />
//                 <p className="text-muted-foreground">
//                   Camera access required. Position barcode or QR code in the
//                   frame.
//                 </p>
//                 <Button className="mt-4">Allow Camera Access</Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         <TabsContent value="overview" className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Total Inventory Items
//                 </CardTitle>
//                 <CardDescription>Across all categories</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="text-2xl font-bold">
//                     {inventoryItems.length}
//                   </div>
//                   <Package className="h-8 w-8 text-muted-foreground" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Low Stock Alerts
//                 </CardTitle>
//                 <CardDescription>Items requiring reorder</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="text-2xl font-bold text-destructive">
//                     {lowStockCount}
//                   </div>
//                   <AlertCircle className="h-8 w-8 text-destructive" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Expiring Soon
//                 </CardTitle>
//                 <CardDescription>Items expiring within 7 days</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="text-2xl font-bold text-amber-500">
//                     {expiringCount}
//                   </div>
//                   <Clock className="h-8 w-8 text-amber-500" />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Inventory by Category</CardTitle>
//               <CardDescription>
//                 Distribution of stock across categories
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80 flex items-end justify-between gap-2">
//                 {categories.map((category, index) => {
//                   const count = inventoryItems.filter(
//                     (item) => item.category === category,
//                   ).length;
//                   const percentage = (count / inventoryItems.length) * 100;
//                   return (
//                     <div key={category} className="flex flex-col items-center">
//                       <div
//                         className="w-16 bg-primary rounded-t-md"
//                         style={{ height: `${Math.max(percentage, 5)}%` }}
//                       />
//                       <p className="text-xs mt-2">{category}</p>
//                       <p className="text-xs font-medium">{count} items</p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <div className="space-y-1">
//                 <CardTitle>Inventory Items</CardTitle>
//                 <CardDescription>Manage your inventory</CardDescription>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="relative">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     type="search"
//                     placeholder="Search items..."
//                     className="w-[200px] pl-8"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <Select
//                   value={selectedCategory}
//                   onValueChange={setSelectedCategory}
//                 >
//                   <SelectTrigger className="w-[130px]">
//                     <Filter className="h-4 w-4 mr-2" />
//                     <SelectValue placeholder="Category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Categories</SelectItem>
//                     {categories.map((category) => (
//                       <SelectItem key={category} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>ID</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Quantity</TableHead>
//                     <TableHead>Expiry Date</TableHead>
//                     <TableHead>Stock Level</TableHead>
//                     <TableHead>Price</TableHead>
//                     <TableHead>Last Updated</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredItems.length > 0 ? (
//                     filteredItems.map((item) => (
//                       <TableRow key={item.id}>
//                         <TableCell>{item.id}</TableCell>
//                         <TableCell className="font-medium">
//                           {item.name}
//                         </TableCell>
//                         <TableCell>{item.category}</TableCell>
//                         <TableCell>
//                           {item.quantity} {item.unit}
//                         </TableCell>
//                         <TableCell>{item.expiryDate}</TableCell>
//                         <TableCell>
//                           <Badge
//                             variant={getStockLevelColor(item.stockLevel) as any}
//                           >
//                             {item.stockLevel}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>${item.price.toFixed(2)}</TableCell>
//                         <TableCell>{item.lastUpdated}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={8} className="text-center">
//                         No items found
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="stock" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Stock Level Analysis</CardTitle>
//               <CardDescription>
//                 Current stock levels across inventory
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-8">
//                 {categories.map((category) => {
//                   const items = inventoryItems.filter(
//                     (item) => item.category === category,
//                   );
//                   const totalItems = items.length;
//                   const lowItems = items.filter(
//                     (item) => item.stockLevel === "Low",
//                   ).length;
//                   const mediumItems = items.filter(
//                     (item) => item.stockLevel === "Medium",
//                   ).length;
//                   const highItems = items.filter(
//                     (item) => item.stockLevel === "High",
//                   ).length;

//                   return totalItems > 0 ? (
//                     <div key={category} className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <h4 className="font-medium">{category}</h4>
//                         <span className="text-sm text-muted-foreground">
//                           {totalItems} items
//                         </span>
//                       </div>
//                       <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
//                         <div
//                           className="bg-destructive"
//                           style={{ width: `${(lowItems / totalItems) * 100}%` }}
//                         />
//                         <div
//                           className="bg-amber-500"
//                           style={{
//                             width: `${(mediumItems / totalItems) * 100}%`,
//                           }}
//                         />
//                         <div
//                           className="bg-green-500"
//                           style={{
//                             width: `${(highItems / totalItems) * 100}%`,
//                           }}
//                         />
//                       </div>
//                       <div className="flex justify-between text-xs">
//                         <div className="flex items-center">
//                           <div className="h-2 w-2 rounded-full bg-destructive mr-1" />
//                           <span>Low ({lowItems})</span>
//                         </div>
//                         <div className="flex items-center">
//                           <div className="h-2 w-2 rounded-full bg-amber-500 mr-1" />
//                           <span>Medium ({mediumItems})</span>
//                         </div>
//                         <div className="flex items-center">
//                           <div className="h-2 w-2 rounded-full bg-green-500 mr-1" />
//                           <span>High ({highItems})</span>
//                         </div>
//                       </div>
//                     </div>
//                   ) : null;
//                 })}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Low Stock Items</CardTitle>
//               <CardDescription>
//                 Items that need to be reordered soon
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Quantity</TableHead>
//                     <TableHead>Reorder Level</TableHead>
//                     <TableHead>Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {inventoryItems
//                     .filter((item) => item.stockLevel === "Low")
//                     .map((item) => (
//                       <TableRow key={item.id}>
//                         <TableCell className="font-medium">
//                           {item.name}
//                         </TableCell>
//                         <TableCell>{item.category}</TableCell>
//                         <TableCell>
//                           {item.quantity} {item.unit}
//                         </TableCell>
//                         <TableCell>
//                           <Progress value={30} className="h-2" />
//                         </TableCell>
//                         <TableCell>
//                           <Button size="sm" variant="outline">
//                             Reorder
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="expiring" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Expiring Products</CardTitle>
//               <CardDescription>
//                 Items expiring within the next 30 days
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Quantity</TableHead>
//                     <TableHead>Expiry Date</TableHead>
//                     <TableHead>Days Left</TableHead>
//                     <TableHead>Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {inventoryItems.map((item) => {
//                     const expiryDate = new Date(item.expiryDate);
//                     const today = new Date();
//                     const diffTime = expiryDate.getTime() - today.getTime();
//                     const diffDays = Math.ceil(
//                       diffTime / (1000 * 60 * 60 * 24),
//                     );

//                     return diffDays <= 30 ? (
//                       <TableRow key={item.id}>
//                         <TableCell className="font-medium">
//                           {item.name}
//                         </TableCell>
//                         <TableCell>{item.category}</TableCell>
//                         <TableCell>
//                           {item.quantity} {item.unit}
//                         </TableCell>
//                         <TableCell>{item.expiryDate}</TableCell>
//                         <TableCell>
//                           <Badge
//                             variant={diffDays <= 7 ? "destructive" : "warning"}
//                           >
//                             {diffDays} days
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <Button size="sm" variant="outline">
//                             Mark Used
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ) : null;
//                   })}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="trends" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Inventory Trends</CardTitle>
//               <CardDescription>Stock level changes over time</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80 flex flex-col justify-center items-center">
//                 <BarChart2 className="h-16 w-16 text-muted-foreground mb-4" />
//                 <p className="text-muted-foreground">
//                   Trend visualization would appear here
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   Showing data for the last 30 days
//                 </p>
//               </div>
//               <Separator className="my-4" />
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center">
//                   <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
//                   <div>
//                     <p className="font-medium">Increasing Stock</p>
//                     <p className="text-sm text-muted-foreground">
//                       Beef, Poultry
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <TrendingDown className="h-5 w-5 text-destructive mr-2" />
//                   <div>
//                     <p className="font-medium">Decreasing Stock</p>
//                     <p className="text-sm text-muted-foreground">Pork, Lamb</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default InventoryOverview;
// src/components/dashboard/InventoryOverview.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  AlertCircle,
  BarChart2,
  Camera,
  Clock,
  Download,
  Filter,
  Package,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";

interface InventoryItem {
  id: string; // Maps to sku
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  stock_level: "Low" | "Medium" | "High";
  unit_price: number; // Maps to unit_price from backend
  last_updated: string;
}

const InventoryOverview = ({ compact = false }: { compact?: boolean }) => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showScanner, setShowScanner] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch inventory data
  useEffect(() => {
    async function fetchInventory() {
      if (authLoading || !user || user.role !== "shop") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.get<InventoryItem[]>("/inventory/");
        // Ensure response.data is an array; default to [] if not
        const items = Array.isArray(response.data) ? response.data : [];
        setInventoryItems(compact ? items.slice(0, 5) : items);

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(items.map((item) => item.category)));
        setCategories(["all", ...uniqueCategories]);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || "Failed to load inventory";
        setError(errorMessage);
        toast.error(errorMessage);
        setInventoryItems([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, [authLoading, user, compact]);

  // Filter inventory items
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Count stock levels and expiring items
  const lowStockCount = inventoryItems.filter((item) => item.stock_level === "Low").length;
  const expiringCount = inventoryItems.filter((item) => {
    const expiryDate = new Date(item.expiry_date);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const getStockLevelColor = (level: "Low" | "Medium" | "High") => {
    switch (level) {
      case "Low":
        return "destructive";
      case "Medium":
        return "warning";
      case "High":
        return "success";
      default:
        return "default";
    }
  };

  const handleScanBarcode = async () => {
    setShowScanner(!showScanner);
    if (!showScanner) {
      try {
        toast.info("Barcode scanning not implemented yet.");
      } catch (err) {
        toast.error("Failed to initialize barcode scanner.");
      }
    }
  };

  const handleReorder = async (itemId: string) => {
    try {
      await api.post("/inventory/reorder/", { item_id: itemId });
      toast.success(`Reorder request sent for item ${itemId}`);
      const response = await api.get<InventoryItem[]>("/inventory/");
      setInventoryItems(compact ? (Array.isArray(response.data) ? response.data.slice(0, 5) : []) : (Array.isArray(response.data) ? response.data : []));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to send reorder request");
    }
  };

  const handleMarkUsed = async (itemId: string) => {
    try {
      await api.post("/inventory/mark-used/", { item_id: itemId });
      toast.success(`Item ${itemId} marked as used`);
      const response = await api.get<InventoryItem[]>("/inventory/");
      setInventoryItems(compact ? (Array.isArray(response.data) ? response.data.slice(0, 5) : []) : (Array.isArray(response.data) ? response.data : []));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to mark item as used");
    }
  };

  const handleExport = () => {
    toast.info("Export functionality not implemented yet.");
  };

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading inventory...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="w-full bg-background p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stock">Stock Levels</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Products</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleScanBarcode}>
              <Camera className="h-4 w-4 mr-2" />
              {showScanner ? "Cancel Scan" : "Scan Barcode/QR"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {showScanner && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-md">
                <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Camera access required. Position barcode or QR code in the frame.
                </p>
                <Button className="mt-4">Allow Camera Access</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory Items</CardTitle>
                <CardDescription>Across all categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{inventoryItems.length}</div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                <CardDescription>Items requiring reorder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <CardDescription>Items expiring within 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-amber-500">{expiringCount}</div>
                  <Clock className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
              <CardDescription>Distribution of stock across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-end justify-between gap-2">
                {categories.filter((cat) => cat !== "all").map((category) => {
                  const count = inventoryItems.filter((item) => item.category === category).length;
                  const percentage = inventoryItems.length ? (count / inventoryItems.length) * 100 : 0;
                  return (
                    <div key={category} className="flex flex-col items-center">
                      <div
                        className="w-16 bg-primary rounded-t-md"
                        style={{ height: `${Math.max(percentage, 5)}%` }}
                      />
                      <p className="text-xs mt-2">{category}</p>
                      <p className="text-xs font-medium">{count} items</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Inventory Items</CardTitle>
                <CardDescription>Manage your inventory</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search items..."
                    className="w-[200px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>{item.expiry_date || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={getStockLevelColor(item.stock_level) as any}>
                            {item.stock_level}
                          </Badge>
                        </TableCell>
                        <TableCell>RWF {item.unit_price.toFixed(2)}</TableCell>
                        <TableCell>{item.last_updated}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Level Analysis</CardTitle>
              <CardDescription>Current stock levels across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {categories.filter((cat) => cat !== "all").map((category) => {
                  const items = inventoryItems.filter((item) => item.category === category);
                  const totalItems = items.length;
                  const lowItems = items.filter((item) => item.stock_level === "Low").length;
                  const mediumItems = items.filter((item) => item.stock_level === "Medium").length;
                  const highItems = items.filter((item) => item.stock_level === "High").length;

                  return totalItems > 0 ? (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{category}</h4>
                        <span className="text-sm text-muted-foreground">{totalItems} items</span>
                      </div>
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="bg-destructive"
                          style={{ width: `${totalItems ? (lowItems / totalItems) * 100 : 0}%` }}
                        />
                        <div
                          className="bg-amber-500"
                          style={{ width: `${totalItems ? (mediumItems / totalItems) * 100 : 0}%` }}
                        />
                        <div
                          className="bg-green-500"
                          style={{ width: `${totalItems ? (highItems / totalItems) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-destructive mr-1" />
                          <span>Low ({lowItems})</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-amber-500 mr-1" />
                          <span>Medium ({mediumItems})</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-1" />
                          <span>High ({highItems})</span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>Items that need to be reordered soon</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.filter((item) => item.stock_level === "Low").map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell>
                        <Progress value={30} className="h-2" />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleReorder(item.id)}>
                          Reorder
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expiring Products</CardTitle>
              <CardDescription>Items expiring within the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => {
                    const expiryDate = item.expiry_date ? new Date(item.expiry_date) : null;
                    if (!expiryDate) return null;
                    const today = new Date();
                    const diffTime = expiryDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    return diffDays <= 30 ? (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>{item.expiry_date}</TableCell>
                        <TableCell>
                          <Badge variant={diffDays <= 7 ? "destructive" : "warning"}>
                            {diffDays} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleMarkUsed(item.id)}>
                            Mark Used
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : null;
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Trends</CardTitle>
              <CardDescription>Stock level changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex flex-col justify-center items-center">
                <BarChart2 className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Trend visualization would appear here</p>
                <p className="text-xs text-muted-foreground">Showing data for the last 30 days</p>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="font-medium">Increasing Stock</p>
                    <p className="text-sm text-muted-foreground">Beef, Poultry</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="h-5 w-5 text-destructive mr-2" />
                  <div>
                    <p className="font-medium">Decreasing Stock</p>
                    <p className="text-sm text-muted-foreground">Pork, Lamb</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryOverview;