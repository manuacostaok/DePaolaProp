import type { ConstructionStatus } from "@prisma/client";

export const CONSTRUCTION_STATUS_LABELS: Record<ConstructionStatus, string> = {
  EN_POZO: "En pozo",
  EN_CONSTRUCCION: "En construcción",
  TERMINADO: "Terminado",
};

export const CONSTRUCTION_STATUS_OPTIONS = Object.entries(CONSTRUCTION_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
