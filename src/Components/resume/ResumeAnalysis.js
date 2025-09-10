import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, Briefcase, GraduationCap, Award, ArrowRight, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ResumeAnalysis({ resume, onStartInterview }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">Resume Analysis Complete!</h3>
              <p className="text-green-700">Your resume has been successfully analyzed and scored</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ATS Score */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-6 h-6 bg-gradient-to-r ${getScoreBg(resume.ats_score)} rounded-lg flex items-center justify-center`}>
                <Award className="w-4 h-4 text-white" />
              </div>
              ATS Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className={`text-4xl font-bold ${getScoreColor(resume.ats_score)} mb-2`}>
                {resume.ats_score}%
              </div>
              <Progress value={resume.ats_score} className="h-2" />
            </div>
            <p className="text-sm text-slate-600 text-center">
              Your resume compatibility with Applicant Tracking Systems
            </p>
          </CardContent>
        </Card>

        {/* Recommended Domain */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              Best Fit Domain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-lg px-4 py-2">
                {resume.recommended_domain}
              </Badge>
              <p className="text-sm text-slate-600 mt-3">
                Based on your skills and experience analysis
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {resume.experience_years} Years
              </div>
              <p className="text-sm text-slate-600">
                Total professional experience
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Info & Skills */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-slate-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">{resume.candidate_name}</h4>
              <div className="space-y-1 text-sm text-slate-600">
                {resume.email && <p>Email: {resume.email}</p>}
                {resume.phone && <p>Phone: {resume.phone}</p>}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {resume.skills?.slice(0, 10).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education & Experience */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-slate-600" />
              Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Education</h4>
              {resume.education?.slice(0, 2).map((edu, index) => (
                <div key={index} className="text-sm text-slate-600 mb-1">
                  <p className="font-medium">{edu.degree}</p>
                  <p>{edu.institution} • {edu.year}</p>
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Recent Experience</h4>
              {resume.work_experience?.slice(0, 2).map((exp, index) => (
                <div key={index} className="text-sm text-slate-600 mb-2">
                  <p className="font-medium">{exp.position}</p>
                  <p>{exp.company} • {exp.duration}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready for Your Mock Interview?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Now that we've analyzed your resume, let's put your skills to the test with a personalized mock interview 
            tailored to your background and target role.
          </p>
          <Button
            onClick={onStartInterview}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Start Mock Interview <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}