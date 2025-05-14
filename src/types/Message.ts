export interface ReactionMap {
    [userId: string]: string; // emoji keyed by user id
}

export interface ChatMessage {
    id: string;
    text: string;
    senderId: string;
    timestamp: number;
    reactions?: ReactionMap;
    unsent?: boolean;
}
