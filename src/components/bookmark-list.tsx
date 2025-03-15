import { ScrollArea } from "@/components/ui/scroll-area"
import { BookmarkTable } from "./bookmark-table"
import type { Bookmark, ViewType } from "@/lib/types"

interface BookmarkListProps {
  bookmarks: Bookmark[]
  viewType: ViewType
  selectedTags: string[]
  onTagSelect: (tag: string) => void
}

export function BookmarkList({ bookmarks, viewType, selectedTags, onTagSelect }: BookmarkListProps) {
  // Group bookmarks by domain if in domain view
  const groupedBookmarks =
    viewType === "domain"
      ? bookmarks.reduce(
          (groups, bookmark) => {
            const domain = bookmark.domain
            if (!groups[domain]) {
              groups[domain] = []
            }
            groups[domain].push(bookmark)
            return groups
          },
          {} as Record<string, Bookmark[]>,
        )
      : { "All Bookmarks": bookmarks }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        {Object.entries(groupedBookmarks).map(([groupName, bookmarks]) => (
          <div key={groupName} className="mb-8">
            {viewType === "domain" && (
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                {bookmarks[0]?.favicon && (
                  <img src={bookmarks[0].favicon || "/placeholder.svg"} alt="" className="w-4 h-4 mr-2" />
                )}
                {groupName} ({bookmarks.length})
              </h2>
            )}
            <BookmarkTable bookmarks={bookmarks} selectedTags={selectedTags} onTagSelect={onTagSelect} />
          </div>
        ))}

        {Object.keys(groupedBookmarks).length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <p>No bookmarks found</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

