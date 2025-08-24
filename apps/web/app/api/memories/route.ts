import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')
    
    let query = supabaseServer.from("memories").select("*")
    if (childId) {
      query = query.eq("childId", childId)
    }
    
    const { data: memories, error } = await query.order("created_at", { ascending: false })
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    
    return new Response(JSON.stringify(memories), { headers: { "content-type": "application/json" }})
  } catch (error) {
    console.error('Error fetching memories:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch memories' }), { status: 500 })
  }
}

export const runtime = "nodejs";
export const maxDuration = 60;

function sanitizeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9_.-]+/g, "-");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const title = String(form.get("title") || "").trim();
    const topic = String(form.get("topic") || "").trim();
    const files = form.getAll("images") as File[];

    if (!title || !topic) return new Response(JSON.stringify({ error: "title and topic are required" }), { status: 400 });
    if (!files.length) return new Response(JSON.stringify({ error: "at least one image is required" }), { status: 400 });

    const { data: mem, error: memErr } = await supabaseServer
      .from("memories").insert({ title, topic }).select("id").single();
    if (memErr || !mem) return new Response(JSON.stringify({ error: memErr?.message || "db insert failed" }), { status: 500 });

    const memoryId = mem.id as string;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "memories";

    const uploaded: { path: string; url: string }[] = [];
    for (const file of files) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const safeName = sanitizeFileName(file.name || `image-${Date.now()}.jpg`);
      const path = `${memoryId}/${Date.now()}-${safeName}`;

      const { error: upErr } = await supabaseServer.storage.from(bucket).upload(path, bytes, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });
      if (upErr) return new Response(JSON.stringify({ error: `upload failed: ${upErr.message}` }), { status: 500 });

      const { data: pub } = supabaseServer.storage.from(bucket).getPublicUrl(path);
      uploaded.push({ path, url: pub.publicUrl });
    }

    const { error: imgErr } = await supabaseServer.from("memory_images").insert(
      uploaded.map(u => ({ memory_id: memoryId, path: u.path, url: u.url }))
    );
    if (imgErr) return new Response(JSON.stringify({ error: imgErr.message }), { status: 500 });

    return new Response(JSON.stringify({ ok: true, memoryId, images: uploaded }), { headers: { "content-type": "application/json" }});
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "unknown error" }), { status: 500 });
  }
}
