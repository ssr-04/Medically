"use client";
import { getAllUpcomingMeds, updateLog } from '@/actions/home.action'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from './ui/alert-dialog';
import MedicationStrip from './MedicationStrip';
import { getNoOfDays } from '@/lib/helper';
import { Button } from './ui/button';
import { DoseLog, DoseStatus, Medication } from '@prisma/client';
import Timer from './Timer';
import toast from 'react-hot-toast';

type UpcomingMeds = Awaited<ReturnType<typeof getAllUpcomingMeds>>
type MedicationProps = NonNullable<UpcomingMeds>[number];

const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const UpcomingMedicationCard = ({medication}:{medication:MedicationProps}) => {
  const [diabled, setdiabled] = useState(false);
  const dose = medication.doseLogs[0];
  const thresholdTime = new Date(dose.scheduledTime);
  thresholdTime.setHours(thresholdTime.getHours() - 1); //Can Take 1 hour before

  useEffect(() => {
    const updateDiabled = () => {
        setdiabled(new Date() < thresholdTime);
    }
    updateDiabled();
    const interval = setInterval(updateDiabled, 60000);

    return () => clearInterval(interval)
  },[dose])

  return (
    <Card className='shadow-lg border border-zinc-600 flex flex-col justify-between'>
    <CardHeader className="bg-gradient-to-r from-zinc-500 to-zinc-800 text-white rounded-t-md px-4 py-3">
        <CardTitle className='flex justify-between'>
            <h3 className="text-xl font-bold">{medication.name}</h3>
        </CardTitle>
    </CardHeader>
    <CardContent className="mt-3 flex flex-col gap-2 items-center">
        <Timer doseLog={medication.doseLogs}/>
        <MedicationStrip height={medication.height} width={medication.width} currentCount={medication.currentCount}/>
        <p className="text-bold mt-1">
            Scheduled date: {formatDate(medication.doseLogs[0].scheduledTime)}
        </p>
        <p>
            Scheduled time: {formatTime(medication.doseLogs[0].scheduledTime)}
        </p>
        <p className='mt-2 text-bold text-muted-foreground'>Current count: {medication.currentCount}</p>
        <p className='text-bold text-muted-foreground'>Extra Strips: {medication.extraAvailable}</p>
        <p className='text-bold text-muted-foreground'>Frequency: every {medication.prescriptionDuration} hours</p>
        <p className='text-bold text-muted-foreground'>No of Days: {getNoOfDays(medication.height, medication.width, medication.currentCount, medication.extraAvailable, medication.prescriptionDuration)}</p>
    </CardContent>
    <CardFooter className='p-3 flex justify-between bg-zinc-800 items-center'>
        <AlertDialogBox ButtonName='Taken' variant="default" medication={medication} dose={medication.doseLogs[0]} status="TAKEN" disabled={diabled}/>
        <AlertDialogBox ButtonName='Missed' variant="outline" medication={medication} dose={medication.doseLogs[0]} status="MISSED" disabled={diabled}/>
        <AlertDialogBox ButtonName='Skipped' variant="outline" medication={medication} dose={medication.doseLogs[0]} status="SKIPPED" disabled={diabled}/>
    </CardFooter>
    </Card>
  )
}

export default UpcomingMedicationCard;

const AlertDialogBox = ({ButtonName, variant, medication, dose, status, disabled}:{ButtonName: string, variant:"default" | "outline", medication: Medication, dose:DoseLog, status:DoseStatus, disabled:boolean}) => {
    const nextDose = new Date(dose.scheduledTime);
    if(status==="MISSED" || status==="SKIPPED"){
        nextDose.setHours(dose.scheduledTime.getHours() + medication.prescriptionDuration)
    }

    const handleSubmit = async () => {
        try {
            await updateLog(medication, dose, status);
            toast.success("Log updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        }
    };
    
    return (
        <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant={variant}>{ButtonName}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                {status==="TAKEN" && `This will mark ${medication.name.toUpperCase()} as taken and schedule the next dosage`}
                {status==="MISSED" && `This will mark ${medication.name.toUpperCase()} as missed but don't forget to take the medication on the next schedule ${formatDate(nextDose)} ${formatTime(nextDose)}`}
                {status==="SKIPPED" && `This will mark ${medication.name.toUpperCase()} as missed but remember to take the medication on the next schedule ${formatDate(nextDose)} ${formatTime(nextDose)}`}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={disabled}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    )
}