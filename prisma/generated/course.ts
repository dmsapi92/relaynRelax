import { CourseLevel, CourseStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { CourseSectionModel, CourseSectionCreateInput } from "./course-section";
import { CourseEnrollmentModel, CourseEnrollmentCreateInput } from "./course-enrollment";
import { AssignmentModel, AssignmentCreateInput } from "./assignment";
import { QuizModel, QuizCreateInput } from "./quiz";
import { DiscussionModel, DiscussionCreateInput } from "./discussion";
import { LiveClassModel, LiveClassCreateInput } from "./live-class";
import { LearningResourceModel, LearningResourceCreateInput } from "./learning-resource";

export interface CourseModel {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  duration: number;
  level: CourseLevel;
  status: CourseStatus;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  instructor: string;
  sections?: CourseSectionModel[];
  enrollments?: CourseEnrollmentModel[];
  assignments?: AssignmentModel[];
  quizzes?: QuizModel[];
  discussions?: DiscussionModel[];
  liveClasses?: LiveClassModel[];
  resources?: LearningResourceModel[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseCreateInput {
  id?: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  duration: number;
  level?: CourseLevel;
  status?: CourseStatus;
  campusId?: string;
  instructor: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseRelationalCreateInput extends CourseCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  sections?: CourseSectionCreateInput | CourseSectionCreateInput[];
  enrollments?: CourseEnrollmentCreateInput | CourseEnrollmentCreateInput[];
  assignments?: AssignmentCreateInput | AssignmentCreateInput[];
  quizzes?: QuizCreateInput | QuizCreateInput[];
  discussions?: DiscussionCreateInput | DiscussionCreateInput[];
  liveClasses?: LiveClassCreateInput | LiveClassCreateInput[];
  resources?: LearningResourceCreateInput | LearningResourceCreateInput[];
}

export type CourseUpdateInput = Partial<CourseCreateInput>;

