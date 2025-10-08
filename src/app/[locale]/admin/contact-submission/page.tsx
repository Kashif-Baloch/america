"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ContactSubmission } from "@prisma/client";

const Page = () => {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

    // 📥 Fetch submissions
    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/contact");
            const data = await res.json();

            if (data.success) {
                setSubmissions(data.submissions);
            } else {
                toast.error(data.message || "Failed to load submissions");
            }
        } catch (error) {
            toast.error("Something went wrong while fetching submissions");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 🗑️ Delete a submission
    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
            const data = await res.json();

            if (data.success) {
                toast.success("Submission deleted successfully!");
                setSubmissions((prev) => prev.filter((s) => s.id !== id));
            } else {
                toast.error(data.message || "Failed to delete submission");
            }
        } catch (error) {
            toast.error("Something went wrong while deleting");
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    return (
        <div className="p-8  min-h-screen">
            <h1 className="text-4xl font-bold mb-10 text-gray-800">📬 Contact Submissions</h1>

            {loading ? (
                <p className="text-gray-500">Loading submissions...</p>
            ) : submissions.length === 0 ? (
                <p className="text-gray-500">No submissions found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {submissions.map((sub) => (
                        <div
                            key={sub.id}
                            className=" rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-200 p-6 flex flex-col justify-between"
                        >
                            {/* Header */}
                            <div className="mb-4">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-1">{sub.name}</h2>
                                <p className="text-sm text-gray-500">{sub.email}</p>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 text-sm text-gray-700">
                                <p>
                                    <span className="font-medium">📞 Phone:</span> {sub.phone}
                                </p>
                                <p className="line-clamp-2">
                                    <span className="font-medium">📌 Subject:</span> {sub.subject}
                                </p>
                                <p className="line-clamp-2">
                                    <span className="font-medium">💬 Message:</span> {sub.message}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="mt-5 flex flex-col gap-4">
                                <p className="text-xs text-gray-400 text-right">
                                    📅 {new Date(sub.createdAt).toLocaleString()}
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* 👁️ View Button */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full text-sm font-medium"
                                                onClick={() => setSelectedSubmission(sub)}
                                            >
                                                View
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-lg overflow-y-auto max-h-screen">
                                            <DialogHeader>
                                                <DialogTitle>📨 Submission Details</DialogTitle>
                                                <DialogDescription>
                                                    Detailed information for this contact message.
                                                </DialogDescription>
                                            </DialogHeader>
                                            {selectedSubmission && (
                                                <div className="space-y-3 text-gray-800 mt-4">
                                                    <p>
                                                        <strong>Name:</strong> {selectedSubmission.name}
                                                    </p>
                                                    <p>
                                                        <strong>Email:</strong> {selectedSubmission.email}
                                                    </p>
                                                    <p>
                                                        <strong>Phone:</strong> {selectedSubmission.phone}
                                                    </p>
                                                    <p>
                                                        <strong>Subject:</strong> {selectedSubmission.subject}
                                                    </p>
                                                    <p className="whitespace-pre-line">
                                                        <strong>Message:</strong> {selectedSubmission.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        📅 {new Date(selectedSubmission.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>

                                    {/* 🗑️ Delete Button */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                className="w-full text-sm font-medium"
                                                disabled={deletingId === sub.id}
                                            >
                                                {deletingId === sub.id ? "Deleting..." : "Delete"}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete the submission from{" "}
                                                    <strong>{sub.name}</strong>. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(sub.id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Confirm Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Page;
