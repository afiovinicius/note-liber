import "./styles.css";

import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

import { Resize, TrashSimple } from "@phosphor-icons/react";

import { usePopoverOpen } from "../../hooks";

import { fetchNotes } from "../../functions";

import { TrayActionProps } from "./trayaction.type";

import { Button } from "../button";
import { BtnPopover } from "../popover";
import { BtnToggle } from "../toggle";

export const TrayAction = ({
  nameNote,
  setTab,
  setNotes,
  isResizeView,
  setResizeView,
}: TrayActionProps) => {
  const { handleRemoveNote } = fetchNotes();
  const { isOpen, setIsOpen } = usePopoverOpen();

  const size = getCurrentWindow().innerSize();
  const setSize = isResizeView ? size : new LogicalSize(800, 600);
  getCurrentWindow().setAlwaysOnTop(isResizeView);
  getCurrentWindow().setResizable(isResizeView);
  getCurrentWindow().setSize(setSize as LogicalSize);

  return (
    <div className="tray-action">
      {nameNote && (
        <BtnPopover
          isOpen={isOpen}
          isChangeOpen={setIsOpen}
          side="top"
          sizes="sm"
          styles="brand"
          trigger={<TrashSimple size={18} />}
          content={
            <>
              <p className="message">
                Se você deletar vai apagar sua nota permanentemente, tem certeza
                disso?
              </p>
              <div className="btns">
                <Button
                  full
                  styles="brand"
                  onClick={() => {
                    handleRemoveNote(nameNote, setTab, setNotes);
                    setIsOpen(false);
                  }}
                >
                  Sim
                </Button>
                <Button full styles="dark" onClick={() => setIsOpen(false)}>
                  Não
                </Button>
              </div>
            </>
          }
        />
      )}
      <BtnToggle
        sizes="sm"
        pressed={isResizeView}
        onPressedChange={() => setResizeView((prev) => !prev)}
      >
        <Resize size={18} />
      </BtnToggle>
    </div>
  );
};
