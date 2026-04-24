import prisma from "../config/prisma.js";

export const isAuthenticated = async (req, res, next) => {

    if (req.session.userId) {
        try {
            const user = await prisma.user.findUnique({
                where: {id: req.session.userId},
                select: {id: true, email: true, role: true}
            });

            if (user) {
                req.user = user;
                return next();
            }
        } catch (error) {
            return next(error);
        }
    }

    return res.render("auth/login", {
        oldData: req.body,
        title: login,
        error: "email atau password salah"
    });
    
}