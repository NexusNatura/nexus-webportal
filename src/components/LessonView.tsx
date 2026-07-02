/**
 * NEXUS-OS â€“ LessonView
 * Interaktivt lektionslÃ¤ge med lÃ¤svy, nyckelbegrepp, quiz och AI-assistent
 */

import { useState, useRef, useEffect } from "react";
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, BookOpen, Lightbulb, HelpCircle, MessageSquare, X, Send, Loader2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { LessonContent, QuizQuestion } from "@/data/lessonContent";

interface LessonViewProps {
  lesson: LessonContent;
  totalLessons: number;
  onComplete: (lessonId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isCompleted: boolean;
}

type Tab = "content" | "concepts" | "quiz";

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
}

export default function LessonView({
  lesson,
  totalLessons,
  onComplete,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
  isCompleted,
}: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      text: `Hej! Jag Ã¤r din kursassistent fÃ¶r "${lesson.title}". StÃ¤ll gÃ¤rna frÃ¥gor om innehÃ¥llet i denna lektion.`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const agentChatMutation = trpc.agent.chat.useMutation({
    onSuccess: (data) => {
      setChatMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    },
    onError: () => {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "TyvÃ¤rr kunde jag inte svara just nu. FÃ¶rsÃ¶k igen." },
      ]);
    },
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Reset quiz when lesson changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveTab("content");
    setChatMessages([
      {
        role: "assistant",
        text: `Hej! Jag Ã¤r din kursassistent fÃ¶r "${lesson.title}". StÃ¤ll gÃ¤rna frÃ¥gor om innehÃ¥llet i denna lektion.`,
      },
    ]);
  }, [lesson.id]);

  const quizScore = quizSubmitted
    ? lesson.quiz.filter((q) => quizAnswers[q.id] === q.correct).length
    : 0;
  const quizPassed = quizScore >= Math.ceil(lesson.quiz.length * 0.67); // 67% pass threshold

  const handleSubmitQuiz = () => {
    const unanswered = lesson.quiz.filter((q) => quizAnswers[q.id] == null);
    if (unanswered.length > 0) {
      toast.error(`Svara pÃ¥ alla ${lesson.quiz.length} frÃ¥gor innan du lÃ¤mnar in.`);
      return;
    }
    setQuizSubmitted(true);
    if (quizPassed && !isCompleted) {
      setTimeout(() => {
        onComplete(lesson.id);
        toast.success("Lektion avklarad! ðŸŽ‰", {
          description: `Du fick ${quizScore}/${lesson.quiz.length} rÃ¤tt.`,
        });
      }, 500);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim() || agentChatMutation.isPending) return;
    const userText = chatInput;
    setChatMessages((prev) => [...prev, { role: "user", text: userText }]);
    setChatInput("");
    agentChatMutation.mutate({
      agentId: "gwd-alpha",
      message: userText,
      context: `Du Ã¤r en kursassistent fÃ¶r Nexus-OS utbildningsplattform. Lektionen heter "${lesson.title}". KursinnehÃ¥ll: ${lesson.intro} ${lesson.sections.map((s) => s.heading + ": " + s.body).join(" ")}. Svara pÃ¥ svenska, pedagogiskt och koncist.`,
    });
  };

  const progressPct = Math.round(((lesson.moduleIndex + 1) / totalLessons) * 100);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-[var(--sand-border)] px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-medium">
              Lektion {lesson.moduleIndex + 1} av {totalLessons}
            </span>
            {isCompleted && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border text-xs gap-1">
                <CheckCircle2 className="w-3 h-3" /> Avklarad
              </Badge>
            )}
          </div>
          <span className="text-xs text-[var(--text-muted)]">{lesson.duration}</span>
        </div>
        <Progress value={progressPct} className="h-1.5 mb-3" />
        <h2 className="font-display text-xl font-bold text-[var(--forest-deep)]">{lesson.title}</h2>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[var(--sand-border)] bg-white">
        {(["content", "concepts", "quiz"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab
                ? "border-[var(--forest-deep)] text-[var(--forest-deep)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--forest-mid)]"
            }`}
          >
            {tab === "content" && <BookOpen className="w-3.5 h-3.5" />}
            {tab === "concepts" && <Lightbulb className="w-3.5 h-3.5" />}
            {tab === "quiz" && <HelpCircle className="w-3.5 h-3.5" />}
            {tab === "content" ? "InnehÃ¥ll" : tab === "concepts" ? "Nyckelbegrepp" : "Quiz"}
            {tab === "quiz" && quizSubmitted && (
              <span className={`text-xs font-bold ml-1 ${quizPassed ? "text-emerald-600" : "text-red-500"}`}>
                {quizScore}/{lesson.quiz.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="px-6 py-6 max-w-2xl">
            <p className="text-[var(--text-body)] text-base leading-relaxed mb-8 italic border-l-4 border-[var(--copper)] pl-4 bg-[var(--sand-light)] py-3 pr-3 rounded-r-lg">
              {lesson.intro}
            </p>

            {lesson.sections.map((section, i) => (
              <div key={i} className="mb-8">
                <h3 className="font-display text-lg font-bold text-[var(--forest-deep)] mb-3">
                  {section.heading}
                </h3>
                <p className="text-[var(--text-body)] leading-relaxed mb-3">{section.body}</p>
                {section.highlight && (
                  <div className="bg-[var(--forest-deep)] text-white rounded-xl px-5 py-3 text-sm font-medium">
                    ðŸ’¡ {section.highlight}
                  </div>
                )}
              </div>
            ))}

            {/* Practical tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-600 text-sm font-bold">ðŸ›  Praktiskt tips</span>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">{lesson.practicalTip}</p>
              {lesson.courseId === "dpp-creator" && (
                <a
                  href="/produktpass"
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[var(--forest-deep)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--forest-mid)] transition-colors"
                >
                  <span>ðŸ—‚</span> Ã–ppna DPP-verktyget
                </a>
              )}
            </div>
          </div>
        )}

        {/* CONCEPTS TAB */}
        {activeTab === "concepts" && (
          <div className="px-6 py-6 max-w-2xl">
            <p className="text-sm text-[var(--text-muted)] mb-5">
              Viktiga termer och definitioner frÃ¥n denna lektion.
            </p>
            <div className="space-y-3">
              {lesson.keyConcepts.map((concept) => (
                <div
                  key={concept.term}
                  className="bg-white border border-[var(--sand-border)] rounded-xl p-4"
                >
                  <div className="font-display font-bold text-[var(--forest-deep)] mb-1">
                    {concept.term}
                  </div>
                  <p className="text-sm text-[var(--text-body)] leading-relaxed">{concept.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === "quiz" && (
          <div className="px-6 py-6 max-w-2xl">
            {!quizSubmitted ? (
              <>
                <p className="text-sm text-[var(--text-muted)] mb-5">
                  Svara pÃ¥ {lesson.quiz.length} frÃ¥gor fÃ¶r att avklara lektionen. Du behÃ¶ver minst{" "}
                  {Math.ceil(lesson.quiz.length * 0.67)} rÃ¤tt.
                </p>
                {lesson.quiz.map((q, qi) => (
                  <QuizCard
                    key={q.id}
                    question={q}
                    index={qi}
                    selected={quizAnswers[q.id] ?? null}
                    onSelect={(idx) =>
                      setQuizAnswers((prev) => ({ ...prev, [q.id]: idx }))
                    }
                    submitted={false}
                  />
                ))}
                <Button
                  className="w-full bg-[var(--forest-deep)] hover:bg-[var(--forest-mid)] text-white h-11 mt-2"
                  onClick={handleSubmitQuiz}
                >
                  LÃ¤mna in svar
                </Button>
              </>
            ) : (
              <>
                {/* Score summary */}
                <div
                  className={`rounded-xl p-5 mb-6 text-center ${
                    quizPassed
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {quizPassed ? (
                    <>
                      <Award className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                      <div className="font-display text-2xl font-bold text-emerald-700 mb-1">
                        {quizScore}/{lesson.quiz.length} rÃ¤tt!
                      </div>
                      <p className="text-sm text-emerald-600">Lektion avklarad â€“ bra jobbat!</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                      <div className="font-display text-2xl font-bold text-red-600 mb-1">
                        {quizScore}/{lesson.quiz.length} rÃ¤tt
                      </div>
                      <p className="text-sm text-red-500">
                        Du behÃ¶ver {Math.ceil(lesson.quiz.length * 0.67)} rÃ¤tt. LÃ¤s igenom innehÃ¥llet och fÃ¶rsÃ¶k igen.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                      >
                        FÃ¶rsÃ¶k igen
                      </Button>
                    </>
                  )}
                </div>

                {/* Answer review */}
                {lesson.quiz.map((q, qi) => (
                  <QuizCard
                    key={q.id}
                    question={q}
                    index={qi}
                    selected={quizAnswers[q.id] ?? null}
                    onSelect={() => {}}
                    submitted={true}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div className="bg-white border-t border-[var(--sand-border)] px-6 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={!hasPrev}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          FÃ¶regÃ¥ende
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowChat(true)}
          className="gap-2 text-[var(--forest-mid)]"
        >
          <MessageSquare className="w-4 h-4" />
          FrÃ¥ga AI-assistenten
        </Button>

        <Button
          onClick={onNext}
          disabled={!hasNext}
          className="bg-[var(--forest-deep)] hover:bg-[var(--forest-mid)] text-white gap-2"
        >
          NÃ¤sta lektion
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* AI Chat Drawer */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowChat(false)} />
          <div className="relative w-96 bg-white shadow-2xl flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--sand-border)] bg-[var(--forest-deep)]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--copper-light)]" />
                <span className="text-sm font-bold text-white">AI-kursassistent</span>
              </div>
              <button onClick={() => setShowChat(false)} className="text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--forest-deep)] text-white"
                        : "bg-[var(--sand-light)] text-[var(--text-body)] border border-[var(--sand-border)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {agentChatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-[var(--sand-light)] border border-[var(--sand-border)] px-3 py-2 rounded-xl">
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--forest-mid)]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-[var(--sand-border)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="StÃ¤ll en frÃ¥ga om lektionen..."
                  disabled={agentChatMutation.isPending}
                  className="flex-1 border border-[var(--sand-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-mid)] disabled:opacity-50"
                />
                <Button
                  size="sm"
                  onClick={handleSendChat}
                  disabled={agentChatMutation.isPending || !chatInput.trim()}
                  className="bg-[var(--forest-deep)] hover:bg-[var(--forest-mid)] text-white"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Quiz Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function QuizCard({
  question,
  index,
  selected,
  onSelect,
  submitted,
}: {
  question: QuizQuestion;
  index: number;
  selected: number | null;
  onSelect: (idx: number) => void;
  submitted: boolean;
}) {
  return (
    <div className="bg-white border border-[var(--sand-border)] rounded-xl p-5 mb-4">
      <div className="flex items-start gap-2 mb-4">
        <span className="w-6 h-6 bg-[var(--forest-deep)] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-[var(--forest-deep)] leading-relaxed">{question.question}</p>
      </div>
      <div className="space-y-2">
        {question.options.map((option, oi) => {
          const isSelected = selected === oi;
          const isCorrect = question.correct === oi;
          let style = "border-[var(--sand-border)] bg-[var(--sand-light)] text-[var(--text-body)] hover:border-[var(--forest-mid)]";
          if (submitted) {
            if (isCorrect) style = "border-emerald-400 bg-emerald-50 text-emerald-800";
            else if (isSelected && !isCorrect) style = "border-red-400 bg-red-50 text-red-700";
            else style = "border-[var(--sand-border)] bg-white text-[var(--text-muted)] opacity-60";
          } else if (isSelected) {
            style = "border-[var(--forest-deep)] bg-[var(--forest-deep)]/5 text-[var(--forest-deep)]";
          }
          return (
            <button
              key={oi}
              disabled={submitted}
              onClick={() => onSelect(oi)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${style}`}
            >
              <span className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  borderColor: submitted && isCorrect ? "#16a34a" : submitted && isSelected ? "#dc2626" : isSelected ? "var(--forest-deep)" : "currentColor",
                }}>
                {submitted && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {submitted && isSelected && !isCorrect && <XCircle className="w-3.5 h-3.5 text-red-500" />}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {submitted && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 leading-relaxed">
          <span className="font-bold">FÃ¶rklaring: </span>{question.explanation}
        </div>
      )}
    </div>
  );
}

