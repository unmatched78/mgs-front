// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { FileText, Download, PenTool, XCircle } from "lucide-react";
// import { Document } from "@/data/documents";

// interface DocumentPreviewDialogProps {
//   document: Document | null;
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   userRole: "staff" | "supplier" | "veterinarian" | "customer";
//   onApprove?: () => void;
//   onReject?: () => void;
// }

// export const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
//   document,
//   isOpen,
//   onOpenChange,
//   userRole,
//   onApprove,
//   onReject,
// }) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-3xl">
//         <DialogHeader>
//           <DialogTitle>{document?.title || "Document Preview"}</DialogTitle>
//           <DialogDescription>
//             {document
//               ? `Document ID: ${document.id} • Type: ${document.type} • Status: ${document.status}`
//               : ""}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="bg-muted/30 border rounded-md p-6 min-h-[400px] flex flex-col items-center justify-center">
//           <FileText className="h-16 w-16 text-muted-foreground mb-4" />
//           <p className="text-muted-foreground">
//             Document preview would appear here
//           </p>
//           <p className="text-sm text-muted-foreground mt-2">
//             This is a placeholder for the actual document content
//           </p>
//         </div>
//         {userRole === "veterinarian" && document?.status === "pending" && (
//           <div className="space-y-4">
//             <Textarea placeholder="Add comments or notes about this document..." />
//             <div className="flex space-x-2">
//               <Button className="flex-1" onClick={onApprove}>
//                 <PenTool className="h-4 w-4 mr-2" /> Sign & Approve
//               </Button>
//               <Button variant="destructive" className="flex-1" onClick={onReject}>
//                 <XCircle className="h-4 w-4 mr-2" /> Reject
//               </Button>
//             </div>
//           </div>
//         )}
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Close
//           </Button>
//           <Button variant="outline">
//             <Download className="h-4 w-4 mr-2" /> Download
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, PenTool, XCircle } from "lucide-react";
import { Document, Template } from "@/data/documents";
import { Form } from "@formio/react";

type PreviewItem = Document | Template;

interface DocumentPreviewDialogProps {
  item: PreviewItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: "staff" | "supplier" | "veterinarian" | "customer";
  onApprove?: () => void;
  onReject?: () => void;
}

export const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  item,
  isOpen,
  onOpenChange,
  userRole,
  onApprove,
  onReject,
}) => {
  const isDocument = (item: PreviewItem | null): item is Document => {
    return item !== null && "data" in item;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isDocument(item) ? `Document #${item.id}` : item?.name || "Preview"}</DialogTitle>
          <DialogDescription>
            {item
              ? isDocument(item)
                ? `Template: ${item.template} • Status: ${item.status} • Submitted: ${item.created_at}`
                : `Template ID: ${item.id} • Last Modified: ${item.updated_at}`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted/30 border rounded-md p-6 min-h-[400px] flex flex-col">
          {item ? (
            isDocument(item) ? (
              <Form
                form={item.data.schema || { components: [] }}
                submission={{ data: item.data }}
                options={{ readOnly: true }}
              />
            ) : (
              <Form
                form={item.schema}
                options={{ readOnly: true }}
              />
            )
          ) : (
            <>
              <FileText className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
              <p className="text-muted-foreground text-center">Preview would appear here</p>
            </>
          )}
          {item && (
            <div className="mt-4 text-sm">
              <p><strong>{isDocument(item) ? "Template" : "Name"}:</strong> {isDocument(item) ? item.template : item.name}</p>
              {isDocument(item) ? (
                <>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Submitted By:</strong> {item.created_by}</p>
                  <p><strong>Date:</strong> {item.created_at}</p>
                </>
              ) : (
                <>
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Last Modified:</strong> {item.updated_at}</p>
                </>
              )}
            </div>
          )}
        </div>
        {userRole === "veterinarian" && isDocument(item) && item?.status === "pending" && (
          <div className="space-y-4">
            <Textarea placeholder="Add comments or notes about this document..." />
            <div className="flex space-x-2">
              <Button className="flex-1" onClick={onApprove}>
                <PenTool className="h-4 w-4 mr-2" /> Sign & Approve
              </Button>
              <Button variant="destructive" className="flex-1" onClick={onReject}>
                <XCircle className="h-4 w-4 mr-2" /> Reject
              </Button>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};