import { getNote } from "@/services/notesService";
import { useQuery } from "@tanstack/react-query"

interface Note {
  id: string;
  data: string;
}

export const useGetNote = (noteId: string) => {
  return useQuery<Note, Error>({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId),
    enabled: !!noteId,
  });
};