import { useState } from "react";
import { Sidebar } from "./sidebar";
import { BookmarkHeader } from "./bookmark-header";
import { BookmarkList } from "./bookmark-list";
import type { ViewType, Bookmark, Tag, Persona } from "@/lib/types";

export default function BookmarkManager() {
  const [viewType, setViewType] = useState<ViewType>("domain");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [currentPersona, setCurrentPersona] = useState<Persona>({
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
  });
  const [showSettings, setShowSettings] = useState(false);

  // Sample personas
  const personas: Persona[] = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
    },
    {
      id: "2",
      name: "Work Profile",
      email: "alex.work@company.com",
    },
    {
      id: "3",
      name: "Research",
      email: "research@example.com",
    },
  ];

  // Sample data
  const bookmarks: Bookmark[] = [
    {
      id: "1",
      title: "Vercel Documentation",
      url: "https://vercel.com/docs",
      description: "Learn how to deploy your Next.js apps on Vercel",
      domain: "vercel.com",
      favicon: "https://vercel.com/favicon.ico",
      tags: ["development", "hosting", "nextjs"],
      createdAt: new Date("2023-01-15"),
      personaId: "1", // Alex's bookmark
    },
    {
      id: "2",
      title: "Next.js Documentation",
      url: "https://nextjs.org/docs",
      description: "The React Framework for the Web",
      domain: "nextjs.org",
      favicon: "https://nextjs.org/favicon.ico",
      tags: ["development", "react", "framework"],
      createdAt: new Date("2023-02-10"),
      personaId: "1", // Alex's bookmark
    },
    {
      id: "3",
      title: "Tailwind CSS Documentation",
      url: "https://tailwindcss.com/docs",
      description:
        "Rapidly build modern websites without ever leaving your HTML",
      domain: "tailwindcss.com",
      favicon: "https://tailwindcss.com/favicon.ico",
      tags: ["css", "design", "development"],
      createdAt: new Date("2023-03-05"),
      personaId: "1", // Alex's bookmark
    },
    {
      id: "4",
      title: "Confluence Home",
      url: "https://confluence.com/home",
      description: "Team collaboration and documentation",
      domain: "confluence.com",
      favicon: "https://confluence.com/favicon.ico",
      tags: ["productivity", "documentation", "team"],
      createdAt: new Date("2023-04-20"),
      personaId: "2", // Work profile bookmark
    },
    {
      id: "5",
      title: "Confluence Spaces",
      url: "https://confluence.com/spaces",
      description: "Manage your team spaces",
      domain: "confluence.com",
      favicon: "https://confluence.com/favicon.ico",
      tags: ["productivity", "organization"],
      createdAt: new Date("2023-04-22"),
      personaId: "2", // Work profile bookmark
    },
    {
      id: "6",
      title: "GitHub Repository",
      url: "https://github.com/username/repo",
      description: "Your code repository",
      domain: "github.com",
      favicon: "https://github.com/favicon.ico",
      tags: ["development", "git", "code"],
      createdAt: new Date("2023-05-15"),
      personaId: "2", // Work profile bookmark
    },
    {
      id: "7",
      title: "Research Papers Database",
      url: "https://papers.research.edu",
      description: "Academic research papers database",
      domain: "papers.research.edu",
      favicon: "",
      tags: ["research", "academic", "papers"],
      createdAt: new Date("2023-06-10"),
      personaId: "3", // Research profile bookmark
    },
  ];

  // Filter bookmarks by current persona
  const personaBookmarks = bookmarks.filter(
    (bookmark) => bookmark.personaId === currentPersona.id
  );

  // Extract all unique tags from current persona's bookmarks
  const allTags: Tag[] = Array.from(
    new Set(personaBookmarks.flatMap((bookmark) => bookmark.tags))
  ).map((tag) => ({
    id: tag,
    name: tag,
    count: personaBookmarks.filter((bookmark) => bookmark.tags.includes(tag))
      .length,
  }));

  // Extract all unique domains from current persona's bookmarks
  const domains = Array.from(
    new Set(personaBookmarks.map((bookmark) => bookmark.domain))
  ).map((domain) => ({
    name: domain,
    count: personaBookmarks.filter((bookmark) => bookmark.domain === domain)
      .length,
  }));

  // Filter bookmarks based on search query, selected tags, and selected domain
  const filteredBookmarks = personaBookmarks.filter((bookmark) => {
    const matchesSearch = searchQuery
      ? bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesTags =
      selectedTags.length > 0
        ? selectedTags.every((tag) => bookmark.tags.includes(tag))
        : true;

    const matchesDomain = selectedDomain
      ? bookmark.domain === selectedDomain
      : true;

    return matchesSearch && matchesTags && matchesDomain;
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewChange = (view: ViewType) => {
    setViewType(view);
    // Reset selections when changing views
    if (view === "domain") {
      setSelectedTags([]);
    } else {
      setSelectedDomain(null);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDomainSelect = (domain: string) => {
    setSelectedDomain((prev) => (prev === domain ? null : domain));
  };

  const handlePersonaChange = (persona: Persona) => {
    setCurrentPersona(persona);
    // Reset filters when changing personas
    setSelectedTags([]);
    setSelectedDomain(null);
    setSearchQuery("");
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
    // In a real app, this would open the settings modal or navigate to settings page
    console.log("Opening settings...");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        viewType={viewType}
        onViewChange={handleViewChange}
        tags={allTags}
        domains={domains}
        selectedTags={selectedTags}
        selectedDomain={selectedDomain}
        onTagSelect={handleTagSelect}
        onDomainSelect={handleDomainSelect}
        currentPersona={currentPersona}
        personas={personas}
        onPersonaChange={handlePersonaChange}
        onOpenSettings={handleOpenSettings}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <BookmarkHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <BookmarkList
          bookmarks={filteredBookmarks}
          viewType={viewType}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />

        {/* Settings Modal would go here in a real app */}
        {showSettings && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <div
              className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <p className="mb-4">
                This is where you would configure your bookmark settings.
              </p>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Current Persona: {currentPersona.name}
                </p>
                <Button onClick={() => setShowSettings(false)}>
                  Close Settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Import Button for the settings modal
import { Button } from "@/components/ui/button";
