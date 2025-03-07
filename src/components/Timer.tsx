"use client";
import { DoseLog } from '@prisma/client'
import React, { useEffect, useState } from 'react'

const Timer = ({doseLog}:{doseLog:DoseLog[]}) => {
    
    const [timeDifference, setTimeDifference] = useState<string>("")

    useEffect(() => {
        if(!doseLog.length) return;

        const updateTimer = () => {
            const now = new Date();
            const scheduledTime = new Date(doseLog[0].scheduledTime)
            const diffInMs = scheduledTime.getTime() - now.getTime();

            const isUpcoming = diffInMs > 0;
            const absDiff = Math.abs(diffInMs);

            const hours = Math.floor(absDiff / (1000 * 60 * 60));
            const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

            if (isUpcoming) {
                setTimeDifference(`Next Dose in ${hours}h ${minutes}m`);
              } else {
                setTimeDifference(`Already Late by ${hours}h ${minutes}m`);
              }

        };

    // Update timer every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
    }, [doseLog])

    if (!doseLog.length) return <div>No Dose Logs Available</div>;
    
    const isUpcoming = new Date(doseLog[0].scheduledTime).getTime() > new Date().getTime();

  return (
     <div className={`text-lg font-semibold ${isUpcoming ? "text-green-500" : "text-red-500"}`}>
      {timeDifference}
    </div>
  )
}

export default Timer