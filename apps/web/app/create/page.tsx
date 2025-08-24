"use client";
import { useEffect, useState } from "react";

export default function CreateMemoryPage() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!images || images.length === 0) { setPreviews([]); return; }
    const urls = Array.from(images).map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [images]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!images || images.length === 0) { setStatus("Please select at least one image."); return; }
    setStatus("Uploading...");
    const fd = new FormData();
    fd.append("title", title);
    fd.append("topic", topic);
    Array.from(images).forEach(f => fd.append("images", f));
    const res = await fetch("/api/memories", { method: "POST", body: fd });
    const json = await res.json();
    setStatus(res.ok ? `Done! Memory ID: ${json.memoryId}` : `Error: ${json.error || "failed"}`);
    if (res.ok) {
      setTitle(""); setTopic(""); setImages(null); setPreviews([]);
      (document.getElementById("images") as HTMLInputElement).value = "";
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create a Memory</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input className="w-full border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Topic</label>
          <input className="w-full border rounded p-2" value={topic} onChange={e=>setTopic(e.target.value)} required placeholder="e.g., 2020 Maldives Vacation" />
        </div>
        <div>
          <label className="block text-sm mb-1">Photos</label>
          <input id="images" type="file" accept="image/*" multiple onChange={e=>setImages(e.target.files)} />
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`preview-${i}`} className="h-24 w-full object-cover rounded" />
            ))}
          </div>
        )}

        <button className="px-4 py-2 bg-black text-white rounded">Create</button>
      </form>
      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}
