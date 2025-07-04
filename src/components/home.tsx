import React, { useState } from "react";
import { Bell, Menu, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import InventoryOverview from "./dashboard/InventoryOverview";
import OrderManagement from "./dashboard/OrderManagement";
import DocumentCenter from "./dashboard/DocumentCenter";
import CommunicationPanel from "./dashboard/CommunicationPanel";

type UserRole = "staff" | "supplier" | "veterinarian" | "customer";

interface HomeProps {
  userRole?: UserRole;
  userName?: string;
}

const Home = ({ userRole = "staff", userName = "John Doe" }: HomeProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard metrics
  const metrics = {
    totalSales: "€12,450",
    pendingOrders: "24",
    lowStockItems: "8",
    expiringItems: "5",
  };

  // Mock data for pending tasks
  const pendingTasks = [
    { id: 1, title: "Approve delivery for Order #1234", priority: "high" },
    { id: 2, title: "Review expiring inventory items", priority: "medium" },
    {
      id: 3,
      title: "Confirm supplier delivery for tomorrow",
      priority: "medium",
    },
    { id: 4, title: "Sign veterinary certificates", priority: "high" },
  ];

  // Filter sidebar items based on user role
  const getSidebarItems = () => {
    const allItems = [
      {
        id: "overview",
        label: "Dashboard",
        icon: "grid",
        roles: ["staff", "supplier", "veterinarian", "customer"],
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: "package",
        roles: ["staff"],
      },
      {
        id: "orders",
        label: "Orders",
        icon: "shopping-cart",
        roles: ["staff", "customer"],
      },
      { id: "customers", label: "Customers", icon: "users", roles: ["staff"] },
      { id: "suppliers", label: "Suppliers", icon: "truck", roles: ["staff"] },
      {
        id: "documents",
        label: "Documents",
        icon: "file-text",
        roles: ["staff", "supplier", "veterinarian"],
      },
      {
        id: "communications",
        label: "Communications",
        icon: "mail",
        roles: ["staff"],
      },
      {
        id: "slaughter-approvals",
        label: "Slaughter Approvals",
        icon: "clipboard-check",
        roles: ["veterinarian"],
      },
      {
        id: "certificates",
        label: "Certificates",
        icon: "award",
        roles: ["supplier", "veterinarian"],
      },
      {
        id: "settings",
        label: "Settings",
        icon: "settings",
        roles: ["staff", "supplier", "veterinarian", "customer"],
      },
    ];

    return allItems.filter((item) => item.roles.includes(userRole));
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h1 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>
            Butcher ERP
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center p-3 rounded-md transition-colors ${activeTab === item.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="flex-shrink-0">
                  {/* Using a placeholder for icon since we don't have the actual icons */}
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs">{item.icon[0]}</span>
                  </div>
                </span>
                {isSidebarOpen && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt={userName}
              />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-[300px] bg-background"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white">
                3
              </span>
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                  alt={userName}
                />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {/* Dashboard Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  {userRole === "supplier"
                    ? "Supplier Portal"
                    : userRole === "customer"
                      ? "Customer Portal"
                      : "Dashboard"}
                </h1>
                <div className="flex space-x-2">
                  {userRole === "staff" && (
                    <>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                      <Button size="sm">New Order</Button>
                    </>
                  )}
                  {userRole === "customer" && (
                    <Button size="sm">Place Order</Button>
                  )}
                  {userRole === "supplier" && (
                    <Button size="sm">Upload Documents</Button>
                  )}
                </div>
              </div>

              {/* Metrics */}
              {userRole === "staff" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Total Sales (Today)
                        </p>
                        <p className="text-2xl font-bold">
                          {metrics.totalSales}
                        </p>
                        <p className="text-xs text-green-500">
                          +5.2% from yesterday
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Pending Orders
                        </p>
                        <p className="text-2xl font-bold">
                          {metrics.pendingOrders}
                        </p>
                        <p className="text-xs text-amber-500">
                          4 require attention
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Low Stock Items
                        </p>
                        <p className="text-2xl font-bold">
                          {metrics.lowStockItems}
                        </p>
                        <p className="text-xs text-destructive">
                          Reorder required
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Expiring Soon
                        </p>
                        <p className="text-2xl font-bold">
                          {metrics.expiringItems}
                        </p>
                        <p className="text-xs text-destructive">
                          Within 3 days
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Supplier Metrics */}
              {userRole === "supplier" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Active Orders
                        </p>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-green-500">
                          3 new this week
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Pending Deliveries
                        </p>
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-xs text-amber-500">2 due today</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Documents to Upload
                        </p>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-xs text-destructive">
                          Certificates needed
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Customer Metrics */}
              {userRole === "customer" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Active Orders
                        </p>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-xs text-green-500">
                          1 ready for pickup
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          This Month's Spending
                        </p>
                        <p className="text-2xl font-bold">€245</p>
                        <p className="text-xs text-muted-foreground">
                          Average: €180/month
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Loyalty Points
                        </p>
                        <p className="text-2xl font-bold">1,250</p>
                        <p className="text-xs text-green-500">
                          €12.50 credit available
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Veterinarian Metrics */}
              {userRole === "veterinarian" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Pending Approvals
                        </p>
                        <p className="text-2xl font-bold">7</p>
                        <p className="text-xs text-amber-500">3 urgent</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Certificates Issued
                        </p>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-xs text-green-500">This month</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Expiring Licenses
                        </p>
                        <p className="text-2xl font-bold">2</p>
                        <p className="text-xs text-destructive">
                          Renewal required
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Staff Dashboard */}
                {userRole === "staff" && (
                  <>
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Inventory Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <InventoryOverview />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <OrderManagement compact={true} />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Pending Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {pendingTasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-start space-x-2 p-3 rounded-md bg-muted/50"
                              >
                                <div className="flex-1">
                                  <p className="text-sm">{task.title}</p>
                                </div>
                                <Badge
                                  variant={
                                    task.priority === "high"
                                      ? "destructive"
                                      : "outline"
                                  }
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Document Approvals</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <DocumentCenter compact={true} />
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}

                {/* Supplier Dashboard */}
                {userRole === "supplier" && (
                  <>
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Recent Purchase Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">PO-2024-001</p>
                                <p className="text-sm text-muted-foreground">
                                  Beef cuts - 50kg
                                </p>
                              </div>
                              <Badge variant="outline">Pending</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">PO-2024-002</p>
                                <p className="text-sm text-muted-foreground">
                                  Pork shoulder - 30kg
                                </p>
                              </div>
                              <Badge>Confirmed</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">PO-2024-003</p>
                                <p className="text-sm text-muted-foreground">
                                  Lamb legs - 25kg
                                </p>
                              </div>
                              <Badge variant="secondary">Delivered</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Required Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-sm font-medium text-amber-800">
                                Health Certificate
                              </p>
                              <p className="text-xs text-amber-600">
                                Due: Tomorrow
                              </p>
                            </div>
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm font-medium text-red-800">
                                Quality Assurance
                              </p>
                              <p className="text-xs text-red-600">
                                Overdue: 2 days
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}

                {/* Customer Dashboard */}
                {userRole === "customer" && (
                  <>
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Your Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">Order #1234</p>
                                <p className="text-sm text-muted-foreground">
                                  2x Ribeye Steaks, 1x Ground Beef
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Placed: Dec 15, 2024
                                </p>
                              </div>
                              <Badge>Ready for Pickup</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">Order #1233</p>
                                <p className="text-sm text-muted-foreground">
                                  1x Whole Chicken, 2x Pork Chops
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Placed: Dec 12, 2024
                                </p>
                              </div>
                              <Badge variant="secondary">Completed</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">Order #1232</p>
                                <p className="text-sm text-muted-foreground">
                                  3x Lamb Chops, 1x Sausages
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Placed: Dec 10, 2024
                                </p>
                              </div>
                              <Badge variant="outline">Processing</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Button className="w-full" variant="outline">
                              Browse Products
                            </Button>
                            <Button className="w-full" variant="outline">
                              Reorder Favorites
                            </Button>
                            <Button className="w-full" variant="outline">
                              View Order History
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Special Offers</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-green-800">
                              Weekend Special
                            </p>
                            <p className="text-xs text-green-600">
                              20% off premium cuts
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}

                {/* Veterinarian Dashboard */}
                {userRole === "veterinarian" && (
                  <>
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Pending Approvals</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">
                                  Slaughter Request #SR-001
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Cattle - Health inspection required
                                </p>
                              </div>
                              <Badge variant="destructive">Urgent</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">
                                  Slaughter Request #SR-002
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Pork - Standard inspection
                                </p>
                              </div>
                              <Badge variant="outline">Pending</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="text-sm">
                              <p className="font-medium">Certificate issued</p>
                              <p className="text-muted-foreground">
                                Health cert. #HC-2024-045
                              </p>
                            </div>
                            <div className="text-sm">
                              <p className="font-medium">
                                Inspection completed
                              </p>
                              <p className="text-muted-foreground">
                                Facility audit passed
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Inventory Management</h1>
                <Button>Add New Item</Button>
              </div>
              <InventoryOverview />
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  {userRole === "customer" ? "My Orders" : "Order Management"}
                </h1>
                {userRole === "staff" && <Button>Create New Order</Button>}
                {userRole === "customer" && <Button>Place New Order</Button>}
              </div>
              {userRole === "customer" ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">
                        Customer Order Portal
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Browse our premium selection of fresh meats and place
                        your orders online.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                        <Button variant="outline">Browse Products</Button>
                        <Button>Quick Reorder</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <OrderManagement />
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Document Center</h1>
                <Button>Upload Document</Button>
              </div>
              <DocumentCenter />
            </div>
          )}

          {/* Communications Tab */}
          {activeTab === "communications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Communication Panel</h1>
                <Button>New Message</Button>
              </div>
              <CommunicationPanel />
            </div>
          )}

          {/* Slaughter Approvals Tab (Veterinarian specific) */}
          {activeTab === "slaughter-approvals" &&
            userRole === "veterinarian" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Slaughter Approvals</h1>
                  <div className="flex space-x-2">
                    <Button variant="outline">History</Button>
                    <Button>Approve Selected</Button>
                  </div>
                </div>
                <Tabs defaultValue="pending">
                  <TabsList>
                    <TabsTrigger value="pending">Pending Approval</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pending">
                    <Card>
                      <CardContent className="p-6">
                        <DocumentCenter filterType="slaughter-approval" />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="approved">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground">
                          Approved documents will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="rejected">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground">
                          Rejected documents will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

          {/* Certificates Tab (Supplier specific) */}
          {activeTab === "certificates" &&
            (userRole === "supplier" || userRole === "veterinarian") && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Certificates</h1>
                  <Button>Upload Certificate</Button>
                </div>
                <Tabs defaultValue="active">
                  <TabsList>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="expired">Expired</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                  <TabsContent value="active">
                    <Card>
                      <CardContent className="p-6">
                        <DocumentCenter
                          filterType="certificates"
                          status="active"
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="expired">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground">
                          Expired certificates will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="pending">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground">
                          Pending certificates will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Settings</h1>
                <Button variant="outline">Save Changes</Button>
              </div>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">
                    Settings panel content will appear here.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
