export const aiConversationApi = async (model: {
  conversationId?: string;
  message: string;
}) => {
  const response = await fetch("/api/ai/conversation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(model),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.body; // 返回 ReadableStream
};

