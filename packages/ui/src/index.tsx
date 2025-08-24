import * as React from "react";
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center rounded-md bg-black px-3 py-2 text-white">
      {children}
    </button>
  );
}
