export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatBloodGroup(
  bloodGroup: string | null | undefined
): string {
  if (!bloodGroup) return "-";
  return bloodGroup
    .replace("_POSITIVE", "+")
    .replace("_NEGATIVE", "-")
    .replace("_", "");
}
