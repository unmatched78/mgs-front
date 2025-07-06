import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Upload, Eye } from "lucide-react";
import { Document, pendingDocuments } from "@/data/documents";
import { DocumentPreviewDialog } from "@/components/DocumentPreviewDialog";

export const SupplierDocumentCenter: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="bg-background p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Document Center</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search documents..." className="pl-8 w-[250px]" />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Purchase Orders & Certificates</CardTitle>
          <CardDescription>Manage orders and upload required certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

      <DocumentPreviewDialog
        document={selectedDocument}
        isOpen={previewOpen}
        onOpenChange={setPreviewOpen}
        userRole="supplier"
      />
    </div>
  );
};