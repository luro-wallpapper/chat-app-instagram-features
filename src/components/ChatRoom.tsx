import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { ChatMessage } from "../types/Message";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { v4 as uuid } from "uuid";

const socket = io();

export const ChatRoom: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userId] = useState<string>(() => uuid());

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on("message", (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
        });
        socket.on("reaction", ({ id, userId: uid, emoji }) => {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === id
                        ? {
                              ...m,
                              reactions: {
                                  ...(m.reactions || {}),
                                  ...(emoji ? { [uid]: emoji } : (() => { const r = { ...(m.reactions || {}) }; delete r[uid]; return r; })())
                              }
                          }
                        : m
                )
            );
        });
        socket.on("unsend", ({ id, senderId }) => {
            setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, unsent: true } : m))
            );
        });
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (text: string) => {
        const msg: ChatMessage = { id: uuid(), text, senderId: userId, timestamp: Date.now() };
        setMessages((prev) => [...prev, msg]);
        socket.emit("message", msg);
    };

    const handleReact = (id: string, emoji: string | null) => {
        socket.emit("reaction", { id, emoji });
    };

    const handleUnsend = (id: string) => {
        socket.emit("unsend", { id });
    };

    return (
        <div className="flex flex-col h-full">
            <MessageList messages={messages} currentUserId={userId} onReact={handleReact} onUnsend={handleUnsend} />
            <div ref={bottomRef} />
            <MessageInput onSend={handleSend} />
        </div>
    );
};
