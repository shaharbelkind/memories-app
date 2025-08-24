'use client';
import { gql, useMutation } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
const REQ = gql`mutation($child:String!,$share:String!){ requestConsent(childId:$child, shareId:$share){ id status } }`;
export default function Request(){
  const sp = useSearchParams();
  const child = sp.get('child')||''; const share = sp.get('share')||'';
  const [reqC] = useMutation(REQ);
  return <main style={{padding:20}}><h1>Request Consent</h1>
    <button onClick={async()=>{ const r = await reqC({ variables:{ child, share } }); alert('Requested: '+r.data.requestConsent.id); }}>Request</button>
  </main>;
}
