import { supabasePublic } from "@/lib/supabasePublic";

type MemoryRow = { id: string; title: string; topic: string; created_at: string };
type ImageRow = { id: string; url: string; memory_id: string };

export default async function Home() {
  const { data: memories } = await supabasePublic
    .from("memories")
    .select("id,title,topic,created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  const ids = (memories || []).map(m => m.id);
  const { data: imgs } = ids.length
    ? await supabasePublic.from("memory_images").select("id,url,memory_id").in("memory_id", ids)
    : { data: [] as ImageRow[] };

  const imagesByMem: Record<string, ImageRow[]> = {};
  (imgs || []).forEach(img => {
    imagesByMem[img.memory_id] ||= [];
    imagesByMem[img.memory_id].push(img);
  });

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Memories</h1>
        <a href="/create" className="px-3 py-2 rounded bg-black text-white">New</a>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {(memories || []).map(m => {
          const first = imagesByMem[m.id]?.[0];
          return (
            <a key={m.id} href={`/m/${m.id}`} className="block border rounded-lg p-4 hover:shadow">
              <div className="text-sm text-gray-500">{new Date(m.created_at).toLocaleString()}</div>
              <div className="font-semibold text-lg">{m.title}</div>
              <div className="text-gray-700 mb-3">{m.topic}</div>
              {first && <img src={first.url} alt={m.title} className="rounded-lg max-h-72 object-cover w-full" />}
            </a>
          );
        })}
      </div>
    </main>
  );
}
