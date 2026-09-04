import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Our type scale is `text-14` … `text-88`, which tailwind-merge does not know
 * about. Left unconfigured it reads `text-18` as a text *colour* and silently
 * drops any real colour set alongside it, so `text-ivory text-18` renders
 * without the ivory. Registering the scale as font sizes keeps the two in
 * separate conflict groups.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["14", "16", "18", "22", "28", "36", "48", "64", "88"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
