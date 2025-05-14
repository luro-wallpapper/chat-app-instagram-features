import React from "react";

interface Props {
    onSelect: (emoji: string | null) => void;
}

const EMOJIS = ["❤️","😆","😮","😢","👏","👍","👎"];

export const ReactionPopup: React.FC<Props> = ({ onSelect }) => {
    return (
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-neutral-800 text-white rounded-2xl p-2 flex gap-1 shadow-lg z-50">
            {EMOJIS.map((e) => (
                <button
                    key={e}
                    className="hover:scale-110 transition-transform duration-150"
                    onClick={() => onSelect(e)}
                >
                    <span style={{fontSize:"18px"}}>{e}</span>
                </button>
            ))}
            <button
                className="ml-2 text-xs text-neutral-400 hover:text-red-400"
                onClick={() => onSelect(null)}
            >
                Remove
            </button>
        </div>
    );
};
