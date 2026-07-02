import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function BlogCarousel() {
  const { data: posts = [], isLoading } = trpc.blog.list.useQuery();

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-card/20 rounded-2xl w-full"></div>;
  }

  if (posts.length === 0) return null;

  return (
    <div className="w-full relative py-8">
      <div className="flex items-center justify-between mb-6 px-4 md:px-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Senaste Insikterna</h2>
          <p className="text-muted-foreground text-sm">Nyheter och djupdykningar inom Nexus-OS</p>
        </div>
        <Link href="/blogg">
          <span className="text-primary hover:underline flex items-center text-sm font-medium cursor-pointer">
            Gå till Bloggen <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar px-4 md:px-0">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blogg/${post.slug}`} className="shrink-0 w-[85vw] md:w-[400px] snap-center md:snap-start group">
            <Card className="h-full bg-card/40 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-primary/5">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur text-foreground border-border/50">
                  {post.category}
                </Badge>
              </div>
              <CardContent className="p-5 relative">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" /> {post.readTime} min läsning
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
