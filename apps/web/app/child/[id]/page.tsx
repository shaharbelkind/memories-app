'use client';
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';

const Q = gql`query($id:ID!){ child(id:$id){ id name } memories(childId:$id){ id kind url takenAt } }`;
const M1 = gql`mutation($childId:String!, $filename:String!, $contentType:String!, $kind:String!){ createUploadUrl(childId:$childId, filename:$filename, contentType:$contentType, kind:$kind){ url key } }`;
const M2 = gql`mutation($memoryId:String!, $publicUrl:String!){ attachUploadedFile(memoryId:$memoryId, publicUrl:$publicUrl){ id url } }`;

const Q_MS = gql`query($id:ID!){ milestones(childId:$id){ id title score missing } }`;
const Q_OBJ = gql`query($id:ID!){ arObjects(childId:$id){ id label previewUrl } }`;
const M_MS = gql`mutation($id:String!,$t:String!){ upsertMilestone(childId:$id, title:$t){ id title score missing } }`;
const M_OBJ = gql`mutation($id:String!,$label:String!){ createARObject(childId:$id,label:$label){ id label } }`;
const M_YEAR = gql`mutation($id:String!){ createYearbook(childId:$id){ id } }`;
const Q_YEAR = gql`query($j:String!){ getYearbook(jobId:$j){ url } }`;

export default function ChildPage(){
  const { id } = useParams<{id:string}>();
  const client = useApolloClient();
  const { data, refetch } = useQuery(Q,{ variables:{ id } });
  const [createUrl] = useMutation(M1);
  const [attach] = useMutation(M2);

  const [label,setLabel]=useState('');
  const [createObj] = useMutation(M_OBJ);
  const [upsertMs] = useMutation(M_MS);
  const [createY] = useMutation(M_YEAR);
  const { data:msData, refetch:refMs } = useQuery(Q_MS,{ variables:{ id } });
  const { data:objData, refetch:refObj } = useQuery(Q_OBJ,{ variables:{ id } });

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0]; if(!file) return;
    const presign = await createUrl({ variables:{ childId: id, filename: file.name, contentType: file.type, kind: 'PHOTO' } });
    const { url, key } = presign.data.createUploadUrl;
    await fetch(url, { method:'PUT', headers:{ 'Content-Type': file.type }, body: file });
    const publicUrl = `${process.env.NEXT_PUBLIC_MINIO_PUBLIC || 'http://localhost:9000'}/${process.env.NEXT_PUBLIC_S3_BUCKET || 'lsc-bucket'}/${url.split('Key=')[1]?.split('&')[0]??''}`;
    await attach({ variables:{ memoryId: key, publicUrl } });
    await refetch();
  }

  async function addObject(){ if(!label) return; await createObj({ variables:{ id, label }}); setLabel(''); refObj(); }
  async function addMilestone(){ const title = prompt('Milestone title'); if(!title) return; await upsertMs({ variables:{ id, t:title }}); refMs(); }
  async function makeYearbook(){ const j = await createY({ variables:{ id } }); const jobId = j.data.createYearbook.id; alert('Rendering…'); setTimeout(async()=>{ try{ const r = await client.query({ query: Q_YEAR, variables:{ j: jobId }, fetchPolicy:'no-cache' }); window.open(r.data.getYearbook.url,'_blank'); }catch(e){ alert('Still rendering, try again.'); } }, 4000); }

  return (
    <main style={{padding:20}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <h1 style={{marginRight:12}}>{data?.child?.name}</h1>
        <input type="file" accept="image/*,video/*" onChange={onUpload} />
        <div style={{display:'flex',gap:8}}>
          <button onClick={addMilestone}>+ Milestone</button>
          <input placeholder="New object label" value={label} onChange={e=>setLabel(e.target.value)} style={{padding:6}}/>
          <button onClick={addObject}>Add Object</button>
          <button onClick={makeYearbook}>Make Yearbook</button>
          <Link href={`/ar/${id}`}><button>Open AR Room</button></Link>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12,marginTop:12}}>
        {data?.memories?.map((m:any)=> (
          <div key={m.id} style={{border:'1px solid #eee',borderRadius:12,padding:8}}>
            {m.url?.match(/\.mp4|\.m3u8/) ? <video src={m.url} controls style={{width:'100%'}}/> : <img src={m.url} style={{width:'100%',borderRadius:8}}/>}
            <div style={{fontSize:12,opacity:.7}}>{m.takenAt||''}</div>
          </div>
        ))}
      </div>
      <h3>Objects</h3>
      <ul>{objData?.arObjects?.map((o:any)=>(<li key={o.id}>{o.label}</li>))}</ul>
      <h3>Milestones</h3>
      <ul>{msData?.milestones?.map((m:any)=>(<li key={m.id}>{m.title} • Score {m.score}% • Missing: {m.missing.join(', ')||'—'}</li>))}</ul>
    </main>
  );
}
