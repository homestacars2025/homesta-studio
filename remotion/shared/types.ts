// Shape returned by media.resolve_props(render_id) in the Stay database.

export type BrandProps = {
  key: string;
  name: string;
  version: number;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    mute?: string;
    rule?: string;
    red_ink?: string;
    paper_warm?: string;
    white?: string;
  };
  fonts: Record<'primary' | 'secondary' | 'display', { family: string; weights?: number[]; style?: string }>;
  logos: Partial<Record<
    'icon' | 'logo_horizontal' | 'logo_horizontal_light' | 'logo_stacked' | 'logo_stacked_light' | 'wordmark' | 'wordmark_light',
    string
  >>;
  icon_svg?: { path: string; viewbox: string; stroke: number };
  radius?: Record<string, number>;
  site?: string;
  handle?: string;
  default_cta?: string;
};

export type UnitProps = {
  id: string;
  slug?: string;
  title: string;
  name: string;
  subtitle?: string | null;
  type: string;
  district?: string | null;
  city?: string | null;
  price_from_usd?: number | null;
  min_nights?: number;
  specs: {
    bedrooms?: number | null;
    beds?: number | null;
    baths?: number | string | null;
    guests?: number | null;
    floor?: number | null;
    size_sqm?: number | null;
    kitchens?: number | null;
    to_mall?: string | null;
    to_transport?: string | null;
  };
  amenities: string[];
  photos: { url: string; w?: number; h?: number; cover?: boolean }[];
  photo_count?: number;
  pay_at_arrival?: boolean;
  deposit?: boolean;
  url?: string;
};

export type StudioProps = {
  template: string;
  render_id: string;
  brand: BrandProps;
  params: Record<string, unknown>;
  cta?: string;
  city?: { id: string; name: string; image?: string | null };
  district?: { id: string; name: string; city?: string; image?: string | null };
  unit?: UnitProps | null;
  units?: UnitProps[];
  /** set by the worker after checking the logo files exist in storage */
  logoReady?: boolean;
};
