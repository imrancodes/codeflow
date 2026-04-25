import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface AiPrompt {
  prompt: string;
}

export interface AiResponse {
  text: string;
  [key: string]: any;
}

const aiDataFetch = async (payload: AiPrompt): Promise<AiResponse> => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }
  return data;
};

export const useAiChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AiPrompt) => aiDataFetch(payload),
    onSuccess: () => {
      queryClient.setQueryData(["ai"], null);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
};

export interface InlineCompletionRequest {
  language: string;
  prefix: string;
  suffix: string;
  maxTokens?: number;
}

export interface InlineCompletionResponse {
  completion: string;
}

export const fetchInlineCompletion = async (
  payload: InlineCompletionRequest,
  signal?: AbortSignal
): Promise<InlineCompletionResponse> => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/ai/inline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Inline completion failed");
  }
  return data;
};
