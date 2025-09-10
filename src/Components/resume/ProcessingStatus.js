import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Brain } from "lucide-react";

export default function ProcessingStatus({ progress }) {
  const getStatusMessage = () => {
    if (progress < 30) return "Uploading your resume...";
    if (progress < 70) return "Analyzing content with AI...";
    if (progress < 90) return "Extracting skills and experience...";
    return "Finalizing analysis...";
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          Processing Your Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {getStatusMessage()}
          </h3>
          <p className="text-slate-600">
            Our AI is carefully analyzing your resume to provide detailed insights
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium text-slate-900">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="bg-white/60 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                progress > 20 ? 'bg-green-500' : 'bg-slate-300'
              }`} />
              <span className="text-xs text-slate-600">Upload</span>
            </div>
            <div>
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                progress > 60 ? 'bg-green-500' : progress > 20 ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
              }`} />
              <span className="text-xs text-slate-600">Analyze</span>
            </div>
            <div>
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                progress > 90 ? 'bg-green-500' : progress > 60 ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
              }`} />
              <span className="text-xs text-slate-600">Complete</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}