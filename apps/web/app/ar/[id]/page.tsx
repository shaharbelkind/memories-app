'use client';
import { useParams } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useEffect, useRef } from 'react';

const Q = gql`query($id:ID!){ arObjects(childId:$id){ id label meshUrl } }`;

export default function ARRoom(){
  const { id } = useParams<{id:string}>();
  const { data } = useQuery(Q,{ variables:{ id } });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas = canvasRef.current; if(!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth/canvas.clientHeight, 0.1, 100);
    camera.position.set(0,1.2,2.4);
    const controls = new OrbitControls(camera, canvas);
    const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(2,3,4); scene.add(light);
    const amb = new THREE.AmbientLight(0xffffff, 0.6); scene.add(amb);

    const loader = new GLTFLoader();
    const objects = data?.arObjects || [];
    const gap = 1.2; let x=0;
    objects.forEach((o:any, idx:number)=>{
      if(!o.meshUrl) return;
      loader.load(o.meshUrl, (gltf)=>{ const m = gltf.scene; m.position.set(x,0,0); m.traverse(n=>{ if((n as any).isMesh){ (n as any).castShadow=true; }}); scene.add(m); x += gap; });
    });

    function onResize(){ const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w,h,false); camera.aspect = w/h; camera.updateProjectionMatrix(); }
    onResize(); window.addEventListener('resize', onResize);
    let raf:number; const tick=()=>{ controls.update(); renderer.render(scene,camera); raf=requestAnimationFrame(tick); }; tick();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); renderer.dispose(); };
  }, [data]);

  return <main style={{height:'100vh', padding:12}}>
    <h1>AR Room</h1>
    <div style={{height:'80vh', border:'1px solid #eee', borderRadius:12}}>
      <canvas ref={canvasRef} style={{width:'100%', height:'100%'}}/>
    </div>
  </main>;
}
