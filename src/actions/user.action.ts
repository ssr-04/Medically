"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { use } from "react";

export const syncUser = async() => {
    try {
        const {userId} = await auth();
        const user = await currentUser();
        
        if (!userId || !user) return;

        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })

        if(existingUser) return existingUser;

        const dbUser = await prisma.user.create({
            data:{
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                email: user.emailAddresses[0].emailAddress,
            }
        })

        return dbUser;
    } catch (error) {
        console.log("Error in syncUser", error);
    }
}

export const getUserByClerkId = async(clerkId: string) => {
    return prisma.user.findUnique({
        where: {
            clerkId
        }
    })
}

export const getDbUserId = async() => {
    const {userId:clerkId} = await auth();
    if(!clerkId) return;

    const user = await getUserByClerkId(clerkId);

    if(!user) throw new Error("User not found");

    return user.id;
}