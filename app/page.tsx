'use client';

import { useEffect, useMemo, useState } from 'react';
import { CategorySidebar } from '../components/CategorySidebar';
import { SearchBar } from '../components/SearchBar';
import { TagFilter } from '../components/TagFilter';
import { ToolCard } from '../components/ToolCard';
import { ToolDetailModal } from '../components/ToolDetailModal';
import { getAvailableTags, getCategories, getTools } from '../src/lib/tools';
import { Tool, ToolTag } from '../src/types';

const tools = getTools();
const categories = getCategories(tools);
const availableTags = getAvailableTags(tools);

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [activeTags, setActiveTags] = useState<ToolTag[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('osint-favorites');
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('osint-favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleTag = (tag: ToolTag) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const toggleFavorite = (tool: Tool) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(tool.id)) {
        next.delete(tool.id);
      } else {
        next.add(tool.id);
      }
      return next;
    });
  };

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
      const matchesTags = activeTags.every((tag) => tool.tags.includes(tag));
      const matchesSearch = `${tool.name} ${tool.category} ${tool.tags.join(' ')} ${tool.description || ''}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFavorites = showFavoritesOnly ? favorites.has(tool.id) : true;
      return matchesCategory && matchesTags && matchesSearch && matchesFavorites;
    });
  }, [activeTags, favorites, search, selectedCategory, showFavoritesOnly]);

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary">OSINT Collection</p>
          <h1 className="text-3xl font-bold text-slate-900">Workbench</h1>
          <p className="text-sm text-slate-600">
            Browse, search, and launch OSINT resources from the original OSINT Framework list.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            />
            Favorites only
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[280px,1fr]">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <section className="space-y-4">
          <SearchBar value={search} onChange={setSearch} />
          <TagFilter availableTags={availableTags} activeTags={activeTags} onToggle={toggleTag} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorite={favorites.has(tool.id)}
                onFavoriteToggle={toggleFavorite}
                onSelect={setSelectedTool}
              />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="card p-6 text-center text-slate-500">No tools match your filters.</div>
          )}
        </section>
      </div>

      <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
    </main>
  );
}
