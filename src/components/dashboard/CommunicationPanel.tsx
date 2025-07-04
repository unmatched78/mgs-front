import React, { useState } from "react";
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
  DialogTrigger,
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
  Edit,
  Mail,
  Plus,
  Search,
  Send,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: "order" | "delivery" | "marketing";
  lastUsed?: Date;
}

interface CommunicationHistory {
  id: string;
  templateName: string;
  subject: string;
  recipient: string;
  sentDate: Date;
  status: "sent" | "scheduled" | "failed";
  type: "order" | "delivery" | "marketing";
}

const CommunicationPanel = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);

  // Mock data for templates
  const templates: EmailTemplate[] = [
    {
      id: "1",
      name: "Order Confirmation",
      subject: "Your order has been confirmed",
      content:
        "Dear [Customer Name],\n\nThank you for your order. Your order #[Order Number] has been confirmed and is being processed.\n\nRegards,\nButcher Shop Team",
      type: "order",
      lastUsed: new Date("2023-05-15"),
    },
    {
      id: "2",
      name: "Delivery Notification",
      subject: "Your order is on the way",
      content:
        "Dear [Customer Name],\n\nYour order #[Order Number] is on the way and will be delivered on [Delivery Date].\n\nRegards,\nButcher Shop Team",
      type: "delivery",
      lastUsed: new Date("2023-05-20"),
    },
    {
      id: "3",
      name: "Weekly Specials",
      subject: "Check out our weekly specials",
      content:
        "Dear [Customer Name],\n\nCheck out our weekly specials! We have great deals on [Product List].\n\nRegards,\nButcher Shop Team",
      type: "marketing",
    },
  ];

  // Mock data for communication history
  const communicationHistory: CommunicationHistory[] = [
    {
      id: "1",
      templateName: "Order Confirmation",
      subject: "Your order has been confirmed",
      recipient: "john.doe@example.com",
      sentDate: new Date("2023-05-15"),
      status: "sent",
      type: "order",
    },
    {
      id: "2",
      templateName: "Delivery Notification",
      subject: "Your order is on the way",
      recipient: "jane.smith@example.com",
      sentDate: new Date("2023-05-20"),
      status: "sent",
      type: "delivery",
    },
    {
      id: "3",
      templateName: "Weekly Specials",
      subject: "Check out our weekly specials",
      recipient: "marketing-list@example.com",
      sentDate: new Date("2023-05-25"),
      status: "scheduled",
      type: "marketing",
    },
  ];

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsTemplateEditorOpen(true);
  };

  const handleCreateTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: `new-${Date.now()}`,
      name: "New Template",
      subject: "",
      content: "",
      type: "order",
    };
    setSelectedTemplate(newTemplate);
    setIsTemplateEditorOpen(true);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-2xl">Communication Panel</CardTitle>
        <CardDescription>
          Manage email templates, schedule communications, and track message
          history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="compose">Compose & Schedule</TabsTrigger>
            <TabsTrigger value="history">Communication History</TabsTrigger>
          </TabsList>

          {/* Email Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search templates..." className="pl-8" />
              </div>
              <Button onClick={handleCreateTemplate}>
                <Plus className="mr-2 h-4 w-4" /> New Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge
                        variant={
                          template.type === "order"
                            ? "default"
                            : template.type === "delivery"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {template.type}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm truncate">
                      {template.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {template.content}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-muted-foreground">
                    {template.lastUsed
                      ? `Last used: ${format(template.lastUsed, "MMM d, yyyy")}`
                      : "Never used"}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compose & Schedule Tab */}
          <TabsContent value="compose" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Type</label>
                  <Select defaultValue="individual">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">
                        Individual Customer
                      </SelectItem>
                      <SelectItem value="segment">Customer Segment</SelectItem>
                      <SelectItem value="all">All Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Schedule</label>
                  <div className="flex space-x-2">
                    <Select defaultValue="now">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Send Now</SelectItem>
                        <SelectItem value="later">
                          Schedule for Later
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[180px] justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Email subject" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Type your message here..."
                    className="min-h-[200px]"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Preview</Button>
                  <Button>
                    <Send className="mr-2 h-4 w-4" /> Send
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Communication History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search history..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="order">Order Confirmations</SelectItem>
                  <SelectItem value="delivery">
                    Delivery Notifications
                  </SelectItem>
                  <SelectItem value="marketing">Marketing Campaigns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communicationHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.templateName}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>{item.recipient}</TableCell>
                      <TableCell>
                        {format(item.sentDate, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "sent"
                              ? "default"
                              : item.status === "scheduled"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Template Editor Dialog */}
      <Dialog
        open={isTemplateEditorOpen}
        onOpenChange={setIsTemplateEditorOpen}
      >
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Customize your email template. Use placeholders like [Customer
              Name] for dynamic content.
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Name</label>
                <Input
                  className="col-span-3"
                  value={selectedTemplate.name}
                  onChange={(e) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Type</label>
                <Select
                  value={selectedTemplate.type}
                  onValueChange={(value: "order" | "delivery" | "marketing") =>
                    setSelectedTemplate({ ...selectedTemplate, type: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order Confirmation</SelectItem>
                    <SelectItem value="delivery">
                      Delivery Notification
                    </SelectItem>
                    <SelectItem value="marketing">
                      Marketing Campaign
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Subject
                </label>
                <Input
                  className="col-span-3"
                  value={selectedTemplate.subject}
                  onChange={(e) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      subject: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium pt-2">
                  Content
                </label>
                <Textarea
                  className="col-span-3 min-h-[200px]"
                  value={selectedTemplate.content}
                  onChange={(e) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      content: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTemplateEditorOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <CheckIcon className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CommunicationPanel;
