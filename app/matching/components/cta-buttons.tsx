'use client'

import { motion } from 'framer-motion'
import { Download, Calendar, RefreshCw, Share2 } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface CTAButtonsProps {
  onDownload?: () => void
  onBookConsultation?: () => void
  onCheckAnother?: () => void
  onShare?: () => void
}

export default function CTAButtons({
  onDownload,
  onBookConsultation,
  onCheckAnother,
  onShare
}: CTAButtonsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <CTAButton
        variant="primary"
        icon={Download}
        text="Download Report"
        onClick={onDownload}
        index={0}
      />
      <CTAButton
        variant="secondary"
        icon={Calendar}
        text="Book Consultation"
        onClick={onBookConsultation}
        index={1}
      />
      <CTAButton
        variant="tertiary"
        icon={RefreshCw}
        text="Check Another"
        onClick={onCheckAnother}
        index={2}
      />
      <CTAButton
        variant="tertiary"
        icon={Share2}
        text="Share Results"
        onClick={onShare}
        index={3}
      />
    </div>
  )
}

interface CTAButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary'
  icon: LucideIcon
  text: string
  onClick?: () => void
  index: number
}

function CTAButton({ variant, icon: Icon, text, onClick, index }: CTAButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-transparent shadow-lg shadow-purple-500/20',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    tertiary: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-6 py-2.5 md:py-3 rounded-xl
        border transition-all duration-200 font-medium
        ${variants[variant]}
      `}
    >
      <Icon className="w-4 h-4 md:w-5 md:h-5" />
      <span className="text-xs md:text-sm lg:text-base">{text}</span>
    </motion.button>
  )
}
