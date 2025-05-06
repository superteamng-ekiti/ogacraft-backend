import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const MONGO_URI = env.MONGO_URI || "";
const PORT = env.PORT;
const PRIVY_APP_ID = env.PRIVY_APP_ID;
const PRIVY_APP_SECRET = env.PRIVY_APP_SECRET;
const PRIVY_VERIFICATION_KEY = env.PRIVY_VERIFICATION_KEY;

export {
  MONGO_URI,
  PORT,
  PRIVY_APP_ID,
  PRIVY_APP_SECRET,
  PRIVY_VERIFICATION_KEY
};
