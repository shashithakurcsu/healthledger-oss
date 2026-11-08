import { z } from 'zod';
import { RELATIONSHIPS } from '@/constants';

// Get relationship keys for validation
const relationshipKeys = Object.keys(RELATIONSHIPS) as [string, ...string[]];

// Family member form schema
export const familyMemberSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  relationship: z.enum(relationshipKeys).optional(),
  date_of_birth: z.string().optional().nullable(),
});

export type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;

// Family member with all fields from database
export interface FamilyMember {
  id: string;
  profile_id: string;
  name: string;
  relationship: string | null;
  date_of_birth: string | null;
  created_at: string;
}

// For creating a new family member
export interface CreateFamilyMemberInput extends FamilyMemberFormData {
  profile_id: string;
}

// For updating a family member
export type UpdateFamilyMemberInput = Partial<FamilyMemberFormData>;
