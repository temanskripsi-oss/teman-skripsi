import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import VideoSection from '@/components/home/VideoSection'
import ProblemSection from '@/components/home/ProblemSection'
import ProductCards from '@/components/home/ProductCards'
import HowItWorks from '@/components/home/HowItWorks'
import Testimonials from '@/components/home/Testimonials'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <VideoSection />
      <ProblemSection />
      <ProductCards />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </>
  )
}
