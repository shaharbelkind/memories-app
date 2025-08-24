'use client';
import Link from 'next/link';

const Button = ({children, ...props}: any) => (
  <button {...props} style={{padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', background: 'white'}}>{children}</button>
);

export default function Memory(){
  return (
    <main style={{padding:20}}>
      <Link href={`/child/${childId}`}>◀ Back</Link>
      <div className="grid" style={{gridTemplateColumns:'1.2fr .8fr'}}>
        <div className="card"><img src="https://picsum.photos/1000/700" style={{width:'100%',borderRadius:8}}/></div>
        <div className="card">
          <h3>Details</h3>
          <p>Date • Time • Map</p>
          <p>People: Emma, Grandma</p>
          <p>Tags: birthday, cake</p>
          <details><summary>Transcript</summary><pre>…</pre></details>
          <div style={{display:'flex',gap:8, alignItems:'center'}}>
            <select id="obj">
              {objs?.arObjects?.map((o:any)=>(<option key={o.id} value={o.id}>{o.label}</option>))}
            </select>
            <Button onClick={async()=>{ const sel=(document.getElementById('obj') as HTMLSelectElement).value; await link({ variables:{ o: sel, m: id as string } }); alert('Linked'); }}>Link to Object</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
