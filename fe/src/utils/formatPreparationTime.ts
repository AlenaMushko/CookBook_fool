export const formatPreparationTime = (time: string | undefined): string => {
  if (!time) return "No time specified";

  const [hours, minutes] = time.split(":").map(Number);

  let result = "";
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}min`;
  }

  return result.trim();
};
