import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme, Theme } from "./ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themesList: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  const ActiveIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;

  return (
    <div className="relative" ref={dropdownRef} id="theme-switcher-container">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-foreground-secondary hover:text-foreground flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none"
        title="Change appearance"
        id="theme-switcher-toggle"
      >
        <motion.div
          key={theme}
          initial={{ rotate: -30, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <ActiveIcon className="w-4 h-4 text-accent" />
        </motion.div>
      </button>

      {/* Floating Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-36 rounded-xl bg-surface/95 border border-border shadow-2xl backdrop-blur-md p-1.5 z-50 overflow-hidden font-sans"
            id="theme-dropdown-menu"
          >
            <div className="text-[9px] font-mono font-bold tracking-wider text-foreground-muted px-2 py-1 select-none uppercase">
              Appearance
            </div>
            
            {themesList.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = theme === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => {
                    setTheme(item.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 text-left ${
                    isSelected
                      ? "bg-surface-elevated text-foreground"
                      : "text-foreground-secondary hover:bg-surface-elevated/40 hover:text-foreground"
                  }`}
                  id={`theme-opt-${item.value}`}
                >
                  <div className="flex items-center gap-2 font-sans">
                    <ItemIcon className={`w-3.5 h-3.5 ${isSelected ? "text-accent" : "text-foreground-secondary"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isSelected && (
                    <motion.div layoutId="active-theme-check">
                      <Check className="w-3.5 h-3.5 text-accent" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themesList: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  return (
    <div className="flex flex-col gap-2 p-1 bg-surface border border-border rounded-xl" id="mobile-theme-switcher">
      <div className="text-[9px] font-mono font-bold tracking-wider text-foreground-muted px-2 py-1 uppercase">
        Appearance Theme
      </div>
      <div className="grid grid-cols-3 gap-1">
        {themesList.map((item) => {
          const ItemIcon = item.icon;
          const isSelected = theme === item.value;
          return (
            <button
              key={item.value}
              onClick={() => setTheme(item.value)}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-surface-elevated text-foreground shadow-md border border-border"
                  : "text-foreground-secondary hover:text-foreground border border-transparent"
              }`}
              id={`mobile-theme-opt-${item.value}`}
            >
              <ItemIcon className={`w-3.5 h-3.5 ${isSelected ? "text-accent" : "text-foreground-secondary"}`} />
              <span className="font-sans">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

