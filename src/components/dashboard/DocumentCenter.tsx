// import React, { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Search,
//   FileText,
//   Upload,
//   Download,
//   CheckCircle,
//   XCircle,
//   Edit,
//   Trash2,
//   Eye,
//   PenTool,
// } from "lucide-react";

// interface Document {
//   id: string;
//   title: string;
//   type: string;
//   status: "pending" | "approved" | "rejected";
//   date: string;
//   submittedBy: string;
// }

// interface Template {
//   id: string;
//   name: string;
//   type: string;
//   lastModified: string;
// }

// const DocumentCenter = ({
//   userRole = "staff",
// }: {
//   userRole?: "staff" | "supplier" | "veterinarian" | "customer";
// }) => {
//   const [activeTab, setActiveTab] = useState("templates");
//   const [selectedDocument, setSelectedDocument] = useState<Document | null>(
//     null,
//   );
//   const [previewOpen, setPreviewOpen] = useState(false);

//   // Mock data
//   const templates: Template[] = [
//     {
//       id: "1",
//       name: "Invoice Template",
//       type: "Invoice",
//       lastModified: "2023-05-15",
//     },
//     {
//       id: "2",
//       name: "Delivery Note",
//       type: "Delivery",
//       lastModified: "2023-06-02",
//     },
//     {
//       id: "3",
//       name: "Slaughter Certificate",
//       type: "Certificate",
//       lastModified: "2023-04-28",
//     },
//     {
//       id: "4",
//       name: "Purchase Order",
//       type: "Order",
//       lastModified: "2023-05-30",
//     },
//   ];

//   const pendingDocuments: Document[] = [
//     {
//       id: "101",
//       title: "Slaughter Approval #45892",
//       type: "Approval",
//       status: "pending",
//       date: "2023-06-10",
//       submittedBy: "John Butcher",
//     },
//     {
//       id: "102",
//       title: "Health Certificate #12345",
//       type: "Certificate",
//       status: "pending",
//       date: "2023-06-09",
//       submittedBy: "Sarah Meats",
//     },
//     {
//       id: "103",
//       title: "Purchase Order #78901",
//       type: "Order",
//       status: "pending",
//       date: "2023-06-08",
//       submittedBy: "Quality Meats Inc.",
//     },
//   ];

//   const repositoryDocuments: Document[] = [
//     {
//       id: "201",
//       title: "Invoice #INV-2023-001",
//       type: "Invoice",
//       status: "approved",
//       date: "2023-05-20",
//       submittedBy: "System",
//     },
//     {
//       id: "202",
//       title: "Delivery Note #DEL-2023-042",
//       type: "Delivery",
//       status: "approved",
//       date: "2023-05-25",
//       submittedBy: "Jane Doe",
//     },
//     {
//       id: "203",
//       title: "Slaughter Certificate #SC-2023-015",
//       type: "Certificate",
//       status: "approved",
//       date: "2023-05-18",
//       submittedBy: "Dr. Smith",
//     },
//     {
//       id: "204",
//       title: "Purchase Order #PO-2023-089",
//       type: "Order",
//       status: "rejected",
//       date: "2023-05-15",
//       submittedBy: "Premium Beef Co.",
//     },
//   ];

//   // Role-specific content
//   const renderRoleSpecificContent = () => {
//     switch (userRole) {
//       case "veterinarian":
//         return (
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Slaughter Approvals Requiring Review</CardTitle>
//               <CardDescription>
//                 Documents awaiting your veterinary approval
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Document ID</TableHead>
//                     <TableHead>Title</TableHead>
//                     <TableHead>Submitted</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {pendingDocuments
//                     .filter((doc) => doc.type === "Approval")
//                     .map((doc) => (
//                       <TableRow key={doc.id}>
//                         <TableCell>{doc.id}</TableCell>
//                         <TableCell>{doc.title}</TableCell>
//                         <TableCell>{doc.date}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => {
//                                 setSelectedDocument(doc);
//                                 setPreviewOpen(true);
//                               }}
//                             >
//                               <Eye className="h-4 w-4 mr-1" /> View
//                             </Button>
//                             <Button size="sm" variant="default">
//                               <CheckCircle className="h-4 w-4 mr-1" /> Approve
//                             </Button>
//                             <Button size="sm" variant="destructive">
//                               <XCircle className="h-4 w-4 mr-1" /> Reject
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         );
//       case "supplier":
//         return (
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Purchase Orders & Certificates</CardTitle>
//               <CardDescription>
//                 Manage orders and upload required certificates
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Purchase Orders</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Order ID</TableHead>
//                           <TableHead>Status</TableHead>
//                           <TableHead>Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {pendingDocuments
//                           .filter((doc) => doc.type === "Order")
//                           .map((doc) => (
//                             <TableRow key={doc.id}>
//                               <TableCell>{doc.id}</TableCell>
//                               <TableCell>
//                                 <Badge variant="outline">{doc.status}</Badge>
//                               </TableCell>
//                               <TableCell>
//                                 <Button size="sm" variant="outline">
//                                   <Eye className="h-4 w-4 mr-1" /> View
//                                 </Button>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                       </TableBody>
//                     </Table>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Upload Certificate</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <Select>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Certificate Type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="health">
//                             Health Certificate
//                           </SelectItem>
//                           <SelectItem value="quality">
//                             Quality Assurance
//                           </SelectItem>
//                           <SelectItem value="origin">
//                             Certificate of Origin
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <div className="border-2 border-dashed rounded-md p-6 text-center">
//                         <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
//                         <p className="text-sm text-muted-foreground mb-2">
//                           Drag and drop your file here or click to browse
//                         </p>
//                         <Button variant="outline" size="sm">
//                           Select File
//                         </Button>
//                       </div>
//                       <Button className="w-full">
//                         <Upload className="h-4 w-4 mr-2" /> Upload Certificate
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </CardContent>
//           </Card>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="bg-background p-6 rounded-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold">Document Center</h2>
//         <div className="flex space-x-2">
//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search documents..."
//               className="pl-8 w-[250px]"
//             />
//           </div>
//           <Button variant="outline">
//             <FileText className="h-4 w-4 mr-2" /> New Document
//           </Button>
//         </div>
//       </div>

//       {renderRoleSpecificContent()}

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid grid-cols-3 mb-6">
//           <TabsTrigger value="templates">Templates</TabsTrigger>
//           <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
//           <TabsTrigger value="repository">Document Repository</TabsTrigger>
//         </TabsList>

//         <TabsContent value="templates" className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {templates.map((template) => (
//               <Card key={template.id}>
//                 <CardHeader>
//                   <CardTitle>{template.name}</CardTitle>
//                   <CardDescription>Type: {template.type}</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm text-muted-foreground">
//                     Last modified: {template.lastModified}
//                   </p>
//                 </CardContent>
//                 <CardFooter className="flex justify-between">
//                   <Button variant="outline" size="sm">
//                     <Eye className="h-4 w-4 mr-1" /> Preview
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     <Edit className="h-4 w-4 mr-1" /> Edit
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     <Download className="h-4 w-4 mr-1" /> Use
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="pending" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Documents Awaiting Approval</CardTitle>
//               <CardDescription>
//                 Review and approve pending documents
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Document ID</TableHead>
//                     <TableHead>Title</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Submitted By</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {pendingDocuments.map((doc) => (
//                     <TableRow key={doc.id}>
//                       <TableCell>{doc.id}</TableCell>
//                       <TableCell>{doc.title}</TableCell>
//                       <TableCell>{doc.type}</TableCell>
//                       <TableCell>{doc.date}</TableCell>
//                       <TableCell>{doc.submittedBy}</TableCell>
//                       <TableCell>
//                         <Badge
//                           variant={
//                             doc.status === "pending"
//                               ? "outline"
//                               : doc.status === "approved"
//                                 ? "default"
//                                 : "destructive"
//                           }
//                         >
//                           {doc.status.charAt(0).toUpperCase() +
//                             doc.status.slice(1)}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => {
//                               setSelectedDocument(doc);
//                               setPreviewOpen(true);
//                             }}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button size="sm" variant="default">
//                             <CheckCircle className="h-4 w-4" />
//                           </Button>
//                           <Button size="sm" variant="destructive">
//                             <XCircle className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="repository" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Document Repository</CardTitle>
//               <CardDescription>Access all stored documents</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex justify-between mb-4">
//                 <div className="flex space-x-2">
//                   <Select defaultValue="all">
//                     <SelectTrigger className="w-[180px]">
//                       <SelectValue placeholder="Document Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Types</SelectItem>
//                       <SelectItem value="invoice">Invoices</SelectItem>
//                       <SelectItem value="delivery">Delivery Notes</SelectItem>
//                       <SelectItem value="certificate">Certificates</SelectItem>
//                       <SelectItem value="order">Purchase Orders</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Select defaultValue="all">
//                     <SelectTrigger className="w-[180px]">
//                       <SelectValue placeholder="Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Statuses</SelectItem>
//                       <SelectItem value="approved">Approved</SelectItem>
//                       <SelectItem value="pending">Pending</SelectItem>
//                       <SelectItem value="rejected">Rejected</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <Button variant="outline">
//                   <Download className="h-4 w-4 mr-2" /> Export
//                 </Button>
//               </div>
//               <ScrollArea className="h-[400px]">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Document ID</TableHead>
//                       <TableHead>Title</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Submitted By</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {repositoryDocuments.map((doc) => (
//                       <TableRow key={doc.id}>
//                         <TableCell>{doc.id}</TableCell>
//                         <TableCell>{doc.title}</TableCell>
//                         <TableCell>{doc.type}</TableCell>
//                         <TableCell>{doc.date}</TableCell>
//                         <TableCell>{doc.submittedBy}</TableCell>
//                         <TableCell>
//                           <Badge
//                             variant={
//                               doc.status === "pending"
//                                 ? "outline"
//                                 : doc.status === "approved"
//                                   ? "default"
//                                   : "destructive"
//                             }
//                           >
//                             {doc.status.charAt(0).toUpperCase() +
//                               doc.status.slice(1)}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => {
//                                 setSelectedDocument(doc);
//                                 setPreviewOpen(true);
//                               }}
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                             <Button size="sm" variant="outline">
//                               <Download className="h-4 w-4" />
//                             </Button>
//                             {userRole === "staff" && (
//                               <Button size="sm" variant="destructive">
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             )}
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </ScrollArea>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Document Preview Dialog */}
//       <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>
//               {selectedDocument?.title || "Document Preview"}
//             </DialogTitle>
//             <DialogDescription>
//               {selectedDocument
//                 ? `Document ID: ${selectedDocument.id} • Type: ${selectedDocument.type} • Status: ${selectedDocument.status}`
//                 : ""}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="bg-muted/30 border rounded-md p-6 min-h-[400px] flex flex-col items-center justify-center">
//             <FileText className="h-16 w-16 text-muted-foreground mb-4" />
//             <p className="text-muted-foreground">
//               Document preview would appear here
//             </p>
//             <p className="text-sm text-muted-foreground mt-2">
//               This is a placeholder for the actual document content
//             </p>
//           </div>
//           {userRole === "veterinarian" &&
//             selectedDocument?.status === "pending" && (
//               <div className="space-y-4">
//                 <Textarea placeholder="Add comments or notes about this document..." />
//                 <div className="flex space-x-2">
//                   <Button
//                     className="flex-1"
//                     onClick={() => setPreviewOpen(false)}
//                   >
//                     <PenTool className="h-4 w-4 mr-2" /> Sign & Approve
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     className="flex-1"
//                     onClick={() => setPreviewOpen(false)}
//                   >
//                     <XCircle className="h-4 w-4 mr-2" /> Reject
//                   </Button>
//                 </div>
//               </div>
//             )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setPreviewOpen(false)}>
//               Close
//             </Button>
//             <Button variant="outline">
//               <Download className="h-4 w-4 mr-2" /> Download
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default DocumentCenter;
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

const DocumentCenter = ({
  userRole = "staff",
  compact = false,
}: {
  userRole?: "staff" | "supplier" | "veterinarian" | "customer";
  compact?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Mock data
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

  // Role-specific content
  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case "veterinarian":
        return (
          <Card className={`${compact ? "p-2" : ""} mb-6`}>
            <CardHeader>
              <CardTitle>Slaughter Approvals Requiring Review</CardTitle>
              <CardDescription>Documents awaiting your veterinary approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDocuments
                    .filter((doc) => doc.type === "Approval")
                    .map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>{doc.title}</TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedDocument(doc);
                                setPreviewOpen(true);
                              }}
                            >
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
            </CardContent>
          </Card>
        );

      case "supplier":
        return (
          <Card className={`${compact ? "p-2" : ""} mb-6`}>
            <CardHeader>
              <CardTitle>Purchase Orders & Certificates</CardTitle>
              <CardDescription>Manage orders and upload required certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingDocuments
                          .filter((doc) => doc.type === "Order")
                          .map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.id}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{doc.status}</Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upload Certificate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Certificate Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health">Health Certificate</SelectItem>
                          <SelectItem value="quality">Quality Assurance</SelectItem>
                          <SelectItem value="origin">Certificate of Origin</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="border-2 border-dashed rounded-md p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your file here or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Select File
                        </Button>
                      </div>
                      <Button className="w-full">
                        <Upload className="h-4 w-4 mr-2" /> Upload Certificate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-background ${compact ? "p-4" : "p-6"} rounded-lg`}>
      <div className={`flex ${compact ? "flex-col space-y-4" : "justify-between"} items-center mb-6`}>
        <h2 className={`${compact ? "text-xl" : "text-3xl"} font-bold`}>Document Center</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className={`pl-8 w-full ${compact ? "text-sm" : "text-base"}`}
            />
          </div>
          <Button variant="outline" className={`${compact ? "text-sm px-2" : ""}`}>
            <FileText className="h-4 w-4 mr-2" /> New Document
          </Button>
        </div>
      </div>

      {renderRoleSpecificContent()}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 mb-6">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="repository">Document Repository</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className={compact ? "p-2" : ""}>
                <CardHeader>
                  <CardTitle className={compact ? "text-base" : ""}>{template.name}</CardTitle>
                  <CardDescription>Type: {template.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Last modified: {template.lastModified}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Use
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card className={compact ? "p-2" : ""}>
            <CardHeader>
              <CardTitle>Documents Awaiting Approval</CardTitle>
              <CardDescription>Review and approve pending documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.id}</TableCell>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>{doc.submittedBy}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            doc.status === "pending"
                              ? "outline"
                              : doc.status === "approved"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setPreviewOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repository" className="space-y-4">
          <Card className={compact ? "p-2" : ""}>
            <CardHeader>
              <CardTitle>Document Repository</CardTitle>
              <CardDescription>Access all stored documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <Select defaultValue="all">
                    <SelectTrigger className={compact ? "w-full sm:w-[140px]" : "w-[180px]"}>
                      <SelectValue placeholder="Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="invoice">Invoices</SelectItem>
                      <SelectItem value="delivery">Delivery Notes</SelectItem>
                      <SelectItem value="certificate">Certificates</SelectItem>
                      <SelectItem value="order">Purchase Orders</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className={compact ? "w-full sm:w-[140px]" : "w-[180px]"}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size={compact ? "sm" : "md"}>
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </div>
              <ScrollArea className={compact ? "h-[300px]" : "h-[400px]"}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repositoryDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>{doc.title}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>{doc.submittedBy}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              doc.status === "pending"
                                ? "outline"
                                : doc.status === "approved"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedDocument(doc);
                                setPreviewOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            {userRole === "staff" && (
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
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

      {/* Document Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument?.title || "Document Preview"}
            </DialogTitle>
            <DialogDescription>
              {selectedDocument
                ? `Document ID: ${selectedDocument.id} • Type: ${selectedDocument.type} • Status: ${selectedDocument.status}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 border rounded-md p-6 min-h-[400px] flex flex-col items-center justify-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Document preview would appear here</p>
            <p className="text-sm text-muted-foreground mt-2">
              This is a placeholder for the actual document content
            </p>
          </div>
          {userRole === "veterinarian" && selectedDocument?.status === "pending" && (
            <div className="space-y-4">
              <Textarea placeholder="Add comments or notes about this document..." />
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={() => setPreviewOpen(false)}>
                  <PenTool className="h-4 w-4 mr-2" /> Sign & Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setPreviewOpen(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentCenter;
