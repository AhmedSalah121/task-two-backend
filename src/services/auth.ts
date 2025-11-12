import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { IUserRepository } from '../models';

type User = {
    id: string;
    email: string;
    username: string;
    password?: string;
    role?: string;
    [key: string]: any;
};

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);
const JWT_SECRET: string = process.env.JWT_SECRET || 'make-sure-its-not-empty';

function stripPassword(user: User) {
    const { password, ...rest } = user;
    return rest as Omit<User, "password">;
}

export function makeAuthService(userRepository: IUserRepository) {
    async function generateToken(user: User) {
        const payload = { id: user.id, email: user.email, username: user.username, role: user.role };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    }

    async function register(payload: { email: string; username: string; password: string; [k: string]: any }) {
        const existingEmail = await userRepository.findByEmail(payload.email);
        if (existingEmail) throw new Error("Email already in use");

        const existingUsername = await userRepository.findByUsername(payload.username);
        if (existingUsername) throw new Error("Username already in use");

        const hashed = await bcrypt.hash(payload.password, SALT_ROUNDS);
        const created = await userRepository.create({ ...payload, password: hashed });

        const token = await generateToken(created);
        return { user: stripPassword(created), token };
    }

    async function login(payload: { username: string; password: string }) {
        const user = await userRepository.findByUsername(payload.username);
        if (!user) throw new Error("Invalid credentials");

        const ok = await bcrypt.compare(payload.password, user.password || "");
        if (!ok) throw new Error("Invalid credentials");

        const token = await generateToken(user);
        return { user: stripPassword(user), token };
    }

    return { register, login, generateToken };
}

export default makeAuthService;
