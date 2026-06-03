import { useMemo, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { ApiDocument, ApiDocumentType } from "@/shared/api/types";
import { useUploadDocument } from "../hooks/use-documents";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABEL } from "../utils/document-labels";

interface Props {
  leadId: string;
  documents: ApiDocument[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const UploadDocumentDialog = ({ leadId, documents }: Props) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ApiDocumentType>("DNI_FRENTE");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const uploadDocument = useUploadDocument();

  const duplicated = useMemo(() => documents.some((doc) => doc.type === type), [documents, type]);

  const reset = () => {
    setType("DNI_FRENTE");
    setFile(null);
    setNotes("");
  };

  const submit = async () => {
    if (!file) {
      toast({ title: "Seleccioná un archivo", variant: "destructive" });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "Archivo demasiado grande", description: "El máximo permitido es 10MB.", variant: "destructive" });
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({ title: "Tipo de archivo no permitido", description: "Usá PDF, JPG, PNG, DOC o DOCX.", variant: "destructive" });
      return;
    }

    try {
      await uploadDocument.mutateAsync({ leadId, type, file, notes: notes.trim() || undefined });
      toast({ title: "Documento subido" });
      setOpen(false);
      reset();
    } catch {
      /* toast disparado por http-client */
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-gold text-primary-foreground shadow-amber">
          <Upload className="mr-1 h-4 w-4" /> Subir documento
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Subir documento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-1.5">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as ApiDocumentType)}>
              <SelectTrigger className="bg-surface-1/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((docType) => (
                  <SelectItem key={docType} value={docType}>{DOCUMENT_TYPE_LABEL[docType]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {duplicated && (
              <p className="text-xs text-warning">Ya existe un documento cargado para este tipo.</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label>Archivo</Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="bg-surface-1/60"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file && <p className="text-xs text-muted-foreground">{file.name}</p>}
          </div>

          <div className="grid gap-1.5">
            <Label>Notas</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-surface-1/60" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={uploadDocument.isPending}>Cancelar</Button>
          <Button onClick={submit} disabled={uploadDocument.isPending} className="bg-gradient-gold text-primary-foreground shadow-amber">
            {uploadDocument.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Upload className="mr-1 h-4 w-4" />}
            Subir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
