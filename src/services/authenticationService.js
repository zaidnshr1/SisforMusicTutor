import prisma from "../config/prisma";
import bcrypt from "bcrypt"
import crypto from "crypto";
import transport from "../config/mailer";
import { profile } from "console";
import { create } from "domain";

export const registerUser = async (userData) => {
    const {fullName, email, password, role} = userData;

    const existingUser = await prisma.user.findUnique({where : {email}});
    if (existingUser) {
        throw new Error("email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = await crypto.randomBytes(32).toString("hex");

    const user = prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role,
            verificationToken,
            profile: {
                create: {
                    fullName
                }
            }
        }
    })

    const verificationLink = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;
    await transport.sendMail({
        from: process.env.MAIL_FROM,
        to: user.email,
        subject: "Verifikasi Akun Aksaranada Anda",
        html: `
        <h1>Selamat Datang Bersama Aksaranada!</h1>
        <p>Silahkan klik link di bawah ini untuk mengaktifkan akun anda:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        `
    })

    return user;
}

