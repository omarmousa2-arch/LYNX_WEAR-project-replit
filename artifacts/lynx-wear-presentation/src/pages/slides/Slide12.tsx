const base = import.meta.env.BASE_URL;

export default function Slide12() {
  const isStatic = window.location.pathname.toLowerCase().endsWith('/allslides');

  return (
    <div dir="rtl" className="w-screen h-screen overflow-hidden relative slide-motion-12 bg-primary">
      <div aria-hidden="true" className="absolute left-[3vw] top-[8vh] w-[40vw] h-[72vh] rounded-[53%_47%_62%_38%] bg-olive/40" />
      <img src={base + 'images/lynx-logo.png'} crossOrigin="anonymous" alt="شعار Lynx Wear" className="absolute left-[8vw] top-[8vh] w-[32vw] h-[56vh] object-contain" />
      <div className="absolute right-[7vw] top-[7vh] w-[47vw] text-bg text-right">
        <p className="font-body text-[2vw] leading-[1.4] font-bold text-[#efa386]">
          إشراف: <span dir="ltr">دكتور Taha Mahmoud Metwally Nour El-Dein</span>
        </p>
        <h1 className="font-display text-[6vw] leading-[1.2] font-bold mt-[4vh]">شكراً لكم</h1>
        <p className="font-body text-[2.1vw] mt-[7vh]">تنفيذ: عمر مصطفي عبدالله</p>
        <div className="mt-[7vh] rounded-[0.8vw] bg-bg px-[1vw] py-[0.8vh] w-fit">
          <img src={base + 'images/nordpoints.svg'} crossOrigin="anonymous" alt="Nordpoints" className="h-[3.2vh] w-[10vw] object-contain" />
        </div>
        <div className="mt-[1.5vh] rounded-[0.8vw] bg-bg px-[1vw] py-[0.8vh] w-fit">
          <img src={base + 'images/replit.svg'} crossOrigin="anonymous" alt="Replit" className="h-[3.2vh] w-[10vw] object-contain" />
        </div>
      </div>

      <style>{isStatic ? '' : `@keyframes lynx-wave-12{from{transform:translateX(-2%)}to{transform:translateX(3%)}} @keyframes lynx-photo-12{from{transform:scale(1)}to{transform:scale(1.018)}} @keyframes lynx-title-12{from{opacity:.75;transform:translateY(.8vh)}to{opacity:1;transform:translateY(0)}} @media (prefers-reduced-motion: no-preference){.slide-motion-12 .lynx-wave-a{animation:lynx-wave-12 8s ease-in-out infinite alternate}.slide-motion-12 .lynx-wave-b{animation:lynx-wave-12 10s ease-in-out infinite alternate-reverse}.slide-motion-12 img:not([alt="Replit"]):not([alt="Nordpoints"]):not([alt="شعار Lynx Wear"]){animation:lynx-photo-12 10s ease-in-out infinite alternate}.slide-motion-12 h1{animation:lynx-title-12 .8s ease-out both}}`}</style>
      <svg aria-hidden="true" viewBox="0 0 1600 150" preserveAspectRatio="none" className="pointer-events-none absolute bottom-0 left-0 w-full h-[10vh]">
        <path className="lynx-wave-a" d="M-180 85 C100 0 360 145 640 72 S1180 10 1780 85 L1780 160 L-180 160 Z" fill="#737a52" opacity="0.18" />
        <path className="lynx-wave-b" d="M-180 112 C120 40 430 150 760 100 S1330 35 1780 110 L1780 160 L-180 160 Z" fill="#c64f31" opacity="0.13" />
      </svg>
    </div>
  );
}
