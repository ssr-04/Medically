import { getAllMedications } from '@/actions/medication.action'
import MedicationList from '@/components/MedicationList';
import MedicationStrip from '@/components/MedicationStrip';
import React from 'react'

const Medicationspage = async() => {
  const medications = await getAllMedications();
  // console.log(medications)
  return (
    <div className='mx-6 p-3 space-y-7'>
        {medications.ACTIVE && <MedicationList title={"Active Medications"} medications={medications.ACTIVE}/>}
        {medications.PAUSED && <MedicationList title={"Paused Medications (Yet to start)"} medications={medications.PAUSED}/>}
        {medications.COMPLETED && <MedicationList title={"Completed Medications"} medications={medications.COMPLETED}/>}
    </div>
  )
}

export default Medicationspage
