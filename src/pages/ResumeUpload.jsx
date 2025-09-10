import React, { useState, useCallback } from "react";
import { Resume } from "@/entities/all";
import { UploadFile, ExtractDataFromUploadedFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, CheckCircle, FileText, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Progress } from "@/components/ui/progress";

import FileDropZone from "../components/resume/FileDropZone";
import ResumeAnalysis from "../components/resume/ResumeAnalysis";
import ProcessingStatus from "../components/resume/ProcessingStatus";

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || 
        droppedFile.name.endsWith('.docx') || droppedFile.name.endsWith('.doc'))) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF or Word document (.doc, .docx)");
    }
  }, []);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const processResume = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Upload file
      setProgress(20);
      const { file_url } = await UploadFile({ file });
      
      // Extract data using AI
      setProgress(60);
      const extractedData = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: Resume.schema()
      });

      setProgress(80);
      
      if (extractedData.status === "success" && extractedData.output) {
        // Create resume record
        const resumeData = {
          ...extractedData.output,
          file_url,
          parsing_status: "completed"
        };
        
        const savedResume = await Resume.create(resumeData);
        setProgress(100);
        setAnalysisResult(savedResume);
      } else {
        throw new Error(extractedData.details || "Failed to extract resume data");
      }
    } catch (error) {
      setError("Error processing resume. Please try again.");
      console.error("Resume processing error:", error);
    }
    
    setIsProcessing(false);
  };

  const startInterview = () => {
    navigate(createPageUrl("MockInterview") + `?resume_id=${analysisResult.id}`);
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Resume Analysis
            </h1>
            <p className="text-slate-600 mt-1">Upload your resume for AI-powered analysis and ATS scoring</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {!analysisResult && !isProcessing && (
            <FileDropZone
              file={file}
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onFileInput={handleFileInput}
              onRemoveFile={() => setFile(null)}
            />
          )}

          {file && !isProcessing && !analysisResult && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{file.name}</h3>
                      <p className="text-sm text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={processResume}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Analyze Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isProcessing && (
            <ProcessingStatus progress={progress} />
          )}

          {analysisResult && (
            <ResumeAnalysis 
              resume={analysisResult}
              onStartInterview={startInterview}
            />
          )}
        </div>
      </div>
    </div>
  );
}