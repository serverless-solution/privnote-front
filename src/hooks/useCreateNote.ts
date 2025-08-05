import { createNote } from "@/services/notesService";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateNote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (note: string) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}