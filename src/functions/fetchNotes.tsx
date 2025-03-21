import { useState } from "react";

import { invoke } from "@tauri-apps/api/core";

import { toast } from "react-toastify";

export const fetchNotes = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [applyTab, setApplyTab] = useState(notes[0]);
  const [contentNotes, setContentNotes] = useState<any>();

  const getListNotes = async () => {
    try {
      const res = (await invoke("list_notes")) as string[];
      setNotes(res);
      setApplyTab(res[0]);
    } catch (error) {
      toast.error("Erro ao carregar as notas");
    }
  };

  const getContentNote = async (fileName: string) => {
    try {
      const data = await invoke("get_content_note", { fileName });
      setContentNotes(data);
      return data;
    } catch (error) {
      toast.error(`Erro ao carregar a nota: ${error}`);
    }
  };

  const handleAddNote = async (
    name: string,
    resetTab: React.Dispatch<React.SetStateAction<string>>,
    isNotes: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    try {
      const res = await invoke("add_note", {
        name,
      });
      isNotes(res as string[]);
      const data = getContentNote(name);
      setContentNotes(data);
      resetTab(`${name}.json`);
      toast.success("Nota adicionada!");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleRemoveNote = async (
    name: string,
    resetTab: React.Dispatch<React.SetStateAction<string>>,
    isNotes: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    try {
      const res = await invoke("remove_note", { name });

      if (Array.isArray(res)) {
        isNotes(res);
        resetTab(res[0]);
        if (res.length > 0) {
          const data = getContentNote(res[0]);
          setContentNotes(data);
        }
        toast.success(`Nota "${name}" removida com sucesso.`);
      } else {
        toast.error(`${res}`);
      }
    } catch (error) {
      toast.error("Erro ao remover a nota");
    }
  };

  return {
    getListNotes,
    getContentNote,
    handleAddNote,
    handleRemoveNote,
    notes,
    setNotes,
    applyTab,
    setApplyTab,
    contentNotes,
    setContentNotes,
  };
};
