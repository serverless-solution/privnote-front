export const createNote = async (note: string) => {
    try {
        const response = await fetch(`https://bitburner.vberkoz.com/api/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "data": note,
                "dontAsk": true
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create note');
        }

        console.log("Note created successfully:", response);

        return response.json();
    } catch (error) {
        console.error('Error creating note:');
        throw error;
    }
}

export const getNote = async (noteId: string) => {
    try {
        const response = await fetch(`https://bitburner.vberkoz.com/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get note');
        }

        console.log("Note retrieved successfully:", response);

        return response.json();
    } catch (error) {
        console.error('Error getting note:');
        throw error;
    }
}