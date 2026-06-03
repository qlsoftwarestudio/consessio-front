import type { ApiDocument, ApiDocumentType } from "@/shared/api/types";

export const DOCUMENT_TYPES: ApiDocumentType[] = [
  "DNI_FRENTE",
  "DNI_DORSO",
  "CUIL_CUIT",
  "RECIBO_SUELDO_1",
  "RECIBO_SUELDO_2",
  "RECIBO_SUELDO_3",
  "SERVICIO",
  "GARANTE_DNI_FRENTE",
  "GARANTE_DNI_DORSO",
  "GARANTE_CUIL",
  "GARANTE_RECIBO_1",
  "CONTRATO_RESERVA",
  "ORDEN_COMPRA",
  "OTRO",
];

export const DOCUMENT_TYPE_LABEL: Record<ApiDocumentType, string> = {
  DNI_FRENTE: "DNI frente",
  DNI_DORSO: "DNI dorso",
  CUIL_CUIT: "CUIL/CUIT",
  RECIBO_SUELDO_1: "Recibo sueldo 1",
  RECIBO_SUELDO_2: "Recibo sueldo 2",
  RECIBO_SUELDO_3: "Recibo sueldo 3",
  SERVICIO: "Servicio",
  GARANTE_DNI_FRENTE: "Garante DNI frente",
  GARANTE_DNI_DORSO: "Garante DNI dorso",
  GARANTE_CUIL: "Garante CUIL",
  GARANTE_RECIBO_1: "Garante recibo 1",
  CONTRATO_RESERVA: "Contrato reserva",
  ORDEN_COMPRA: "Orden compra",
  OTRO: "Otro",
};

export const REQUIRED_DOCUMENT_TYPES: ApiDocumentType[] = [
  "DNI_FRENTE",
  "DNI_DORSO",
  "CUIL_CUIT",
  "RECIBO_SUELDO_1",
  "RECIBO_SUELDO_2",
  "RECIBO_SUELDO_3",
  "SERVICIO",
  "CONTRATO_RESERVA",
  "ORDEN_COMPRA",
];

export const documentFileName = (doc: ApiDocument) => doc.fileName ?? doc.originalFilename ?? `documento-${doc.id}`;
export const documentFileSize = (doc: ApiDocument) => doc.fileSize ?? doc.size ?? 0;
export const documentMimeType = (doc: ApiDocument) => doc.mimeType ?? doc.contentType ?? "Archivo";
