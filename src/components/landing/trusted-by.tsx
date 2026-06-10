import Image from "next/image";

/* hpx balances visual size: each SVG has different internal padding and
   wordmark scale, so equal CSS heights render disproportionate logos */
const BRANDS = [
  { name: "Post Affiliate Pro", src: "/brands/pap.svg", href: "https://www.postaffiliatepro.com/", w: 158, h: 48, hpx: 33 },
  { name: "LiveAgent", src: "/brands/liveagent.svg", href: "https://www.liveagent.com/", w: 158, h: 48, hpx: 27 },
  { name: "FlowHunt", src: "/brands/flowhunt.svg", href: "https://www.flowhunt.io/", w: 1060, h: 223, hpx: 25 },
];

/** Hero "Trusted by" strip — monochrome brand logos. */
export default function TrustedBy() {
  return (
    <div className="trusted">
      <span className="tlbl">Trusted by</span>
      {BRANDS.map((b) => (
        <a key={b.name} href={b.href} target="_blank" rel="noreferrer" title={b.name}>
          <Image src={b.src} alt={b.name} width={b.w} height={b.h} style={{ height: b.hpx }} unoptimized />
        </a>
      ))}
    </div>
  );
}
