import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string,
  ) as JwtPayload;
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "14d",
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string,
  ) as JwtPayload;
};
