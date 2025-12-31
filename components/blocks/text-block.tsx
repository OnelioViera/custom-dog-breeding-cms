"use client";

interface TextBlockProps {
  content: {
    heading?: string;
    text?: string;
  };
}

export function TextBlock({ content }: TextBlockProps) {
  return (
    <div className="prose max-w-none">
      {content.heading && (
        <h2 className="text-3xl font-bold mb-4">{content.heading}</h2>
      )}
      {content.text && (
        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: content.text }}
        />
      )}
    </div>
  );
}

