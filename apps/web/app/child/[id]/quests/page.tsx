'use client';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
const ENSURE = gql`mutation($id:String!,$m:Int!,$y:Int!){ ensureMonthlyQuest(childId:$id, month:$m, year:$y){ id month year target status } }`;
const PICK = gql`mutation($q:String!,$m:String!){ pickFavorite(questId:$q, memoryId:$m) }`;
const Q = gql`query($id:ID!){ memories(childId:$id){ id url } }`;
export default function Quests(){
  const { id } = useParams<{id:string}>();
  const d = new Date();
  const { data } = useQuery(Q,{ variables:{ id } });
  const [ensure] = useMutation(ENSURE); const [pick] = useMutation(PICK);
  const [quest,setQuest] = React.useState<any>(null);
  async function start(){ const r = await ensure({ variables:{ id, m:d.getMonth()+1, y:d.getFullYear() }}); setQuest(r.data.ensureMonthlyQuest); }
  return <main style={{padding:20}}>
    <h1>Kid Quest</h1>
    {!quest ? <button onClick={start}>Start this month's quest</button> : <p>Pick {quest.target} favourites</p>}
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:8}}>
      {data?.memories?.map((m:any)=> (
        <div key={m.id} onClick={async()=> quest && await pick({ variables:{ q:quest.id, m:m.id } }) }>
          <img src={m.url} style={{width:'100%',borderRadius:8}}/>
        </div>
      ))}
    </div>
  </main>;
}
