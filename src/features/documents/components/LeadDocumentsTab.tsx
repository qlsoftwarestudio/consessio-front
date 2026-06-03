import { CheckCircle2, Download, FileText, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { formatDateTime } from "@/shared/utils/format";
import { useAuth } from "@/shared/auth/useAuth";
import { documentsService } from "../api/documents.service";
import {
  useDeleteDocument,
  useDocumentChecklist,
  useDocumentsByLead,
  useDocumentStats,
  useVerifyDocument,
} from "../hooks/use-documents";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import {
  DOCUMENT_TYPE_LABEL,
  REQUIRED_DOCUMENT_TYPES,
  documentFileName,
  documentFileSize,
  documentMimeType,
} from "../utils/document-labels";

interface Props {
  leadId: string;
}

const formatBytes = (bytes: number) => {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const downloadDocument = async (id: number, filename: string) => {
  const blob = await documentsService.download(id);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const LeadDocumentsTab = ({ leadId }: Props) => {
  const { can } = useAuth();
  const { data: documents = [], isLoading } = useDocumentsByLead(leadId);
  const { data: stats } = useDocumentStats(leadId);
  const { data: checklist = [] } = useDocumentChecklist(leadId);
  const verifyDocument = useVerifyDocument();
  const deleteDocument = useDeleteDocument();

  const totalDocs = stats?.totalDocs ?? documents.length;
  const verifiedDocs = stats?.verifiedDocs ?? documents.filter((doc) => doc.verified).length;
  const pendingDocs = stats?.pendingDocs ?? Math.max(0, totalDocs - verifiedDocs);
  const progress = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0;
  const verifiedTypes = new Set(checklist);

  const handleDownload = async (id: number, filename: string) => {
    try {
      await downloadDocument(id, filename);
    } catch {
      toast({ title: "No se pudo descargar el documento", variant: "destructive" });
    }
  };

  const handleVerify = async (id: number) => {
    try {
      await verifyDocument.mutateAsync({ id, leadId });
      toast({ title: "Documento verificado" });
    } catch {
      /* toast disparado por http-client */
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDocument.mutateAsync({ id, leadId });
      toast({ title: "Documento eliminado" });
    } catch {
      /* toast disparado por http-client */
    }
  };

  return (
    <div className="space-y-4 p-3">
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-surface-1/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-semibold">Documentos del comprador</h3>
            <Badge variant="outline">{verifiedDocs}/{totalDocs} verificados</Badge>
            {pendingDocs > 0 && <Badge variant="secondary">{pendingDocs} pendientes</Badge>}
          </div>
          <Progress value={progress} className="mt-3 h-2" />
        </div>
        {can("uploadDocuments") && <UploadDocumentDialog leadId={leadId} documents={documents} />}
      </div>

      <div className="rounded-lg border border-border/60 bg-surface-1/40 p-4">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Checklist</h4>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {REQUIRED_DOCUMENT_TYPES.map((type) => (
            <div key={type} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className={verifiedTypes.has(type) ? "h-4 w-4 text-success" : "h-4 w-4 text-muted-foreground/50"} />
              <span className={verifiedTypes.has(type) ? "text-foreground" : "text-muted-foreground"}>{DOCUMENT_TYPE_LABEL[type]}</span>
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          Todavía no hay documentos cargados.
        </p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => {
            const filename = documentFileName(doc);
            return (
              <li key={doc.id} className="flex flex-col gap-3 rounded-lg border border-border/60 bg-surface-1/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <FileText className="mt-0.5 h-4 w-4 text-primary" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">{DOCUMENT_TYPE_LABEL[doc.type]}</p>
                      <Badge variant={doc.verified ? "default" : "secondary"}>{doc.verified ? "Verificado" : "Pendiente"}</Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {filename} · {formatBytes(documentFileSize(doc))} · {documentMimeType(doc)}
                    </p>
                    <p className="text-xs text-muted-foreground">Subido {formatDateTime(doc.uploadedAt)}</p>
                    {doc.notes && <p className="mt-1 text-xs text-muted-foreground">{doc.notes}</p>}
                  </div>
                </div>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.id, filename)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  {can("verifyDocuments") && !doc.verified && (
                    <Button variant="ghost" size="icon" onClick={() => handleVerify(doc.id)} disabled={verifyDocument.isPending}>
                      <ShieldCheck className="h-4 w-4" />
                    </Button>
                  )}
                  {can("deleteDocuments") && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} disabled={deleteDocument.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
