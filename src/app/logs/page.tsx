import { getAllMedLogs } from '@/actions/medlogs.action'
import LogsList from '@/components/LogsList';
import React from 'react'

const MedLogs = async() => {
  const medLogs = await getAllMedLogs();
  //console.log(medLogs)

  return (
    <div className='mx-6 p-3 space-y-7'>
      <h1 className="mt-5 font-bold text-2xl text-center font-mono">Medication Logs</h1>
      <div className='space-y-10'>
        {medLogs?.map((medLog) => (
            <LogsList key={medLog.id} medLog={medLog}/>
        ))}
      </div>
    </div>
  )
}

export default MedLogs