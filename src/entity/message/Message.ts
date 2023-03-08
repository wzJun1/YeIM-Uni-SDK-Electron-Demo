import type { MessageImage } from "./MessageImage";
import type { MessageText } from "./MessageText";

export interface Message {
    body: MessageText | MessageImage,
    conversationId: string,
    conversationType: string,
    direction: string,
    extra: string,
    from: string,
    fromUserInfo: any,
    isDeleted: number,
    isRead: number,
    isRevoke: number,
    messageId: string,
    receive: number,
    sequence: number,
    status: string,
    time: number,
    to: string,
    type: string,
    userId: string,
}