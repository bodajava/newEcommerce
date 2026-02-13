import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface User {
        id: string;
        user: {
            name: string;
            email: string;
            rol: string;
        };
        token: string;
    }

    interface Session {
        user: {
            name: string;
            email: string;
            rol: string;
        };
        token?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        user?: {
            name: string;
            email: string;
            rol: string;
        };
        token?: string;
    }
}
