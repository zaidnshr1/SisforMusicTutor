export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            const firstError = error.errors[0].message();

            const isRegister = req.username !== undefined;
            const viewPath = isRegister ? "auth/register" : "auth/login";
            const titlePage = IsRegister ? "Register" : "Login";

            return res.status(400).render(viewPath, {
                title: titlePage,
                error: firstError,
                oldData: req.body
            });
        }
    }
}