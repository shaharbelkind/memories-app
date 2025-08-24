'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface UploadZoneProps {
  childId: string;
  onUploadComplete?: () => void;
}

export function UploadZone({ childId, onUploadComplete }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const kind = getFileKind(file);
        await api.uploadMemory(childId, file, kind);
        setUploadProgress(((i + 1) / acceptedFiles.length) * 100);
      }
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [childId, onUploadComplete]);

  const getFileKind = (file: File): string => {
    if (file.type.startsWith('image/')) return 'PHOTO';
    if (file.type.startsWith('video/')) return 'VIDEO';
    if (file.type.startsWith('audio/')) return 'AUDIO';
    return 'DOC';
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDrop(Array.from(e.dataTransfer.files));
    }
  }, [onDrop]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onDrop(Array.from(e.target.files));
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
        ${dragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
        ${uploading ? 'opacity-75 cursor-not-allowed' : ''}
      `}
    >
      <input 
        type="file" 
        multiple 
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      {uploading ? (
        <div className="space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 mb-2">Uploading memories...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{Math.round(uploadProgress)}% complete</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
            <div className="relative">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {dragActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-3">
              {dragActive ? 'Drop your memories here!' : 'Upload Precious Moments'}
            </p>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Drag and drop photos, videos, or audio files here, or click to select from your device
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-gray-100 rounded-full">Photos</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">Videos</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">Audio</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">Documents</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
