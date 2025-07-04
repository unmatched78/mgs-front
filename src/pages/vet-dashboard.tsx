import React, { useState } from "react";
import { Bell, Menu, Search, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import InventoryOverview from "../components/dashboard/InventoryOverview";
import OrderManagement from "../components/dashboard/OrderManagement";
import DocumentCenter from "../components/dashboard/DocumentCenter";
import CommunicationPanel from "../components/dashboard/CommunicationPanel";

type UserRole = "staff" | "supplier" | "veterinarian" | "customer";

interface HomeProps {
  userRole?: UserRole;
  userName?: string;
}

const Home = ({ userRole = "veterinarian", userName = "John Doe" }: HomeProps) => {
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
            Ikiraro Mgs
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
            
                </div>
              </div>

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
                {/* Veterinarian Dashboard */}
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
          {activeTab === "slaughter-approvals" && (
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
          {activeTab === "certificates" && (
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
