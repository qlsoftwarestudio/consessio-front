import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { excelService } from "../api/excel.service";
import { useQueryClient } from "@tanstack/react-query";
import { leadsKeys } from "../hooks/use-leads";
import { toast } from "@/hooks/use-toast";
import type { ApiExcelUploadResult } from "@/shared/api/types";

export const ImportLeadsDialog = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiExcelUploadResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const reset = () => {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  const submit = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await excelService.uploadLeads(file);
      setResult(res);
      qc.invalidateQueries({ queryKey: leadsKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast({ title: "Importación finalizada", description: res.message });
    } catch {
      // toast ya disparado por http-client
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-1 h-4 w-4" /> Importar
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Importar leads desde Excel</DialogTitle>
          <DialogDescription>
            Subí un archivo .xlsx con columnas: Nombre, Apellido, Teléfono, Email, DNI, Fuente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label
            htmlFor="excel-file"
            className="glass flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border/60 p-6 text-center transition-colors hover:border-primary/50"
          >
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            <div className="text-sm font-medium">
              {file ? file.name : "Click para seleccionar archivo"}
            </div>
            <p className="text-xs text-muted-foreground">.xlsx · máx. 5 MB</p>
            <input
              ref={inputRef}
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {result && (
            <div className="space-y-2 rounded-lg border border-border/60 bg-surface-1/50 p-4 text-sm">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">{result.processed} procesados</span>
              </div>
              {result.duplicates > 0 && (
                <div className="flex items-center gap-2 text-warning">
                  <AlertCircle className="h-4 w-4" />
                  <span>{result.duplicates} duplicados ignorados</span>
                </div>
              )}
              {result.errors > 0 && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{result.errors} errores</span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleClose(false)}>
            Cerrar
          </Button>
          <Button
            onClick={submit}
            disabled={!file || loading}
            className="bg-gradient-gold text-primary-foreground shadow-amber"
          >
            {loading ? "Procesando…" : "Subir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
