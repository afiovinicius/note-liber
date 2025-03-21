import "./styles/globals.css";

import { useEffect, useState } from "react";

import { NotePencil, Placeholder, Plus } from "@phosphor-icons/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { usePopoverOpen } from "./hooks";

import { fetchNotes } from "./functions";

import {
  BtnPopover,
  EditorTiptap,
  FormAddNote,
  Sidebar,
  TabContent,
  TabList,
  TabRoot,
  TabTrigger,
  TrayAction,
} from "./components";

export default function App() {
  const { notes, applyTab, getListNotes, setApplyTab, setNotes } = fetchNotes();
  const { isOpen, setIsOpen } = usePopoverOpen();

  const [isResize, setIsResize] = useState(false);

  useEffect(() => {
    getListNotes();
  }, []);

  return (
    <>
      <ToastContainer
        stacked
        position="bottom-center"
        autoClose={2800}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={true}
        theme="colored"
      />
      <main id="layout">
        {notes.length > 0 ? (
          <TabRoot initValue={applyTab} changeInitValue={setApplyTab}>
            <Sidebar resize={!isResize ? "active" : "inactive"}>
              <TabList>
                {notes.map((note: string, index: number) => (
                  <TabTrigger key={index} value={note}>
                    <NotePencil size={24} />
                  </TabTrigger>
                ))}
              </TabList>
              <BtnPopover
                isOpen={isOpen}
                isChangeOpen={setIsOpen}
                side="right"
                sizes="lg"
                styles="dark"
                trigger={<Plus size={24} />}
                content={
                  <FormAddNote
                    notes={notes}
                    setTab={setApplyTab}
                    setNotes={setNotes}
                  />
                }
              />
            </Sidebar>
            {notes.map((note: string, index: number) => (
              <TabContent key={index} value={note}>
                <EditorTiptap fileName={note} />
              </TabContent>
            ))}
          </TabRoot>
        ) : (
          <div className="empty-notes">
            <Placeholder size={68} />
            <h1>Não tem notas a serem listadas. Crie uma nota!</h1>
            <BtnPopover
              isOpen={isOpen}
              isChangeOpen={setIsOpen}
              side="bottom"
              sizes="sizing"
              styles="brand"
              trigger={"Adicionar Nota"}
              content={
                <FormAddNote
                  notes={notes}
                  setTab={setApplyTab}
                  setNotes={setNotes}
                />
              }
            />
          </div>
        )}
        <TrayAction
          nameNote={applyTab}
          setTab={setApplyTab}
          setNotes={setNotes}
          isResizeView={isResize}
          setResizeView={setIsResize}
        />
      </main>
    </>
  );
}
