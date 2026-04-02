import { useState } from "react";
import { Button, Dialog, NumberInput, Select, SectionLabel } from "../ui";
import type { Unit } from "../../../types";

type DisplayUnit = Unit | "in";

interface CalibrationDialogProps {
  pixelDistance: number;
  existingUnit?: Unit;
  onConfirm: (distance: number, unit: Unit) => void;
  onClose: () => void;
}

/** Convert display-unit value to base Unit + distance for storage. */
function toBaseUnit(distance: number, displayUnit: DisplayUnit): { distance: number; unit: Unit } {
  if (displayUnit === "in") {
    return { distance: distance / 12, unit: "ft" };
  }
  return { distance, unit: displayUnit };
}

export function CalibrationDialog({
  pixelDistance,
  existingUnit,
  onConfirm,
  onClose,
}: CalibrationDialogProps) {
  const [distance, setDistance] = useState<number>(0);
  const [displayUnit, setDisplayUnit] = useState<DisplayUnit>(
    existingUnit && existingUnit !== "px" ? existingUnit : "ft",
  );

  const canConfirm = distance > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    const { distance: baseDistance, unit } = toBaseUnit(distance, displayUnit);
    onConfirm(baseDistance, unit);
  };

  return (
    <Dialog
      title="Set Scale"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" color="neutral" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            Apply
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        <p className="text-xs text-gray-500">
          You selected two points{" "}
          <span className="font-medium text-gray-700">
            {Math.round(pixelDistance)} px
          </span>{" "}
          apart. Enter the real-world distance between them.
        </p>

        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1.5 flex-1">
            <SectionLabel>Distance</SectionLabel>
            <NumberInput
              value={distance}
              onChange={(v) => setDistance(Math.max(0, v))}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Unit</SectionLabel>
            <Select
              value={displayUnit}
              onChange={(e) => setDisplayUnit(e.target.value as DisplayUnit)}
            >
              <option value="ft">Feet</option>
              <option value="in">Inches</option>
              <option value="m">Meters</option>
            </Select>
          </div>
        </div>

        {displayUnit === "in" && distance > 0 && (
          <p className="text-[11px] text-gray-400">
            = {(distance / 12).toFixed(2)} ft
          </p>
        )}
      </div>
    </Dialog>
  );
}
