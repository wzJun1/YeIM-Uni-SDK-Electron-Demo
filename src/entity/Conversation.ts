
export interface Conversation {
	conversationId: string,
	createdAt: number
	lastMessage: any,
	type: string,
	unread: number
	updatedAt: number
	userInfo?: UserInfo,
	groupInfo?: GroupInfo
}

export interface UserInfo {
	avatarUrl?: string,
	createdAt?: number
	id?: number
	mobileDeviceId?: string,
	nickname?: string,
	userId?: string,
}


export interface GroupInfo {
	avatarUrl?: string,
	isMute?: boolean,
	name: string
}