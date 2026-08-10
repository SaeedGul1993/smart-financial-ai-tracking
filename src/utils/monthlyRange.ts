export async function getCurrentMonthRange() {
  const startDate = new Date();
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setHours(23, 59, 59, 999);
  return { start: startDate, end: endDate };
}

export async function getTodayRange() {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  return { start: startDate, end: endDate };
}

export const getMonthlyRange = (month: number, year: number) => {
  const startDate = new Date(year, month - 1, 1);

  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  return { start: startDate, end: endDate };
};

export const currentMonthRage = () => {
  const now = new Date();

  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const startOfMonth = new Date(year, month - 1, 1);
  const startOfNextMonth = new Date(year, month, 1);
  return {
    month,
    start: startOfMonth,
    end: startOfNextMonth,
    year,
  };
};
