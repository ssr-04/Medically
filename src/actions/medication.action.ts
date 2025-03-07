"use server";

import { prisma } from "@/lib/prisma";
import { Medication, MedicationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

interface MedicationForm {
  name: string;
  height: number;
  width: number;
  currentCount: number;
  extraAvailable: number;
  prescriptionDuration: number;
  prescriptionDays?: number;
  startDate?: string;
  endDate?: string;
  instructions?: string;
  status: string;
}

export const addMedicationAction = async (medications: MedicationForm[], conditionId: number) => {
  try {
    const condition = await prisma.condition.findUnique({
        where: {
          id: conditionId,
        },
      });
  
      if (!condition) {
        throw new Error("Condition not found");
      }
  
    // Add medications in a transaction to ensure consistency
    const addedMedications = await prisma.medication.createMany({
      data: medications.map((medication) => ({
        name: medication.name,
        height: medication.height,
        width: medication.width,
        currentCount: medication.currentCount,
        extraAvailable: medication.extraAvailable,
        prescriptionDuration: medication.prescriptionDuration,
        prescriptionDays: medication.prescriptionDays,
        startDate: medication.startDate ? new Date(medication.startDate) : null,
        endDate: medication.endDate ? new Date(medication.endDate) : null,
        instructions: medication.instructions,
        status: medication.status as MedicationStatus,
        conditionId: conditionId,
      })),
    });
    revalidatePath("/conditions")
    console.log("Medications added:", addedMedications);
    return addedMedications;
  } catch (error) {
    console.error("Error adding medications:", error);
    throw new Error("Failed to add medications");
  }
};

export const deleteMedication = async(MedicationId:number) => {
    try {
        await prisma.medication.delete({
            where:{
                id: MedicationId
            }
        })
        revalidatePath("/conditions")
    } catch (error) {
        console.error("Error deleting medication:", error)
        throw new Error("Something went wrong")
    }
}

export const getAllMedications = async() => {
  const userId = await getDbUserId();
  
  try {
    const medications = await prisma.medication.findMany({
      where: {
        condition: {
          userId: userId, // Filtering by userId through the Condition model
        },
      },
      include: {
        doseLogs: true, // Include dose logs
      },
    });
    const seperatedMedications = medications.reduce(
      (acc, medication) => {
        acc[medication.status].push(medication);
        return acc
      },
      { ACTIVE: [], PAUSED: [], COMPLETED: [] } as Record<
        "ACTIVE" | "PAUSED" | "COMPLETED",
        Medication[]
      >
    )
    return seperatedMedications
  } catch (error) {
    console.error("Error fetching medications:", error);
    throw new Error("Could not fetch medications.");
  }
}

export const changeMedicationStatus = async(medicationId:number, status:MedicationStatus) => {
  try {
    if(status==="ACTIVE"){
      await prisma.$transaction(async (tx) => {
        await tx.medication.update({
          where:{
            id: medicationId
          },
          data:{
            status
          }
        });

        await tx.doseLog.create({
          data: {
            medicationId: medicationId,
            scheduledTime: new Date(),
            status:"PENDING"
          }
        })
      })
    }
    else if(status==="COMPLETED" || status==="PAUSED"){
      await prisma.$transaction(async (tx) => {
        await tx.medication.update({
          where:{
            id: medicationId
          },
          data:{
            status: status
          }
        });

        await tx.doseLog.updateMany({
          where:{
            medicationId,
            status: "PENDING"
          },
          data:{
            status: "SKIPPED"
          }
        })
      })
    }
    
    revalidatePath("/medications");
    return {success: true}
  } catch (error) {
    console.log("Unable to update status:", error)
    throw new Error("Unable to update status")
  }
}

export const updateMedication = async(medicationId:number, currentCount:number, extraAvailable:number) => {
  try {
    await prisma.medication.update({
      where:{
        id: medicationId
      },
      data:{
        currentCount,
        extraAvailable
      }
    })
    revalidatePath("/medications")
    return {success:true}
  } catch (error) {
    console.log("Error in updating medication", error)
    throw new Error("Error in updating medication")
  }
}