// Functions to retrieve the last year and its data from json object
export const getLastYear = (data) => {
  return Math.max(...Object.keys(data).map(Number));
};

export const getLastYearData = (data) => {
  const lastYear = getLastYear(data); // Get the latest year
  return data[lastYear]; // Return the GHG data for the latest year
};
