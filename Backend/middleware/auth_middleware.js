// import { ApiResponse } from "./utils/apiresponse.js";
import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from "../utils/async.js";
import jwt from "jsonwebtoken";
import { User } from "../user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    console.log(req.cookies);

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    console.log(req.cookies);
    console.log(token);
    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});
