import { Editor } from "@tiptap/react";

export type DropdownProps = {
  trigger: JSX.Element | React.ReactNode;
  triggerStyle: string;
  arrayItems: (Record<string, unknown> & { component: JSX.Element })[];
  isEditor: Editor;
  children?: React.ReactNode;
  dataState?: boolean;
};
