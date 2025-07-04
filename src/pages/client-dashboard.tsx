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
import DocumentCenter from "../components/dashboard/DocumentCenter";
import CommunicationPanel from "../components/dashboard/CommunicationPanel";

type UserRole = "staff" | "supplier" | "veterinarian" | "customer";

interface HomeProps {
  userRole?: UserRole;
  userName?: string;
}

const Home = ({ userRole = "customer", userName = "John Doe" }: HomeProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Filter sidebar items based on user role
  const getSidebarItems = () => {
    const allItems = [
      {
        id: "overview",
        label: "Dashboard",
        icon: "grid",
        roles: ["customer"],
      },
      {
        id: "orders",
        label: "Orders",
        icon: "shopping-cart",
        roles: ["customer"],
      },
      {
        id: "settings",
        label: "Settings",
        icon: "settings",
        roles: ["customer"],
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
                  Customer Portal
                </h1>
                <div className="flex space-x-2">
                    <Button size="sm">Place Order</Button>
               
                </div>
              </div>

              {/* Customer Metrics */}

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

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Dashboard */}
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
                  My Orders
                </h1>
                <Button>Place New Order</Button>
              </div>

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
