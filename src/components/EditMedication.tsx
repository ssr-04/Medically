"use client";
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {Medication} from '@prisma/client'
import { updateMedication } from '@/actions/medication.action'
import toast from 'react-hot-toast'
import { PencilIcon } from 'lucide-react'

const EditMedication = ({medication}:{medication:Medication}) => {
    const [extraStrips, setExtraStrips] = useState(medication.extraAvailable);
    const [currentCount, setcurrentCount] = useState(medication.currentCount);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async() => {
        try {
            setIsLoading(true);
            const result = await updateMedication(medication.id, currentCount, extraStrips)
            toast.success("Medication updated successfully")
        } catch (error) {
            toast.error("Something went wrong")
        } finally{
            setIsOpen(false);
            setIsLoading(false);
        }
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className='hover:bg-blue-500'>
                <PencilIcon className='h-2 w-2'/>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Medication</DialogTitle>
              <DialogDescription>
                Making changes to your {medication.name}. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="count" className="text-right">
                  Current Count
                </Label>
                <Input id="count" value={currentCount} onChange={(e) => setcurrentCount(parseInt(e.target.value))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="extra" className="text-right">
                  Extra Strips
                </Label>
                <Input id="extra" value={extraStrips} onChange={(e) => setExtraStrips(parseInt(e.target.value))} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit} disabled={isLoading}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    
}

export default EditMedication