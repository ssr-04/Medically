import { prisma } from "@/lib/prisma"
import { getDbUserId } from "./user.action"


export const getAllMedLogs = async() => {
    const userId = await getDbUserId();
    if(!userId) return;
    try {
        const medLogs = await prisma.medication.findMany({
            where:{
                condition: {
                    userId
                }
            },
            include:{
                doseLogs:{
                    orderBy:{
                        scheduledTime: "desc"
                    }
                }
            }
        })
        return medLogs
    } catch (error) {
        console.log("Error fetching Medlogs:",error)
        return []
    }
    
    
}