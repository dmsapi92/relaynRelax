export interface AnnouncementCommentSettingsModel {
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

export interface AnnouncementCommentSettingsCreateInput {
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

export interface AnnouncementCommentSettingsRelationalCreateInput extends AnnouncementCommentSettingsCreateInput {
  
}

export type AnnouncementCommentSettingsUpdateInput = Partial<AnnouncementCommentSettingsCreateInput>;

