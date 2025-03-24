import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  CodeBlock,
} from "@phosphor-icons/react";

import { ToolbarGroup, ToolbarItem, ToolbarRoot } from "../toolbar/modules";

import { FloatMenuProps } from "./foatingmenu.type";

export const FloatMenu = ({ isEditor }: FloatMenuProps) => {
  const OPTIONS = [
    {
      value: "Bold",
      action: () => isEditor.chain().focus().toggleBold().run(),
      isActive: isEditor.isActive("bold"),
      icon: <TextB size={24} />,
    },
    {
      value: "Italic",
      action: () => isEditor.chain().focus().toggleItalic().run(),
      isActive: isEditor.isActive("italic"),
      icon: <TextItalic size={24} />,
    },
    {
      value: "Underline",
      action: () => isEditor.chain().focus().toggleUnderline().run(),
      isActive: isEditor.isActive("underline"),
      icon: <TextUnderline size={24} />,
    },
    {
      value: "Strike",
      action: () => isEditor.chain().focus().toggleStrike().run(),
      isActive: isEditor.isActive("strike"),
      icon: <TextStrikethrough size={24} />,
    },
    {
      value: "Code Block",
      action: () => isEditor?.chain().focus().toggleCode().run(),
      isActive: isEditor.isActive("code"),
      icon: <CodeBlock size={24} />,
    },
  ];

  return (
    <ToolbarRoot>
      <ToolbarGroup>
        {OPTIONS.map((btn, index: number) => (
          <ToolbarItem
            key={index}
            value={btn.value}
            dataState={btn.isActive}
            action={btn.action}
          >
            {btn.icon}
          </ToolbarItem>
        ))}
      </ToolbarGroup>
    </ToolbarRoot>
  );
};
