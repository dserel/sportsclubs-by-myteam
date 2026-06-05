export type Category = {
  id: number;
  name: string;
  slug: string;
  kind: "sport" | "wellness";
};

export type Sport = {
  id: number;
  name: string;
  slug: string;
  category_id: number | null;
  club_count: number;
  source: "gga" | "admin";
  is_active: boolean;
};

export type Club = {
  id: number;
  gga_code: string | null;
  name: string;
  slug: string;
  reg_date: string | null;
  sport_slugs: string[];
  has_myteam: boolean;
  myteam_club_id: number | null;
  myteam_slug: string | null;
  city: string | null;
  region: string | null;
  address: string | null;
  postal_code: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  vat_number: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  lat: number | null;
  lng: number | null;
  is_published: boolean;
  // profile (phase 1)
  contact_name: string | null;
  contact_role: string | null;
  club_type: string | null; // Ψυχαγωγικό | Ακαδημία | Ανταγωνιστικό
  registration_url: string | null;
  registration_opens_at: string | null;
  annual_fee_min: number | null;
  annual_fee_max: number | null;
  socials: { facebook?: string; instagram?: string; [k: string]: string | undefined } | null;
};

export type ClubTeam = {
  id: number;
  club_id: number;
  name: string;
  gender: string | null;
  age_group: string | null;
  sport_id: number | null;
  registration_opens_at: string | null;
  registration_url: string | null;
  notes: string | null;
  sort_order: number;
};

export type MyteamClub = {
  id: number;
  name: string;
  slug: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  vat_number: string | null;
  onboarded_at: string | null;
  is_verified: boolean;
};

export type RegistrationRequest = {
  id: number;
  club_id: number | null;
  sport_id: number | null;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: "new" | "sent" | "contacted" | "closed";
  created_at: string;
};
