export type TabsProps = {
  children: React.ReactNode;
  value: string;
  initValue?: string;
  changeInitValue?: React.Dispatch<React.SetStateAction<string>>;
};
