import { User } from "../models/user.model.js";

export const getAllUsers = async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({message:'success',users})
    } catch (error) {
        console.log('error in getting all user:',error)
        res.status(500).json({message:'something went wrong!'})
    }
};
