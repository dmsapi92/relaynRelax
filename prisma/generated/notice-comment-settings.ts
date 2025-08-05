export interface NoticeCommentSettingsModel {
  id: string;
  allowComments: boolean;
  allowReplies: boolean;
  autoApproveComments: boolean;
  autoApproveReplies: boolean;
  autoApproveAnonymousComments: boolean;
  autoApproveAnonymousReplies: boolean;
  allowAnonymousComments: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeCommentSettingsCreateInput {
  id?: string;
  allowComments?: boolean;
  allowReplies?: boolean;
  autoApproveComments?: boolean;
  autoApproveReplies?: boolean;
  autoApproveAnonymousComments?: boolean;
  autoApproveAnonymousReplies?: boolean;
  allowAnonymousComments?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoticeCommentSettingsRelationalCreateInput extends NoticeCommentSettingsCreateInput {
  
}

export type NoticeCommentSettingsUpdateInput = Partial<NoticeCommentSettingsCreateInput>;

