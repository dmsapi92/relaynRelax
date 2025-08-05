import { CalendarEventStatus } from "./enums";
import { CalendarModel, CalendarCreateInput } from "./calendar";
import { EventDetailsModel, EventDetailsCreateInput } from "./event-details";
import { EventRecurrenceModel, EventRecurrenceCreateInput } from "./event-recurrence";
import { EventReminderModel, EventReminderCreateInput } from "./event-reminder";
import { EventAttendeeModel, EventAttendeeCreateInput } from "./event-attendee";

export interface CalendarEventModel {
  id: string;
  calendar?: CalendarModel;
  calendarId: string;
  details?: EventDetailsModel;
  recurrence?: EventRecurrenceModel;
  reminders?: EventReminderModel[];
  attendees?: EventAttendeeModel[];
  status: CalendarEventStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEventCreateInput {
  id?: string;
  calendarId?: string;
  status?: CalendarEventStatus;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CalendarEventRelationalCreateInput extends CalendarEventCreateInput {
  calendar?: CalendarCreateInput;
  details?: EventDetailsCreateInput;
  recurrence?: EventRecurrenceCreateInput;
  reminders?: EventReminderCreateInput | EventReminderCreateInput[];
  attendees?: EventAttendeeCreateInput | EventAttendeeCreateInput[];
}

export type CalendarEventUpdateInput = Partial<CalendarEventCreateInput>;

