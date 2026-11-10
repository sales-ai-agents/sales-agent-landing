const CRM_REFERENCE_LABELS: Record<string, string> = {
  card: "картка",
  lead: "лід",
  deal: "угода",
};

export const formatCrmReference = (externalId: string | null): string | null => {
  if (!externalId) return null;

  const [kind, id] = externalId.split(":");
  const label = CRM_REFERENCE_LABELS[kind];
  return label && id ? `${label} #${id}` : null;
};
