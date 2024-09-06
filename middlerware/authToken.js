import jwt from "jsonwebtoken";

async function authToken(req, res, next) {
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "User not authenticated",
                error: true,
                success: false,
            });
        }

        jwt.verify(accessToken, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                console.log("JWT Error:", err);
                return res.status(403).json({
                    message: "Invalid or expired token",
                    error: true,
                    success: false,
                });
            }

            // Initialize req.user if it's undefined
            req.user = req.user || {};
            req.user.id = decoded?._id;

            next();
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || error,
            data: [],
        });
    }
}

export default authToken;
