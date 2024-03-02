import { User } from "./user.model.js";
import { UserID } from "./userid_schema.js";
import { asyncHandler } from "./utils/async.js";
import { ApiError } from "./utils/apierror.js";
import { ApiResponse } from "./utils/apiresponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (_id) => {
  try {
    console.log("Generating token", _id);
    const user = await User.findById(_id);
    console.log("T");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error");
    throw new ApiError(500, error.message);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, userID } = req.body;

  const existingUser = await UserID.findOne({ userID });
  const existingSignedUpUser = await User.findOne({ userID });

  if (!existingUser) {
    throw new ApiError(404, "User with this id does not exist");
  } else if (existingSignedUpUser) {
    throw new ApiError(409, "User with this id already exists");
  }

  try {
    const user = await User.create({
      email,
      password,
      userID,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
});

// const verifyUID = async (req, res) => {
//   try {
//     console.log("Received Request:", req.body);
//     const { userID } = req.body;

//     if (!userID) {
//       throw new ApiError(400, "UID is required");
//     }

//     const user = await User.findOne({ userID });

//     if (!user) {
//       res.status(200).send("incorrect");
//       console.log("inc");
//       return;
//     }

//     res.status(200).send("correct");
//     console.log("correct");
//   } catch (error) {
//     console.error("Error during UID verification:", error);
//     res.status(200).json({ message: "Internal server error" });
//   }
// };

const loginUser = asyncHandler(async (req, res) => {
  const { userID, password } = req.body;
  console.log(userID);
  console.log("hii");
  if (!userID) {
    throw new ApiError(400, "userID REQUIRED");
  }

  const user = await User.findOne({ userID });
  if (!user) {
    throw new ApiError(404, "User does not exist");

  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "success"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log("HERE BACK");
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", newRefreshToken)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching IDs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { registerUser, loginUser, logoutUser, refreshAccessToken, getAllUsers };
