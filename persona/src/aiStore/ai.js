import { create } from "zustand";
import axios from "axios";


export const useAIStore = create((set) => ({
    response: null,
    setResponse: async (systemPrompt,messages) => {
        try {
            console.log("system prompt - ",systemPrompt,"Messages - ",messages)
            const response = await axios.post(
              `${import.meta.env.BACKEND_URL}/persona-ai`,
              {
                systemPrompt,
                messages,
              }
            );
            set({ response: response.data.messages });
        } catch (error) {
            console.error("Error fetching response:", error);
        }


    },
}));