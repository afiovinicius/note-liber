import "./style.css";

import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { SpinnerGap, FilePlus } from "@phosphor-icons/react";

import { fetchNotes, isNoteNameDuplicate } from "../../functions";

import { folderNameSchema } from "../../schema";

import { AddNoteProps } from "./addnote.type";

import { Input } from "../input";
import { Button } from "../button";

export const FormAddNote = ({ notes, setTab, setNotes }: AddNoteProps) => {
  const { handleAddNote } = fetchNotes();

  return (
    <Formik
      initialValues={{ name: "" }}
      validationSchema={toFormikValidationSchema(folderNameSchema)}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          if (isNoteNameDuplicate(values.name, notes)) {
            toast.error(`A nota "${values.name}" já existe.`);
            setSubmitting(false);

            return;
          }

          folderNameSchema.parse(values);
          await handleAddNote(values.name, setTab, setNotes);
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
        <Form
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="form-add"
        >
          <div className="group_form">
            <Input
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
          <Button type="submit" disabled={isSubmitting} styles="dark">
            {isSubmitting ? <SpinnerGap size={16} /> : <FilePlus size={16} />}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
