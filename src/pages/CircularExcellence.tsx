/**
 * CIRCULAR EXCELLENCE â€“ Utbildningsprogram
 * Design: Nordic Sustainability Intelligence
 * Full interaktivt lektionslÃ¤ge med framstegsspÃ¥rning, quiz och AI-assistent
 */

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import LessonView from "@/components/LessonView";
import CertificateView from "@/components/CertificateView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  GraduationCap, BookOpen, CheckCircle2, Clock, Star,
  Award, ChevronRight, Play, Lock, Leaf, Recycle,
  FileText, BarChart3, Globe, Zap, Users, TrendingUp,
  ChevronDown, ChevronUp, Trophy
} from "lucide-react";
import { LEARNING_PATHS, CERTIFICATIONS, levelColor } from "@/data/courseData";
import { getLessonContent, getCourseLessons } from "@/data/lessonContent";

// â”€â”€â”€ Local storage helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STORAGE_KEY = "nexus-os-course-progress";

function loadProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// â”€â”€â”€ Course sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourseSidebar({
  course,
  currentIndex,
  completedLessons,
  onSelectLesson,
}: {
  course: typeof LEARNING_PATHS[0];
  currentIndex: number;
  completedLessons: Set<string>;
  onSelectLesson: (index: number) => void;
}) {
  const completedCount = course.modules_list.filter((_, i) => {
    const lessonId = `${course.id}-${i}`;
    return completedLessons.has(lessonId);
  }).length;

  const pct = Math.round((completedCount / course.modules_list.length) * 100);

  return (
    <div className="w-72 flex-shrink-0 bg-white border-r border-[var(--sand-border)] flex flex-col">
      {/* Course header */}
      <div className="p-4 border-b border-[var(--sand-border)] bg-[var(--forest-deep)]">
        <div className="flex items-center gap-2 mb-2">
          <course.icon className="w-5 h-5 text-[var(--copper-light)]" />
          <span className="font-display font-bold text-white text-sm leading-tight">{course.title}</span>
        </div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/60">{completedCount}/{course.modules_list.length} avklarade</span>
          <span className="text-xs font-bold text-[var(--copper-light)]">{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5 bg-white/20" />
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {course.modules_list.map((mod, i) => {
          const lessonId = `${course.id}-${i}`;
          const isCompleted = completedLessons.has(lessonId);
          const isCurrent = currentIndex === i;
          const hasContent = !!getLessonContent(course.id, i);
          const isLocked = !mod.free && !hasContent;

          return (
            <button
              key={i}
              onClick={() => hasContent && onSelectLesson(i)}
              disabled={!hasContent}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-start gap-3 ${
                isCurrent
                  ? "bg-[var(--forest-deep)] text-white"
                  : isCompleted
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  : hasContent
                  ? "hover:bg-[var(--sand-light)] text-[var(--text-body)]"
                  : "opacity-50 cursor-not-allowed text-[var(--text-muted)]"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold border ${
                isCurrent ? "bg-[var(--copper)] border-[var(--copper)] text-white" :
                isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                "border-current"
              }`}>
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium leading-tight truncate">{mod.title}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-2.5 h-2.5 opacity-60" />
                  <span className="text-[10px] opacity-60">{mod.duration}</span>
                  {!hasContent && <Lock className="w-2.5 h-2.5 opacity-60" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Certification progress */}
      {pct === 100 && (
        <div className="p-3 border-t border-[var(--sand-border)] bg-emerald-50">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">Kurs avklarad!</span>
          </div>
          <p className="text-[10px] text-emerald-600 mt-0.5">Du kan nu ta certifieringsprovet.</p>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Course catalog card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourseCard({
  path,
  completedLessons,
  onStart,
}: {
  path: typeof LEARNING_PATHS[0];
  completedLessons: Set<string>;
  onStart: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const completedCount = path.modules_list.filter((_, i) => completedLessons.has(`${path.id}-${i}`)).length;
  const pct = Math.round((completedCount / path.modules_list.length) * 100);
  const hasStarted = completedCount > 0;
  const Icon = path.icon;

  return (
    <div className="bg-white border border-[var(--sand-border)] rounded-2xl overflow-hidden hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[var(--forest-deep)] rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-[var(--copper-light)]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--forest-deep)] text-lg leading-tight">{path.title}</h3>
              <p className="text-xs text-[var(--text-muted)]">{path.subtitle}</p>
            </div>
          </div>
          {path.free ? (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border text-xs">Gratis</Badge>
          ) : (
            <Lock className="w-4 h-4 text-[var(--text-muted)]" />
          )}
        </div>

        <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">{path.description}</p>

        {hasStarted && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[var(--text-muted)]">Framsteg</span>
              <span className="text-xs font-bold text-[var(--forest-deep)]">{completedCount}/{path.modules_list.length}</span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
        )}

        <div className="flex items-center gap-4 mb-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{path.duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{path.modules} moduler</span>
          <span className={`px-2 py-0.5 rounded-full border text-xs ${levelColor[path.level]}`}>{path.level}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="flex-1 bg-[var(--forest-deep)] hover:bg-[var(--forest-mid)] text-white gap-2"
            onClick={onStart}
          >
            {hasStarted ? (
              <><BookOpen className="w-4 h-4" />FortsÃ¤tt kurs</>
            ) : (
              <><Play className="w-4 h-4" />{path.free ? "Starta gratis" : "Starta kurs"}</>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-[var(--text-muted)]"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[var(--sand-border)] px-6 py-4 bg-[var(--sand-light)]">
          <h4 className="text-xs font-bold text-[var(--forest-deep)] uppercase tracking-wide mb-3">KursinnehÃ¥ll</h4>
          <div className="space-y-2">
            {path.modules_list.map((mod, i) => {
              const lessonId = `${path.id}-${i}`;
              const isCompleted = completedLessons.has(lessonId);
              return (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : mod.free ? (
                      <Play className="w-4 h-4 text-[var(--forest-mid)] flex-shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    )}
                    <span className={isCompleted ? "text-emerald-700" : "text-[var(--text-body)]"}>{mod.title}</span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">{mod.duration}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--sand-border)]">
            <h4 className="text-xs font-bold text-[var(--forest-deep)] uppercase tracking-wide mb-2">Du lÃ¤r dig</h4>
            <div className="grid grid-cols-1 gap-1.5">
              {path.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-2 text-xs text-[var(--text-body)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {outcome}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function CircularExcellence() {
  const [view, setView] = useState<"catalog" | "lesson">("catalog");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(loadProgress);
  const [showCertificate, setShowCertificate] = useState(false);

  const completedSet = new Set(Object.keys(completedLessons).filter((k) => completedLessons[k]));

  const activeCourse = LEARNING_PATHS.find((p) => p.id === activeCourseId);
  const activeLesson = activeCourse ? getLessonContent(activeCourse.id, activeLessonIndex) : null;
  const courseLessons = activeCourse ? getCourseLessons(activeCourse.id) : [];

  const handleStartCourse = (courseId: string) => {
    const course = LEARNING_PATHS.find((p) => p.id === courseId);
    if (!course) return;
    // Find first incomplete lesson that has content
    const lessons = getCourseLessons(courseId);
    const firstIncomplete = lessons.find((l) => !completedLessons[l.id]);
    const startIndex = firstIncomplete ? firstIncomplete.moduleIndex : 0;
    setActiveCourseId(courseId);
    setActiveLessonIndex(startIndex);
    setView("lesson");
  };

  const handleCompleteLesson = (lessonId: string) => {
    const updated = { ...completedLessons, [lessonId]: true };
    setCompletedLessons(updated);
    saveProgress(updated);
    // Check if all lessons in the course are now complete
    if (activeCourse) {
      const courseLessonsLocal = getCourseLessons(activeCourse.id);
      const allDone = courseLessonsLocal.every((l) => updated[l.id]);
      if (allDone) {
        setTimeout(() => setShowCertificate(true), 1200);
      }
    }
  };

  const handleNextLesson = () => {
    if (!activeCourse) return;
    const nextIndex = activeLessonIndex + 1;
    if (nextIndex < activeCourse.modules_list.length) {
      const nextLesson = getLessonContent(activeCourse.id, nextIndex);
      if (nextLesson) {
        setActiveLessonIndex(nextIndex);
      } else {
        toast.info("NÃ¤sta lektion krÃ¤ver Professional-plan.", {
          description: "Uppgradera fÃ¶r att lÃ¥sa upp alla lektioner.",
        });
      }
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    }
  };

  const totalCompleted = completedSet.size;

  return (
    <Layout>
      {view === "catalog" ? (
        <div className="min-h-screen bg-[var(--sand-light)]">
          {/* Hero */}
          <div className="bg-[var(--forest-deep)] text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 60% 30%, #b87333 0%, transparent 50%), radial-gradient(circle at 10% 70%, #2d6a4f 0%, transparent 60%)",
              }}
            />
            <div className="container py-14 relative z-10">
              <Badge className="bg-[var(--copper)] text-white border-0 text-xs font-medium tracking-wide mb-4">
                CIRCULAR EXCELLENCE PROGRAM
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Bli certifierad<br />
                <span className="text-[var(--copper-light)]">cirkulÃ¤r specialist</span>
              </h1>
              <p className="text-white/75 text-lg max-w-xl mb-8 leading-relaxed">
                Fyra praktiska kurser med interaktiva lektioner, quiz och AI-driven kursassistent.
                Certifieringen stÃ¤rker din ansÃ¶kan till Vinnova, Almi och EU-finansiering.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-white/60">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> FÃ¶rsta kursen gratis</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI-kursassistent i varje lektion</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Quiz och certifiering</span>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="bg-white border-b border-[var(--sand-border)]">
            <div className="container py-4">
              <div className="flex flex-wrap gap-8 text-center justify-center">
                {[
                  { icon: Users, value: "240+", label: "Deltagare hittills" },
                  { icon: BookOpen, value: "4", label: "Kurser" },
                  { icon: Award, value: "3", label: "CertifieringsnivÃ¥er" },
                  { icon: CheckCircle2, value: `${totalCompleted}`, label: "Dina avklarade lektioner" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[var(--copper)]" />
                    <span className="font-display font-bold text-[var(--forest-deep)]">{value}</span>
                    <span className="text-sm text-[var(--text-muted)]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="container py-10">
            {/* Learning paths */}
            <h2 className="font-display text-2xl font-bold text-[var(--forest-deep)] mb-6">
              VÃ¤lj din utbildningsvÃ¤g
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {LEARNING_PATHS.map((path) => (
                <CourseCard
                  key={path.id}
                  path={path}
                  completedLessons={completedSet}
                  onStart={() => handleStartCourse(path.id)}
                />
              ))}
            </div>

            {/* Certifications */}
            <h2 className="font-display text-2xl font-bold text-[var(--forest-deep)] mb-6">
              Certifieringar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.abbr} className="bg-white border border-[var(--sand-border)] rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm ${
                        cert.color === "copper"
                          ? "bg-[var(--copper)] text-white"
                          : cert.color === "emerald"
                          ? "bg-emerald-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {cert.abbr}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--forest-deep)] text-sm leading-tight">{cert.name}</h3>
                      <div className="text-xs text-[var(--copper)] font-medium">{cert.price}</div>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-3">{cert.description}</p>
                  <div className="text-xs text-[var(--text-muted)]">
                    <span className="font-medium">KrÃ¤ver: </span>
                    {cert.requires.join(", ")}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-[var(--forest-deep)] rounded-2xl p-8 text-white text-center">
              <GraduationCap className="w-12 h-12 text-[var(--copper-light)] mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold mb-2">BÃ¶rja med ESPR-grunden â€“ helt gratis</h3>
              <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
                Fyra interaktiva lektioner med quiz och AI-kursassistent. Ingen registrering krÃ¤vs.
              </p>
              <Button
                className="bg-[var(--copper)] hover:bg-[var(--copper-dark)] text-white border-0"
                onClick={() => handleStartCourse("espr-foundation")}
              >
                <Play className="w-4 h-4 mr-2" />
                Starta gratis kurs
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* â”€â”€ LESSON VIEW â”€â”€ */
        activeCourse && activeLesson ? (
          <div className="flex h-[calc(100vh-64px)]">
            <CourseSidebar
              course={activeCourse}
              currentIndex={activeLessonIndex}
              completedLessons={completedSet}
              onSelectLesson={(i) => setActiveLessonIndex(i)}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Back button */}
              <div className="bg-white border-b border-[var(--sand-border)] px-4 py-2 flex items-center gap-2">
                <button
                  onClick={() => setView("catalog")}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--forest-deep)] flex items-center gap-1 transition-colors"
                >
                  â† Tillbaka till kurskatalogen
                </button>
                <span className="text-[var(--sand-border)]">Â·</span>
                <span className="text-xs font-medium text-[var(--forest-deep)]">{activeCourse.title}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <LessonView
                  lesson={activeLesson}
                  totalLessons={courseLessons.length}
                  onComplete={handleCompleteLesson}
                  onNext={handleNextLesson}
                  onPrev={handlePrevLesson}
                  hasPrev={activeLessonIndex > 0}
                  hasNext={activeLessonIndex < activeCourse.modules_list.length - 1}
                  isCompleted={completedSet.has(activeLesson.id)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-[var(--text-muted)] mb-4">Lektion ej tillgÃ¤nglig</p>
              <Button onClick={() => setView("catalog")}>Tillbaka till kurser</Button>
            </div>
          </div>
        )      )}
      {showCertificate && activeCourse && (
        <CertificateView
          courseName={activeCourse.title}
          certAbbr="CEP"
          certName="Certified ESPR Practitioner"
          recipientName="Peter Johansson"
          completedDate={new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </Layout>
  );
}

