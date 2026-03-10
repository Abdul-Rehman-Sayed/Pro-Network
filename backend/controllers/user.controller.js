import User from "./../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "./../models/profile.model.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import mongoose from "mongoose";
import ConnectionRequest from "./../models/connections.model.js";

const convertUserDataTOPDF = async (userData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 60, size: "A4" });
      const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
      const stream = fs.createWriteStream("uploads/" + outputPath);

      stream.on("error", (err) =>
        reject(new Error("Failed to create PDF file: " + err.message)),
      );
      doc.on("error", (err) =>
        reject(new Error("PDF generation error: " + err.message)),
      );
      doc.pipe(stream);

      const profilePicPath = `uploads/${userData.userId.profilePic}`;
      if (fs.existsSync(profilePicPath)) {
        try {
          doc.image(profilePicPath, 60, 60, { width: 72, height: 72 });
        } catch (e) {
          console.warn("Could not add profile picture:", e.message);
        }
      }

      doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .text(userData.userId.name || "Unknown", 148, 68);
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`@${userData.userId.username}`, 148, 96);
      doc.fontSize(11).text(userData.userId.email, 148, 112);

      doc.moveDown(3);
      doc
        .moveTo(60, doc.y)
        .lineTo(doc.page.width - 60, doc.y)
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(1.5);

      doc.fontSize(9).font("Helvetica-Bold").text("ABOUT", 60);
      doc.moveDown(0.5);
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(userData.bio || "No bio provided.", 60);
      doc.moveDown(1.5);

      doc.fontSize(9).font("Helvetica-Bold").text("DETAILS", 60);
      doc.moveDown(0.5);
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Current Position: ${userData.currentPost || "N/A"}`, 60);
      doc.moveDown(1.5);

      doc
        .moveTo(60, doc.y)
        .lineTo(doc.page.width - 60, doc.y)
        .lineWidth(0.25)
        .stroke();
      doc.moveDown(1.5);

      doc.fontSize(9).font("Helvetica-Bold").text("WORK EXPERIENCE", 60);
      doc.moveDown(0.5);

      if (userData.pastWork && userData.pastWork.length > 0) {
        userData.pastWork.forEach((work, index) => {
          doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .text(work.company || "Unknown Company", 60);
          doc
            .fontSize(11)
            .font("Helvetica-Oblique")
            .text(work.position || "N/A", 60);
          doc
            .fontSize(10)
            .font("Helvetica")
            .text(`Duration: ${work.years || "N/A"} years`, 60);
          if (index < userData.pastWork.length - 1) doc.moveDown(1);
        });
      } else {
        doc
          .fontSize(11)
          .font("Helvetica")
          .text("No past work experience recorded.", 60);
      }

      doc.end();
      stream.on("finish", () => resolve(outputPath));
    } catch (error) {
      reject(error);
    }
  });
};
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });

    await profile.save();
    return res.json({ message: "User Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });

    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    user.profilePic = req.file.filename;

    await user.save();

    return res.json({ message: "Profile Picture Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token: token });

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User already exists" });
      }
    }
    Object.assign(user, newUserData);

    await user.save();

    return res.json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch profile and include selected user details using populate
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePic",
    );

    return res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileToUpdate = await Profile.findOne({ userId: userProfile._id });
    Object.assign(profileToUpdate, newProfileData);

    await profileToUpdate.save();

    return res.json({ message: "Profile Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePic",
    );
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePic",
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const outputPath = await convertUserDataTOPDF(userProfile);
    return res.json({ message: outputPath });
  } catch (error) {
    console.error("Download profile error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to generate PDF" });
  }
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "Request Sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionRequests = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePic");
    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const allMyConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePic");

    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connection = await ConnectionRequest.findOne({ _id: requestId });
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }
    await connection.save();
    return res.json({ message: "Request Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePic",
    );
    return res.json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
