import { BirthDetailsForm } from "@/components/kundli/birth-details-form"
import ServiceSchema from "@/components/schema/ServiceSchema"

export default function KundliPage() {
  return (
    <>
      {/* Schema.org markup for SEO and AI discoverability */}
      <ServiceSchema
        serviceName="Vedic Birth Chart Generation (Kundli)"
        description="Generate accurate Vedic Kundli with planetary positions, houses, dashas, yogas, and personalized astrological predictions based on your birth details."
        serviceType="Astrology Consultation"
      />
      
      <div className="container py-12 md:py-20">
        <BirthDetailsForm />
      </div>
    </>
  )
}
