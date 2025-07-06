import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { Document, pendingDocuments } from "@/data/documents";
import { DocumentPreviewDialog } from "@/components/DocumentPreviewDialog";

export const VeterinarianDocumentCenter: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleApprove = () => {
    setPreviewOpen(false);
    // Backend integration for approval
  };

  const handleReject = () => {
    setPreviewOpen(false);
    // Backend integration for rejection
  };

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
                      <div className="flex space-x-2">
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
                        <Button size="sm" variant="default" onClick={handleApprove}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={handleReject}>
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

      <DocumentPreviewDialog
        document={selectedDocument}
        isOpen={previewOpen}
        onOpenChange={setPreviewOpen}
        userRole="veterinarian"
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};