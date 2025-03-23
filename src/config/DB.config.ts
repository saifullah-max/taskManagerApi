import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const localUrl = process.env.LOCAL_URI;
    const remoteUrl = process.env.REMOTE_URI;
    await mongoose.connect(remoteUrl ? remoteUrl : (localUrl as string));
    console.log(
      `${remoteUrl ? "Remote MongoDB COnnected" : "Local MongoDB Connected"}`
    );
  } catch (error) {
    console.log("DBS Connection failed", error);
    process.exit(1);
  }
};
