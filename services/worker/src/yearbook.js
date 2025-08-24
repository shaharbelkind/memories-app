import PDFDocument from 'pdfkit';
import * as Minio from 'minio';

const minio = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT?.replace('http://','').replace('https://','')?.split(':')[0] || 'localhost',
  port: Number(process.env.S3_ENDPOINT?.split(':').pop() || 9000),
  useSSL: false,
  accessKey: process.env.S3_ACCESS_KEY || 'minio',
  secretKey: process.env.S3_SECRET_KEY || 'minio123'
});

export async function renderYearbook({ childName, images=[] }){
  const doc = new PDFDocument({ size:'A4', margin:36 });
  const chunks=[]; doc.on('data', d=>chunks.push(d));
  const title = `${childName} — Yearbook`;
  doc.fontSize(24).text(title, { align:'center' });
  doc.moveDown();
  for(const url of images.slice(0,60)){
    try{ doc.addPage(); doc.fontSize(16).text(url, {align:'left'}); }catch(e){}
  }
  doc.end();
  const buffer = Buffer.concat(chunks);
  const key = `artifacts/yearbooks/${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
  await minio.putObject(process.env.S3_BUCKET || 'lsc-bucket', key, buffer, { 'Content-Type':'application/pdf' });
  return key;
}
