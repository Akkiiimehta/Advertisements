interface Brand {
  name: string;
  // Path under /public — e.g. "/images/logos/zepto.png". Omit to fall
  // back to styled text (used for KFC below until that logo file is
  // uploaded to public/images/logos/kfc.png — no other code changes
  // needed once it is, just add the logo field here).
  logo?: string;
}

// Edit this array to update the brand list — shows up in both rows.
const BRANDS: Brand[] = [
  { name: "Pampers", logo: "/images/logos/pampers.png" },
  { name: "Dabur", logo: "/images/logos/dabur.png" },
  { name: "Zepto", logo: "/images/logos/zepto.png" },
  { name: "KFC", logo: "/images/logos/images.png"},
  { name: "Flite", logo: "/images/logos/flite.png" },
  { name: "MuscleBlaze", logo: "/images/logos/muscleblaze.png" },
];

function BrandItem({ brand }: { brand: Brand }) {
  if (brand.logo) {
    return (
      <span className="brand-marquee-item brand-marquee-item-logo">
        <img src={brand.logo} alt={brand.name} draggable={false} loading="lazy" />
      </span>
    );
  }
  return <span className="brand-marquee-item brand-marquee-item-text">{brand.name}</span>;
}

// Classic seamless-marquee technique: each row renders the brand list
// TWICE back to back, then animates translateX from 0 to exactly -50%
// (one full set-width). Since the second copy is identical to the
// first, the moment the animation loops back to 0% the visual state is
// unchanged — no visible seam or jump. Pure CSS keyframes, no JS.
export default function BrandMarquee() {
  return (
    <div className="brand-marquee" aria-label="Brands worked with">
      <div className="brand-marquee-row brand-marquee-row-left">
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <BrandItem brand={brand} key={i} />
        ))}
      </div>
      <div className="brand-marquee-row brand-marquee-row-right">
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <BrandItem brand={brand} key={i} />
        ))}
      </div>
    </div>
  );
}
