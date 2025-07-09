// src/pages/ShopDashboard.tsx
import { useState, useEffect } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import InventoryOverview from "@/components/dashboard/InventoryOverview";
import OrderManagement from "@/components/dashboard/OrderManagement";
import {DocumentCenter} from "@/components/dashboard/DocumentCenter";
import CommunicationPanel from "@/components/dashboard/CommunicationPanel";
import LanguageSelector from '@/components/LanguageSelector';
import AddInventoryItem from '@/components/AddInventoryItem';
import {LogoutButton} from "@/components/LogoutButton";
import api from "@/api/api";

interface Metrics {
  totalSales: string;
  pendingOrders: string;
  lowStockItems: string;
  expiringItems: string;
}

interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
}

const ShopDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInventory, setRefreshInventory] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile and handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false); // Close sidebar on mobile by default
      } else {
        setIsSidebarOpen(true); // Open sidebar on desktop by default
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      if (authLoading || !user || user.role !== "shop") return;

      try {
        setLoading(true);
        setError(null);

        // Fetch metrics
        const metricsResponse = await api.get<Metrics>("/shop/metrics/");
        setMetrics(metricsResponse.data);

        // Fetch pending tasks
        const tasksResponse = await api.get<Task[]>("/shop/tasks/");
        setTasks(tasksResponse.data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        const errorMessage = err.response?.data?.detail || "Failed to load dashboard data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [authLoading, user]);

  // Sidebar items for shop role
  const sidebarItems = [
    { id: "overview", label: "Dashboard", icon: "grid", roles: ["shop"] },
    { id: "inventory", label: "Inventory", icon: "package", roles: ["shop"] },
    { id: "orders", label: "Orders", icon: "shopping-cart", roles: ["shop"] },
    { id: "customers", label: "Customers", icon: "users", roles: ["shop"] },
    { id: "suppliers", label: "Suppliers", icon: "truck", roles: ["shop"] },
    { id: "documents", label: "Documents", icon: "file-text", roles: ["shop"] },
    { id: "communications", label: "Communications", icon: "mail", roles: ["shop"] },
    { id: "settings", label: "Settings", icon: "settings", roles: ["shop"] },
  ].filter((item) => item.roles.includes(user?.role || "shop"));

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Auto-close sidebar on mobile after selection
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "shop") {
    return null; // PrivateRoute will handle redirect
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile 
            ? `fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : `relative transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`
          }
          bg-card border-r border-border flex flex-col
        `}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h1 className={`font-bold text-xl ${!isSidebarOpen && !isMobile && "hidden"}`}>
            Ikiraro Mgs
          </h1>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isMobile && isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center p-3 rounded-md transition-colors ${
                  activeTab === item.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
                onClick={() => handleTabClick(item.id)}
              >
                <span className="flex-shrink-0">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs">{item.icon[0]}</span>
                  </div>
                </span>
                {(isSidebarOpen || isMobile) && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.username}
              />
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            {(isSidebarOpen || isMobile) && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile menu button when sidebar is closed */}
            {isMobile && !isSidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 w-[200px] md:w-[300px] bg-background" />
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* <LanguageSelector className="mb-2 hidden sm:block" /> */}
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white">
                {tasks.filter((task) => task.priority === "high").length}
              </span>
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <Separator orientation="vertical" className="h-8" />
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.username}
                />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          {activeTab === "overview" && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <span className="hidden sm:inline">Export</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                  <Button size="sm">
                    <span className="hidden sm:inline">New Order</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </div>
              </div>

              {/* Metrics */}
              {metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs md:text-sm text-muted-foreground">Total Sales (Today)</p>
                        <p className="text-lg md:text-2xl font-bold">{metrics.totalSales}</p>
                        <p className="text-xs text-green-500">+5.2% from yesterday</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs md:text-sm text-muted-foreground">Pending Orders</p>
                        <p className="text-lg md:text-2xl font-bold">{metrics.pendingOrders}</p>
                        <p className="text-xs text-amber-500">4 require attention</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs md:text-sm text-muted-foreground">Low Stock Items</p>
                        <p className="text-lg md:text-2xl font-bold">{metrics.lowStockItems}</p>
                        <p className="text-xs text-destructive">Reorder required</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs md:text-sm text-muted-foreground">Expiring Soon</p>
                        <p className="text-lg md:text-2xl font-bold">{metrics.expiringItems}</p>
                        <p className="text-xs text-destructive">Within 3 days</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg md:text-xl">Inventory Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <InventoryOverview />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg md:text-xl">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <OrderManagement />
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg md:text-xl">Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tasks.length > 0 ? (
                          tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-start space-x-2 p-3 rounded-md bg-muted/50"
                            >
                              <div className="flex-1">
                                <p className="text-sm">{task.title}</p>
                              </div>
                              <Badge
                                variant={task.priority === "high" ? "destructive" : "outline"}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No pending tasks</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg md:text-xl">Document Approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* <DocumentCenter compact={true} /> */}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h1 className="text-2xl font-bold">Inventory Management</h1>
                <AddInventoryItem onItemAdded={() => setRefreshInventory((prev) => prev + 1)} />
              </div>
              <InventoryOverview />
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h1 className="text-2xl font-bold">Order Management</h1>
                {/* <Button>Create New Order</Button> */}
              </div>
              <OrderManagement />
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h1 className="text-2xl font-bold">Document Center</h1>
                <Button>Upload Document</Button>
              </div>
              <DocumentCenter />
            </div>
          )}

          {activeTab === "communications" && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h1 className="text-2xl font-bold">Communication Panel</h1>
                <Button>New Message</Button>
              </div>
              <CommunicationPanel />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h1 className="text-2xl font-bold">Settings</h1>
                <Button variant="outline">Save Changes</Button>
              </div>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <p className="text-muted-foreground">Settings panel content will appear here.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopDashboard;