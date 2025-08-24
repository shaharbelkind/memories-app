import { supabasePublic } from "@/lib/supabasePublic";

export const revalidate = 0; // always fresh for now

type Params = { params: { id: string } };

export default async function MemoryDetail({ params }: Params) {
  const id = params.id;

  const { data: memory, error: memErr } = await supabasePublic
    .from("memories")
    .select("id,title,topic,created_at")
    .eq("id", id)
    .single();

  if (memErr || !memory) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <a href="/" className="text-sm underline">&larr; Back</a>
        <h1 className="text-2xl font-semibold mt-4">Memory not found</h1>
      </main>
    );
  }

  const { data: images } = await supabasePublic
    .from("memory_images")
    .select("id,url,created_at")
    .eq("memory_id", id)
    .order("created_at", { ascending: true });

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <a href="/" className="text-sm underline">&larr; Back</a>
      <div>
        <div className="text-sm text-gray-500">{new Date(memory.created_at).toLocaleString()}</div>
        <h1 className="text-2xl font-semibold">{memory.title}</h1>
        <div className="text-gray-700">{memory.topic}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {(images || []).map(img => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={img.id} src={img.url} alt={memory.title} className="w-full h-48 object-cover rounded" />
        ))}
      </div>
    </main>
  );
}
