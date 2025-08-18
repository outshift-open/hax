interface CommandHintsProps {
  showSuggestions: boolean;
}

export function CommandHints({ showSuggestions }: CommandHintsProps) {
  return (
    <div className="mb-2 text-xs text-gray-500">
      <span className="mr-4">@ to delegate to agent</span>
      <span className="mr-4">+ to add context</span>
      <span className="mr-4">/ to force tool call</span>
      {showSuggestions && (
        <span className="text-blue-600">
          ↑↓ navigate • Enter/Tab select • Esc close
        </span>
      )}
    </div>
  );
}
