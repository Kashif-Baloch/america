"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Calendar24Props {
  date?: Date | undefined;
  onDateChange?: (date: Date | undefined) => void;
}

export function Calendar24({ date: controlledDate, onDateChange }: Calendar24Props) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(controlledDate);

  React.useEffect(() => {
    setDate(controlledDate);
  }, [controlledDate]);

  function handleSelect(date: Date | undefined) {
    setDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
    setOpen(false);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex w-full flex-col gap-3 relative">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-full justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="absolute -left-5 top-10 z-[1000] w-auto overflow-hidden p-0">
            <Calendar
              mode="single"
              selected={date}
              disabled={(date) => {
                // Disable past dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              captionLayout="dropdown"
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="10:30:00"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
