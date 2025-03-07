"use server"
import { prisma } from "@/lib/prisma"
import { getDbUserId } from "./user.action"
import { DoseLog, DoseStatus, Medication } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getAllUpcomingMeds = async () => {
    const userId = await getDbUserId();
    if(!userId) return;
    try {
        const medications = await prisma.medication.findMany({
            where: {
                condition: {
                    userId: userId, // Filtering by userId through the Condition model
                },
                doseLogs: {
                    some: {
                        status: "PENDING",
                    },
                },
            },
            include: {
                doseLogs: {
                    where: { status: "PENDING" }, // ✅ Only include "PENDING" dose logs
                    orderBy: {
                        scheduledTime: "asc", // Sort doseLogs inside each medication
                    },
                },
            },
        });

        // Sort medications by the earliest dose log in JavaScript
        medications.sort((a, b) => {
            const aNextDose = a.doseLogs.length > 0 ? new Date(a.doseLogs[0].scheduledTime).getTime() : Infinity;
            const bNextDose = b.doseLogs.length > 0 ? new Date(b.doseLogs[0].scheduledTime).getTime() : Infinity;
            return aNextDose - bNextDose;
        });

        return medications;
    } catch (error) {
        console.log("Error fetching upcoming medications:", error);
        return [];
    }
};

export const updateLog = async(medication:Medication, doseLog: DoseLog, status:DoseStatus) => {
    let updateCount = medication.currentCount;
    let extra = medication.extraAvailable;
    if(updateCount===1){
        updateCount = medication.height * medication.width;
        extra -= 1
    }else{
        updateCount -= 1
    }
    if(status=="TAKEN"){
        var nextDose = new Date();
        nextDose.setHours(nextDose.getHours() + medication.prescriptionDuration);
        // console.log(nextDose.toLocaleString(), status);
    }else{
        var nextDose = new Date(doseLog.scheduledTime);
        nextDose.setHours(nextDose.getHours() + medication.prescriptionDuration);
        // console.log(nextDose.toLocaleString(), status);
    }

    
    try {
        await prisma.$transaction(async (tx) => {
            await tx.doseLog.update({
                where: {
                    id: doseLog.id
                },
                data: {
                    status,
                    takenTime: new Date()
                }
            });
            if(status==="TAKEN"){
                await tx.medication.update({
                    where:{
                        id: medication.id
                    },
                    data:{
                        currentCount: updateCount,
                        extraAvailable: extra,
                    }
                })
            }
            await tx.doseLog.create({
                data:{
                    medicationId: medication.id,
                    scheduledTime: nextDose,
                    status: "PENDING"
                }
            })
        })

        revalidatePath("/")
    } catch (error) {
        console.log("Error updating medication Logs:", error)
        throw new Error("Error updating medication Logs")
    }
        
}