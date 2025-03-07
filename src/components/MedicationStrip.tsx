import React from "react";

interface MedicationStripProps {
  height: number; // Number of rows
  width: number;  // Number of columns
  currentCount: number; // Number of filled slots
}

const MedicationStrip: React.FC<MedicationStripProps> = ({ height, width, currentCount }) => {
  const totalSlots = height * width;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="grid gap-1 p-2 border bg-zinc-300 rounded-md"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
        }}
      >
        {[...Array(totalSlots)].map((_, index) => (
          <div
            key={index}
            className={`w-10 h-10 flex items-center justify-center border rounded-md
              ${index < currentCount ? "bg-yellow-100" : "bg-zinc-400"}
            `}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MedicationStrip;
