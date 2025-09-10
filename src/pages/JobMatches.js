
import React, { useState, useEffect, useCallback } from "react";
import { JobRecommendation } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Search, 
  Sparkles,
  ExternalLink,
  Filter,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function JobMatchesPage() {
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  const fetchNewJobs = useCallback(async (query) => {
    if (!query) return;
    setIsFetching(true);

    try {
      const prompt = `
        Find 5 real and current job postings for a '${query}'.
        For each job, provide the job title, company name, location, an estimated salary range, a brief description (2-3 sentences), required skills (as an array of strings), and a direct URL to the job posting.
        Return a JSON object with a "jobs" key containing an array of these job objects.
      `;
      
      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            jobs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  job_title: { type: "string" },
                  company: { type: "string" },
                  location: { type: "string" },
                  salary_range: { type: "string" },
                  job_description: { type: "string" },
                  required_skills: { type: "array", items: { type: "string" } },
                  job_url: { type: "string" },
                },
                required: ["job_title", "company", "location", "job_description", "job_url"]
              }
            }
          },
          required: ["jobs"]
        }
      });
      
      if (response.jobs && response.jobs.length > 0) {
        // Here you would typically match these jobs to a candidate/interview and save them.
        // For this page, we'll just display them directly.
        // Let's add mock match percentages.
        const newJobs = response.jobs.map(job => ({
          ...job,
          id: Math.random().toString(36).substr(2, 9), // mock id
          match_percentage: Math.floor(Math.random() * (98 - 75 + 1) + 75),
        }));
        setJobRecommendations(prevJobs => [...newJobs, ...prevJobs]);
        
        // Optionally save to DB
        // await JobRecommendation.bulkCreate(response.jobs.map(j => ({...j, interview_id: 'some_interview_id'})));
      }

    } catch (error) {
      console.error("Error fetching new jobs:", error);
    }
    setIsFetching(false);
  }, []); // Dependencies: setJobRecommendations, setIsLoading, setIsFetching are stable from useState

  const loadInitialJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const existingJobs = await JobRecommendation.list("-created_date", 20);
      if (existingJobs.length > 0) {
        setJobRecommendations(existingJobs);
      } else {
        fetchNewJobs("Software Engineer in USA");
      }
    } catch (error) {
      console.error("Error loading initial jobs:", error);
    }
    setIsLoading(false);
  }, [fetchNewJobs]); // Dependency: fetchNewJobs

  useEffect(() => {
    loadInitialJobs();
  }, [loadInitialJobs]); // Dependency: loadInitialJobs

  const handleSearch = (e) => {
    e.preventDefault();
    setJobRecommendations([]);
    fetchNewJobs(searchQuery);
  };

  const filteredJobs = jobRecommendations.filter(job => {
    const searchMatch = (job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) || job.company?.toLowerCase().includes(searchQuery.toLowerCase()));
    const locationMatch = locationFilter ? job.location?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    // jobTypeFilter is for demonstration, as we don't have this data from the API
    return searchMatch && locationMatch;
  });

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full mb-4">
             <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI-Powered Job Matches
          </h1>
          <p className="text-slate-600 text-lg">
            Discover job opportunities tailored to your skills and interview performance
          </p>
        </motion.div>

        {/* Search and Filters */}
        <Card className="mb-8 p-4 shadow-lg border-0 bg-white/60 backdrop-blur-sm">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search for job titles or companies..." 
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <Input 
                placeholder="Location" 
                className="h-12"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
              <Select onValueChange={setJobTypeFilter} defaultValue="all">
                <SelectTrigger className="w-[180px] h-12">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="lg" className="h-12 w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600" disabled={isFetching}>
              {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Find Jobs
            </Button>
          </form>
        </Card>

        {/* Job Listings */}
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader><div className="h-6 bg-slate-200 rounded w-3/4"></div></CardHeader>
                        <CardContent className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800">No Jobs Found</h3>
            <p className="text-slate-500 mt-2">Try a different search query to find your perfect job match.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold text-slate-900">{job.job_title}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">{job.match_percentage}% Match</Badge>
                      </div>
                      <p className="text-sm font-medium text-indigo-600">{job.company}</p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">{job.job_description}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.required_skills?.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                       <p className="text-sm font-semibold text-green-600 flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salary_range || "Competitive"}</p>
                      <Button asChild variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800">
                        <a href={job.job_url} target="_blank" rel="noopener noreferrer">
                          View Job <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
