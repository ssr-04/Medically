"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action"

import { MedicationStatus } from "@prisma/client"; 
import { revalidatePath } from "next/cache";


export const getAllConditions = async() => {
    try {
        const userId = await getDbUserId();
        if(!userId) return [];

        const conditions = await prisma.condition.findMany({
            where:{
                userId: userId
            },
            include:{
                medications:true
            }
        })
        
        return conditions;
    } catch (error) {
        console.log("Error in fetching conditions",error);
    }
}

// Define the type for the medication form data if needed
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
  
  export const addCondition = async ({
    conditionName,
    description,
    medications,
  }: {
    conditionName: string;
    description: string;
    medications: MedicationForm[];
  }) => {
    try {
      const userId = await getDbUserId();
      if (!userId) {
        throw new Error("User not found");
      }
  
      // Map each medication to match the Prisma Medication model
      const medicationData = medications.map((med) => ({
        name: med.name,
        height: med.height,
        width: med.width,
        currentCount: med.currentCount,
        extraAvailable: med.extraAvailable,
        prescriptionDuration: med.prescriptionDuration,
        prescriptionDays: med.prescriptionDays ?? null,
        startDate: med.startDate ? new Date(med.startDate) : null,
        endDate: med.endDate ? new Date(med.endDate) : null,
        instructions: med.instructions || null,
        status: med.status as MedicationStatus,
      }));
  
      // Create a new Condition with nested Medication records
      const condition = await prisma.condition.create({
        data: {
          name: conditionName,
          description,
          user: { connect: { id: userId } },
          medications: {
            create: medicationData,
          },
        },
        include: {
          medications: true,
        },
      });
      revalidatePath("/conditions")
      return condition;
    } catch (error) {
      console.error("Error adding condition", error);
      throw error;
    }
  };

export const deleteCondition = async(conditionId:number) => {
    try {
        await prisma.condition.delete({
            where:{
                id: conditionId
            }
        })
        revalidatePath("/conditions")
    } catch (error) {
        console.error("Error deleting condition:", error)
        throw new Error("Something went wrong")
    }
}