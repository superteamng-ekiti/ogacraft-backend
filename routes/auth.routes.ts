import { Router } from "express";
import {
  auth_controller,
  authenticated,
  fetch_user_controller,
  update_profile_controller
} from "../controllers/auth.ts";

const auth_router = Router();

auth_router.post("/", auth_controller);
auth_router.get("/fetch/:email", fetch_user_controller);
auth_router.put("/update-profile", authenticated, update_profile_controller);
// auth_router.get("/gimmie", async (req, res) => {
//   const { id, address, chainType, policyIds, createdAt } =
//     await privy.walletApi.create({
//       chainType: "solana"
//     });

//   console.log({ id, address, chainType, policyIds, createdAt });
//   res.status(200).json({ id, address, chainType, policyIds, createdAt });
//   return;
// });

export { auth_router };
