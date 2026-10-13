import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register the design-system type scale so tailwind-merge treats e.g.
// `text-label-sm` as a font size and doesn't drop it next to `text-secondary`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-6xl", "display-5xl", "display-4xl", "display-3xl", "display-2xl",
            "display-xl", "display-lg", "display-base", "display-page", "display-metric",
            "heading-lg", "heading-md", "heading-sm", "body-lg", "body-md", "body-sm",
            "label-md", "label-sm", "caption",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
