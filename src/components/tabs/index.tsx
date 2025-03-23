import "./styles.css";

import * as Tabs from "@radix-ui/react-tabs";

import { TabsProps } from "./tabs.type";

export const TabRoot = ({
  children,
  initValue,
  changeInitValue,
}: Partial<TabsProps>) => {
  return (
    <Tabs.Root
      className="tab-root"
      value={initValue}
      onValueChange={changeInitValue}
    >
      {children}
    </Tabs.Root>
  );
};

export const TabList = ({ children }: Partial<TabsProps>) => {
  return (
    <Tabs.List className="tab-list" aria-label="Menu">
      {children}
    </Tabs.List>
  );
};

export const TabTrigger = ({ children, value }: TabsProps) => {
  return (
    <Tabs.Trigger className="tab-trigger" title={value} value={value}>
      {children}
    </Tabs.Trigger>
  );
};

export const TabContent = ({ children, value }: TabsProps) => {
  return (
    <Tabs.Content className="tab-content" value={value}>
      {children}
    </Tabs.Content>
  );
};
