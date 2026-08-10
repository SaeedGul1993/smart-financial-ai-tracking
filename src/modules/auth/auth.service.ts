import bcrypt from "bcrypt";
import z from "zod";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { AppError } from "../../errors/appError";
import { AuthRepository } from "./auth.repository";
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
} from "./auth.validation";
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "../../utils/jwt";

const authRepository = new AuthRepository();

export const registerService = async (data: z.infer<typeof registerSchema>) => {
  const { email, password } = data;
  const existingUser = await authRepository.findByEmail(email);
  if (existingUser)
    throw new AppError(HTTP_STATUS.CONFLICT, "User already exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  const addUser = await authRepository.create({
    ...data,
    password: hashedPassword,
  });
  return addUser;
};

export const loginService = async (data: z.infer<typeof loginSchema>) => {
  const { email, password } = data;
  const user = await authRepository.findByEmail(email);
  if (!user) throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch)
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid password");
  let tokenPayload = {
    userId: user.id,
    email: user.email,
  };
  const accessToken = generateToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);
  await authRepository.createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
  return { accessToken, refreshToken, user };
};

export const refreshTokenService = async (
  data: z.infer<typeof refreshTokenSchema>,
) => {
  const { refreshToken } = data;
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded)
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
  const storedToken = await authRepository.findRefreshToken(refreshToken);
  if (!storedToken)
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
  if (storedToken.expiresAt < new Date())
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Refresh token expired");
  await authRepository.deleteRefreshToken(refreshToken);
  const newAccessToken = generateToken({
    userId: decoded.userId,
    email: decoded.email,
  });

  const newRefreshToken = generateRefreshToken({
    userId: decoded.userId,
    email: decoded.email,
  });

  await authRepository.createRefreshToken({
    token: newRefreshToken,
    userId: decoded.userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutService = async (data: z.infer<typeof logoutSchema>) => {
  const { refreshToken } = data;
  const storedToken = await authRepository.findRefreshToken(refreshToken);
  if (!storedToken)
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
  if (storedToken.expiresAt < new Date())
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Refresh token expired");
  await authRepository.deleteRefreshToken(refreshToken);
  return null;
};
