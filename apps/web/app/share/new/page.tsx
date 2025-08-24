'use client';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const BEGIN = gql`mutation($child:String!,$mem:String!){ beginShare(childId:$child, memoryId:$mem){ consentId } }`;
const FINAL = gql`mutation($cid:String!,$mem:String!){ finalizeShare(consentId:$cid, memoryId:$mem){ id url } }`;

export default function NewShare(){
  const [childId,setChildId]=useState(''); const [memoryId,setMemoryId]=useState('');
  const [begin] = useMutation(BEGIN); const [finalize] = useMutation(FINAL);
  const [consentId,setCid]=useState<string>('');
  return <main style={{padding:20}}>
    <h1>Create Share (consent-first)</h1>
    <input placeholder="ChildId" value={childId} onChange={e=>setChildId(e.target.value)} />
    <input placeholder="MemoryId" value={memoryId} onChange={e=>setMemoryId(e.target.value)} />
    {!consentId ? <button onClick={async()=>{ const r = await begin({ variables:{ child:childId, mem:memoryId } }); setCid(r.data.beginShare.consentId); alert('Consent requested. Ask teen to approve.'); }}>Begin</button> :
      <button onClick={async()=>{ try{ const r = await finalize({ variables:{ cid:consentId, mem:memoryId } }); window.location.href = r.data.finalizeShare.url; }catch(e:any){ alert(e.message||'Not approved yet'); } }}>Finalize</button>}
  </main>;
}
