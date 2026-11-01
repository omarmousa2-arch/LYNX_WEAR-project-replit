const base = import.meta.env.BASE_URL;

export default function Slide1() {
  const isStatic = window.location.pathname.toLowerCase().endsWith('/allslides');

  return (
    <div dir="rtl" className="w-screen h-screen overflow-hidden relative slide-motion-1 bg-primary">
      <img src={base + 'images/hero.jpg'} crossOrigin="anonymous" alt="ملابس تمرين" className="absolute left-0 top-0 h-full w-[48vw] object-cover" />
      <div aria-hidden="true" className="absolute left-0 top-0 h-full w-[58vw] bg-gradient-to-l from-primary via-primary/40 to-transparent" />
      <div aria-hidden="true" className="absolute left-[1vw] bottom-[1vh] h-[34vh] w-[31vw] rounded-[51%_49%_61%_39%] bg-accent/20" />

      <div className="absolute right-[6vw] top-[5vh] w-[45vw] text-right text-bg flex flex-col items-start">
        <p className="font-body text-[1.9vw] leading-[1.4] font-bold text-[#efa386]">
          إشراف: <span dir="ltr">دكتور Taha Mahmoud Metwally Nour El-Dein</span>
        </p>
        <img src={base + 'images/lynx-logo.png'} crossOrigin="anonymous" alt="شعار Lynx Wear" className="h-[15vh] w-[12vw] object-contain self-start mt-[2vh]" />
        <h1 dir="ltr" className="font-display text-[6vw] leading-none font-bold text-bg mt-[1vh]">LYNX WEAR</h1>
        <p className="font-body text-[2.05vw] leading-[1.45] mt-[3vh]">متجر إلكتروني لملابس ومستلزمات التمرين</p>
        <p className="font-body text-[1.7vw] leading-[1.4] mt-[3vh]">تنفيذ: عمر مصطفي عبدالله</p>
        <div className="mt-[3vh] rounded-[0.8vw] bg-bg px-[1vw] py-[0.8vh]">
          <img src={base + 'images/nordpoints.svg'} crossOrigin="anonymous" alt="Nordpoints" className="h-[3.2vh] w-[10vw] object-contain" />
        </div>
        <div className="mt-[1vh] rounded-[0.6vw] bg-bg px-[0.8vw] py-[0.5vh]">
          <img src={base + 'images/replit.svg'} crossOrigin="anonymous" alt="Replit" className="h-[2.7vh] w-[8vw] object-contain" />
        </div>
      </div>

      <style>{isStatic ? '' : `@keyframes lynx-wave-1{from{transform:translateX(-2%)}to{transform:translateX(3%)}} @keyframes lynx-photo-1{from{transform:scale(1)}to{transform:scale(1.018)}} @keyframes lynx-title-1{from{opacity:.75;transform:translateY(.8vh)}to{opacity:1;transform:translateY(0)}} @media (prefers-reduced-motion: no-preference){.slide-motion-1 .lynx-wave-a{animation:lynx-wave-1 8s ease-in-out infinite alternate}.slide-motion-1 .lynx-wave-b{animation:lynx-wave-1 10s ease-in-out infinite alternate-reverse}.slide-motion-1 img:not([alt="Replit"]):not([alt="Nordpoints"]):not([alt="شعار Lynx Wear"]){animation:lynx-photo-1 10s ease-in-out infinite alternate}.slide-motion-1 h1{animation:lynx-title-1 .8s ease-out both}}`}</style>
      <svg aria-hidden="true" viewBox="0 0 1600 150" preserveAspectRatio="none" className="pointer-events-none absolute bottom-0 left-0 w-full h-[10vh]">
        <path className="lynx-wave-a" d="M-180 85 C100 0 360 145 640 72 S1180 10 1780 85 L1780 160 L-180 160 Z" fill="#737a52" opacity="0.18" />
        <path className="lynx-wave-b" d="M-180 112 C120 40 430 150 760 100 S1330 35 1780 110 L1780 160 L-180 160 Z" fill="#c64f31" opacity="0.13" />
      </svg>
    </div>
  );
}
