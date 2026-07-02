import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Trophy, Clock, Star, PlayCircle, Puzzle } from "lucide-react";
import { MOCK_COURSES } from "@/data/mockCourses";

export default function AgentCommunity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredCourses = MOCK_COURSES.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || c.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Agent Community</h1>
          <p className="text-muted-foreground text-lg">Master the Nexus-OS ecosystem. Learn, build, and certify your AI agents.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm py-1"><Trophy className="w-4 h-4 mr-1 text-yellow-500" /> 1,250 Pts</Badge>
          <Badge variant="outline" className="text-sm py-1"><Star className="w-4 h-4 mr-1 text-primary" /> 2 Certs</Badge>
        </div>
      </div>

      {/* Logic Puzzle Banner */}
      <Card className="mb-8 bg-gradient-to-r from-primary/10 via-background to-secondary/20 border-primary/20 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Puzzle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-1">Dagens Logikpussel</h3>
              <p className="text-muted-foreground text-sm">Testa dina kunskaper och tjäna XP genom att bygga rätt arbetsflöde.</p>
            </div>
          </div>
          <Link href="/agent-community/puzzle">
            <Button className="shrink-0 font-bold shadow-sm transition-transform group-hover:scale-105">
              Spela Nu
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="md:col-span-1 bg-card/50 backdrop-blur border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><BookOpen className="w-5 h-5 mr-2 text-primary" /> My Learning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">EU AI Act Compliance</span>
                <span className="text-muted-foreground">60%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start text-xs" size="sm">
              <PlayCircle className="w-4 h-4 mr-2" /> Resume Course
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses..." 
                className="pl-9 bg-background/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {["all", "beginner", "intermediate", "advanced", "specialized"].map(cat => (
                <Button 
                  key={cat}
                  variant={filter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(cat)}
                  className="capitalize whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Card key={course.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow group border-border/50">
                <div className="aspect-video w-full overflow-hidden relative">
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <Badge className="absolute top-2 right-2 capitalize bg-background/80 text-foreground backdrop-blur">{course.category}</Badge>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg line-clamp-2 leading-tight">{course.title}</CardTitle>
                  <CardDescription className="flex items-center gap-3 text-xs mt-2">
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {course.duration}m</span>
                    <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {course.instructor}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/agent-community/course/${course.slug}`} className="w-full">
                    <Button className="w-full text-xs font-semibold" variant="default">View Course</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          {filteredCourses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-card/30 rounded-lg border border-dashed">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function User({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}

