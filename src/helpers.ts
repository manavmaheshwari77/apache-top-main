export const convertDateStringToDate = (dateString: string): string => {
  // Map month names to their corresponding index
  const monthMap: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  // Split the date string into day, month, and year
  const [day, monthStr, year] = dateString.split("/");

  // Get the month index from the map
  const monthIndex: number = monthMap[monthStr.toLowerCase()];

  // Create a new Date object
  const convertedDate = new Date(
    Number(year),
    monthIndex,
    Number(day)
  ).toLocaleDateString();

  return convertedDate;
};

export function indexDataArr<T>(arr: T[], chunckSize: number): T[] {
  const logsPicked = arr.slice(0, chunckSize);
  return logsPicked;
}
