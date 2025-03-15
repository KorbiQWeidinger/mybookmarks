import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ChevronsUpDown, Settings, Users } from "lucide-react"
import type { Persona } from "@/lib/types"

interface UserNavProps {
  currentPersona: Persona
  personas: Persona[]
  onPersonaChange: (persona: Persona) => void
  onOpenSettings: () => void
}

export function UserNav({ currentPersona, personas, onPersonaChange, onOpenSettings }: UserNavProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2 gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentPersona.avatar} alt={currentPersona.name} />
            <AvatarFallback>{getInitials(currentPersona.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium leading-none">{currentPersona.name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentPersona.email}</p>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="top">
        <DropdownMenuLabel>My Personas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {personas.map((persona) => (
            <DropdownMenuItem key={persona.id} className="cursor-pointer" onClick={() => onPersonaChange(persona)}>
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={persona.avatar} alt={persona.name} />
                <AvatarFallback className="text-xs">{getInitials(persona.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm">{persona.name}</p>
              </div>
              {currentPersona.id === persona.id && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={onOpenSettings}>
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Users className="h-4 w-4 mr-2" />
          <span>Manage Personas</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

