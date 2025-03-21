export const isNoteNameDuplicate = (name: string, notes: string[]) => {
  return notes.includes(`${name}.json`);
};
