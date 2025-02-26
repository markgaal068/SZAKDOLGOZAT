import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import { compare } from "bcryptjs";

// MongoDB kapcsolatot itt egyszer hozunk létre, nem minden egyes kéréseknél
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = MongoClient.connect(
            process.env.MONGODB_URI, // Használj környezeti változót a MongoDB URL-hez
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, use a regular variable
    clientPromise = MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Felhasználónév", type: "text" },
                password: { label: "Jelszó", type: "password" },
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db("kinizsi");
                const usersCollection = db.collection("users");

                const user = await usersCollection.findOne({ username: credentials.username });

                if (!user) {
                    console.log("Felhasználó nem található!");
                    throw new Error("Nincs ilyen felhasználó");
                }


                const isValid = await compare(credentials.password, user.password);

                if (!isValid) {
                    console.log("Hibás jelszó!");
                    throw new Error("Hibás jelszó");
                }


                return { id: user._id, name: user.username };
            },
        }),
    ],
    session: {
        strategy: "jwt", // JWT token alapú session kezelés
    },
    secret: process.env.NEXTAUTH_SECRET || "s3cureR@nd0mK3y!1234", // A titkos kulcsot környezeti változóban tárold
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            return session;
        }
    },
});
