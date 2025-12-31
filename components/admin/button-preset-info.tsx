"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface ButtonPresetInfoProps {
  activePreset?: {
    name: string;
    slug: string;
  } | null;
}

export function ButtonPresetInfo({ activePreset }: ButtonPresetInfoProps) {
  if (!activePreset) {
    return (
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">No Button Preset Active</h4>
            <p className="text-sm text-blue-700">
              Buttons are using default theme styles. To customize button colors, sizes, and styles, 
              create and apply a <a href="/admin/button-presets" className="underline font-medium">Button Preset</a>.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-green-50 border-green-200">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-green-600 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-green-900">Active Button Preset</h4>
            <Badge variant="default" className="bg-green-600">
              {activePreset.name}
            </Badge>
          </div>
          <p className="text-sm text-green-700">
            All buttons on your website are using the <strong>{activePreset.name}</strong> preset. 
            This includes buttons in the page editor, live preview, and published pages.
          </p>
          <p className="text-xs text-green-600 mt-2">
            To change the active preset, go to <a href="/admin/button-presets" className="underline">Button Presets</a> and click {`"Apply Preset"`} on a different preset.
          </p>
        </div>
      </div>
    </Card>
  );
}

