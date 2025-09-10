
import React, { useState, useEffect, useCallback } from "react";
import { MockInterview, Question, Response as InterviewResponse } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Clock, 
  Award, 
  TrendingUp, 
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Calendar,
  Target,
  Mic
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSessionDetails = useCallback(async (sessionId) => {
    try {
      const [questions, responses] = await Promise.all([
        Question.filter({ session_id: sessionId }),
        InterviewResponse.filter({ session_id: sessionId })
      ]);

      setSessionDetails({
        questions,
        responses
      });
    } catch (error) {
      console.error("Error loading session details:", error);
    }
  }, []); // Empty dependency array as it doesn't depend on external state/props that change

  const handleSessionSelect = useCallback((session) => {
    setSelectedSession(session);
    loadSessionDetails(session.id);
  }, [loadSessionDetails]); // Depends on loadSessionDetails

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await MockInterview.list("-created_date");
      setSessions(data);
      if (data.length > 0) {
        // Automatically select the first session if none is selected
        if (!selectedSession) {
            handleSessionSelect(data[0]);
        }
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
    setIsLoading(false);
  }, [selectedSession, handleSessionSelect]); // Depends on selectedSession and handleSessionSelect

  useEffect(() => {
    loadSessions();
  }, [loadSessions]); // Depends on loadSessions

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (!score) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Interview Results
          </h1>
          <p className="text-slate-600 text-lg">
            Review your mock interview performance and track your progress
          </p>
        </motion.div>

        {sessions.length === 0 && !isLoading ? (
          <Card className="text-center p-12 shadow-lg border-0">
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="w-12 h-12 text-slate-400" />
              </div>
            <h2 className="text-2xl font-semibold mb-2">No interviews taken yet</h2>
            <p className="text-slate-500 mb-6">Complete a mock interview to see your results and get job recommendations.</p>
            <Button onClick={() => navigate(createPageUrl('MockInterview'))} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Your First Interview
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sessions List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Your Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <motion.div
                          key={session.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSessionSelect(session)}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedSession?.id === session.id
                              ? 'bg-blue-100 shadow-md ring-2 ring-blue-500'
                              : 'bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-slate-900">{session.target_role}</p>
                              <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3"/>
                                {format(new Date(session.created_date), "MMM d, yyyy")}
                              </p>
                            </div>
                            {getStatusIcon(session.status)}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                             <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                             {session.overall_score !== null && typeof session.overall_score !== 'undefined' && (
                               <p className={`font-bold text-lg ${getScoreColor(session.overall_score)}`}>
                                 {Math.round(session.overall_score)}%
                               </p>
                             )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Selected Session Details */}
            {selectedSession && (
              <motion.div
                key={selectedSession.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600"/>
                        Session Details
                      </span>
                      <Badge variant="secondary">{selectedSession.target_role}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="questions">Q&A Breakdown</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="mt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg"><Award className="w-5 h-5 text-amber-500"/>Overall Performance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <p className={`text-6xl font-bold ${getScoreColor(selectedSession.overall_score)}`}>{Math.round(selectedSession.overall_score || 0)}%</p>
                                        <Progress value={selectedSession.overall_score || 0} className="mt-4 h-2" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-6 text-center">
                                        <div>
                                            <p className="text-sm text-slate-500">Strengths</p>
                                            <p className="font-semibold text-slate-800">{selectedSession.strengths?.join(', ') || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Improvement Areas</p>
                                            <p className="font-semibold text-slate-800">{selectedSession.improvement_areas?.join(', ') || 'N/A'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="w-5 h-5 text-green-500"/>Score Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     {/* Mock data for score breakdown */}
                                    <div className="flex justify-between items-center">
                                        <p>Technical Skills</p>
                                        <Progress value={85} className="w-1/2 h-2" />
                                        <p className="font-semibold">85%</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p>Communication</p>
                                        <Progress value={92} className="w-1/2 h-2" />
                                        <p className="font-semibold">92%</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p>Problem Solving</p>
                                        <Progress value={78} className="w-1/2 h-2" />
                                        <p className="font-semibold">78%</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                      </TabsContent>
                      <TabsContent value="questions" className="mt-4">
                        <div className="space-y-4">
                            {sessionDetails?.questions?.map((q, index) => {
                                const response = sessionDetails.responses.find(r => r.question_id === q.id);
                                return (
                                    <Card key={q.id}>
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold">Q{index+1}: {q.question}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {response ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-slate-600"><strong>Feedback:</strong> {response.feedback}</p>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm"><strong>Score:</strong></p>
                                                        <p className={`font-bold ${getScoreColor(response.ai_score)}`}>{response.ai_score}%</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500">No response recorded.</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
