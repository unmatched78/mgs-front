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
  Eye,
  ShoppingCart,
  Calendar,
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
  
  //trends tabs
  const [trends, setTrends] = useState<{ increasing: string[]; decreasing: string[] }>({ increasing: [], decreasing: [] });

  useEffect(() => {
    async function fetchTrends() {
      if (activeTab !== "trends") return;
      try {
        const response = await api.get<{ increasing: string[]; decreasing: string[] }>("/inventory/trends/");
        setTrends(response.data);
      } catch (err: any) {
        toast.error("Failed to load trends");
      }
    }
    fetchTrends();
  }, [activeTab]);

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
      toast.success(`Reorder sent for ${itemId}`);
      const response = await api.get<InventoryItem[]>("/inventory/");
      setInventoryItems(compact ? (Array.isArray(response.data) ? response.data.slice(0, 5) : []) : (Array.isArray(response.data) ? response.data : []));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Reorder failed");
    }
  };

  const handleMarkUsed = async (itemId: string) => {
    try {
      await api.post("/inventory/mark-used/", { item_id: itemId });
      toast.success(`${itemId} marked as used`);
      const response = await api.get<InventoryItem[]>("/inventory/");
      setInventoryItems(compact ? (Array.isArray(response.data) ? response.data.slice(0, 5) : []) : (Array.isArray(response.data) ? response.data : []));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Mark used failed");
    }
  };

  const handleExport = () => {
    toast.info("Export not implemented yet.");
  };

  // Mobile-optimized item card component
  const MobileItemCard = ({ item }: { item: InventoryItem }) => (
    <Card className="mb-3">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{item.name}</h4>
            <p className="text-xs text-muted-foreground">ID: {item.id}</p>
          </div>
          <Badge variant={getStockLevelColor(item.stock_level) as any} className="text-xs ml-2">
            {item.stock_level}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Qty:</span> {item.quantity} {item.unit}
          </div>
          <div>
            <span className="text-muted-foreground">Price:</span> {item.unit_price.toFixed(0)} RWF
          </div>
          <div>
            <span className="text-muted-foreground">Cat:</span> {item.category}
          </div>
          <div>
            <span className="text-muted-foreground">Exp:</span> {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "N/A"}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="p-4 text-center text-sm">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-destructive text-sm">{error}</div>;
  }

  return (
    <div className="w-full bg-background p-2 sm:p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile-first header */}
        <div className="space-y-3 mb-4">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 text-xs min-w-[280px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stock">Stock</TabsTrigger>
              <TabsTrigger value="expiring">Expiring</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleScanBarcode} className="flex-1 text-xs">
              <Camera className="h-3 w-3 mr-1" />
              Scan
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} className="flex-1 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {showScanner && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-md">
                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground text-center px-2">
                  Position barcode in frame
                </p>
                <Button className="mt-2 text-xs" size="sm">Allow Camera</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value="overview" className="space-y-4">
          {/* Compact stats grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card className="p-3 sm:p-4">
              <div className="text-center">
                <Package className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-lg sm:text-2xl font-bold">{inventoryItems.length}</div>
                <div className="text-xs text-muted-foreground">Total Items</div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="text-center">
                <AlertCircle className="h-5 w-5 mx-auto mb-1 text-destructive" />
                <div className="text-lg sm:text-2xl font-bold text-destructive">{lowStockCount}</div>
                <div className="text-xs text-muted-foreground">Low Stock</div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                <div className="text-lg sm:text-2xl font-bold text-amber-500">{expiringCount}</div>
                <div className="text-xs text-muted-foreground">Expiring</div>
              </div>
            </Card>
          </div>

          {/* Category distribution - mobile optimized */}
          <Card className="block sm:hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {categories.filter((cat) => cat !== "all").map((category) => {
                  const count = inventoryItems.filter((item) => item.category === category).length;
                  return (
                    <div key={category} className="bg-muted rounded p-2">
                      <div className="text-xs font-medium truncate">{category}</div>
                      <div className="text-xs text-muted-foreground">{count} items</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Desktop chart */}
          <Card className="hidden sm:block">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Inventory by Category</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Distribution of stock across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex items-end justify-between gap-2">
                {categories.filter((cat) => cat !== "all").map((category) => {
                  const count = inventoryItems.filter((item) => item.category === category).length;
                  const percentage = inventoryItems.length ? (count / inventoryItems.length) * 100 : 0;
                  return (
                    <div key={category} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-primary rounded-t-md min-h-[20px]"
                        style={{ height: `${Math.max(percentage, 10)}%` }}
                      />
                      <p className="text-xs mt-2 text-center truncate w-full">{category}</p>
                      <p className="text-xs font-medium">{count}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Search and filters */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-sm sm:text-base">Items</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-8 text-xs sm:text-sm h-8 sm:h-10 w-full sm:w-32"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-24 h-8 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-xs sm:text-sm">
                          {category === "all" ? "All" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile card view */}
              <div className="block sm:hidden">
                {filteredItems.length > 0 ? (
                  <div className="space-y-2">
                    {filteredItems.map((item) => (
                      <MobileItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No items found
                  </div>
                )}
              </div>

              {/* Desktop table view */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">ID</TableHead>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Category</TableHead>
                      <TableHead className="text-xs">Quantity</TableHead>
                      <TableHead className="text-xs">Expiry</TableHead>
                      <TableHead className="text-xs">Stock</TableHead>
                      <TableHead className="text-xs">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs">{item.id}</TableCell>
                          <TableCell className="text-xs font-medium">{item.name}</TableCell>
                          <TableCell className="text-xs">{item.category}</TableCell>
                          <TableCell className="text-xs">{item.quantity} {item.unit}</TableCell>
                          <TableCell className="text-xs">{item.expiry_date || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={getStockLevelColor(item.stock_level) as any} className="text-xs">
                              {item.stock_level}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{item.unit_price.toFixed(0)} RWF</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-xs">
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          {/* Mobile-optimized stock levels */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Stock Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.filter((cat) => cat !== "all").map((category) => {
                  const items = inventoryItems.filter((item) => item.category === category);
                  const totalItems = items.length;
                  const lowItems = items.filter((item) => item.stock_level === "Low").length;
                  const mediumItems = items.filter((item) => item.stock_level === "Medium").length;
                  const highItems = items.filter((item) => item.stock_level === "High").length;

                  return totalItems > 0 ? (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium truncate">{category}</span>
                        <span className="text-xs text-muted-foreground">{totalItems}</span>
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
                        <span>Low: {lowItems}</span>
                        <span>Med: {mediumItems}</span>
                        <span>High: {highItems}</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Low stock items */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {inventoryItems.filter((item) => item.stock_level === "Low").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.quantity} {item.unit}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleReorder(item.id)} className="text-xs h-7">
                      Reorder
                    </Button>
                  </div>
                ))}
                {inventoryItems.filter((item) => item.stock_level === "Low").length === 0 && (
                  <div className="text-center py-4 text-xs text-muted-foreground">
                    No low stock items
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Expiring Items</CardTitle>
              <CardDescription className="text-xs">Next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {inventoryItems.map((item) => {
                  const expiryDate = item.expiry_date ? new Date(item.expiry_date) : null;
                  if (!expiryDate) return null;
                  const today = new Date();
                  const diffTime = expiryDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  return diffDays <= 30 ? (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} {item.unit} • {item.expiry_date}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={diffDays <= 7 ? "destructive" : "warning"} className="text-xs">
                          {diffDays}d
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleMarkUsed(item.id)} className="text-xs h-7">
                          Used
                        </Button>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Inventory Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex flex-col justify-center items-center border-2 border-dashed rounded">
                <BarChart2 className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Chart coming soon</p>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium">Increasing</div>
                    <div className="text-xs text-muted-foreground">
                      {trends.increasing.length > 0 ? trends.increasing.join(", ") : "None"}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium">Decreasing</div>
                    <div className="text-xs text-muted-foreground">
                      {trends.decreasing.length > 0 ? trends.decreasing.join(", ") : "None"}
                    </div>
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
export type { InventoryItem };