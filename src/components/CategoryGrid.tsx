export default function CategoryGrid(){
  return (<section className="container-x pb-16">
    {/* ===== Woman Collection: ảnh gốc + nền sóng hồng gốc của bản demo ===== */}
    <div className="relative grid grid-cols-2 h-[340px] md:h-[600px] overflow-hidden">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/site/cat-woman-tall.jpg" alt="Woman Collection" className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute bottom-5 left-6 text-white font-semibold tracking-widest text-lg md:text-xl drop-shadow">WOMAN</span>
      </div>
      <div className="relative bg-cover bg-center" style={{backgroundImage:"url(/images/site/pink-wave.jpg)"}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/site/cat-woman-inset.jpg" alt="" className="absolute right-[6%] top-[7%] h-[78%] object-cover shadow-lg" />
      </div>
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/site/19ss.png" alt="19SS" className="mt-[8%] w-[180px] md:w-[290px]" />
        <h3 className="mt-1 text-center font-heading font-extrabold text-white text-4xl md:text-7xl leading-[1.05] drop-shadow-md">Woman<br />Collection</h3>
      </div>
      <span className="absolute bottom-5 right-6 text-[#4d4d4d] font-semibold tracking-widest text-lg md:text-xl">WOMAN</span>
    </div>

    {/* ===== Man Collection: ảnh gốc + nền sóng xanh gốc của bản demo ===== */}
    <div className="relative grid grid-cols-2 h-[300px] md:h-[520px] overflow-hidden">
      <div className="relative bg-cover bg-center" style={{backgroundImage:"url(/images/site/blue-wave.jpg)"}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/site/cat-man-inset.jpg" alt="" className="absolute left-[10%] top-[9%] h-[82%] object-cover shadow-lg" />
      </div>
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/site/cat-man-tall.jpg" alt="Man Collection" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <h3 className="absolute top-[4%] left-1/2 -translate-x-1/2 font-heading font-extrabold text-white text-4xl md:text-7xl drop-shadow-md pointer-events-none">Collection</h3>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/site/19ss.png" alt="19SS" className="absolute left-[36%] top-[44%] w-[160px] md:w-[270px] pointer-events-none" />
      <span className="absolute bottom-5 left-6 text-[#4d4d4d] font-semibold tracking-widest text-lg md:text-xl">MAN</span>
      <span className="absolute bottom-5 right-6 text-white font-semibold tracking-widest text-lg md:text-xl drop-shadow">MAN</span>
    </div>
  </section>);
}
