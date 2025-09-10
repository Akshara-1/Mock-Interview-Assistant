import React, { useState, useEffect } from "react";
import { Resume, MockInterview } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Brain, 
  FileText, 
  Mic, 
  Trophy, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import StatsOverview from "../components/dashboard/StatsOverview";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import InterviewerPreview from "../components/dashboard/InterviewerPreview";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [resumeData, interviewData] = await Promise.all([
        Resume.list("-created_date", 10),
        MockInterview.list("-created_date", 5)
      ]);
      setResumes(resumeData);
      setInterviews(interviewData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getStats = () => {
    const completedInterviews = interviews.filter(i => i.status === 'completed');
    const avgScore = completedInterviews.length > 0 
      ? completedInterviews.reduce((sum, i) => sum + (i.overall_score || 0), 0) / completedInterviews.length 
      : 0;
    
    return {
      totalResumes: resumes.length,
      completedInterviews: completedInterviews.length,
      averageScore: Math.round(avgScore),
      inProgressInterviews: interviews.filter(i => i.status === 'in_progress').length
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Welcome to InterviewAI
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Master your interview skills with AI-powered mock interviews and personalized feedback
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} isLoading={isLoading} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Actions & Activity */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            <RecentActivity interviews={interviews} isLoading={isLoading} />
          </div>

          {/* Right Column - Interviewer Preview */}
          <div className="space-y-8">
            <InterviewerPreview />
            
            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Target className="w-5 h-5" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-amber-700">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <p>Use good quality headphones for clear audio recording</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <p>Practice in a quiet environment with good lighting</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <p>Take your time to think before answering questions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}