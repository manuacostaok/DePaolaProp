// Varios formularios piden un único campo "WhatsApp o email" en vez de dos
// inputs separados. Antes de mandarlo a createLead() hay que decidir a cuál
// de los dos campos del Lead corresponde, para no guardar un email adentro
// de contactPhone (o viceversa).
export function splitContactInput(value: string): { contactPhone?: string; contactEmail?: string } {
  const trimmed = value.trim();
  return trimmed.includes("@") ? { contactEmail: trimmed } : { contactPhone: trimmed };
}
