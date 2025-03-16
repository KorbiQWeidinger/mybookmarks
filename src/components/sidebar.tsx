"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { ViewType, Tag, Persona } from "@/lib/types"
import { Bookmark, FolderKanban, Hash, Menu, Search, X } from "lucide-react"
import { UserNav } from "./user-nav"

interface SidebarProps {
  viewType: ViewType
  onViewChange: (view: ViewType) => void
  tags: Tag[]
  domains: { name: string; count: number }[]
  selectedTags: string[]
  selectedDomain: string | null
  onTagSelect: (tag: string) => void
  onDomainSelect: (domain: string) => void
  currentPersona: Persona
  personas: Persona[]
  onPersonaChange: (persona: Persona) => void
  onOpenSettings: () => void
}

export function Sidebar({
  viewType,
  onViewChange,
  tags,
  domains,
  selectedTags,
  selectedDomain,
  onTagSelect,
  onDomainSelect,
  currentPersona,
  personas,
  onPersonaChange,
  onOpenSettings,
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [domainSearch, setDomainSearch] = useState("")
  const [tagSearch, setTagSearch] = useState("")

  // Filter domains based on search
  const filteredDomains = domains.filter((domain) => domain.name.toLowerCase().includes(domainSearch.toLowerCase()))

  // Filter tags based on search
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(tagSearch.toLowerCase()))

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`bg-card border-r w-64 flex-shrink-0 flex flex-col h-full transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:relative z-40`}
      >
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Bookmarks
          </h1>
        </div>

        <div className="p-4 border-b">
          <Tabs
            defaultValue={viewType}
            value={viewType}
            onValueChange={(value) => onViewChange(value as ViewType)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="domain" className="flex items-center gap-1">
                <FolderKanban className="h-4 w-4" />
                Domains
              </TabsTrigger>
              <TabsTrigger value="tag" className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                Tags
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1 p-4">
          {viewType === "domain" ? (
            <div className="space-y-2">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search domains..."
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  className="pl-8 h-9"
                />
                {domainSearch && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={() => setDomainSearch("")}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>

              <h2 className="text-sm font-semibold text-muted-foreground mb-2">Domains</h2>

              {filteredDomains.length > 0 ? (
                filteredDomains.map((domain) => (
                  <Button
                    key={domain.name}
                    variant={selectedDomain === domain.name ? "secondary" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => onDomainSelect(domain.name)}
                  >
                    <span className="truncate flex-1">{domain.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {domain.count}
                    </Badge>
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">No domains found</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  className="pl-8 h-9"
                />
                {tagSearch && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={() => setTagSearch("")}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>

              <h2 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h2>

              {filteredTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => onTagSelect(tag.id)}
                    >
                      {tag.name} ({tag.count})
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">No tags found</p>
              )}
            </div>
          )}
        </ScrollArea>

        {/* User navigation at bottom of sidebar */}
        <div className="border-t p-4">
          <UserNav
            currentPersona={currentPersona}
            personas={personas}
            onPersonaChange={onPersonaChange}
            onOpenSettings={onOpenSettings}
          />
        </div>
      </div>
    </>
  )
}

