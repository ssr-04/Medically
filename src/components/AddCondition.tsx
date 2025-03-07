"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { addCondition } from "@/actions/condition.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface MedicationForm {
  name: string;
  height: number;
  width: number;
  currentCount: number;
  extraAvailable: number;
  prescriptionDuration: number;
  prescriptionDays?: number;
  startDate?: string;
  endDate?: string;
  instructions?: string;
  status: string;
}

interface AddConditionDialogProps {
  mutate: () => void;
}

export default function AddConditionDialog({
  mutate,
}: AddConditionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conditionName, setConditionName] = useState("");
  const [description, setDescription] = useState("");
  const [medications, setMedications] = useState<MedicationForm[]>([
    {
      name: "",
      height: 0,
      width: 0,
      currentCount: 0,
      extraAvailable: 0,
      prescriptionDuration: 0,
      prescriptionDays: undefined,
      startDate: "",
      endDate: "",
      instructions: "",
      status: "PAUSED",
    },
  ]);

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        name: "",
        height: 0,
        width: 0,
        currentCount: 0,
        extraAvailable: 0,
        prescriptionDuration: 0,
        prescriptionDays: undefined,
        startDate: "",
        endDate: "",
        instructions: "",
        status: "PAUSED",
      },
    ]);
  };

  const deleteMedication = (index: number) => {
    if (index === 0) return; // Prevent deletion of the first medication
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof MedicationForm,
    value: any
  ) => {
    const newMedications = [...medications];
    newMedications[index] = { ...newMedications[index], [field]: value };
    setMedications(newMedications);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await addCondition({
        conditionName,
        description,
        medications,
      });
      if (result) {
        toast.success("Condition added successfully");
        setConditionName("");
        setDescription("");
        setMedications([
          {
            name: "",
            height: 0,
            width: 0,
            currentCount: 0,
            extraAvailable: 0,
            prescriptionDuration: 0,
            prescriptionDays: undefined,
            startDate: "",
            endDate: "",
            instructions: "",
            status: "PAUSED",
          },
        ]);
        setOpen(false);
        // Refresh conditions by calling SWR’s mutate
        mutate();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Add condition</Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[600px] h-[80vh]">
        <ScrollArea className="h-full">
          <DialogHeader className="sticky top-1 bg-background z-10 border-b pb-2">
            <DialogTitle>Add Condition</DialogTitle>
            <DialogDescription>
              Enter the details for the condition and its medications.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="conditionName">Condition Name</Label>
              <Input
                id="conditionName"
                value={conditionName}
                onChange={(e) => setConditionName(e.target.value)}
                placeholder="Enter condition name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
            {/* Medications Form */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Medications</h3>
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-md space-y-2 relative"
                  >
                    {index !== 0 && (
                      <Button
                        variant="ghost"
                        className="absolute top-2 right-2 p-1"
                        onClick={() => deleteMedication(index)}
                        aria-label="Delete medication"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor={`medName-${index}`}>
                        Medication Name
                      </Label>
                      <Input
                        id={`medName-${index}`}
                        value={medication.name}
                        onChange={(e) =>
                          handleMedicationChange(index, "name", e.target.value)
                        }
                        placeholder="Enter medication name"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`height-${index}`}>Height</Label>
                        <Input
                          id={`height-${index}`}
                          value={medication.height}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "height",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Height"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`width-${index}`}>Width</Label>
                        <Input
                          id={`width-${index}`}
                          value={medication.width}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "width",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Width"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`currentCount-${index}`}>
                          Current Count
                        </Label>
                        <Input
                          id={`currentCount-${index}`}
                          value={medication.currentCount}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "currentCount",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Current Count"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`extraAvailable-${index}`}>
                          Extra Available
                        </Label>
                        <Input
                          id={`extraAvailable-${index}`}
                          value={medication.extraAvailable}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "extraAvailable",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Extra Available"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`prescriptionDuration-${index}`}>
                          Prescription Duration
                        </Label>
                        <Input
                          id={`prescriptionDuration-${index}`}
                          value={medication.prescriptionDuration}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "prescriptionDuration",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Prescription Duration"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`prescriptionDays-${index}`}>
                          Prescription Days (Optional)
                        </Label>
                        <Input
                          id={`prescriptionDays-${index}`}
                          value={medication.prescriptionDays || ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "prescriptionDays",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          placeholder="Prescription Days"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>
                          Start Date (Optional)
                        </Label>
                        <Input
                          id={`startDate-${index}`}
                          type="date"
                          value={medication.startDate || ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${index}`}>
                          End Date (Optional)
                        </Label>
                        <Input
                          id={`endDate-${index}`}
                          type="date"
                          value={medication.endDate || ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`instructions-${index}`}>
                        Instructions (Optional)
                      </Label>
                      <Input
                        id={`instructions-${index}`}
                        value={medication.instructions || ""}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "instructions",
                            e.target.value
                          )
                        }
                        placeholder="Enter instructions"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`status-${index}`}>Status</Label>
                      <Input
                        id={`status-${index}`}
                        value={medication.status}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" variant="secondary" onClick={addMedication}>
                + Add Medication
              </Button>
            </div>
          </form>
          <DialogFooter className="sticky bottom-0 bg-background z-10 border-t p-4">
            <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
              Submit
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
