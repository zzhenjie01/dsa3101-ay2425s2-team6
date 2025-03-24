export const convertPercentage = (percentageString) => {
  const cleanedString = percentageString.replace("%", "");
  // return parseInt(cleanedString, 10); // Use parseInt for integers
  return parseFloat(cleanedString); // Use parseFloat for decimals
};
