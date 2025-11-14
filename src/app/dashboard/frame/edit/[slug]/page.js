/* eslint-disable react/no-unescaped-entities */
import React from "react";
const { useRouter } = require("next/navigation");

export default async function Page({ params }) {
    const { slug } = params;
    console.log(slug);

    // Fetch existing frame data from your API or database
    // Replace the URL below with your real backend endpoint if needed
    let frame = null;
    try {
        const res = await fetch(`${process.env.API_URL || ""}/api/frames/${encodeURIComponent(slug)}`, {
            cache: "no-store",
        });
        if (res.ok) frame = await res.json();
    } catch (err) {
        // swallow — form will render with empty defaults
        console.error("Failed to load frame:", err);
    }

    if (!frame) {
        return (
            <div style={{ padding: 24 }}>
                <h1>Edit frame</h1>
                <p>Frame "Delay" not found or could not be loaded.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <h1>Edit frame</h1>
            <EditFrameForm initialData={frame} slug={slug} />
        </div>
    );
}

/* Client form to update the frame */
function EditFrameFormClient(props) {
    "use client";
    const { useState, useTransition } = React;
    const [title, setTitle] = useState(props.initialData.title || "");
    const [content, setContent] = useState(props.initialData.content || "");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function submitForm(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        startTransition(async () => {
            try {
                const res = await fetch(`/api/frames/${encodeURIComponent(props.slug)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content }),
                });

                if (!res.ok) {
                    const json = await res.json().catch(() => ({}));
                    throw new Error(json?.message || `Request failed: ${res.status}`);
                }

                setSuccess("Frame updated.");
                // optionally navigate back to list or frame page
                // router.push("/dashboard/frame");
            } catch (err) {
                setError(err.message || "Update failed");
            }
        });
    }

    return (
        <form onSubmit={submitForm} style={{ maxWidth: 720, display: "grid", gap: 12 }}>
            <label>
                <div style={{ fontSize: 14, marginBottom: 6 }}>Title</div>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Frame title"
                    style={{ width: "100%", padding: 8, fontSize: 16 }}
                />
            </label>

            <label>
                <div style={{ fontSize: 14, marginBottom: 6 }}>Content</div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Frame content"
                    rows={8}
                    style={{ width: "100%", padding: 8, fontSize: 15 }}
                />
            </label>

            <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={isPending} style={{ padding: "8px 12px" }}>
                    {isPending ? "Saving..." : "Save"}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    style={{ padding: "8px 12px" }}
                >
                    Cancel
                </button>
            </div>

            {error && <div style={{ color: "crimson" }}>{error}</div>}
            {success && <div style={{ color: "green" }}>{success}</div>}
        </form>
    );
}

// Wrap client component to avoid "use client" at top-level of file
function EditFrameForm(props) {
    return <EditFrameFormClient {...props} />;
}