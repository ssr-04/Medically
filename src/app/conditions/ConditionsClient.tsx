"use client";
import React from "react";
import AddConditionDialog from "@/components/AddCondition";
import ConditionCard from "@/components/ConditionCard";

interface Condition {
  id: number;
  name: string;
  description?: string | null;
  userId: number;
  medications: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConditionsClientProps {
  conditions: Condition[];
  mutate: () => void;
}

const ConditionsClient: React.FC<ConditionsClientProps> = ({ conditions, mutate }) => {
  if (!conditions || conditions.length === 0) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-6">
        <h3 className="text-muted-foreground">No conditions added yet</h3>
        <AddConditionDialog mutate={mutate} />
      </div>
    );
  }

  return (
    <div className="mx-6">
      <div className="p-3">
        <div className="flex justify-between m-3">
          <h3 className="font-bold text-2xl">Conditions</h3>
          <AddConditionDialog mutate={mutate} />
        </div>
        {conditions.map((condition) => (
          <ConditionCard key={condition.id} condition={condition} mutate={mutate} />
        ))}
      </div>
    </div>
  );
};

export default ConditionsClient;
