import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export default function InterviewerPreview() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
          Meet Your AI Interviewer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Virtual Interviewer Avatar */}
        <div className="relative bg-white rounded-2xl p-6 shadow-inner">
          <div className="flex justify-center mb-4">
            <div className={`relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
              isAnimating ? 'scale-110' : 'scale-100'
            }`}>
              {/* Animated rings when speaking */}
              {isSpeaking && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping opacity-75" />
                  <div className="absolute inset-0 rounded-full border-4 border-purple-300 animate-ping opacity-50 animation-delay-200" />
                </>
              )}
              
              {/* Avatar Face */}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex flex-col items-center justify-center">
                  {/* Eyes */}
                  <div className="flex gap-2 mb-1">
                    <div className={`w-1.5 h-1.5 bg-white rounded-full transition-all duration-300 ${
                      isAnimating ? 'scale-0' : 'scale-100'
                    }`} />
                    <div className={`w-1.5 h-1.5 bg-white rounded-full transition-all duration-300 ${
                      isAnimating ? 'scale-0' : 'scale-100'
                    }`} />
                  </div>
                  {/* Mouth */}
                  <div className={`w-3 h-1 bg-white rounded-full transition-all duration-300 ${
                    isSpeaking ? 'scale-125' : 'scale-100'
                  }`} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-slate-900 mb-2">Sarah - AI Interview Coach</h3>
            <p className="text-sm text-slate-600 mb-4">
              I'll guide you through a realistic interview experience with personalized questions
            </p>
            
            <div className="flex justify-center gap-2">
              <Button
                size="sm"
                variant={isSpeaking ? "default" : "outline"}
                onClick={toggleSpeaking}
                className="gap-2"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isSpeaking ? 'Stop' : 'Demo Voice'}
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-slate-600">Natural conversation flow</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-slate-600">Real-time feedback and scoring</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span className="text-slate-600">Personalized question generation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}