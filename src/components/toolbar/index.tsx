import "./styles.css";

import {
  CaretDown,
  CodeBlock,
  LinkSimple,
  ListBullets,
  ListChecks,
  ListNumbers,
  TextB,
  TextHOne,
  TextHThree,
  TextHTwo,
  TextItalic,
  TextStrikethrough,
  TextT,
  TextUnderline,
} from "@phosphor-icons/react";

import {
  DropdownContent,
  DropdownItem,
  DropdownRoot,
  DropdownTrigger,
} from "../dropdown";
import { FormSetLink } from "../setlink";

import {
  ToolbarButton,
  ToolbarGroup,
  ToolbarItem,
  ToolbarRoot,
} from "./modules";

import { Level, ToolBarProps } from "./toolbar.type";

export const ToolBar = ({ isEditor }: ToolBarProps) => {
  const HEADING_OPTIONS = [
    { level: 0, label: "Texto", component: <TextT size={24} /> },
    { level: 1, label: "H1", component: <TextHOne size={24} /> },
    { level: 2, label: "H2", component: <TextHTwo size={24} /> },
    { level: 3, label: "H3", component: <TextHThree size={24} /> },
  ];

  const currentHeading =
    HEADING_OPTIONS.find((option) =>
      option.level === 0
        ? isEditor.isActive("paragraph")
        : isEditor.isActive("heading", { level: option.level })
    ) || HEADING_OPTIONS[0];

  const TEXT_OPTIONS = [
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
  ];

  const ALIGN_OPTIONS = [
    {
      value: "Bullet List",
      action: () => isEditor.chain().focus().toggleBulletList().run(),
      isActive: isEditor.isActive("bulletList"),
      icon: <ListBullets size={24} />,
    },
    {
      value: "Number List",
      action: () => isEditor.chain().focus().toggleOrderedList().run(),
      isActive: isEditor.isActive("orderedList"),
      icon: <ListNumbers size={24} />,
    },
    {
      value: "Task List",
      action: () => isEditor.chain().focus().toggleTaskList().run(),
      isActive: isEditor.isActive("taskList"),
      icon: <ListChecks size={24} />,
    },
  ];

  return (
    <ToolbarRoot>
      <ToolbarGroup>
        <ToolbarButton>
          <DropdownRoot>
            <DropdownTrigger triggerStyle="toolbar-item">
              {currentHeading.component}
              <CaretDown size={14} className="trigger-arrow" />
            </DropdownTrigger>
            <DropdownContent>
              {HEADING_OPTIONS?.map((item, index: number) => (
                <DropdownItem
                  key={index}
                  onSelect={() => {
                    if (isEditor && item.level === 0) {
                      isEditor?.chain().focus().setParagraph().run();
                    } else {
                      isEditor
                        .chain()
                        .focus()
                        .toggleHeading({ level: item.level as Level })
                        .run();
                    }
                  }}
                >
                  <li
                    className="drop-item"
                    data-row-active={
                      isEditor?.isActive("heading", { level: item.level }) ||
                      (item.level === 0 && isEditor?.isActive("paragraph"))
                    }
                  >
                    {item.component}
                  </li>
                </DropdownItem>
              ))}
            </DropdownContent>
          </DropdownRoot>
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarGroup>
        {TEXT_OPTIONS.map((btn, index: number) => (
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
      <ToolbarGroup>
        <ToolbarItem
          value="Code Block"
          dataState={isEditor.isActive("codeBlock")}
          action={() => isEditor?.chain().focus().toggleCodeBlock().run()}
        >
          <CodeBlock size={24} />
        </ToolbarItem>
        <ToolbarButton>
          <DropdownRoot>
            <DropdownTrigger
              triggerStyle="toolbar-item"
              dataState={isEditor.isActive("link")}
            >
              <LinkSimple size={24} />
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem>
                <FormSetLink isEditor={isEditor} />
              </DropdownItem>
            </DropdownContent>
          </DropdownRoot>
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarGroup>
        {ALIGN_OPTIONS.map((btn, index: number) => (
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
