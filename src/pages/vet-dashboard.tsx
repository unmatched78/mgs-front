// src/pages/home.tsx
import { useState } from "react";
import {
  Bell,
  Menu,
  Search,
  Grid,
  ClipboardCheck,
  Award,
  Settings,
  FileText,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { DocumentCenter } from "../components/dashboard/DocumentCenter";

type UserRole = "staff" | "supplier" | "veterinarian" | "customer";

interface HomeProps {
  userRole?: UserRole;
  userName?: string;
}

const ICON_MAP: Record<string, JSX.Element> = {
  overview: <Grid className="h-5 w-5" />,
  documents: <FileText className="h-5 w-5" />,
  "slaughter-approvals": <ClipboardCheck className="h-5 w-5" />,
  certificates: <Award className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
};

export default function Home({
  userRole = "veterinarian",
  userName = "John Doe",
}: HomeProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarItems = [
    { id: "overview", label: "Dashboard", iconKey: "overview" },
    { id: "documents", label: "Documents", iconKey: "documents" },
    { id: "slaughter-approvals", label: "Slaughter Approvals", iconKey: "slaughter-approvals" },
    { id: "certificates", label: "Certificates", iconKey: "certificates" },
    { id: "settings", label: "Settings", iconKey: "settings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar (hidden on small, toggles overlay) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:relative sm:translate-x-0 sm:flex sm:flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="font-bold text-lg">Ikiraro Mgs</h1>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  {ICON_MAP[item.iconKey]}
                  <span className="ml-3">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 p-4 border-t border-border">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                userName
              )}`}
              alt={userName}
            />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="truncate">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userRole}</p>
          </div>
        </div>
      </aside>

      {/* Overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-card border-b border-border px-4 py-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative w-full max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 w-full" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white">
                3
              </span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    userName
                  )}`}
                  alt={userName}
                />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card><CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-xs text-amber-500">3 urgent</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Certificates Issued</p>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-green-500">This month</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Expiring Licenses</p>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs text-destructive">Renewal required</p>
                </CardContent></Card>
              </div>

              {/* Pending Approvals List */}
              <Card>
                <CardHeader className="pb-2"><CardTitle>Pending Approvals</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Slaughter Request #SR-001</p>
                        <p className="text-sm text-muted-foreground">Cattle – Health inspection required</p>
                      </div>
                      <Badge variant="destructive" className="mt-2 sm:mt-0">Urgent</Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Slaughter Request #SR-002</p>
                        <p className="text-sm text-muted-foreground">Pork – Standard inspection</p>
                      </div>
                      <Badge variant="outline" className="mt-2 sm:mt-0">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-2"><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">Certificate issued</p>
                      <p className="text-muted-foreground">Health cert. #HC-2024-045</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Inspection completed</p>
                      <p className="text-muted-foreground">Facility audit passed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Documents */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h1 className="text-2xl font-semibold">Document Center</h1>
                <Button size="sm">Upload Document</Button>
              </div>
              <DocumentCenter userRole={userRole} />
            </div>
          )}

          {/* Slaughter Approvals */}
          {activeTab === "slaughter-approvals" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h1 className="text-2xl font-semibold">Slaughter Approvals</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">History</Button>
                  <Button size="sm">Approve Selected</Button>
                </div>
              </div>
              <Tabs defaultValue="pending" className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-4">
                <TabsList className="inline-flex space-x-3 whitespace-nowrap">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                <TabsContent value="pending"><DocumentCenter userRole={userRole} /></TabsContent>
                <TabsContent value="approved">
                  <Card><CardContent className="p-4 text-center text-muted-foreground">No approved items</CardContent></Card>
                </TabsContent>
                <TabsContent value="rejected">
                  <Card><CardContent className="p-4 text-center text-muted-foreground">No rejected items</CardContent></Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Certificates */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h1 className="text-2xl font-semibold">Certificates</h1>
                <Button size="sm">Upload Certificate</Button>
              </div>
              <Tabs defaultValue="active" className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-4">
                <TabsList className="inline-flex space-x-3 whitespace-nowrap">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="expired">Expired</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
                <TabsContent value="active"><DocumentCenter userRole={userRole} /></TabsContent>
                <TabsContent value="expired">
                  <Card><CardContent className="p-4 text-center text-muted-foreground">No expired certificates</CardContent></Card>
                </TabsContent>
                <TabsContent value="pending">
                  <Card><CardContent className="p-4 text-center text-muted-foreground">No pending certificates</CardContent></Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h1 className="text-2xl font-semibold">Settings</h1>
                <Button variant="outline" size="sm">Save Changes</Button>
              </div>
              <Card><CardContent className="p-4 text-muted-foreground">Settings content goes here.</CardContent></Card>
            </div>
          )}
        </main>
      </div>  
    </div>
  );
};
