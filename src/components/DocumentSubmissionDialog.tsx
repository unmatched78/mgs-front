import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Template } from "@/data/documents";
import { Form } from "@formio/react";
import api from "@/api/api";
import { toast } from "@/components/ui/use-toast";

interface DocumentSubmissionDialogProps {
  template: Template | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentSubmissionDialog: React.FC<DocumentSubmissionDialogProps> = ({
  template,
  isOpen,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = async (submission: { data: any }) => {
    try {
      await api.post("/docs/instances/", {
        template: template?.id,
        data: submission.data,
      });
      toast({ title: "Success", description: "Document submitted successfully" });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to submit document",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Submit {template?.name}</DialogTitle>
        </DialogHeader>
        {template && (
          <Form
            form={template.schema}
            onSubmit={handleSubmit}
            onChange={(submission: any) => setFormData(submission.data)}
          />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};