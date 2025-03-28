export const parseJsonValues = (data) => {
  if (typeof data !== "object" || data === null) return data; // Return if not an object

  return Object.entries(data).reduce((acc, [key, value]) => {
    if (typeof value === "object" && value !== null) {
      // Recursively parse nested objects
      acc[key] = parseJsonValues(value);
    } else if (typeof value === "string" && !isNaN(parseFloat(value))) {
      // Convert valid number strings to floats
      acc[key] = parseFloat(value);
    } else {
      acc[key] = value; // Keep other types unchanged
    }
    return acc;
  }, {});
};
