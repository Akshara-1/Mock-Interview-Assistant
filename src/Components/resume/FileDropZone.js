import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function FileDropZone({ 
  file, 
  dragActive, 
  onDrag, 
  onDrop, 
  onFileInput, 
  onRemoveFile 
}) {
  return (
    <Card className={`shadow-lg border-2 border-dashed transition-all duration-300 ${
      dragActive 
        ? "border-blue-400 bg-blue-50 scale-105" 
        : "border-slate-200 bg-white/80 backdrop-blur-sm hover:border-slate-300"
    }`}>
      <CardContent 
        className="p-12"
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.doc,.docx"
          onChange={onFileInput}
          className="hidden"
        />
        
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10 text-blue-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Upload Your Resume
          </h3>
          <p className="text-slate-600 mb-6">
            Drag and drop your resume here, or click to browse files
          </p>
          
          <Button
            onClick={() => document.getElementById('resume-upload')?.click()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mb-6"
          >
            <FileText className="w-4 h-4 mr-2" />
            Choose File
          </Button>
          
          <Separator className="my-6" />
          
          <div className="text-sm text-slate-500">
            <p className="mb-2">Supported formats: PDF, DOC, DOCX</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}