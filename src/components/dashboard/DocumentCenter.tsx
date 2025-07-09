// src/components/dashboard/DocumentCenter.tsx
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  FileText,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  PenTool,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  submittedBy: string;
}

interface Template {
  id: string;
  name: string;
  type: string;
  lastModified: string;
}

const DocumentCenter: React.FC<{ userRole?: "staff" | "supplier" | "veterinarian" | "customer" }> = ({
  userRole = "staff",
}) => {
  const [activeTab, setActiveTab] = useState<string>("templates");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const templates: Template[] = [
    { id: "1", name: "Invoice Template", type: "Invoice", lastModified: "2023-05-15" },
    { id: "2", name: "Delivery Note", type: "Delivery", lastModified: "2023-06-02" },
    { id: "3", name: "Slaughter Certificate", type: "Certificate", lastModified: "2023-04-28" },
    { id: "4", name: "Purchase Order", type: "Order", lastModified: "2023-05-30" },
  ];

  const pendingDocuments: Document[] = [
    { id: "101", title: "Slaughter Approval #45892", type: "Approval", status: "pending", date: "2023-06-10", submittedBy: "John Butcher" },
    { id: "102", title: "Health Certificate #12345", type: "Certificate", status: "pending", date: "2023-06-09", submittedBy: "Sarah Meats" },
    { id: "103", title: "Purchase Order #78901", type: "Order", status: "pending", date: "2023-06-08", submittedBy: "Quality Meats Inc." },
  ];

  const repositoryDocuments: Document[] = [
    { id: "201", title: "Invoice #INV-2023-001", type: "Invoice", status: "approved", date: "2023-05-20", submittedBy: "System" },
    { id: "202", title: "Delivery Note #DEL-2023-042", type: "Delivery", status: "approved", date: "2023-05-25", submittedBy: "Jane Doe" },
    { id: "203", title: "Slaughter Certificate #SC-2023-015", type: "Certificate", status: "approved", date: "2023-05-18", submittedBy: "Dr. Smith" },
    { id: "204", title: "Purchase Order #PO-2023-089", type: "Order", status: "rejected", date: "2023-05-15", submittedBy: "Premium Beef Co." },
  ];

  const renderRoleSpecificContent = () => {
    if (userRole === "veterinarian") {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Slaughter Approvals Requiring Review</CardTitle>
            <CardDescription>Documents awaiting your veterinary approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDocuments.filter(d => d.type === "Approval").map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.id}</TableCell>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => { setSelectedDocument(doc); setPreviewOpen(true); }}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    }
    if (userRole === "supplier") {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Purchase Orders & Certificates</CardTitle>
            <CardDescription>Manage orders and upload certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader><CardTitle>Purchase Orders</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingDocuments.filter(d => d.type === "Order").map(doc => (
                          <TableRow key={doc.id}>
                            <TableCell>{doc.id}</TableCell>
                            <TableCell><Badge variant="outline">{doc.status}</Badge></TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1" />View</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Upload Certificate</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health Certificate</SelectItem>
                        <SelectItem value="quality">Quality Assurance</SelectItem>
                        <SelectItem value="origin">Certificate of Origin</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Drag & drop or click to browse</p>
                      <Button variant="outline" size="sm">Select File</Button>
                    </div>
                    <Button className="w-full"><Upload className="h-4 w-4 mr-1" /> Upload</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="bg-background p-4 md:p-6 rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl md:text-3xl font-bold mb-2 sm:mb-0">Document Center</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input placeholder="Search documents..." className="pl-10 w-full" />
          </div>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" /> New Template
          </Button>
        </div>
      </div>

      {/* Role-specific */}
      {renderRoleSpecificContent()}

      {/* Tabs */}
      <div className="overflow-x-auto -mx-4 px-4 sm:overflow-visible sm:-mx-0 sm:px-0 mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto -mx-4 px-4 sm:overflow-visible sm:-mx-0 sm:px-0">
          <TabsList className="inline-flex space-x-3 whitespace-nowrap">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="repository">Repository</TabsTrigger>
          </TabsList>
          </div>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(t => (
                <Card key={t.id}>
                  <CardHeader>
                    <CardTitle>{t.name}</CardTitle>
                    <CardDescription>Type: {t.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Last modified: {t.lastModified}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1" /> Preview</Button>
                    <Button size="sm" variant="outline"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                    <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" /> Use</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documents Awaiting Approval</CardTitle>
                <CardDescription>Review and approve</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead className="hidden sm:table-cell">Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="hidden md:table-cell">By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingDocuments.map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.id}</TableCell>
                          <TableCell className="hidden sm:table-cell">{doc.title}</TableCell>
                          <TableCell>{doc.date}</TableCell>
                          <TableCell className="hidden md:table-cell">{doc.submittedBy}</TableCell>
                          <TableCell>
                            <Badge variant={doc.status === "pending" ? "outline" : doc.status === "approved" ? "default" : "destructive"}>
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => { setSelectedDocument(doc); setPreviewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                              <Button size="sm" variant="default"><CheckCircle className="h-4 w-4" /></Button>
                              <Button size="sm" variant="destructive"><XCircle className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Repository Tab */}
          <TabsContent value="repository" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Repository</CardTitle>
                <CardDescription>Access all stored documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-4">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="invoice">Invoices</SelectItem>
                        <SelectItem value="delivery">Delivery Notes</SelectItem>
                        <SelectItem value="certificate">Certificates</SelectItem>
                        <SelectItem value="order">Purchase Orders</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
                </div>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead className="hidden sm:table-cell">Title</TableHead>
                        <TableHead className="hidden md:table-cell">Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repositoryDocuments.map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.id}</TableCell>
                          <TableCell className="hidden sm:table-cell">{doc.title}</TableCell>
                          <TableCell className="hidden md:table-cell">{doc.type}</TableCell>
                          <TableCell>{doc.date}</TableCell>
                          <TableCell>
                            <Badge variant={doc.status === "pending" ? "outline" : doc.status === "approved" ? "default" : "destructive"}>
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => { setSelectedDocument(doc); setPreviewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                              <Button size="sm" variant="outline"><Download className="h-4 w-4" /></Button>
                              {userRole === "staff" && <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button>}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Document Preview */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title || "Document Preview"}</DialogTitle>
            <DialogDescription>
              {selectedDocument && `ID: ${selectedDocument.id} • Type: ${selectedDocument.type} • Status: ${selectedDocument.status}`}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 border rounded-md p-6 h-[200px] sm:h-[400px] flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Preview placeholder</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
            <div className="flex gap-2">
              <Button variant="outline"><Download className="h-4 w-4 mr-1" /> Download</Button>
              {userRole === "veterinarian" && selectedDocument?.status === "pending" && (
                <>
                  <Button className="flex-1"><PenTool className="h-4 w-4 mr-1" /> Sign & Approve</Button>
                  <Button variant="destructive" className="flex-1"><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentCenter;
export { DocumentCenter };