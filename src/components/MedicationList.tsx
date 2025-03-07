import { Medication } from "@prisma/client";
import React from "react";
import MedicationCard from "./MedicationCard";

const MedicationList = ({ title, medications }: { title: string; medications: Medication[] }) => {
  return (
    <div>
      <h3 className="font-bold text-2xl mb-4">{title}</h3>
      
      {medications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {title} found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationList;
