import React from "react";
import { ChatMessage } from "../types/Message";
import { MessageBubble } from "./MessageBubble";

interface Props {
    messages: ChatMessage[];
    currentUserId: string;
    onReact: (id: string, emoji: string | null) => void;
    onUnsend: (id: string) => void;
}

export const MessageList: React.FC<Props> = ({ messages, currentUserId, onReact, onUnsend }) => {
    return (
        <div className="flex flex-col gap-2 overflow-y-auto px-3 py-4 flex-1">
            {messages.map((msg) => (
                <MessageBubble
                    key={msg.id}
                    message={msg}
                    currentUserId={currentUserId}
                    onReact={onReact}
                    onUnsend={onUnsend}
                    isMine={msg.senderId === currentUserId}
                />
            ))}
        </div>
    );
};
