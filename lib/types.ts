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
