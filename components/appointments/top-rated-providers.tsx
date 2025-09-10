'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { Provider } from "@/lib/types"

interface TopRatedProvidersProps {
  providers: Provider[]
  onProviderSelect: (provider: Provider) => void
  selectedProvider: Provider | null
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function TopRatedProviders({
  providers,
  onProviderSelect,
  selectedProvider,
  searchQuery,
  onSearchChange
}: TopRatedProvidersProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Find your Providers</h2>
        <div className="w-[300px]">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search providers..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          <div className="flex gap-4">
            {providers
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 6)
              .map((provider) => (
                <Card 
                  key={provider.id}
                  className="flex-shrink-0 w-[280px]"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <img src={provider.avatar} alt={provider.name} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{provider.name}</h3>
                            <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                          </div>
                          <Badge variant="outline">{provider.rating} ★</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.modes.map((mode) => (
                        <Badge key={mode} variant="secondary" className="text-xs">
                          {mode === "online" ? "Online" : "In-person"}
                        </Badge>
                      ))}
                      {provider.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      onClick={() => onProviderSelect(provider)}
                      className="w-full"
                      variant={selectedProvider?.id === provider.id ? "secondary" : "default"}
                    >
                      {selectedProvider?.id === provider.id ? "Selected" : "Book Appointment"}
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 