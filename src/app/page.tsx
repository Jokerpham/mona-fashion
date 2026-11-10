import Hero from "@/components/Hero";
import PromoCards from "@/components/PromoCards";
import ProductSection from "@/components/ProductSection";
import CategoryGrid from "@/components/CategoryGrid";
import PromoBanner from "@/components/PromoBanner";
import BlogSection from "@/components/BlogSection";
export default function HomePage(){
  return (<>
<Hero />
    <PromoCards /><ProductSection /><CategoryGrid /><PromoBanner /><BlogSection />
  </>);
}
