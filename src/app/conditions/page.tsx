"use client";

import { useConditions } from "@/hooks/useConditions";
import ConditionsClient from "./ConditionsClient";
import { Loader2Icon } from "lucide-react";

export default function ConditionsPage() {
  const { conditions, isLoading, isError, mutate } = useConditions();

  if (isLoading) {
    return (
      <div className="text-2xl flex justify-center items-center h-screen gap-2">
        <Loader2Icon className="animate-spin" />
        <p>Loading</p>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading conditions.</div>;
  }

  return <ConditionsClient conditions={conditions} mutate={mutate} />;
}
