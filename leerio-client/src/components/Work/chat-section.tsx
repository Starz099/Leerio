import { useState } from "react";
import { Input } from "../ui/input";
import { usePathname } from "next/navigation";

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

const ChatSection = () => {
  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const username = pathParts[1];
  const projectId = pathParts[3];

  const [chat, setChat] = useState<ChatMessage[]>([]);
  return (
    <div className="relative h-full w-full">
      <div className="scrollbar-hide mb-12 h-auto max-h-[90%] w-full overflow-y-auto">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`p-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <span className="bg-accent inline-block rounded-lg p-2">
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      <Input
        onKeyDown={async (e) => {
          if (e.key == "Enter") {
            const chatContext = chat;
            const newQuery: ChatMessage = {
              role: "user",
              message: e.currentTarget.value,
            };
            // setChat([...chat, newQuery]);
            e.currentTarget.value = "";

            const query: { chatHistory: ChatMessage[]; query: string } = {
              chatHistory: chatContext,
              query: newQuery.message,
            };

            const response: { response: string } = await (
              await fetch(
                `http://localhost:8000/chat?username=${username}&projectId=${projectId}&query=${JSON.stringify(query)}`,
                {
                  method: "POST",
                },
              )
            ).json();
            const aiResponse: ChatMessage = {
              role: "assistant",
              message: response.response,
            };
            setChat([...chat, newQuery, aiResponse]);
          }
        }}
        placeholder="Type your message..."
        className="absolute bottom-0"
      />
    </div>
  );
};

export default ChatSection;
