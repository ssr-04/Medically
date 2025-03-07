"use client";
import { Medication, MedicationStatus } from '@prisma/client'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import MedicationStrip from './MedicationStrip'
import { getNoOfDays } from '@/lib/helper'
import { Button } from './ui/button'
import { changeMedicationStatus } from '@/actions/medication.action'
import toast from 'react-hot-toast';
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from './ui/alert-dialog';
import EditMedication from './EditMedication';

const MedicationCard = ({medication}:{medication:Medication}) => {
  
  return (
    <Card className='shadow-lg border border-zinc-600 flex flex-col justify-between'>
        <CardHeader className="bg-gradient-to-r from-zinc-500 to-zinc-800 text-white rounded-t-md px-4 py-3">
            <CardTitle className='flex justify-between'>
                <h3 className="text-xl font-bold">{medication.name}</h3>
                <EditMedication medication={medication}/>
            </CardTitle>
        </CardHeader>
        <CardContent className="mt-3 flex flex-col gap-2 items-center">
            <MedicationStrip height={medication.height} width={medication.width} currentCount={medication.currentCount}/>
            <p className='mt-2 text-bold text-muted-foreground'>Current count: {medication.currentCount}</p>
            <p className='text-bold text-muted-foreground'>Extra Strips: {medication.extraAvailable}</p>
            <p className='text-bold text-muted-foreground'>Frequency: every {medication.prescriptionDuration} hours</p>
            <p className='text-bold text-muted-foreground'>No of Days: {getNoOfDays(medication.height, medication.width, medication.currentCount, medication.extraAvailable, medication.prescriptionDuration)}</p>
        </CardContent>
        <CardFooter className='p-3 flex justify-between bg-zinc-800 items-center'>
            {medication.status==="ACTIVE" && <>
                <AlertDialogBox ButtonName='Pause' variant='outline' medication={medication} status='PAUSED' />
                <AlertDialogBox ButtonName='Complete' variant='outline' medication={medication} status='COMPLETED' />
            </>}
            {medication.status==="PAUSED" && <>
                <AlertDialogBox ButtonName='Start' variant='default' medication={medication} status='ACTIVE' />
                <AlertDialogBox ButtonName='Complete' variant='outline' medication={medication} status='COMPLETED' />
            </>}
            {medication.status==="COMPLETED" && <>
                <AlertDialogBox ButtonName='Restart' variant='default' medication={medication} status='ACTIVE' />
            </>}
        </CardFooter>
    </Card>
  )
}

export default MedicationCard

const AlertDialogBox = ({ButtonName, variant, medication, status}:{ButtonName: string, variant: "outline" | "default", medication:Medication, status:MedicationStatus}) => {
    
    const changeStatus = async(medicationId:number, status:MedicationStatus) => {
        try {
            const response = changeMedicationStatus(medicationId, status)
            toast.success(`Medication is now ${status}`)
        } catch (error:any) {
            toast.error(error);
        }
      }
    return (
        <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant={variant}>{ButtonName}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                {status==="ACTIVE" && `This will make the medication ${medication.name} ACTIVE and schedule the first dose immediately`}
                {status==="PAUSED" && `This will make the PAUSE medication ${medication.name}`}
                {status==="COMPLETED" && `This will mark the medication ${medication.name} as COMPLETED`}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => changeStatus(medication.id, status)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    )
}