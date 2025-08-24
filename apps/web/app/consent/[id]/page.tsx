'use client';
import { useParams } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
const RESP = gql`mutation($id:String!,$a:Boolean!){ respondConsent(consentId:$id, approve:$a){ id status } }`;
export default function Consent(){
  const { id } = useParams<{id:string}>();
  const [respond] = useMutation(RESP);
  return <main style={{padding:20}}>
    <h1>Share Consent</h1>
    <button onClick={()=>respond({ variables:{ id, a:true } })}>Approve</button>
    <button onClick={()=>respond({ variables:{ id, a:false } })} style={{marginLeft:8}}>Reject</button>
  </main>;
}
