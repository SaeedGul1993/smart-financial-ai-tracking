import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "../errors/appError";
import { RecurringFrequency } from "../generated/prisma/enums";

export const calculateNextRunDate = (date: Date, frequency: string) => {
  const nextDate = new Date(date);
  switch (frequency) {
    case RecurringFrequency.DAILY:
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case RecurringFrequency.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case RecurringFrequency.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case RecurringFrequency.YEARLY:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid frequency");
  }
  return nextDate;
};

export const getNextValidRunDate = (
  nextRunDate: Date,
  frequency: RecurringFrequency,
) => {
  let date = new Date(nextRunDate);
  const now = new Date();
  while (date < now) {
    date = calculateNextRunDate(date, frequency);
  }
  return date;
};
