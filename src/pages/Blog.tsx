/**
 * NEXUS-OS – Blogg
 * Listvy för alla blogginlägg med featured-sektion och kategorier
 */
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Zap } from "lucide-react";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Tag,
  User,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
}

const CATEGORY_COLORS: Record<string, string> = {
  "AI & Reglering": "bg-[oklch(0.18_0.04_155)] text-[oklch(0.75_0.18_155)] border-[oklch(0.35_0.12_155)]",
  "Hållbarhet & Reglering": "bg-[oklch(0.18_0.04_200)] text-[oklch(0.75_0.18_200)] border-[oklch(0.35_0.12_200)]",
  "Greenwashing & Integritet": "bg-[oklch(0.18_0.04_25)] text-[oklch(0.75_0.18_25)] border-[oklch(0.35_0.12_25)]",
  "Upphandling & Affärsutveckling": "bg-[oklch(0.18_0.04_55)] text-[oklch(0.75_0.18_55)] border-[oklch(0.35_0.12_55)]",
  "Cirkulär Ekonomi": "bg-[oklch(0.18_0.04_130)] text-[oklch(0.75_0.18_130)] border-[oklch(0.35_0.12_130)]",
};

export default function Blog() {
  const [seeding, setSeeding] = useState(false);
  const { data: allPosts = [], isLoading, refetch } = trpc.blog.list.useQuery();
  const seedMutation = trpc.blog.seed.useMutation();
  const featured = allPosts.filter((p) => p.featured);
  const rest = allPosts.filter((p) => !p.featured);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const result = await seedMutation.mutateAsync();
      toast.success(`${result.seeded} blogginlägg seedade`);
      await refetch();
    } catch (error) {
      toast.error("Kunde inte seeda blogginlägg");
      console.error(error);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[oklch(0.08_0.01_155)]">
        {/* Header */}
        <div className="border-b border-[oklch(0.2_0.04_155)] bg-[oklch(0.1_0.02_155)]">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[oklch(0.28_0.12_155)] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[oklch(0.75_0.18_155)]" />
              </div>
              <span className="text-[oklch(0.55_0.08_155)] text-sm font-mono uppercase tracking-widest">
                Nexus-OS Insikter
              </span>
            </div>
            <h1 className="text-4xl font-bold text-[oklch(0.92_0.04_155)] mb-4 leading-tight">
              Djupanalys om AI, hållbarhet<br />och EU-lagstiftning
            </h1>
            <p className="text-[oklch(0.65_0.06_155)] text-lg max-w-2xl">
              Seniora perspektiv från fältet – skrivet av Peter Johansson och Manus AI för tillverkare, upphandlare och hållbarhetsansvariga som vill förstå vad som händer nu.
            </p>
            {allPosts.length === 0 && (
              <Button
                onClick={handleSeed}
                disabled={seeding}
                size="sm"
                className="mt-4 bg-[oklch(0.65_0.18_155)] hover:bg-[oklch(0.72_0.18_155)] text-[oklch(0.08_0.01_155)]"
              >
                {seeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                Seeda blogginlägg
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.65_0.18_155)]" />
            </div>
          )}
          {!isLoading && allPosts.length === 0 && (
            <div className="text-center py-20 text-[oklch(0.55_0.06_155)]">Inga inlägg hittades.</div>
          )}
          {/* Featured posts */}
          {featured.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-[oklch(0.65_0.18_155)] rounded-full" />
                <span className="text-[oklch(0.65_0.18_155)] text-sm font-mono uppercase tracking-widest">
                  Utvalda inlägg
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {featured.map((post) => (
                  <Link key={post.slug} href={`/blogg/${post.slug}`}>
                    <article className="group h-full border border-[oklch(0.22_0.06_155)] rounded-xl bg-[oklch(0.11_0.02_155)] hover:border-[oklch(0.45_0.12_155)] hover:bg-[oklch(0.13_0.03_155)] transition-all duration-200 cursor-pointer overflow-hidden">
                      {/* Category bar */}
                      <div className="h-1 bg-gradient-to-r from-[oklch(0.55_0.18_155)] to-[oklch(0.45_0.14_200)]" />
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-xs font-mono px-2 py-1 rounded border ${CATEGORY_COLORS[post.category] ?? "bg-[oklch(0.18_0.04_155)] text-[oklch(0.65_0.12_155)] border-[oklch(0.3_0.08_155)]"}`}>
                            {post.category}
                          </span>
                          <span className="text-[oklch(0.45_0.06_155)] text-xs font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readingTime} min
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-[oklch(0.88_0.04_155)] mb-3 group-hover:text-[oklch(0.75_0.18_155)] transition-colors leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-[oklch(0.58_0.05_155)] text-sm leading-relaxed mb-5 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[oklch(0.28_0.1_155)] flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-[oklch(0.65_0.15_155)]" />
                            </div>
                            <div>
                              <p className="text-[oklch(0.72_0.08_155)] text-xs font-medium">{post.author}</p>
                              {post.coAuthor && (
                                <p className="text-[oklch(0.45_0.06_155)] text-xs flex items-center gap-1">
                                  <Cpu className="w-2.5 h-2.5" />
                                  {post.coAuthor}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[oklch(0.55_0.12_155)] text-xs font-mono group-hover:text-[oklch(0.75_0.18_155)] transition-colors">
                            Läs mer <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All other posts */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-[oklch(0.55_0.1_200)] rounded-full" />
              <span className="text-[oklch(0.55_0.1_200)] text-sm font-mono uppercase tracking-widest">
                Alla inlägg
              </span>
            </div>
            <div className="space-y-4">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blogg/${post.slug}`}>
                  <article className="group border border-[oklch(0.2_0.04_155)] rounded-xl bg-[oklch(0.11_0.02_155)] hover:border-[oklch(0.4_0.1_155)] hover:bg-[oklch(0.13_0.03_155)] transition-all duration-200 cursor-pointer p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${CATEGORY_COLORS[post.category] ?? "bg-[oklch(0.18_0.04_155)] text-[oklch(0.65_0.12_155)] border-[oklch(0.3_0.08_155)]"}`}>
                            {post.category}
                          </span>
                          <span className="text-[oklch(0.42_0.05_155)] text-xs font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.publishedAt instanceof Date ? post.publishedAt.toISOString() : String(post.publishedAt))}
                          </span>
                          <span className="text-[oklch(0.42_0.05_155)] text-xs font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readingTime} min
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-[oklch(0.85_0.04_155)] mb-2 group-hover:text-[oklch(0.75_0.18_155)] transition-colors leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-[oklch(0.55_0.05_155)] text-sm leading-relaxed line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {(post.tags ?? []).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-[oklch(0.48_0.06_155)] bg-[oklch(0.15_0.03_155)] border border-[oklch(0.22_0.04_155)] px-2 py-0.5 rounded-full flex items-center gap-1"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1 text-[oklch(0.5_0.1_155)] text-xs font-mono group-hover:text-[oklch(0.75_0.18_155)] transition-colors mt-1">
                        Läs <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-16 border border-[oklch(0.25_0.08_155)] rounded-xl bg-[oklch(0.12_0.03_155)] p-8 text-center">
            <h3 className="text-xl font-bold text-[oklch(0.88_0.04_155)] mb-2">
              Vill du bidra med ett inlägg?
            </h3>
            <p className="text-[oklch(0.58_0.06_155)] text-sm mb-5 max-w-md mx-auto">
              Vi välkomnar perspektiv från tillverkare, upphandlare, hållbarhetsansvariga och jurister som arbetar med EU:s hållbarhetslagstiftning i praktiken.
            </p>
            <Button
              variant="outline"
              className="border-[oklch(0.4_0.12_155)] text-[oklch(0.72_0.15_155)] hover:bg-[oklch(0.2_0.06_155)]"
              onClick={() => window.open("mailto:peter@jerker-ai.se?subject=Gästinlägg Nexus-OS Blogg", "_blank")}
            >
              Kontakta oss
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

