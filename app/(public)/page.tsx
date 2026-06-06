import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import WallOfGraduates from '@/components/home/WallOfGraduates'
import ProblemSection from '@/components/home/ProblemSection'
import ProductCards from '@/components/home/ProductCards'
import OfflineHighlight from '@/components/home/OfflineHighlight'
import HowItWorks from '@/components/home/HowItWorks'
import VideoTestimonials from '@/components/home/VideoTestimonials'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <WallOfGraduates />
      <ProblemSection />
      <ProductCards />
      <OfflineHighlight />
      <HowItWorks />
      <VideoTestimonials />
      <CTASection />
    </>
  )
}
