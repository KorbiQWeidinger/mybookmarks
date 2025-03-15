import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { BookmarkModal } from "./bookmark-modal";

interface BookmarkHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BookmarkHeader({
  searchQuery,
  onSearchChange,
}: BookmarkHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4 border-b sticky top-0 bg-background z-10">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookmarks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button
          size="icon"
          className="flex-shrink-0"
          title="Add bookmark"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add bookmark</span>
        </Button>
      </div>

      <BookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
