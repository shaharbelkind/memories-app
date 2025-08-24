'use client';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import Link from 'next/link';

const Q = gql`query { children { id name dob } }`;
const M = gql`mutation($name:String!, $dob:String){ createChild(input:{name:$name, dob:$dob}){ id name } }`;

export default function Dashboard(){
  const { data, refetch } = useQuery(Q);
  const [create] = useMutation(M);
  const [name,setName] = useState('');
  const [dob,setDob] = useState('');
  
  return (
    <div className="container">
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="form-group">
          <input 
            className="form-input"
            placeholder="Child name" 
            value={name} 
            onChange={e=>setName(e.target.value)} 
          />
          <input 
            className="form-input"
            placeholder="YYYY-MM-DD" 
            value={dob} 
            onChange={e=>setDob(e.target.value)} 
          />
          <button 
            className="btn btn-primary"
            onClick={async()=>{ 
              await create({ variables:{ name, dob: dob||null } }); 
              setName(''); 
              setDob(''); 
              refetch(); 
            }}
          >
            Add child
          </button>
        </div>
        <ul className="children-list">
          {data?.children?.map((c:any)=> (
            <li key={c.id}>
              <Link href={`/child/${c.id}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
