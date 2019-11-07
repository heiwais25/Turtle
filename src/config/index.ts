import dotenv from "dotenv";
dotenv.config();

export default {
  UPGRADE_EXTENSIONS: process.env.UPGRADE_EXTENSIONS,
  NODE_ENV: process.env.NODE_ENV,
  ELECTRON_DISABLE_SECURITY_WARNINGS:
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS
};
