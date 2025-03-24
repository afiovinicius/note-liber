import { z } from "zod";

export const folderNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "O nome não pode estar vazio." })
    .max(10, { message: "O nome não pode ser maior que 10 caracteres." })
    .regex(/^[a-zA-Z0-9-_\.]+$/, {
      message:
        "O nome da pasta só pode conter letras, números, hífens, sublinhados e pontos.",
    })
    .refine((value) => !value.startsWith("."), {
      message:
        "O nome da pasta não pode começar com um ponto (exceto diretórios ocultos).",
    })
    .refine((value) => !value.includes("/"), {
      message: "O nome da pasta não pode conter a barra '/'",
    }),
});

export const setLinkSchema = z.object({
  linkUrl: z
    .string()
    .url({ message: "URL inválida. Deve começar com http ou https." }),
  linkLabel: z.string().optional(),
});
