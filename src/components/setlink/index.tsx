import "./styles.css";

import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { setLinkSchema } from "../../schema";

import { Input } from "../input";
import { Button } from "../button";

import { SetLinkProps } from "./setlink.type";

export const FormSetLink = ({ isEditor }: SetLinkProps) => {
  const [linkContent, setLinkContent] = useState({
    linkLabel: "",
    linkUrl: "",
  });

  useEffect(() => {
    if (!isEditor) return;
    const { $anchor } = isEditor.state.selection;
    const linkMark = isEditor.getAttributes("link");
    const labelMark = $anchor.parent.textContent;

    setLinkContent({
      linkLabel: labelMark,
      linkUrl: linkMark.href,
    });
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...linkContent,
      }}
      validationSchema={toFormikValidationSchema(setLinkSchema)}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        if (!isEditor) return;

        const hasSelection = !isEditor.state.selection.empty;

        isEditor.chain().focus().extendMarkRange("link").unsetLink().run();

        if (hasSelection) {
          isEditor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: values.linkUrl })
            .run();
        } else {
          isEditor
            .chain()
            .focus()
            .insertContent(
              `<a href="${values.linkUrl}" target="_blank">${
                values.linkLabel || values.linkUrl
              }</a>`
            )
            .run();
        }

        setSubmitting(false);
        resetForm();
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
          className="form-setlink"
        >
          <div className="group_form">
            <label htmlFor="linkUrl">URL</label>
            <Input
              type="text"
              id="linkUrl"
              name="linkUrl"
              value={values.linkUrl}
              onChange={handleChange}
              readOnly={isSubmitting}
              placeholder="Seu link"
            />
            {errors.linkUrl && touched.linkUrl && (
              <h5 className="form_error">{errors.linkUrl}</h5>
            )}
          </div>
          <div className="group_form">
            <label htmlFor="linkLabel">Nome</label>
            <Input
              type="text"
              id="linkLabel"
              name="linkLabel"
              value={values.linkLabel}
              onChange={handleChange}
              readOnly={isSubmitting}
              placeholder="Nome do link"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} styles="brand" full>
            {linkContent.linkUrl ? "Editar" : "Inserir"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
