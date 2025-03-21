export type TrayActionProps = {
  nameNote: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  setNotes: React.Dispatch<React.SetStateAction<string[]>>;
  isResizeView: boolean;
  setResizeView: React.Dispatch<React.SetStateAction<boolean>>;
};
