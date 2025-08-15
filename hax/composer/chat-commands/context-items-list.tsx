import { FolderOpen, X } from "lucide-react";
import { LocalContextItem } from "./hooks/useLocalContext";

interface ContextItemsListProps {
  selectedContextItems: LocalContextItem[];
  onRemoveItem: (item: LocalContextItem) => void;
}

export function ContextItemsList({
  selectedContextItems,
  onRemoveItem,
}: ContextItemsListProps) {
  if (selectedContextItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="mb-2 text-sm text-gray-600">Context files:</div>
      <div className="flex flex-wrap gap-2">
        {selectedContextItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
          >
            <FolderOpen className="h-3 w-3" />
            <span>{item.name}</span>
            <button
              onClick={() => onRemoveItem(item)}
              className="hover:text-blue-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
