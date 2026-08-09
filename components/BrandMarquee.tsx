// Edit this array to update the brand list — shows up in both rows.
const BRANDS = ["Pampers", "Dabur", "Zepto", "KFC", "Flite", "MuscleBlaze"];

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
          <span className="brand-marquee-item" key={i}>
            {brand}
          </span>
        ))}
      </div>
      <div className="brand-marquee-row brand-marquee-row-right">
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <span className="brand-marquee-item" key={i}>
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
