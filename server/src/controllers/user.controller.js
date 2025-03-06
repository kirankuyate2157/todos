import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); //i validating it  no need to again validation so .
        return { accessToken, refreshToken };
    } catch (error) { }
};


const registration = asyncHandler(async (req, res) => {
    /*
      - get user details from frontend
      - validations - check it not empty
      - check if user already exists: user ,email
      - check for images ,check for avatar
      - uploads them to cloudinary or S3 , avatar
      - create user object - create entry in DB
      - remove password and refresh token field from responses
      - check for user creation
      - return res
      */
    const { username, email, password, fullName } = req.body;
    console.log({
        email: email,
        username: username,
        password: password,
        fullName: fullName,
    });

    if (
        [fullName, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "field is missing or empty 🫠");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        throw new ApiError(409, "User with mail or  username already exists 🫠");
    }


    console.log("Uploading imges : ", req?.files);
    const avatarLocalPath = req?.files?.avatar?.length ? req?.files?.avatar[0]?.path : null
    let avatar = null;
    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath);
    }
    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        avatar: avatar?.url || "",
        email,
        password,
    });

    const createdUser = await User.findById(user.id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong 🫠 while registering user");
    }
    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registered Successfully ✅"));
});

const loginUser = asyncHandler(async (req, res) => {
    /* 
  - req body data
  - find username email in DB
  - check password match
  - if match make  refresh token send data with it 
  - send cookies
  */

    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "username or email is required 🫠..");
    }
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        throw new ApiError(404, "user does not exist .🫠..");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials 🫠..");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );
    const loggedUser = await User.findById(user._id).select(
        "-password -refreshToken "
    );

    const options = { httpOnly: true, secure: true, sameSite: "Lax", maxAge: 7 * 24 * 60 * 60 * 1000, }; //only modifiable  by server

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedUser, accessToken, refreshToken },
                "user logged in successfully ✅"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    /*
    use cookies to find user 
    find user by id
    clear cookies and refreshToken of user
    */
    console.log("User: ", req.user)
    User.findByIdAndUpdate(
        req.user._id,
        {
            // $set: { refreshToken: undefined },
            $unset: {
                refreshToken: 1 //this will removes refreshToken from document 
            }
        },
        { new: true }
    );

    const options = { httpOnly: true, secure: true }; //only modifiable  by server

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logout in successfully ✅"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "user fetched successfully ✅"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { email, fullName } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All field are required 🫠");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { fullName: fullName, email: email },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully ✅")
        );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError("400", "Avatar file is missing 🫠");
    }

    //delete old image is pending
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError("404", "Error while uploading on avatar 🫠 ");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { avatar: avatar.url },
        },
        { new: true }
    ).select("-password");
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar image updated successfully ✅"));
});

const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {};

    if (search.trim()) {
        query.$or = [
            { username: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } }
        ];
    }

    const users = await User.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .select("-password -refreshToken");

    const totalUsers = await User.countDocuments(query);

    return res.status(200).json(new ApiResponse(200, { page, users, total_pages: Math.ceil(totalUsers / limit) }, "Users fetched successfully ✅"));
});

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found 🫠");
    }

    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully ✅"));
});

export {
    registration, loginUser, logoutUser, getCurrentUser, updateAccountDetails, updateUserAvatar, getUserById, getAllUsers
}