import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Eye, Edit, Download, CheckCircle, XCircle, Trash2, Save, Plus } from "lucide-react";
import { Document, Template } from "@/data/documents";
import { DocumentPreviewDialog } from "@/components/DocumentPreviewDialog";
import { DocumentSubmissionDialog } from "@/components/DocumentSubmissionDialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/api/api";
import { FormBuilder } from "@formio/react";
import "formiojs/dist/formio.full.min.css"; // Formio styles

export const StaffDocumentCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedItem, setSelectedItem] = useState<Document | Template | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Template>>({});
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch templates and documents on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [templatesResponse, documentsResponse] = await Promise.all([
          api.get("/docs/templates/"),
          api.get("/docs/instances/"),
        ]);
        setTemplates(templatesResponse.data);
        setDocuments(documentsResponse.data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateTemplate = async () => {
    try {
      const response = await api.post("/docs/templates/", editForm);
      setTemplates((prev) => [...prev, response.data]);
      setIsCreating(false);
      setEditForm({});
      toast({ title: "Success", description: "Template created successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create template",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async (templateId: string) => {
    try {
      const response = await api.put(`/docs/templates/${templateId}/`, editForm);
      setTemplates((prev) =>
        prev.map((template) => (template.id === templateId ? response.data : template))
      );
      setEditingTemplateId(null);
      setEditForm({});
      toast({ title: "Success", description: "Template updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update template",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await api.delete(`/docs/templates/${templateId}/`);
      setTemplates((prev) => prev.filter((template) => template.id !== templateId));
      toast({ title: "Success", description: "Template deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (template: Template) => {
    setEditingTemplateId(template.id);
    setEditForm({
      id: template.id,
      name: template.name,
      description: template.description,
      schema: template.schema,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormBuilderChange = (schema: any) => {
    setEditForm((prev) => ({ ...prev, schema }));
  };

  const handleCancelEdit = () => {
    setEditingTemplateId(null);
    setIsCreating(false);
    setEditForm({});
  };

  // Filter documents for pending and repository tabs
  const pendingDocs = documents.filter((doc) => doc.status === "pending");
  const repositoryDocs = documents;

  return (
    <div className="bg-background p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Document Center</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search documents..." className="pl-8 w-[250px]" />
          </div>
          <Button variant="outline" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Template
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto -mx-4 px-4 sm:overflow-visible sm:-mx-0 sm:px-0">
        <TabsList className="inline-flex space-x-3 text-sm whitespace-nowrap">

          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="repository">Document Repository</TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="templates" className="space-y-4">
          {isCreating && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Create New Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  name="name"
                  value={editForm.name || ""}
                  onChange={handleInputChange}
                  placeholder="Template Name"
                />
                <Textarea
                  name="description"
                  value={editForm.description || ""}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
                <FormBuilder
                  form={editForm.schema || { components: [] }}
                  onChange={handleFormBuilderChange}
                  options={{
                    builder: {
                      basic: {
                        title: "Basic Components",
                        components: {
                          textfield: true,
                          number: true,
                          date: true,
                          select: true,
                          checkbox: true,
                        },
                      },
                    },
                  }}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="default" onClick={handleCreateTemplate}>
                  <Save className="h-4 w-4 mr-1" /> Create
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <p>Loading templates...</p>
            ) : (
              templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    {editingTemplateId === template.id ? (
                      <div className="space-y-2">
                        <Input
                          name="name"
                          value={editForm.name || template.name}
                          onChange={handleInputChange}
                          placeholder="Template Name"
                        />
                        <Textarea
                          name="description"
                          value={editForm.description || template.description}
                          onChange={handleInputChange}
                          placeholder="Description"
                        />
                      </div>
                    ) : (
                      <>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </>
                    )}
                  </CardHeader>
                  <CardContent>
                    {editingTemplateId === template.id ? (
                      <FormBuilder
                        form={editForm.schema || { components: [] }}
                        onChange={handleFormBuilderChange}
                        options={{
                          builder: {
                            basic: {
                              title: "Basic Components",
                              components: {
                                textfield: true,
                                number: true,
                                date: true,
                                select: true,
                                checkbox: true,
                              },
                            },
                          },
                        }}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">Last modified: {template.updated_at}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {editingTemplateId === template.id ? (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSaveEdit(template.id)}
                        >
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(template);
                            setPreviewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setSubmissionOpen(true);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" /> Fill Out
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(template)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents Awaiting Approval</CardTitle>
              <CardDescription>Review and approve pending documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document ID</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.id}</TableCell>
                      <TableCell>{doc.template}</TableCell>
                      <TableCell>{doc.created_at}</TableCell>
                      <TableCell>{doc.created_by}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Pending</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(doc);
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
          <Card>
            <CardHeader>
              <CardTitle>Document Repository</CardTitle>
              <CardDescription>Access all stored documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="delivery_note">Delivery Notes</SelectItem>
                      <SelectItem value="slaughter_checklist">Slaughter Checklists</SelectItem>
                      <SelectItem value="audit_form">Audit Forms</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
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
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </div>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document ID</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repositoryDocs.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>{doc.template}</TableCell>
                        <TableCell>{doc.created_at}</TableCell>
                        <TableCell>{doc.created_by}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              doc.status === "pending" ? "outline" : doc.status === "approved" ? "default" : "destructive"
                            }
                          >
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedItem(doc);
                                setPreviewOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      <DocumentPreviewDialog
        item={selectedItem}
        isOpen={previewOpen}
        onOpenChange={setPreviewOpen}
        userRole="staff"
      />
      <DocumentSubmissionDialog
        template={selectedTemplate}
        isOpen={submissionOpen}
        onOpenChange={setSubmissionOpen}
      />
    </div>
  );
};