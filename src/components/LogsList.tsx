import { getAllMedLogs } from '@/actions/medlogs.action'
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { DoseLog } from '@prisma/client'

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

const calculateDiff = (log: DoseLog) => {
    if(!log.takenTime) return;
    const scheduledTime = new Date(log.scheduledTime)
    const takenTime = new Date(log.takenTime);
    const diffInMs = scheduledTime.getTime() - takenTime.getTime();

    const TakenEarly = diffInMs > 0;
    const absDiff = Math.abs(diffInMs);

    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (TakenEarly) {
        return `${hours}h ${minutes}m early`;
    } else {
    return `${hours}h ${minutes}m late`
    }

}

type LogsProps = NonNullable<Awaited<ReturnType<typeof getAllMedLogs>>>
type LogsProp = LogsProps[number]

const LogsList = ({ medLog }: { medLog: LogsProp }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-gray-100">
        {`${medLog.name} (${medLog.status})`}
      </h1>

      {!medLog.doseLogs.length ? (
        <div className="flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No Dose logs found</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[400px] w-full rounded-md border border-gray-300 dark:border-gray-700 overflow-auto">
          <Table className="w-full text-left">
            <TableHeader className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <TableRow>
                <TableHead className="px-4 py-3 font-semibold">Scheduled Time</TableHead>
                <TableHead className="px-4 py-3 font-semibold">Taken Time</TableHead>
                <TableHead className="px-4 py-3 font-semibold">Status</TableHead>
                <TableHead className="px-4 py-3 font-semibold">Diff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medLog.doseLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <TableCell className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    {`${formatDate(log.scheduledTime)} ${formatTime(log.scheduledTime)}`}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    {log.takenTime ? `${formatDate(log.takenTime)} ${formatTime(log.takenTime)}` : log.status === "PENDING" ? "Yet to take" : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        log.status === "TAKEN"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : log.status === "PENDING" ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${!log.takenTime ? '' : log.takenTime<log.scheduledTime ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>
                        {log.status==="TAKEN" ? calculateDiff(log) : "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  )
}

export default LogsList
