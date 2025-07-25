import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = process.env.ALLOWD_HOSTS.split(",")
  .map(origin => origin.trim().replace(/\/$/, "")); // Trim dan hapus trailing slash

console.log(allowedOrigins);

export const corsOptions = {
  origin: (origin, callback) => {
    const normalizedOrigin = origin?.trim().replace(/\/$/, "");
    if (allowedOrigins.includes(normalizedOrigin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};