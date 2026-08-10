import { HTTP_STATUS } from "../../constants/httpStatus";
import { AppError } from "../../errors/appError";
import { User, UserRepository } from "./user.repository";

const userRepository = new UserRepository();

export const getUserProfileService = async (userId: string) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");
  return user;
};

export const updateUserProfileService = async (userId: string, data: User) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");
  return await userRepository.updateProfile(userId, data);
};
