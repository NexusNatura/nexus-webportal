/**
 * NEXUS-OS – Blogginlägg artikelvy
 * Full läsvy med Markdown-rendering, metadata och relaterade inlägg
 */
import { useParams, Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  User,
  Cpu,
  Tag,
  Share2,
  Link2,
  
  Check,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

function formatDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
}

const CATEGORY_COLORS: Record<string, string> = {
  "AI & Reglering": "bg-[oklch(0.18_0.04_155)] text-[oklch(0.75_0.18_155)] border-[oklch(0.35_0.12_155)]",
  "Hållbarhet & Reglering": "bg-[oklch(0.18_0.04_200)] text-[oklch(0.75_0.18_200)] border-[oklch(0.35_0.12_200)]",
  "Greenwashing & Integritet": "bg-[oklch(0.18_0.04_25)] text-[oklch(0.75_0.18_25)] border-[oklch(0.35_0.12_25)]",
  "Upphandling & Affärsutveckling": "bg-[oklch(0.18_0.04_55)] text-[oklch(0.75_0.18_55)] border-[oklch(0.35_0.12_55)]",
  "Cirkulär Ekonomi": "bg-[oklch(0.18_0.04_130)] text-[oklch(0.75_0.18_130)] border-[oklch(0.35_0.12_130)]",
};

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: params.slug ?? "" });
  const { data: allPosts = [] } = trpc.blog.list.useQuery();

  const [copied, setCopied] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    toast.success("Länk kopierad till urklipp");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLinkedInShare = () => {
    if (!post) return;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.excerpt)}&source=Nexus-OS`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer,width=600,height=600");
    toast.success("Öppnar LinkedIn-delning...");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[oklch(0.08_0.01_155)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.65_0.18_155)]" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen bg-[oklch(0.08_0.01_155)] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[oklch(0.88_0.04_155)] mb-4">Inlägget hittades inte</h1>
            <Link href="/blogg">
              <Button variant="outline" className="border-[oklch(0.35_0.1_155)] text-[oklch(0.65_0.12_155)]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tillbaka till bloggen
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <Layout>
      <div className="min-h-screen bg-[oklch(0.08_0.01_155)]">
        {/* Top bar */}
        <div className="border-b border-[oklch(0.18_0.04_155)] bg-[oklch(0.1_0.02_155)] sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/blogg">
              <button className="flex items-center gap-2 text-[oklch(0.55_0.08_155)] hover:text-[oklch(0.75_0.18_155)] transition-colors text-sm font-mono">
                <ArrowLeft className="w-4 h-4" />
                Alla inlägg
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-[oklch(0.42_0.05_155)] text-xs font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} min läsning
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowSharePanel(!showSharePanel)}
                  className="flex items-center gap-1.5 text-[oklch(0.5_0.08_155)] hover:text-[oklch(0.72_0.15_155)] transition-colors text-xs font-mono"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Dela
                </button>
                {showSharePanel && (
                  <div className="absolute right-0 top-8 z-50 w-52 bg-[oklch(0.12_0.03_155)] border border-[oklch(0.25_0.06_155)] rounded-xl shadow-2xl p-2 flex flex-col gap-1">
                    <button
                      onClick={handleLinkedInShare}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[oklch(0.18_0.04_220)] transition-colors group w-full text-left"
                    >
                      <div className="w-7 h-7 rounded-md bg-[oklch(0.28_0.12_220)] flex items-center justify-center flex-shrink-0">
                        <Linkedin className="w-4 h-4 text-[oklch(0.72_0.18_220)]" />
                      </div>
                      <div>
                        <p className="text-[oklch(0.78_0.06_155)] text-xs font-semibold group-hover:text-[oklch(0.9_0.08_155)]">Dela på LinkedIn</p>
                        <p className="text-[oklch(0.42_0.04_155)] text-[10px]">Öppnar LinkedIn</p>
                      </div>
                    </button>
                    <div className="h-px bg-[oklch(0.2_0.04_155)] mx-2" />
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[oklch(0.16_0.04_155)] transition-colors group w-full text-left"
                    >
                      <div className="w-7 h-7 rounded-md bg-[oklch(0.18_0.04_155)] flex items-center justify-center flex-shrink-0">
                        {copied ? (
                          <Check className="w-4 h-4 text-[oklch(0.65_0.18_155)]" />
                        ) : (
                          <Link2 className="w-4 h-4 text-[oklch(0.55_0.08_155)]" />
                        )}
                      </div>
                      <div>
                        <p className="text-[oklch(0.78_0.06_155)] text-xs font-semibold group-hover:text-[oklch(0.9_0.08_155)]">
                          {copied ? "Kopierad!" : "Kopiera länk"}
                        </p>
                        <p className="text-[oklch(0.42_0.04_155)] text-[10px]">Direktlänk till inlägget</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-6 py-12">
          {/* Meta */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className={`text-xs font-mono px-2.5 py-1 rounded border ${CATEGORY_COLORS[post.category] ?? "bg-[oklch(0.18_0.04_155)] text-[oklch(0.65_0.12_155)] border-[oklch(0.3_0.08_155)]"}`}>
                {post.category}
              </span>
              <span className="text-[oklch(0.45_0.05_155)] text-xs font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.publishedAt)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.92_0.04_155)] mb-5 leading-tight">
              {post.title}
            </h1>
            <p className="text-[oklch(0.62_0.06_155)] text-lg leading-relaxed mb-6 border-l-2 border-[oklch(0.35_0.1_155)] pl-4">
              {post.excerpt}
            </p>
            {/* Authors */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-[oklch(0.2_0.04_155)] bg-[oklch(0.11_0.02_155)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.25_0.1_155)] flex items-center justify-center">
                  <User className="w-5 h-5 text-[oklch(0.65_0.15_155)]" />
                </div>
                <div>
                  <p className="text-[oklch(0.82_0.06_155)] text-sm font-semibold">{post.author}</p>
                  <p className="text-[oklch(0.48_0.06_155)] text-xs">{post.authorRole}</p>
                </div>
              </div>
              {post.coAuthor && (
                <>
                  <div className="w-px h-8 bg-[oklch(0.22_0.04_155)]" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[oklch(0.2_0.08_200)] flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-[oklch(0.65_0.15_200)]" />
                    </div>
                    <div>
                      <p className="text-[oklch(0.82_0.06_155)] text-sm font-semibold">{post.coAuthor}</p>
                      <p className="text-[oklch(0.48_0.06_155)] text-xs">{post.coAuthorRole}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose-nexus">
            <style>{`
              .prose-nexus h2 { font-size:1.5rem; font-weight:700; color:oklch(0.88 0.04 155); margin-top:2.5rem; margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid oklch(0.2 0.04 155); }
              .prose-nexus h3 { font-size:1.15rem; font-weight:600; color:oklch(0.78 0.06 155); margin-top:1.75rem; margin-bottom:0.75rem; }
              .prose-nexus p { color:oklch(0.72 0.04 155); line-height:1.8; margin-bottom:1.25rem; font-size:1rem; }
              .prose-nexus strong { color:oklch(0.85 0.06 155); font-weight:600; }
              .prose-nexus ul, .prose-nexus ol { color:oklch(0.68 0.04 155); padding-left:1.5rem; margin-bottom:1.25rem; }
              .prose-nexus li { margin-bottom:0.5rem; line-height:1.7; }
              .prose-nexus table { width:100%; border-collapse:collapse; margin:1.5rem 0; font-size:0.875rem; }
              .prose-nexus th { background:oklch(0.14 0.03 155); color:oklch(0.75 0.1 155); padding:0.75rem 1rem; text-align:left; border:1px solid oklch(0.22 0.05 155); font-weight:600; font-family:monospace; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; }
              .prose-nexus td { padding:0.65rem 1rem; border:1px solid oklch(0.18 0.04 155); color:oklch(0.68 0.04 155); }
              .prose-nexus tr:nth-child(even) td { background:oklch(0.115 0.02 155); }
              .prose-nexus blockquote { border-left:3px solid oklch(0.45 0.12 155); padding-left:1rem; margin:1.5rem 0; color:oklch(0.65 0.06 155); font-style:italic; }
              .prose-nexus code { background:oklch(0.15 0.03 155); color:oklch(0.72 0.12 155); padding:0.15rem 0.4rem; border-radius:0.25rem; font-size:0.85rem; font-family:monospace; }
            `}</style>
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* Tags */}
          {(post.tags ?? []).length > 0 && (
            <div className="mt-10 pt-6 border-t border-[oklch(0.18_0.04_155)]">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-[oklch(0.48_0.06_155)]" />
                {(post.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[oklch(0.55_0.08_155)] bg-[oklch(0.14_0.03_155)] border border-[oklch(0.22_0.04_155)] px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prev/Next navigation */}
          {(prevPost || nextPost) && (
            <div className="mt-12 pt-8 border-t border-[oklch(0.18_0.04_155)] grid grid-cols-2 gap-4">
              {prevPost ? (
                <Link href={`/blogg/${prevPost.slug}`}>
                  <div className="group p-4 rounded-xl border border-[oklch(0.2_0.04_155)] bg-[oklch(0.11_0.02_155)] hover:border-[oklch(0.4_0.1_155)] transition-all cursor-pointer">
                    <div className="flex items-center gap-2 text-[oklch(0.48_0.06_155)] text-xs font-mono mb-2">
                      <ArrowLeft className="w-3 h-3" />
                      Föregående
                    </div>
                    <p className="text-[oklch(0.78_0.06_155)] text-sm font-medium group-hover:text-[oklch(0.88_0.08_155)] transition-colors line-clamp-2">
                      {prevPost.title}
                    </p>
                  </div>
                </Link>
              ) : <div />}
              {nextPost ? (
                <Link href={`/blogg/${nextPost.slug}`}>
                  <div className="group p-4 rounded-xl border border-[oklch(0.2_0.04_155)] bg-[oklch(0.11_0.02_155)] hover:border-[oklch(0.4_0.1_155)] transition-all cursor-pointer text-right">
                    <div className="flex items-center justify-end gap-2 text-[oklch(0.48_0.06_155)] text-xs font-mono mb-2">
                      Nästa
                      <ArrowRight className="w-3 h-3" />
                    </div>
                    <p className="text-[oklch(0.78_0.06_155)] text-sm font-medium group-hover:text-[oklch(0.88_0.08_155)] transition-colors line-clamp-2">
                      {nextPost.title}
                    </p>
                  </div>
                </Link>
              ) : <div />}
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
}


