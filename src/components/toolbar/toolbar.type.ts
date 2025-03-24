import type { Editor } from "@tiptap/react";

export type ToolBarProps = {
  isEditor: Editor;
};

export type ModulesToolBarProps = {
  value?: string;
  children: React.ReactNode;
  type?: "multiple" | "single";
  action?: () => void;
  dataState?: boolean;
};

export type Level = 1 | 2 | 3 | 4 | 5 | 6;
