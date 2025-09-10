import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MockInterview, Resume, Question } from '@/entities/all';
import { InvokeLLM } from '@/integrations/Core';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mic, Video, Settings, PhoneOff, ArrowLeft, Headphones, Loader2 } from 'lucide-react';

// Main Components
import InterviewWindow from '../components/interview/InterviewWindow';
import Controls from '../components/interview/Controls';
import SetupScreen from '../components/interview/SetupScreen';
import InterviewCompletedScreen from '../components/interview/InterviewCompletedScreen';

export default function MockInterviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [resume, setResume] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewState, setInterviewState] = useState('setup'); // 'setup', 'in_progress', 'completed'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeInterview = async () => {
      const params = new URLSearchParams(location.search);
      const resumeId = params.get('resume_id');
      const targetRole = params.get('role') || 'Software Engineer'; // default role

      if (!resumeId) {
        setError("No resume specified. Please start from the resume analysis page.");
        setIsLoading(false);
        return;
      }

      try {
        const resumeData = await Resume.get(resumeId);
        setResume(resumeData);

        // 1. Create a mock interview session
        const newSession = await MockInterview.create({
          resume_id: resumeId,
          target_role: targetRole,
          status: 'scheduled',
        });
        setSession(newSession);

        // 2. Generate questions using AI based on resume and role
        const questionPrompt = `
          Generate a set of 5 diverse interview questions for a candidate applying for the role of ${targetRole}.
          The candidate's resume shows skills like: ${resumeData.skills?.join(', ')} and ${resumeData.experience_years} years of experience.
          Mix technical, behavioral, and situational questions.
          Return a JSON array with objects, each having "question" (string), "type" (enum: "technical", "behavioral", "situational"), and "difficulty" (enum: "easy", "medium", "hard").
        `;

        const generatedQuestions = await InvokeLLM({
          prompt: questionPrompt,
          response_json_schema: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    type: { type: "string", enum: ["technical", "behavioral", "situational"] },
                    difficulty: { type: "string", enum: ["easy", "medium", "hard"] }
                  },
                  required: ["question", "type", "difficulty"]
                }
              }
            },
            required: ["questions"]
          }
        });

        if (generatedQuestions.questions && generatedQuestions.questions.length > 0) {
          // 3. Save questions to the database, linked to the session
          const questionsToSave = generatedQuestions.questions.map(q => ({ ...q, session_id: newSession.id }));
          await Question.bulkCreate(questionsToSave);
          setQuestions(questionsToSave);
        } else {
          throw new Error("AI failed to generate questions.");
        }
        
        setIsLoading(false);

      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to set up the interview. Please try again.");
        setIsLoading(false);
      }
    };

    initializeInterview();
  }, [location.search]);

  const startInterview = () => {
    if (session) {
      MockInterview.update(session.id, { status: 'in_progress', started_at: new Date().toISOString() });
      setInterviewState('in_progress');
    }
  };

  const endInterview = async () => {
    if (session) {
      await MockInterview.update(session.id, { status: 'completed', completed_at: new Date().toISOString() });
      setInterviewState('completed');
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      endInterview();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <Loader2 className="mr-4 h-8 w-8 animate-spin" />
        <p className="text-xl">Preparing your personalized interview...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex h-screen items-center justify-center p-4 bg-slate-100">
          <Alert variant="destructive" className="max-w-lg">
            <AlertTitle>Interview Setup Failed</AlertTitle>
            <AlertDescription>
              {error}
              <Button onClick={() => navigate(createPageUrl('ResumeUpload'))} className="mt-4 w-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
              </Button>
            </AlertDescription>
          </Alert>
       </div>
    );
  }

  const renderContent = () => {
    switch (interviewState) {
      case 'setup':
        return (
          <SetupScreen 
            onResumeUploadClick={() => navigate(createPageUrl('ResumeUpload'))}
            onStartInterview={startInterview}
            targetRole={session.target_role}
            questionCount={questions.length}
          />
        );
      case 'in_progress':
        return (
          <div className="flex h-full flex-col">
            <InterviewWindow
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              sessionId={session.id}
            />
            <Controls onNext={handleNextQuestion} onEnd={endInterview} />
          </div>
        );
      case 'completed':
        return <InterviewCompletedScreen sessionId={session.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full bg-slate-900 text-white font-sans">
      <main className="relative mx-auto h-full max-w-7xl">
        {renderContent()}
      </main>
    </div>
  );
}