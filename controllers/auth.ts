import { type NextFunction, type Request, type Response } from "express";
import UserSchema, {
  category_list,
  type IAccountype,
  type IUser,
  type category
} from "../schema/Schema.ts";
import { privy } from "../utils/privy.ts";
import { PRIVY_VERIFICATION_KEY } from "../utils/environment.ts";

const auth_controller = async (req: Request, res: Response) => {
  try {
    const { email, gender, first_name, last_name, location } = req.body;
    if (!email) {
      res.status(409).json({
        response: "something went wrong trying to register you",
        message: "please provide email"
      });
    }

    const existing_user = await UserSchema.findOne({ email });

    if (existing_user) {
      res.status(200).json({
        response: existing_user,
        message: "that went well.. 🙂"
      });
      return;
    } else {
      const new_user = new UserSchema({
        email,
        gender,
        first_name,
        last_name,
        location,
        account_type: "client"
      });
      await new_user.save();
      res.status(200).json({
        response: "that went well.. 🙂",
        message: "successfully registered 🎊"
      });
      return;
    }
  } catch (error) {
    res.status(409).json({
      response: "something went wrong " + error,
      message: "something went wrong trying to register you"
    });
  }
};

const fetch_user_controller = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    if (!email) {
      res.status(409).json({
        response: "something went wrong trying to find you",
        message: "please provide email"
      });
    }

    const existing_user = await UserSchema.findOne({ email });

    if (existing_user) {
      res.status(200).json({
        response: existing_user,
        message: "that went well.. 🙂"
      });
      return;
    } else {
      res.status(409).json({
        response: "something went wrong trying to find you",
        message: "please try registering"
      });
      return;
    }
  } catch (error) {
    res.status(409).json({
      response: "something went wrong " + error,
      message: "something went wrong trying to find you"
    });
  }
};

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

const update_profile_controller = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const query = req.query;

    if (!email) {
      res.status(400).json({
        response: null,
        message: "please provide email"
      });
      return;
    }

    const updateFields: Partial<IUser> = {};

    if (query.first_name) updateFields.first_name = String(query.first_name);
    if (query.last_name) updateFields.last_name = String(query.last_name);
    if (query.location) updateFields.location = String(query.location);
    if (query.bio) updateFields.profile_description = String(query.bio);
    if (query.profile_picture)
      updateFields.profile_picture = String(query.profile_picture);
    if (query.gender && ["m", "f", "o"].includes(query.gender as string)) {
      updateFields.gender = query.gender as "m" | "f" | "o";
    }

    if (query.categories) {
      const inputCategories = Array.isArray(query.categories)
        ? query.categories
        : String(query.categories).split(",");

      const invalid = inputCategories.filter(
        (cat) => !category_list.includes(cat as category)
      );

      if (invalid.length > 0) {
        res.status(409).json({
          message: `Invalid category: ${invalid.join(", ")}`,
          response: `Invalid category: ${invalid.join(", ")}`
        });
        return;
      }

      updateFields.categories = inputCategories as category[];
    }
    if (query.years_of_experience) {
      updateFields.years_of_experience = Number(query.years_of_experience);
    }
    if (
      query.account_type &&
      ["client", "craftman"].includes(query.account_type as string)
    ) {
      updateFields.account_type = query.account_type as IAccountype;
    }

    const updatedUser = await UserSchema.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        response: null,
        message: "User not found"
      });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
    return;
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({
      response: null,
      message: "Something went wrong updating profile",
      error: err instanceof Error ? err.message : String(err)
    });
    return;
  }
};

export {
  auth_controller,
  fetch_user_controller,
  authenticated,
  update_profile_controller
};
