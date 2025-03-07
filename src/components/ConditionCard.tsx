"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import toast from "react-hot-toast";
import { deleteCondition } from "@/actions/condition.action";
import AddMedicationDialog from "./AddMedication";
import { deleteMedication } from "@/actions/medication.action";
import { useRouter } from "next/navigation";


export type MedicationType = {
  id: number;
  name: string;
  currentCount: number;
  extraAvailable: number;
  prescriptionDuration: number;
  prescriptionDays?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  instructions?: string | null;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
};

export type ConditionType = {
  id: number;
  name: string;
  description?: string | null;
  medications: MedicationType[];
};

const ConditionCard = ({ condition, mutate}: { condition: ConditionType, mutate: () => void }) => {
  return (
    <Card className="mb-8 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-zinc-500 to-zinc-800 text-white rounded-t-md px-4 py-3">
        <CardTitle className="flex justify-between">
          <h3 className="text-xl font-bold">{condition.name}</h3>
          <DeleteConditionDialog conditionName={condition.name} conditionId={condition.id} mutate={mutate}/>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-6">
        {condition.description && (
          <p className="mb-6 text-muted-foreground">{condition.description}</p>
        )}
        <h3 className="mb-4 text-lg font-medium">Medications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {condition.medications.map((med) => (
            <Card key={med.id} className="shadow-md hover:bg-zinc-800 hover:border hover:border-zinc-400">
              <CardHeader className="bg-grey-500 px-3 py-2">
                <CardTitle className="flex justify-between">
                  <h3 className="text-lg font-medium ">{med.name}</h3>
                  <DeleteMedicationDialog MedicationId={med.id} MedicationName={med.name} mutate={mutate}/>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Count:</span>{" "}
                  {med.currentCount}
                </p>
                <p className="mt-2 text-sm text-gray-600">Every {med.prescriptionDuration} hours</p>
              </CardContent>
            </Card>
          ))}
          <AddMedicationDialog conditionId={condition.id} mutate={mutate}/>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConditionCard;

const DeleteConditionDialog = ({conditionId, conditionName, mutate}:{conditionId:number, conditionName:string, mutate: () => void}) => {
  const router = useRouter();

  const handleConditionDelete = async(conditionId:number) => {
    try {
      deleteCondition(conditionId)
      toast.success("Condition deleted successfully")
      mutate();
    } catch (error:any) {
      toast.error(error)
    }
  }

  return(
      <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="hover:bg-red-500">
              <Trash2Icon className=""/>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are you sure that you wanna remove condition - {conditionName}?</AlertDialogTitle>
              <AlertDialogDescription>
                  This action cannot be undone. This will remove the condition and associated medications
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleConditionDelete(conditionId)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
          </AlertDialog>
  )
}

const DeleteMedicationDialog = ({MedicationId, MedicationName, mutate}:{MedicationId:number, MedicationName:string, mutate: ()=> void}) => {
  const router = useRouter();

  const handleMedicationDelete = async(MedicationId:number) => {
    try {
      deleteMedication(MedicationId)
      toast.success("Medication deleted successfully")
      mutate();
    } catch (error:any) {
      toast.error(error)
    }
  }
  
  return(
      <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="hover:bg-red-500">
              <Trash2Icon/>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are you sure that you wanna remove {MedicationName}?</AlertDialogTitle>
              <AlertDialogDescription>
                  This action cannot be undone. This will remove the medication
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleMedicationDelete(MedicationId)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
          </AlertDialog>
  )
}