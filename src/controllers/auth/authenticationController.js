import authService from "../../services/auth/authenticationService"

export const showRegisterForm = (req, res) => {
    res.render("auth/register", {title: register, error: null});
}

export const register = async (req, res) => {
    try {
        await authService.registerUser(req.body);
        res.send("Registrasi berhasil! Silahkan cek email Anda untuk verifikasi.");
    } catch (error) {
        res.render("auth/register", {title: register, error: error.message});
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const {token} = req.query;
        await authService.verifyEmailToken(token);
        res.send("Email berhasil diverifikasi! Anda sekarang bisa login.")
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const showLoginForm = (req, res) => {
    res.render("auth/login", {title: "login", error: null});
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.userLogin(email, password);

        req.session.userId = user.id;
        req.session.userRole = user.role;

        res.redirect("/dashboard");
    } catch (error) {
        res.render("/auth/login", {title: login, error: error.message});
    }
}