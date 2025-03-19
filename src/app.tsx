import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Plus, SpinnerGap, TrashSimple } from "@phosphor-icons/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { folderNameSchema } from "./schema";

import { EditorTiptap } from "./components";

export default function App() {
  const [notes, setNotes] = useState<string[] | any>([]);

  const handleAddNote = async (name: string) => {
    try {
      const res = await invoke("add_note", {
        name,
      });
      setNotes(res);
      toast.success("Nota adicionada!");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleRemoveNote = async (noteName: string) => {
    try {
      const res = await invoke("remove_note", { name: noteName });

      if (Array.isArray(res)) {
        setNotes(res);
        toast.success(`Nota "${noteName}" removida com sucesso.`);
      } else {
        toast.error(`${res}`);
      }
    } catch (error) {
      toast.error("Erro ao remover a nota");
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await invoke("list_notes");
      setNotes(res);
    } catch (error) {
      toast.error("Erro ao carregar as notas");
    }
  };

  const isNoteNameDuplicate = (name: string) => {
    return notes.includes(`${name}.json`);
  };

  useEffect(() => {
    fetchNotes();
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
        theme="light"
      />
      <main>
        <Formik
          initialValues={{ name: "" }}
          validationSchema={toFormikValidationSchema(folderNameSchema)}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              if (isNoteNameDuplicate(values.name)) {
                toast.error(`A nota "${values.name}" já existe.`);
                setSubmitting(false);
                return;
              }
              folderNameSchema.parse(values);
              await handleAddNote(values.name);
              setSubmitting(false);
              resetForm();
            } catch (err) {
              toast.error("Erro na validação do nome da nota.");
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleSubmit,
            handleReset,
          }) => (
            <Form onSubmit={handleSubmit} onReset={handleReset}>
              <div
                className="group_form"
                style={{ display: "flex", gap: "8px", flexDirection: "column" }}
              >
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  readOnly={isSubmitting}
                  placeholder="Nome da nota"
                />
                {errors.name && touched.name && (
                  <h5 className="form_error">{errors.name}</h5>
                )}
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <SpinnerGap size={24} /> : <Plus size={24} />}
              </button>
            </Form>
          )}
        </Formik>

        {notes.map((note: any, index: number) => (
          <button
            key={index}
            onClick={() => handleRemoveNote(note)}
            style={{ marginLeft: "8px", color: "red" }}
          >
            <TrashSimple size={24} />
            {note}
          </button>
        ))}

        {notes.length > 0 ? (
          <EditorTiptap fileName={notes[0]} />
        ) : (
          <p>Não tem notas</p>
        )}
      </main>
    </>
  );
}
