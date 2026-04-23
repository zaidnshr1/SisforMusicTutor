import prisma from "../../config/prisma";
import bcrypt from "bcrypt"
import crypto from "crypto";
import transport from "../../config/mailer";
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

export const verifyEmailToken = async (token) => {
    const user = await prisma.user.findUnique({where : {verificationToken: token}});

    if (!user) {
        throw new Error("token tidak valid atau sudah digunakan");
    }

    return prisma.user.update({
        where: {
            isVerified: true,
            verificationToken: null
            // Logika untuk menghapus user yang tidak terverifikasi
            // setelah beberapa jam sebaiknya diimplementasikan
            // menggunakan cron job atau scheduled task yang berjalan secara periodik.
            // Ini adalah fitur lanjutan yang bisa ditambahkan setelah fungsionalitas inti selesai.
        }
    });
}

export const userLogin = async (email, password) => {
    const user = await prisma.user.findUnique({where: {email}});

    if (!user) {
        throw new Error("email atau password salah");
    }

    if (!user.isVerified) {
        throw new Error("Akun anda belum terverfikasi. Silahkan cek email anda")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("email atau password salah");
    }

    return user;
}