import React, { useState } from "react";
import { Bell, Menu, Search, User, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import InventoryOverview from "../components/dashboard/InventoryOverview";
import OrderManagement from "../components/dashboard/OrderManagement";
import { DocumentCenter } from "../components/dashboard/DocumentCenter";
import CommunicationPanel from "../components/dashboard/CommunicationPanel";

type UserRole = "staff" | "supplier" | "veterinarian" | "customer";

interface HomeProps {
  userRole?: UserRole;
  userName?: string;
}

const Home = ({ userRole = "supplier", userName = "John Doe" }: HomeProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
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
        id: "documents",
        label: "Documents",
        icon: "file-text",
        roles: ["staff", "supplier", "veterinarian"],
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

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isSidebarOpen ? "w-64" : "w-20"} fixed lg:static lg:translate-x-0 left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 flex flex-col z-50`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h1 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>
            Ikiraro Mgs
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block"
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
                onClick={() => {
                  setActiveTab(item.id);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
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
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
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
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-full lg:w-[300px] bg-background"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white">
                3
              </span>
            </Button>
            <Separator orientation="vertical" className="h-8 hidden sm:block" />
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                  alt={userName}
                />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-muted/30">
          {/* Dashboard Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold">
                  "Supplier Portal"
                </h1>
                <div className="flex space-x-2">
                  {userRole === "supplier" && (
                    <Button size="sm" className="w-full sm:w-auto">Upload Documents</Button>
                  )}
                </div>
              </div>

              {/* Supplier Metrics */}
              {userRole === "supplier" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 lg:p-6">
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
                    <CardContent className="p-4 lg:p-6">
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
                    <CardContent className="p-4 lg:p-6">
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

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

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
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-2">
                              <div>
                                <p className="font-medium">PO-2024-001</p>
                                <p className="text-sm text-muted-foreground">
                                  Beef cuts - 50kg
                                </p>
                              </div>
                              <Badge variant="outline" className="self-start sm:self-center">Pending</Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-2">
                              <div>
                                <p className="font-medium">PO-2024-002</p>
                                <p className="text-sm text-muted-foreground">
                                  Pork shoulder - 30kg
                                </p>
                              </div>
                              <Badge className="self-start sm:self-center">Confirmed</Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-2">
                              <div>
                                <p className="font-medium">PO-2024-003</p>
                                <p className="text-sm text-muted-foreground">
                                  Lamb legs - 25kg
                                </p>
                              </div>
                              <Badge variant="secondary" className="self-start sm:self-center">Delivered</Badge>
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
              </div>
            </div>
          )}
          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold">Inventory Management</h1>
                <Button className="w-full sm:w-auto">Add New Item</Button>
              </div>
              <InventoryOverview />
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <OrderManagement />

            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold">Document Center</h1>
                <Button className="w-full sm:w-auto">Upload Document</Button>
              </div>
              <DocumentCenter />
            </div>
          )}

          {/* Communications Tab */}
          {activeTab === "communications" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold">Communication Panel</h1>
                <Button className="w-full sm:w-auto">New Message</Button>
              </div>
              <CommunicationPanel />
            </div>
          )}

          {/* Certificates Tab (Supplier specific) */}
          {activeTab === "certificates" &&
            (userRole === "supplier") && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h1 className="text-2xl font-bold">Certificates</h1>
                  <Button className="w-full sm:w-auto">Upload Certificate</Button>
                </div>
                <Tabs defaultValue="active">
                  <div className="overflow-x-auto">
                    <TabsList>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="expired">Expired</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="active">
                    <Card>
                      <CardContent className="p-4 lg:p-6">
                        <DocumentCenter
                          userRole={userRole}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="expired">
                    <Card>
                      <CardContent className="p-4 lg:p-6">
                        <p className="text-muted-foreground">
                          Expired certificates will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="pending">
                    <Card>
                      <CardContent className="p-4 lg:p-6">
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold">Settings</h1>
                <Button variant="outline" className="w-full sm:w-auto">Save Changes</Button>
              </div>
              <Card>
                <CardContent className="p-4 lg:p-6">
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