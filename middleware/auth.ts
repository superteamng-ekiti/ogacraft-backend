import { type NextFunction, type Request, type Response } from "express";
import UserSchema, {
  category_list,
  type IAccountype,
  type IUser,
  type category
} from "../schema/Schema.ts";
import { privy } from "../utils/privy.ts";
import { PRIVY_VERIFICATION_KEY } from "../utils/environment.ts";

const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const auth_header = req.headers["authorization"];

    if (!email) {
      res.status(409).json({
        response: "please provide email in body",
        message: "something went wrong trying to find you"
      });
      return;
    }

    if (!auth_header || !auth_header.startsWith("Bearer ")) {
      res.status(409).json({
        response: "please provide auth in header",
        message: "authentication token missing or malformed"
      });
      return;
    }

    const auth_token = auth_header.replace(/^Bearer\s+/i, "").trim(); // ✅ Extract token only
    // console.log("Token to verify:", auth_token);

    // console.log(PRIVY_VERIFICATION_KEY);
    try {
      const verifiedClaims = await privy.verifyAuthToken(
        auth_token,
        PRIVY_VERIFICATION_KEY
      );
      console.log("Verified claims:", verifiedClaims);
    } catch (error) {
      res.status(409).json({
        response: "error occured while verifyuing",
        message: error.toString()
      });
      return;
    }

    const existing_user = await UserSchema.findOne({ email });

    if (!existing_user) {
      res.status(409).json({
        response: "please make sure you are registered",
        message: "something went wrong trying to find you"
      });
      return;
    }

    // You can attach user or claims to req for downstream use if needed:
    // req.user = verifiedClaims;

    next();
  } catch (error: any) {
    console.error("Auth error:", error);

    res.status(409).json({
      response: "something went wrong " + error.message,
      message: "something went wrong trying to authenticate"
    });
    return;
  }
};

const authenticated_signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const auth_header = req.headers["authorization"];

    if (!email) {
      res.status(409).json({
        response: "please provide email in body",
        message: "something went wrong trying to find you"
      });
      return;
    }

    if (!auth_header || !auth_header.startsWith("Bearer ")) {
      res.status(409).json({
        response: "please provide auth in header",
        message: "authentication token missing or malformed"
      });
      return;
    }

    const auth_token = auth_header.replace(/^Bearer\s+/i, "").trim(); // ✅ Extract token only
    // console.log("Token to verify:", auth_token);

    // console.log(PRIVY_VERIFICATION_KEY);
    try {
      const verifiedClaims = await privy.verifyAuthToken(
        auth_token,
        PRIVY_VERIFICATION_KEY
      );
      console.log("Verified claims:", verifiedClaims);
    } catch (error) {
      res.status(409).json({
        response: "error occured while verifyuing",
        message: error.toString()
      });
      return;
    }

    // const existing_user = await UserSchema.findOne({ email });

    // if (!existing_user) {
    //   res.status(409).json({
    //     response: "please make sure you are registered",
    //     message: "something went wrong trying to find you"
    //   });
    //   return;
    // }

    // You can attach user or claims to req for downstream use if needed:
    // req.user = verifiedClaims;

    next();
  } catch (error: any) {
    console.error("Auth error:", error);

    res.status(409).json({
      response: "something went wrong " + error.message,
      message: "something went wrong trying to authenticate"
    });
    return;
  }
};

export { authenticated, authenticated_signup };
