import { useEffect, useRef, useState } from "react";

export default function CategoryFilter({
  categories = [],
  selectedCategory,
  setSelectedCategory,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!filterRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={filterRef}
      style={{ position: "relative", margin: "16px 0" }}
      aria-label="Filter by category"
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        style={{
          padding: "8px 12px",
          border: "1px solid var(--border-color)",
          borderRadius: "4px",
          cursor: "pointer",
          background: "var(--surface, #fff)",
          color: "inherit",
        }}
      >
        Category: {selectedCategory} {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && (
        <div
          role="listbox"
          aria-label="Product categories"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 5,
            display: "grid",
            gap: "4px",
            minWidth: "180px",
            maxHeight: "240px",
            overflowY: "auto",
            padding: "8px",
            border: "1px solid var(--border-color)",
            borderRadius: "4px",
            background: "var(--surface, #fff)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="option"
              aria-selected={selectedCategory === category}
              aria-pressed={selectedCategory === category}
              onClick={() => {
                setSelectedCategory(category);
                setIsOpen(false);
              }}
              style={{
                textAlign: "left",
                padding: "8px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                cursor: "pointer",
                background:
                  selectedCategory === category
                    ? "var(--accent)"
                    : "transparent",
                color:
                  selectedCategory === category
                    ? "var(--accent-contrast, #fff)"
                    : "inherit",
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
