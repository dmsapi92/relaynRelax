import { MessageType, MessagePriority, MessageStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { MessageReadStatusModel, MessageReadStatusCreateInput } from "./message-read-status";

export interface MessageModel {
  id: string;
  sender: string;
  recipients: string[];
  subject: string;
  content: string;
  type: MessageType;
  priority: MessagePriority;
  status: MessageStatus;
  attachments: string[];
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  readBy?: MessageReadStatusModel[];
  createdAt: string;
  updatedAt: string;
}

export interface MessageCreateInput {
  id?: string;
  sender: string;
  recipients: string[];
  subject: string;
  content: string;
  type: MessageType;
  priority?: MessagePriority;
  status?: MessageStatus;
  attachments: string[];
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageRelationalCreateInput extends MessageCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  readBy?: MessageReadStatusCreateInput | MessageReadStatusCreateInput[];
}

export type MessageUpdateInput = Partial<MessageCreateInput>;

