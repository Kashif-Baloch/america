"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarIcon, Video } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar24 } from "@/components/ui/calender-two";

interface Consultation {
  id: string;
  scheduledAt: string;
  status: string;
  meetingLink: string;
  notes?: string;
}

export function ConsultationScheduler() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("10:30:00");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingConsultation, setUpcomingConsultation] =
    useState<Consultation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchConsultation();
  }, []);

  const fetchConsultation = async () => {
    try {
      const response = await fetch("/api/consultations");
      if (!response.ok) throw new Error("Failed to fetch consultation");
      const data = await response.json();
      if (data.consultations && data.consultations.length > 0) {
        setUpcomingConsultation(data.consultations[0]);
      }
    } catch (error) {
      console.error("Error fetching consultation:", error);
      toast.error("Failed to load consultation data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    // Combine date and time
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const scheduledAt = new Date(date);
    scheduledAt.setHours(hours, minutes, seconds, 0);

    console.log(scheduledAt);

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduledAt: scheduledAt.toISOString(),
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to schedule consultation");
      }

      const data = await response.json();
      setUpcomingConsultation(data.consultation);
      toast.success("Consultation scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling consultation:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to schedule consultation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (upcomingConsultation) {
    const scheduledDate = new Date(upcomingConsultation.scheduledAt);

    return (
      <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-full">
            <CalendarIcon className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold">Upcoming Consultation</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">
              {format(scheduledDate, "EEEE, MMMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-gray-700">
              {format(scheduledDate, "h:mm a")}
            </span>
          </div>

          {upcomingConsultation.notes && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-700 mb-2">Notes:</h3>
              <p className="text-gray-600">{upcomingConsultation.notes}</p>
            </div>
          )}

          <div className="pt-4">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <a
                href={upcomingConsultation.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2"
              >
                <Video className="h-4 w-4" />
                <span>Join Meeting</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If no upcoming consultation, show the scheduling form
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Schedule Your Consultation</h2>
        <p className="text-gray-600">
          Book a 30-minute consultation with one of our career experts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="w-full">
            <Calendar24 date={date} onDateChange={handleDateChange} />
          </div>

          <div className="w-full flex flex-col gap-3">
            <label htmlFor="time-picker" className="px-1">
              Time
            </label>
            <input
              type="time"
              id="time-picker"
              step="1"
              value={time}
              onChange={handleTimeChange}
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Any specific topics you'd like to discuss?"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            "Schedule Consultation"
          )}
        </Button>
      </form>
    </div>
  );
}
