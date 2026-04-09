export type SectionId = 'top' | 'workflow' | 'departments' | 'contact';

export type DepartmentKey = 'project' | 'pr' | 'media' | 'design';

export type PersonProfile = {
  name: string;
  role: string;
  meta: string;
  bio: string;
  image?: string;
  quote?: string;
};

export type Department = {
  key: DepartmentKey;
  title: string;
  subtitle: string;
  image: string;
  directions: string[];
  about: string;
  lead: PersonProfile;
};

export type WorkflowStep = {
  title: string;
  description: string;
};

export type NavigationItem = {
  id: Exclude<SectionId, 'top'>;
  label: string;
};

export type FormState = {
  name: string;
  group: string;
  phone: string;
  email: string;
  telegram: string;
  about: string;
  department: DepartmentKey | '';
};
