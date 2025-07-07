// // export default CommunicationPanel;
// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
// import {
//   CalendarIcon,
//   CheckIcon,
//   Mail,
//   Plus,
//   Search,
//   Send,
//   Trash,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import api from "@/api/api"; // Your API client
// import { useAuth } from "@/context/AuthContext"; // Authentication context

// // Interfaces matching backend
// interface EmailTemplate {
//   id: string;
//   name: string;
//   subject: string;
//   content: string;
//   type: "order" | "delivery" | "marketing";
//   last_used?: string;
// }

// interface CommunicationHistory {
//   id: string;
//   template_name?: string;
//   subject: string;
//   recipient_email: string;
//   sent_date: string;
//   status: "sent" | "scheduled" | "failed";
//   type: "order" | "delivery" | "marketing" | "custom";
// }

// interface Customer {
//   id: string;
//   name: string;
//   email: string;
// }

// const CommunicationPanel = () => {
//   const { user, loading: authLoading } = useAuth();
//   const [activeTab, setActiveTab] = useState("templates");
//   const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
//   const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);
//   const [templates, setTemplates] = useState<EmailTemplate[]>([]);
//   const [history, setHistory] = useState<CommunicationHistory[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [templateSearch, setTemplateSearch] = useState("");
//   const [historySearch, setHistorySearch] = useState("");
//   const [historyTypeFilter, setHistoryTypeFilter] = useState("all");
//   const [composeForm, setComposeForm] = useState({
//     templateId: "",
//     recipientType: "individual" as "individual" | "segment" | "all",
//     recipientId: "",
//     schedule: "now" as "now" | "later",
//     scheduleDate: new Date(),
//     subject: "",
//     content: "",
//   });

//   // Fetch data from backend
//   useEffect(() => {
//     async function fetchData() {
//       if (authLoading || !user || user.role !== "shop") {
//         setLoading(false);
//         return;
//       }
//       try {
//         setLoading(true);
//         const [templatesRes, historyRes, customersRes] = await Promise.all([
//           api.get<EmailTemplate[]>("/communications/templates/"),
//           api.get<CommunicationHistory[]>("/communications/history/"),
//           api.get<Customer[]>("/customers/"),
//         ]);
//         setTemplates(templatesRes.data);
//         setHistory(historyRes.data);
//         setCustomers(customersRes.data);
//       } catch (err: any) {
//         setError(err.response?.data?.detail || "Failed to load data");
//         toast.error("Failed to load communication data");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [authLoading, user]);

//   // Filter templates and history
//   const filteredTemplates = templates.filter((t) =>
//     t.name.toLowerCase().includes(templateSearch.toLowerCase())
//   );

//   const filteredHistory = history.filter((item) => {
//     const matchesSearch =
//       item.subject.toLowerCase().includes(historySearch.toLowerCase()) ||
//       item.recipient_email.toLowerCase().includes(historySearch.toLowerCase());
//     const matchesType = historyTypeFilter === "all" || item.type === historyTypeFilter;
//     return matchesSearch && matchesType;
//   });

//   // Template handlers
//   const handleTemplateSelect = (template: EmailTemplate) => {
//     setSelectedTemplate(template);
//     setIsTemplateEditorOpen(true);
//   };

//   const handleCreateTemplate = () => {
//     const newTemplate: EmailTemplate = {
//       id: `new-${Date.now()}`,
//       name: "New Template",
//       subject: "",
//       content: "",
//       type: "order",
//     };
//     setSelectedTemplate(newTemplate);
//     setIsTemplateEditorOpen(true);
//   };

//   const handleSaveTemplate = async () => {
//     if (!selectedTemplate) return;
//     try {
//       if (selectedTemplate.id.startsWith("new-")) {
//         const { id, ...data } = selectedTemplate;
//         const res = await api.post<EmailTemplate>("/communications/templates/", data);
//         setTemplates([...templates, res.data]);
//       } else {
//         const res = await api.put<EmailTemplate>(
//           `/communications/templates/${selectedTemplate.id}/`,
//           selectedTemplate
//         );
//         setTemplates(templates.map((t) => (t.id === selectedTemplate.id ? res.data : t)));
//       }
//       setIsTemplateEditorOpen(false);
//       toast.success("Template saved successfully");
//     } catch (err: any) {
//       toast.error(err.response?.data?.detail || "Failed to save template");
//     }
//   };

//   // Compose handlers
//   const handleSend = async () => {
//     try {
//       const data = {
//         template_id: composeForm.templateId || null,
//         subject: composeForm.subject,
//         content: composeForm.content,
//         recipient_id: composeForm.recipientId,
//         schedule_date: composeForm.schedule === "later" ? composeForm.scheduleDate.toISOString() : null,
//       };
//       await api.post("/communications/send/", data);
//       toast.success("Communication sent successfully");
//       setComposeForm({
//         templateId: "",
//         recipientType: "individual",
//         recipientId: "",
//         schedule: "now",
//         scheduleDate: new Date(),
//         subject: "",
//         content: "",
//       });
//       // Optionally refresh history here
//     } catch (err: any) {
//       toast.error(err.response?.data?.detail || "Failed to send communication");
//     }
//   };

//   // History handlers
//   const handleDeleteCommunication = async (id: string) => {
//     try {
//       await api.delete(`/communications/history/${id}/`);
//       setHistory(history.filter((item) => item.id !== id));
//       toast.success("Communication deleted successfully");
//     } catch (err: any) {
//       toast.error(err.response?.data?.detail || "Failed to delete communication");
//     }
//   };

//   const handleResendCommunication = (id: string) => {
//     toast.info(`Resending communication ${id} not implemented yet.`);
//   };

//   if (loading) return <div className="p-4 text-center">Loading...</div>;
//   if (error) return <div className="p-4 text-center text-destructive">{error}</div>;

//   return (
//     <Card className="w-full bg-white">
//       <CardHeader>
//         <CardTitle className="text-2xl">Communication Panel</CardTitle>
//         <CardDescription>
//           Manage email templates, schedule communications, and track message history
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="templates">Email Templates</TabsTrigger>
//             <TabsTrigger value="compose">Compose & Schedule</TabsTrigger>
//             <TabsTrigger value="history">Communication History</TabsTrigger>
//           </TabsList>

//           {/* Email Templates Tab */}
//           <TabsContent value="templates" className="space-y-4">
//             <div className="flex justify-between items-center">
//               <div className="relative w-64">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search templates..."
//                   className="pl-8"
//                   value={templateSearch}
//                   onChange={(e) => setTemplateSearch(e.target.value)}
//                 />
//               </div>
//               <Button onClick={handleCreateTemplate}>
//                 <Plus className="mr-2 h-4 w-4" /> New Template
//               </Button>
//             </div>
//             {filteredTemplates.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//                 {filteredTemplates.map((template) => (
//                   <Card
//                     key={template.id}
//                     className="cursor-pointer hover:bg-muted/50"
//                     onClick={() => handleTemplateSelect(template)}
//                   >
//                     <CardHeader className="pb-2">
//                       <div className="flex justify-between items-start">
//                         <CardTitle className="text-lg">{template.name}</CardTitle>
//                         <Badge
//                           variant={
//                             template.type === "order"
//                               ? "default"
//                               : template.type === "delivery"
//                               ? "secondary"
//                               : "outline"
//                           }
//                         >
//                           {template.type}
//                         </Badge>
//                       </div>
//                       <CardDescription className="text-sm truncate">
//                         {template.subject}
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-muted-foreground line-clamp-3">
//                         {template.content}
//                       </p>
//                     </CardContent>
//                     <CardFooter className="pt-0 text-xs text-muted-foreground">
//                       {template.last_used
//                         ? `Last used: ${format(new Date(template.last_used), "MMM d, yyyy")}`
//                         : "Never used"}
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-center text-muted-foreground mt-4">
//                 No templates found. Create a new one to get started.
//               </p>
//             )}
//           </TabsContent>

//           {/* Compose & Schedule Tab */}
//           <TabsContent value="compose" className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="md:col-span-1 space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Template</label>
//                   <Select
//                     value={composeForm.templateId}
//                     onValueChange={(value) => {
//                       const template = templates.find((t) => t.id === value);
//                       setComposeForm({
//                         ...composeForm,
//                         templateId: value,
//                         subject: template?.subject || "",
//                         content: template?.content || "",
//                       });
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a template" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {templates.map((t) => (
//                         <SelectItem key={t.id} value={t.id}>
//                           {t.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Recipient Type</label>
//                   <Select
//                     value={composeForm.recipientType}
//                     onValueChange={(value: "individual" | "segment" | "all") =>
//                       setComposeForm({ ...composeForm, recipientType: value })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="individual">Individual Customer</SelectItem>
//                       <SelectItem value="segment">Customer Segment</SelectItem>
//                       <SelectItem value="all">All Customers</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 {composeForm.recipientType === "individual" && (
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Recipient</label>
//                     <Select
//                       value={composeForm.recipientId}
//                       onValueChange={(value) => setComposeForm({ ...composeForm, recipientId: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select customer" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {customers.map((c) => (
//                           <SelectItem key={c.id} value={c.id}>
//                             {c.name} ({c.email})
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Schedule</label>
//                   <Select
//                     value={composeForm.schedule}
//                     onValueChange={(value: "now" | "later") =>
//                       setComposeForm({ ...composeForm, schedule: value })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="now">Send Now</SelectItem>
//                       <SelectItem value="later">Schedule for Later</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   {composeForm.schedule === "later" && (
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
//                           <CalendarIcon className="mr-2 h-4 w-4" />
//                           {format(composeForm.scheduleDate, "PPP")}
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0">
//                         <Calendar
//                           mode="single"
//                           selected={composeForm.scheduleDate}
//                           onSelect={(date) => date && setComposeForm({ ...composeForm, scheduleDate: date })}
//                           initialFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                   )}
//                 </div>
//               </div>
//               <div className="md:col-span-2 space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Subject</label>
//                   <Input
//                     placeholder="Email subject"
//                     value={composeForm.subject}
//                     onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Message</label>
//                   <Textarea
//                     placeholder="Type your message here..."
//                     className="min-h-[200px]"
//                     value={composeForm.content}
//                     onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <Button variant="outline" onClick={() => toast.info("Preview not implemented yet")}>
//                     Preview
//                   </Button>
//                   <Button onClick={handleSend}>
//                     <Send className="mr-2 h-4 w-4" /> Send
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </TabsContent>

//           {/* Communication History Tab */}
//           <TabsContent value="history" className="space-y-4">
//             <div className="flex justify-between items-center">
//               <div className="relative w-64">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search history..."
//                   className="pl-8"
//                   value={historySearch}
//                   onChange={(e) => setHistorySearch(e.target.value)}
//                 />
//               </div>
//               <Select value={historyTypeFilter} onValueChange={setHistoryTypeFilter}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   <SelectItem value="order">Order Confirmations</SelectItem>
//                   <SelectItem value="delivery">Delivery Notifications</SelectItem>
//                   <SelectItem value="marketing">Marketing Campaigns</SelectItem>
//                   <SelectItem value="custom">Custom Messages</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Template</TableHead>
//                     <TableHead>Subject</TableHead>
//                     <TableHead>Recipient</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead className="w-[100px]">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredHistory.length > 0 ? (
//                     filteredHistory.map((item) => (
//                       <TableRow key={item.id}>
//                         <TableCell>{item.template_name || "Custom"}</TableCell>
//                         <TableCell>{item.subject}</TableCell>
//                         <TableCell>{item.recipient_email}</TableCell>
//                         <TableCell>{format(new Date(item.sent_date), "MMM d, yyyy")}</TableCell>
//                         <TableCell>
//                           <Badge
//                             variant={
//                               item.status === "sent"
//                                 ? "default"
//                                 : item.status === "scheduled"
//                                 ? "outline"
//                                 : "destructive"
//                             }
//                           >
//                             {item.status}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="secondary">{item.type}</Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => handleResendCommunication(item.id)}
//                             >
//                               <Mail className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => handleDeleteCommunication(item.id)}
//                             >
//                               <Trash className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center text-muted-foreground">
//                         No communication history found.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </CardContent>

//       {/* Template Editor Dialog */}
//       <Dialog open={isTemplateEditorOpen} onOpenChange={setIsTemplateEditorOpen}>
//         <DialogContent className="sm:max-w-[725px]">
//           <DialogHeader>
//             <DialogTitle>Edit Template</DialogTitle>
//             <DialogDescription>
//               Customize your email template. Use placeholders like [Customer Name] for dynamic content.
//             </DialogDescription>
//           </DialogHeader>
//           {selectedTemplate && (
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <label className="text-right text-sm font-medium">Name</label>
//                 <Input
//                   className="col-span-3"
//                   value={selectedTemplate.name}
//                   onChange={(e) =>
//                     setSelectedTemplate({ ...selectedTemplate, name: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <label className="text-right text-sm font-medium">Type</label>
//                 <Select
//                   value={selectedTemplate.type}
//                   onValueChange={(value: "order" | "delivery" | "marketing") =>
//                     setSelectedTemplate({ ...selectedTemplate, type: value })
//                   }
//                 >
//                   <SelectTrigger className="col-span-3">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="order">Order Confirmation</SelectItem>
//                     <SelectItem value="delivery">Delivery Notification</SelectItem>
//                     <SelectItem value="marketing">Marketing Campaign</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <label className="text-right text-sm font-medium">Subject</label>
//                 <Input
//                   className="col-span-3"
//                   value={selectedTemplate.subject}
//                   onChange={(e) =>
//                     setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-start gap-4">
//                 <label className="text-right text-sm font-medium pt-2">Content</label>
//                 <Textarea
//                   className="col-span-3 min-h-[200px]"
//                   value={selectedTemplate.content}
//                   onChange={(e) =>
//                     setSelectedTemplate({ ...selectedTemplate, content: e.target.value })
//                   }
//                 />
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsTemplateEditorOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveTemplate}>
//               <CheckIcon className="mr-2 h-4 w-4" /> Save Changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// };

// export default CommunicationPanel;
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckIcon,
  Mail,
  Plus,
  Search,
  Send,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: "order" | "delivery" | "marketing";
  last_used?: string;
}

interface CommunicationHistory {
  id: string;
  template_name?: string;
  subject: string;
  recipient_email: string;
  sent_date: string;
  status: "sent" | "scheduled" | "failed";
  type: "order" | "delivery" | "marketing" | "custom";
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

const CommunicationPanel: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [history, setHistory] = useState<CommunicationHistory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [templateSearch, setTemplateSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [historyTypeFilter, setHistoryTypeFilter] = useState("all");

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);

  const [composeForm, setComposeForm] = useState({
    templateId: "",
    recipientType: "individual" as "individual" | "segment" | "all",
    recipientId: "",
    schedule: "now" as "now" | "later",
    scheduleDate: new Date(),
    subject: "",
    content: "",
  });

  useEffect(() => {
    async function fetchAll() {
      if (authLoading || !user || user.role !== "shop") {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [tplR, histR, custR] = await Promise.all([
          api.get<EmailTemplate[]>("/communications/templates/"),
          api.get<CommunicationHistory[]>("/communications/history/"),
          api.get<Customer[]>("/customers/"),
        ]);
        setTemplates(tplR.data);
        setHistory(histR.data);
        setCustomers(custR.data);
      } catch (err: any) {
        setError("Failed to load data");
        toast.error("Could not fetch communications");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [authLoading, user]);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(templateSearch.toLowerCase())
  );

  const filteredHistory = history.filter((h) => {
    const matchText =
      h.subject.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.recipient_email.toLowerCase().includes(historySearch.toLowerCase());
    const matchType = historyTypeFilter === "all" || h.type === historyTypeFilter;
    return matchText && matchType;
  });

  const openEditor = (tpl: EmailTemplate) => {
    setSelectedTemplate(tpl);
    setIsTemplateEditorOpen(true);
  };

  const saveTemplate = async () => {
    if (!selectedTemplate) return;
    try {
      if (selectedTemplate.id.startsWith("new-")) {
        const { id, ...data } = selectedTemplate;
        const res = await api.post<EmailTemplate>("/communications/templates/", data);
        setTemplates((t) => [...t, res.data]);
      } else {
        const res = await api.put<EmailTemplate>(
          `/communications/templates/${selectedTemplate.id}/`,
          selectedTemplate
        );
        setTemplates((t) => t.map((x) => (x.id === res.data.id ? res.data : x)));
      }
      setIsTemplateEditorOpen(false);
      toast.success("Saved");
    } catch (err: any) {
      toast.error("Save failed");
    }
  };

  const sendCommunication = async () => {
    try {
      await api.post("/communications/send/", {
        template_id: composeForm.templateId || null,
        subject: composeForm.subject,
        content: composeForm.content,
        recipient_id: composeForm.recipientId,
        schedule_date:
          composeForm.schedule === "later"
            ? composeForm.scheduleDate.toISOString()
            : null,
      });
      toast.success("Sent");
      setComposeForm({
        templateId: "",
        recipientType: "individual",
        recipientId: "",
        schedule: "now",
        scheduleDate: new Date(),
        subject: "",
        content: "",
      });
    } catch {
      toast.error("Send failed");
    }
  };

  const deleteHistory = async (id: string) => {
    try {
      await api.delete(`/communications/history/${id}/`);
      setHistory((h) => h.filter((x) => x.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return <div className="p-4 text-center text-muted-foreground">Loading…</div>;
  if (error)
    return <div className="p-4 text-center text-destructive">{error}</div>;

  return (
    <Card className="w-full bg-background p-4 md:p-6 rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Communication Panel</CardTitle>
        <CardDescription>
          Manage templates, compose messages, track history
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Wrap the TabsList in a scrollable container */}
          <div className="overflow-x-auto -mx-4 px-4 sm:overflow-visible sm:-mx-0 sm:px-0">
          <TabsList className="inline-flex space-x-3 text-sm whitespace-nowrap">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </div>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={() => openEditor({
              id: `new-${Date.now()}`,
              name: "New Template",
              subject: "",
              content: "",
              type: "order",
            })}>
              <Plus className="mr-1 h-4 w-4" /> New
            </Button>
          </div>

          {filteredTemplates.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((tpl) => (
                <Card
                  key={tpl.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openEditor(tpl)}
                >
                  <CardHeader className="pb-1">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg truncate">{tpl.name}</CardTitle>
                      <Badge variant="outline" className="capitalize text-xs">
                        {tpl.type}
                      </Badge>
                    </div>
                    <p className="text-sm truncate">{tpl.subject}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {tpl.content}
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground pt-1">
                    {tpl.last_used
                      ? `Last used ${format(new Date(tpl.last_used), "MMM d, yyyy")}`
                      : "Never used"}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-4">
              No templates found.
            </p>
          )}
        </TabsContent>

        {/* Compose */}
        <TabsContent value="compose" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              {/* Template Picker */}
              <div>
                <label className="block text-sm font-medium">Template</label>
                <Select
                  value={composeForm.templateId}
                  onValueChange={(val) => {
                    const t = templates.find((x) => x.id === val);
                    setComposeForm((f) => ({
                      ...f,
                      templateId: val,
                      subject: t?.subject || "",
                      content: t?.content || "",
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-sm font-medium">Recipient</label>
                <Select
                  value={composeForm.recipientType}
                  onValueChange={(val) =>
                    setComposeForm((f) => ({ ...f, recipientType: val as any }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="segment">Segment</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {composeForm.recipientType === "individual" && (
                <div>
                  <label className="block text-sm font-medium">Customer</label>
                  <Select
                    value={composeForm.recipientId}
                    onValueChange={(v) =>
                      setComposeForm((f) => ({ ...f, recipientId: v }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Schedule */}
              <div className="space-y-1">
                <label className="block text-sm font-medium">Schedule</label>
                <Select
                  value={composeForm.schedule}
                  onValueChange={(val) =>
                    setComposeForm((f) => ({ ...f, schedule: val as any }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="later">Later</SelectItem>
                  </SelectContent>
                </Select>

                {composeForm.schedule === "later" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-between"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(composeForm.scheduleDate, "MMM d, yyyy")}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={composeForm.scheduleDate}
                        onSelect={(d) =>
                          d && setComposeForm((f) => ({ ...f, scheduleDate: d }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>

            {/* Subject + Body */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium">Subject</label>
                <Input
                  value={composeForm.subject}
                  onChange={(e) =>
                    setComposeForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <Textarea
                  className="min-h-[160px]"
                  value={composeForm.content}
                  onChange={(e) =>
                    setComposeForm((f) => ({ ...f, content: e.target.value }))
                  }
                  placeholder="Type message…"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => toast.info("Preview TBD")}>
                  Preview
                </Button>
                <Button onClick={sendCommunication}>
                  <Send className="mr-1 h-4 w-4" /> Send
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search history"
                className="pl-8"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
              />
            </div>
            <Select
              value={historyTypeFilter}
              onValueChange={setHistoryTypeFilter}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Tpl</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">To</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length ? (
                  filteredHistory.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="hidden sm:table-cell">
                        {h.template_name || "Custom"}
                      </TableCell>
                      <TableCell>{h.subject}</TableCell>
                      <TableCell className="hidden md:table-cell truncate max-w-[120px]">
                        {h.recipient_email}
                      </TableCell>
                      <TableCell>{format(new Date(h.sent_date), "MMM d")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            h.status === "sent"
                              ? "default"
                              : h.status === "scheduled"
                                ? "outline"
                                : "destructive"
                          }
                          className="capitalize text-xs px-2 py-1"
                        >
                          {h.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell capitalize">
                        {h.type}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toast.info("Resend TBD")}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteHistory(h.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      No entries
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>

      {/* Template Editor */ }
  <Dialog open={isTemplateEditorOpen} onOpenChange={setIsTemplateEditorOpen}>
    <DialogContent className="max-w-md sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Edit Template</DialogTitle>
        <DialogDescription>
          Use placeholders like [Name] for dynamic fields.
        </DialogDescription>
      </DialogHeader>
      {selectedTemplate && (
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              value={selectedTemplate.name}
              onChange={(e) =>
                setSelectedTemplate((t) => t && { ...t, name: e.target.value }!)
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <Select
              value={selectedTemplate.type}
              onValueChange={(v) =>
                setSelectedTemplate((t) => t && { ...t, type: v as any }!)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <Input
              value={selectedTemplate.subject}
              onChange={(e) =>
                setSelectedTemplate((t) => t && { ...t, subject: e.target.value }!)
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Content</label>
            <Textarea
              className="min-h-[120px]"
              value={selectedTemplate.content}
              onChange={(e) =>
                setSelectedTemplate((t) => t && { ...t, content: e.target.value }!)
              }
            />
          </div>
        </div>
      )}
      <DialogFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsTemplateEditorOpen(false)}>
          Cancel
        </Button>
        <Button onClick={saveTemplate}>
          <CheckIcon className="mr-1 h-4 w-4" /> Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
    </Card >
  );
};

export default CommunicationPanel;
