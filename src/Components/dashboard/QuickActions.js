import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Mic, Upload, ArrowRight } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Upload Resume",
      description: "Start by uploading your resume for AI analysis",
      icon: Upload,
      href: createPageUrl("ResumeUpload"),
      gradient: "from-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      title: "Start Mock Interview",
      description: "Begin an AI-powered interview session",
      icon: Mic,
      href: createPageUrl("MockInterview"),
      gradient: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50"
    }
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Link key={action.title} to={action.href} className="block">
              <Card className={`bg-gradient-to-br ${action.bgGradient} border-0 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{action.description}</p>
                      <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900 p-0">
                        Get Started <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}