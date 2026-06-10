import Image from "next/image";

/* hpx balances visual size: PAP/LiveAgent only ink ~52% of their viewBox
   height while FlowHunt inks 100%, so equal CSS heights render FlowHunt
   ~2x larger. Values tuned for equal optical wordmark height. */
const BRANDS = [
  { name: "Post Affiliate Pro", src: "/brands/pap.svg", href: "https://www.postaffiliatepro.com/", w: 158, h: 48, hpx: 41 },
  { name: "LiveAgent", src: "/brands/liveagent.svg", href: "https://www.liveagent.com/", w: 158, h: 48, hpx: 44 },
  { name: "FlowHunt", src: "/brands/flowhunt.svg", href: "https://www.flowhunt.io/", w: 1060, h: 223, hpx: 24 },
  { name: "AmICited", src: "/brands/amicited.svg", href: "https://www.amicited.com/", w: 220, h: 50, hpx: 34 },
];

/** Hero "Trusted by" strip — monochrome brand logos. */
export default function TrustedBy() {
  return (
    <div className="trusted">
      <span className="tlbl">Trusted by</span>
      <div className="trow">
        {BRANDS.map((b) => (
          <a key={b.name} href={b.href} target="_blank" rel="noreferrer" title={b.name}>
            <Image src={b.src} alt={b.name} width={b.w} height={b.h} style={{ height: b.hpx }} unoptimized />
          </a>
        ))}
      </div>
    </div>
  );
}
