import React, { useState, useRef } from "react";
import { ChatMessage } from "../types/Message";
import { ReactionPopup } from "./ui/ReactionPopup";
interface Props {
    message: ChatMessage;
    currentUserId: string;
    onReact: (id: string, emoji: string | null) => void;
    onUnsend: (id: string) => void;
    isMine: boolean;
}

export const MessageBubble: React.FC<Props> = ({ message, currentUserId, onReact, onUnsend, isMine }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const tapRef = useRef<number>(0);

    const handleDoubleTap = () => {
        const currentReaction = message.reactions?.[currentUserId] || null;
        const newReaction = currentReaction === "❤️" ? null : "❤️";
        onReact(message.id, newReaction);
    };

    const handleTouch = () => {
        const now = Date.now();
        if (now - tapRef.current < 300) {
            handleDoubleTap();
        }
        tapRef.current = now;
    };

    const alignment = isMine ? "self-end bg-blue-600" : "self-start bg-neutral-700";

    const renderReactions = () => {
        if (!message.reactions) return null;
        const counts = Object.values(message.reactions).reduce<Record<string, number>>((acc, emo) => {
            acc[emo] = (acc[emo] || 0) + 1;
            return acc;
        }, {});
        return (
            <div className="flex gap-1 mt-1 text-xs">
                {Object.entries(counts).map(([emo, count]) => (
                    <div key={emo} className="flex items-center gap-0.5 bg-neutral-800 px-1 py-0.5 rounded-full">
                        <span>{emo}</span>
                        {count > 1 && <span>{count}</span>}
                    </div>
                ))}
            </div>
        );
    };

    if (message.unsent) {
        const placeholder = isMine ? "You unsent a message" : "This message was unsent";
        return (
            <div className={`text-neutral-500 text-sm italic ${isMine ? "self-end" : "self-start"}`}>
                {placeholder}
            </div>
        );
    }

    return (
        <div
            onClick={() => setShowMenu(!showMenu)}
            onTouchStart={handleTouch}
            onDoubleClick={handleDoubleTap}
            className={`relative max-w-xs p-3 rounded-2xl text-white ${alignment}`}
        >
            {message.text}

            {renderReactions()}

            {showMenu && (
                <div className="absolute -top-9 right-0 bg-neutral-800 text-white rounded-md shadow-lg text-sm z-50">
                    {isMine && (
                        <button
                            className="block w-full px-3 py-1 hover:bg-neutral-700"
                            onClick={() => { setShowMenu(false); onUnsend(message.id);}}
                        >
                            Unsend
                        </button>
                    )}
                    <button
                        className="block w-full px-3 py-1 hover:bg-neutral-700"
                        onClick={() => { setShowMenu(false); setShowPopup(true);}}
                    >
                        React
                    </button>
                </div>
            )}

            {showPopup && (
                <ReactionPopup
                    onSelect={(emoji) => {
                        onReact(message.id, emoji);
                        setShowPopup(false);
                    }}
                />
            )}
        </div>
    );
};
