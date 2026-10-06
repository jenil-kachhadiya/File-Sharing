import jwt from "jsonwebtoken";

export const receiverAuth = (req, res, next) => {
    try {
        const token = req.cookies.receiverToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Receiver access required",
            });
        }
        const decoded = jwt.verify(
            token, process.env.JWT_SECRET
        );

        if (decoded.accessType !== "receiver") {
            return res.status(403).json({
                success: false,
                message: "Invalid receiver access",
            });
        }
        req.receiver = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Receiver session expired",
        });
    }
};