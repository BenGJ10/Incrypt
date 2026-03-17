export const getAuditActionBadgeClasses = (action) => {
  const normalizedAction = String(action || "").toUpperCase();

  if (normalizedAction.includes("CREATE")) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (normalizedAction.includes("UPDATE")) {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }

  if (normalizedAction.includes("DELETE")) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-amber-100 text-amber-700 border-amber-200";
};
