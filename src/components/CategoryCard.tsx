import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Circle } from "lucide-react";
import type { Category } from "@/data/topics";

interface Props {
  category: Category;
  index: number;
}

const CategoryCard = ({ category, index }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
      >
        <span
          className={`${category.bgClass} flex items-center justify-center w-10 h-10 rounded-lg text-lg text-primary-foreground shrink-0`}
        >
          {category.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-foreground leading-tight">{category.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {category.topics.length} {category.topics.length === 1 ? "topic" : "topics"}
          </p>
        </div>
        <ChevronRight
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-4 border-t border-border pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {category.topics.map((topic) => (
              <button
                key={topic.slug}
                onClick={() => navigate(`/topic/${topic.slug}`)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors text-left"
              >
                <Circle size={6} className={`${category.colorClass} shrink-0 fill-current`} />
                <span>{topic.name}</span>
                <ChevronRight size={12} className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
