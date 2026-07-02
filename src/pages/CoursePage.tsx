import React from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, PlayCircle, CheckCircle2, Clock, Trophy, FileText, Lock } from "lucide-react";
import { MOCK_COURSES } from "@/data/mockCourses";

// Mock lessons
const MOCK_LESSONS = [
  { id: 1, title: "Introduction to Deterministic AI", duration: 15, isCompleted: true, isLocked: false },
  { id: 2, title: "Structuring JSON Prompts", duration: 20, isCompleted: false, isLocked: false },
  { id: 3, title: "Handling Edge Cases in Multi-Agent Systems", duration: 25, isCompleted: false, isLocked: true },
  { id: 4, title: "Final Assessment & Certification", duration: 30, isCompleted: false, isLocked: true }
];

export default function CoursePage() {
  const [match, params] = useRoute("/agent-community/course/:slug");
  const slug = params?.slug;
  
  const course = MOCK_COURSES.find(c => c.slug === slug) || MOCK_COURSES[0];
  const progress = 25; // Mock progress (25%)

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl animate-in fade-in duration-500">
      <Link href="/agent-community" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Community
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="capitalize bg-primary/10 text-primary border-primary/20">{course.category}</Badge>
              <Badge variant="secondary">Level {course.level}</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
          </div>

          <div className="aspect-video w-full rounded-xl overflow-hidden relative group cursor-pointer bg-black/50 border border-border/50">
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground transform group-hover:scale-110 transition-transform shadow-lg">
                <PlayCircle className="w-8 h-8 ml-1" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Course Syllabus</h2>
            <div className="space-y-3">
              {MOCK_LESSONS.map((lesson, index) => (
                <div key={lesson.id} className={`flex items-center justify-between p-4 rounded-lg border ${lesson.isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-card'} ${lesson.isLocked ? 'opacity-60 grayscale' : 'hover:border-primary/50 transition-colors'}`}>
                  <div className="flex items-center gap-4">
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : lesson.isLocked ? (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-primary/50 flex items-center justify-center text-xs font-bold">{index + 1}</div>
                    )}
                    <div>
                      <h3 className={`font-medium ${lesson.isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>{lesson.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center mt-1"><Clock className="w-3 h-3 mr-1" /> {lesson.duration} mins</p>
                    </div>
                  </div>
                  {!lesson.isLocked && !lesson.isCompleted && (
                    <Link href={`/agent-community/lesson/${course.slug}/${lesson.id}`}>
                      <Button variant="outline" size="sm">Start Lesson</Button>
                    </Link>
                  )}
                  {lesson.isCompleted && (
                     <Button variant="ghost" size="sm" className="text-primary hover:text-primary">Review</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{progress}% Completed</span>
                  <span>1 / 4 Lessons</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Link href={`/agent-community/lesson/${course.slug}/2`} className="w-full block">
                <Button className="w-full" size="lg">Continue Learning</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground"><Clock className="w-4 h-4 mr-3 text-primary" /> {course.duration} minutes total</div>
              <div className="flex items-center text-sm text-muted-foreground"><FileText className="w-4 h-4 mr-3 text-primary" /> 4 interactive modules</div>
              <div className="flex items-center text-sm text-muted-foreground"><Trophy className="w-4 h-4 mr-3 text-primary" /> Official Nexus-OS Certificate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

