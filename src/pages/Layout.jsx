// src/pages/Layout.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Brain, FileText, Mic, Trophy, Briefcase, Home, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: Home },
  { title: "Upload Resume", url: createPageUrl("ResumeUpload"), icon: FileText },
  { title: "Mock Interview", url: createPageUrl("MockInterview"), icon: Mic },
  { title: "Results", url: createPageUrl("Results"), icon: Trophy },
  { title: "Job Matches", url: createPageUrl("JobMatches"), icon: Briefcase },
];

const managementNav = [
  { title: "Candidates", url: createPageUrl("Candidates"), icon: Users },
];

export default function Layout({ children }) {
  const location = useLocation();

  const NavGroup = ({ label, items }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl mb-1 font-medium ${
                  location.pathname === item.url ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm' : ''
                }`}
              >
                <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        :root {
          --primary: 220 91% 58%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96%;
          --secondary-foreground: 222.2 84% 4.9%;
          --muted: 210 40% 96%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96%;
          --accent-foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 220 91% 58%;
        }
      `}</style>
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <SidebarHeader className="border-b border-slate-200/60 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">InterviewAI</h2>
                  <p className="text-xs text-slate-500">Smart Mock Interviews</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <NavGroup label="Interview Journey" items={mainNav} />
              <NavGroup label="Management" items={managementNav} />
            </SidebarContent>

            <SidebarFooter className="border-b border-slate-200/60 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">Candidate</p>
                  <p className="text-xs text-slate-500 truncate">Ready for your interview?</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white/60 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                <h1 className="text-xl font-bold text-slate-900">InterviewAI</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}