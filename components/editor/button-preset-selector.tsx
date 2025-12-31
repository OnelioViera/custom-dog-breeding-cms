"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ButtonPresetSelectorProps {
  value?: string; // Preset slug or "default" for global preset
  onChange: (presetSlug: string | null) => void;
  label?: string;
}

export function ButtonPresetSelector({
  value,
  onChange,
  label = "Button Style",
}: ButtonPresetSelectorProps) {
  const [presets, setPresets] = useState<Array<{ _id: string; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/button-presets")
      .then((res) => res.json())
      .then((data) => {
        if (data.presets) {
          setPresets(data.presets.filter((p: any) => p.isActive));
        }
      })
      .catch((error) => {
        console.error("Error fetching button presets:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value || "default"}
        onValueChange={(newValue) => {
          onChange(newValue === "default" ? null : newValue);
        }}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select button style..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Use Global Preset</SelectItem>
          {presets.map((preset) => (
            <SelectItem key={preset._id} value={preset.slug}>
              {preset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        {value === "default" || !value
          ? "Uses the active global button preset"
          : "Uses this specific preset for this button"}
      </p>
    </div>
  );
}

