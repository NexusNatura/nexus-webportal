import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, ChevronRight, PlayCircle, Code } from "lucide-react";

export default function LessonPage() {
  const [match, params] = useRoute("/agent-community/lesson/:courseSlug/:lessonId");
  const courseSlug = params?.courseSlug;
  
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/agent-community/course/${courseSlug}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Syllabus
        </Link>
        <div className="flex items-center gap-4 w-1/3">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Lesson 2 of 4</span>
          <Progress value={50} className="h-1.5" />
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Structuring JSON Prompts</h1>
          <p className="text-muted-foreground">Learn how to constrain large language models to output predictable JSON schemas required by the WA-04 Policy Gate.</p>
        </div>

        {/* Video Player Mock */}
        <div className="aspect-video w-full rounded-xl bg-black border border-border/50 relative overflow-hidden flex items-center justify-center">
           <div className="absolute top-4 left-4 flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <PlayCircle className="w-16 h-16 text-white/50 hover:text-white transition-colors cursor-pointer" />
        </div>

        {/* Content Area */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h3>Why Deterministic Output Matters</h3>
          <p>
            When integrating agents into enterprise pipelines like the <strong>Nexus-OS Ledger</strong>, natural language responses are dangerous. 
            If an agent outputs "Sure, the total weight is 50kg" instead of <code>{`{"weightKg": 50}`}</code>, the ingestion pipeline will crash.
          </p>
          
          <div className="bg-card p-6 rounded-lg border my-6 font-mono text-sm relative">
            <div className="absolute top-0 right-0 bg-primary/20 text-primary px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs flex items-center"><Code className="w-3 h-3 mr-1" /> Prompt Example</div>
            <span className="text-muted-foreground">// BAD PROMPT</span><br/>
            <span className="text-red-400">Extract the LCA data from this certificate.</span>
            <br/><br/>
            <span className="text-muted-foreground">// GOOD PROMPT</span><br/>
            <span className="text-green-400">Extract the LCA data. You must respond ONLY with a valid JSON object matching this schema:</span><br/>
            <span className="text-blue-300">{`{ "co2SavedKg": number, "material": string }`}</span>
          </div>
        </div>

        {/* Interactive Knowledge Check */}
        <Card className="border-primary/30 bg-primary/5 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-primary" /> Knowledge Check</h3>
            <p className="mb-6 text-muted-foreground">Which of the following is the best way to enforce JSON structure in Gemini?</p>
            
            <div className="space-y-3">
              {[
                "Ask politely in the prompt to format as JSON.",
                "Use the 'responseMimeType: application/json' config parameter.",
                "Write a regex script to parse the output."
              ].map((answer, i) => (
                <div 
                  key={i}
                  onClick={() => !quizAnswered && setSelectedAnswer(i)}
                  className={`p-4 rounded-md border cursor-pointer transition-all ${quizAnswered ? (i === 1 ? 'bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-300' : (selectedAnswer === i ? 'bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300' : 'bg-card opacity-50')) : (selectedAnswer === i ? 'border-primary bg-primary/10' : 'bg-card hover:border-primary/50')}`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedAnswer === i ? 'border-primary' : 'border-muted-foreground'}`}>
                      {selectedAnswer === i && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                    </div>
                    {answer}
                  </div>
                </div>
              ))}
            </div>

            {!quizAnswered && selectedAnswer !== null && (
              <Button className="mt-6 w-full" onClick={() => setQuizAnswered(true)}>Submit Answer</Button>
            )}

            {quizAnswered && (
              <div className="mt-6 p-4 bg-card border rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                <div>
                  {selectedAnswer === 1 ? (
                    <p className="font-semibold text-green-500 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Correct! Native API config is the most robust method.</p>
                  ) : (
                    <p className="font-semibold text-red-500">Incorrect. Relying on prompt text alone or parsing regex is prone to hallucinations.</p>
                  )}
                </div>
                {selectedAnswer === 1 && (
                  <Link href={`/agent-community/course/${courseSlug}`}>
                    <Button>Continue to Next Lesson <ChevronRight className="w-4 h-4 ml-1" /></Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

