export interface KootaExplanation {
  meaning: string
  impact: string
  scoreReason: string
  improvementTips?: string[]
}

export interface KootaTemplate {
  meaning: string
  interpretations: {
    full: { impact: string }
    partial: { impact: string }
    zero: { impact: string }
  }
  scoreReasons: Record<string, string>
  guidance: {
    zero: string[]
    partial: string[]
    full: string[]
  }
}

// ============================================
// KOOTA 1: VARNA (1 point)
// ============================================
const varnaTemplate: KootaTemplate = {
  meaning: "Varna represents spiritual compatibility and ego levels between partners.",
  
  interpretations: {
    full: {
      impact: "You score full points here, suggesting similar approaches to life purpose and spiritual growth. This creates a foundation of mutual respect and understanding in your relationship."
    },
    partial: {
      impact: "You have compatible Varna classifications, though with some differences in how you approach spirituality and personal growth. This minor variation rarely causes issues in modern relationships."
    },
    zero: {
      impact: "Your Varna classifications differ in traditional hierarchy. In modern contexts, this primarily reflects different approaches to ambition and ego expression rather than actual incompatibility. Many successful couples share this pattern."
    }
  },
  
  scoreReasons: {
    "Brahmin-Brahmin": "Both partners have Brahmin Varna, indicating aligned intellectual and spiritual pursuits.",
    "Brahmin-Kshatriya": "Compatible Varna pairing with complementary approaches to leadership and knowledge.",
    "Brahmin-Vaishya": "Compatible Varna pairing blending intellectual and practical orientations.",
    "Brahmin-Shudra": "Different Varna classifications. In traditional texts this scores 0, though modern interpretation focuses on complementary strengths.",
    "Kshatriya-Kshatriya": "Both partners share Kshatriya Varna, suggesting similar leadership qualities and protective instincts.",
    "Kshatriya-Vaishya": "Compatible Varna pairing with balanced power and practical dynamics.",
    "Kshatriya-Shudra": "Different Varna classifications reflecting different approaches to ambition and service.",
    "Vaishya-Vaishya": "Both partners have Vaishya Varna, indicating shared focus on material security and practical matters.",
    "Vaishya-Shudra": "Different Varna orientations that can complement each other in practical life.",
    "Shudra-Shudra": "Both partners share Shudra Varna, suggesting similar service-oriented and grounded natures.",
    "same": "Identical Varna indicates aligned ego levels and spiritual orientation.",
    "compatible": "Compatible Varna pairing creates natural mutual respect.",
    "incompatible": "Different Varna levels reflect varied approaches to ambition, which many couples successfully navigate.",
    "default": "Varna calculated based on Moon sign positions."
  },
  
  guidance: {
    zero: [
      "Focus on shared values rather than traditional role expectations",
      "Appreciate that different ambition levels can create balance",
      "Modern relationships thrive on mutual respect regardless of traditional classifications"
    ],
    partial: [
      "Your Varna compatibility provides a good foundation for mutual respect",
      "Small differences in spiritual approach can add healthy diversity"
    ],
    full: [
      "Your aligned Varna is a strength - nurture shared spiritual or intellectual pursuits",
      "This compatibility creates natural understanding in value-based decisions"
    ]
  }
}

// ============================================
// KOOTA 2: VASHYA (2 points)
// ============================================
const vashyaTemplate: KootaTemplate = {
  meaning: "Vashya measures mutual attraction, influence, and control dynamics in the relationship.",
  
  interpretations: {
    full: {
      impact: "You score maximum points in mutual attraction and influence. This suggests natural chemistry and balanced power dynamics where neither partner dominates. You likely feel comfortable being yourselves around each other."
    },
    partial: {
      impact: "You have moderate Vashya compatibility, indicating good attraction with some areas where influence may be one-sided. This is common and manageable with conscious communication about decision-making."
    },
    zero: {
      impact: "Your Vashya score is low, suggesting that power dynamics and mutual influence may require attention. One partner might naturally dominate decisions, or you may struggle with control issues. Awareness and open dialogue about this pattern can help create more balance."
    }
  },
  
  scoreReasons: {
    "same-sign": "Your Moon signs share the same Vashya category, creating natural understanding and balanced influence.",
    "compatible-vashya": "Your Moon signs have compatible Vashya types, allowing for mutual attraction and respect.",
    "one-way-vashya": "One partner's sign influences the other more than vice versa, creating asymmetric control dynamics.",
    "incompatible-vashya": "Your Vashya types traditionally don't harmonize, which can manifest as power struggles or lack of natural chemistry.",
    "neutral": "Your signs have neutral Vashya relationship, neither strongly attracted nor repelled.",
    "default": "Vashya calculated based on Moon sign Vashya categories."
  },
  
  guidance: {
    zero: [
      "Establish clear agreements about major decisions to prevent one partner from dominating",
      "Practice conscious power-sharing in different life areas",
      "Recognize when control dynamics are playing out and address them directly",
      "Consider couples counseling if power struggles become frequent"
    ],
    partial: [
      "Notice patterns in who tends to influence whom in different situations",
      "Ensure both partners have areas where their input is valued equally",
      "Maintain individual autonomy while nurturing mutual attraction"
    ],
    full: [
      "Your balanced influence is a relationship strength - maintain it consciously",
      "This natural chemistry supports both independence and togetherness",
      "Continue to respect each other's autonomy even with strong mutual attraction"
    ]
  }
}

// ============================================
// KOOTA 3: TARA (3 points)
// ============================================
const taraTemplate: KootaTemplate = {
  meaning: "Tara represents health, well-being, and the overall prosperity that partners bring to each other's lives.",
  
  interpretations: {
    full: {
      impact: "You score full points in Tara, suggesting that you bring positive health, luck, and overall well-being into each other's lives. This is considered highly auspicious for mutual support during challenges and shared prosperity."
    },
    partial: {
      impact: "Your Tara compatibility is moderate, indicating that you generally support each other's well-being, though there may be specific life areas where you need to be more conscious of supporting vs. draining each other's energy."
    },
    zero: {
      impact: "Low Tara score suggests that your Nakshatras may not naturally enhance each other's health and prosperity. This doesn't predict illness or failure, but indicates you should be more intentional about supporting each other's physical and emotional well-being."
    }
  },
  
  scoreReasons: {
    "favorable-tara": "Your birth stars (Nakshatras) are positioned favorably relative to each other, creating mutual support for health and prosperity.",
    "neutral-tara": "Your Nakshatras have a neutral relationship regarding health and well-being influence.",
    "unfavorable-tara": "Your birth stars are in positions that traditionally indicate challenges in supporting each other's health and prosperity.",
    "janma-tara": "Same birth star or Janma Tara relationship detected.",
    "sampat-tara": "Sampat Tara relationship suggests mutual prosperity.",
    "vipat-tara": "Vipat Tara relationship requires extra care for each other's well-being.",
    "kshema-tara": "Kshema Tara relationship indicates safety and security together.",
    "pratyak-tara": "Pratyak Tara relationship may bring obstacles that require conscious effort.",
    "sadhana-tara": "Sadhana Tara relationship involves mutual accomplishment.",
    "naidhana-tara": "Naidhana Tara relationship requires remedies and extra care.",
    "default": "Tara calculated based on Nakshatra positions."
  },
  
  guidance: {
    zero: [
      "Prioritize regular health check-ins and wellness practices together",
      "Be extra attentive to each other's stress levels and physical health",
      "Create rituals of care - regular date nights, health routines, or mutual hobbies",
      "Consider traditional remedies like fasting on auspicious days or charitable acts"
    ],
    partial: [
      "Maintain awareness of how your moods and health affect each other",
      "Build supportive routines around health and well-being",
      "Celebrate shared wins and support each other through setbacks"
    ],
    full: [
      "Your natural ability to support each other's well-being is a gift - nurture it",
      "This compatibility helps you weather life's challenges together",
      "Continue being each other's source of positive energy and health"
    ]
  }
}

// ============================================
// KOOTA 4: YONI (4 points)
// ============================================
const yoniTemplate: KootaTemplate = {
  meaning: "Yoni represents instinctive compatibility, including physical attraction, sexual harmony, and basic temperamental nature.",
  
  interpretations: {
    full: {
      impact: "You score maximum points in Yoni, indicating strong instinctive compatibility and natural physical attraction. This suggests alignment in intimacy needs, affection expression, and basic temperament. You likely feel naturally comfortable with each other's energy."
    },
    partial: {
      impact: "Your Yoni compatibility is moderate, suggesting some natural attraction with areas where your instincts or intimacy needs may differ. This is common and can be bridged through open communication about physical and emotional needs."
    },
    zero: {
      impact: "Low Yoni score indicates differences in instinctive nature and intimacy preferences. You may express affection differently or have varying comfort levels with physical closeness. This gap can be bridged through patient communication and understanding each other's love languages."
    }
  },
  
  scoreReasons: {
    "same-yoni": "You share the same Yoni (animal symbol), creating natural instinctive understanding and physical compatibility.",
    "friendly-yoni": "Your Yonis are naturally friendly, supporting good physical and temperamental harmony.",
    "neutral-yoni": "Your Yonis have a neutral relationship, neither strongly compatible nor incompatible.",
    "enemy-yoni": "Your Yonis are traditionally considered opposing natures, which can manifest as different intimacy preferences.",
    "Horse-Horse": "Both partners have Horse Yoni - energetic, free-spirited, and adventurous natures.",
    "Elephant-Elephant": "Both partners have Elephant Yoni - dignified, loyal, and steady temperaments.",
    "Cat-Rat": "Cat and Rat Yonis are natural enemies, suggesting different instinctive approaches.",
    "Dog-Deer": "Dog and Deer Yonis have moderate compatibility with some natural differences.",
    "default": "Your birth stars have a specific Yoni relationship that influences instinctive compatibility."
  },
  
  guidance: {
    zero: [
      "Openly discuss your needs for physical affection and intimacy",
      "Learn each other's love languages and primary ways of feeling loved",
      "Don't assume what feels natural to you feels natural to your partner",
      "Consider reading books on intimacy together or attending workshops",
      "Build emotional intimacy which often enhances physical compatibility"
    ],
    partial: [
      "Appreciate both your similarities and differences in expressing affection",
      "Check in regularly about intimacy and connection needs",
      "Create rituals that honor both partners' comfort levels"
    ],
    full: [
      "Your natural physical and temperamental compatibility is a strong foundation",
      "Continue to nurture this instinctive connection consciously",
      "This harmony supports both passion and comfort in the relationship"
    ]
  }
}

// ============================================
// KOOTA 5: GRAHA MAITRI (5 points)
// ============================================
const grahaMaitriTemplate: KootaTemplate = {
  meaning: "Graha Maitri measures mental compatibility, friendship, and intellectual harmony between partners based on Moon sign rulers.",
  
  interpretations: {
    full: {
      impact: "You score maximum points in mental compatibility. Your Moon signs are ruled by friendly planets, creating natural intellectual harmony, easy communication, and strong friendship. You likely understand each other's thought processes and enjoy each other's company even in simple daily activities."
    },
    partial: {
      impact: "You have good mental compatibility with some areas of difference. Your ruling planets are neutral or partially friendly, meaning you generally understand each other but may have different thinking styles or communication preferences. This moderate compatibility is very workable."
    },
    zero: {
      impact: "Your Graha Maitri score is low, indicating that your Moon sign rulers are traditionally inimical. This can manifest as different mental wavelengths, communication misunderstandings, or feeling like you're speaking different languages. However, conscious effort to understand each other's perspectives can bridge this gap."
    }
  },
  
  scoreReasons: {
    "same-lord": "Your Moon signs share the same ruling planet, creating identical mental wavelengths and natural understanding.",
    "natural-friends": "Your Moon sign lords are natural friends in Vedic astrology, supporting mental harmony.",
    "temporary-friends": "Your Moon sign lords are temporarily friendly based on their current positions.",
    "neutral-relationship": "Your Moon sign lords have a neutral relationship, neither strongly compatible nor incompatible in mental matters.",
    "natural-enemies": "Your Moon sign lords are natural enemies in traditional planetary relationships, suggesting different mental approaches.",
    "Sun-Moon": "Sun and Moon rule your signs - masculine and feminine energies that can complement or clash.",
    "Mars-Venus": "Mars and Venus rule your signs - passion and harmony seeking different expressions.",
    "default": "Specific planetary relationship between your Moon sign rulers affects mental compatibility."
  },
  
  guidance: {
    zero: [
      "Practice active listening without immediately jumping to solutions or judgments",
      "Recognize that different thinking styles can be complementary rather than wrong",
      "Establish communication ground rules during disagreements",
      "Take time to understand WHY your partner thinks differently, not just WHAT they think",
      "Consider using written communication for important topics if verbal feels strained"
    ],
    partial: [
      "Appreciate when your different mental approaches bring fresh perspectives",
      "Build on areas where you naturally understand each other",
      "Be patient when communication feels slightly off-sync"
    ],
    full: [
      "Your mental compatibility is a significant strength - you're naturally on the same wavelength",
      "This friendship foundation supports long-term relationship satisfaction",
      "Continue to nurture intellectual connection through shared interests and deep conversations"
    ]
  }
}

// ============================================
// KOOTA 6: GANA (6 points)
// ============================================
const ganaTemplate: KootaTemplate = {
  meaning: "Gana reflects temperament, nature, and how you approach life's challenges - particularly conflict resolution and decision-making styles.",
  
  interpretations: {
    full: {
      impact: "You score maximum points in Gana, meaning you share the same fundamental temperament. Both partners approach challenges, conflicts, and daily life with similar energy levels and decision-making styles. This creates natural harmony in navigating life's ups and downs together."
    },
    partial: {
      impact: "You have moderate Gana compatibility, indicating some alignment in temperament with occasional differences in handling stress or making decisions. This is manageable and can even be beneficial as different approaches sometimes complement each other."
    },
    zero: {
      impact: "Your Gana score is low, suggesting fundamentally different temperaments. You likely have contrasting approaches to conflict, stress management, and decision-making. One partner may be more direct or aggressive while the other seeks harmony or avoidance. These differences are workable but require conscious communication strategies."
    }
  },
  
  scoreReasons: {
    "Dev-Dev": "Both partners have Dev Gana (divine nature) - gentle, harmonious, and peace-seeking temperaments.",
    "Manushya-Manushya": "Both partners have Manushya Gana (human nature) - balanced, practical, and moderate temperaments.",
    "Rakshasa-Rakshasa": "Both partners have Rakshasa Gana (demonic nature) - intense, direct, and forceful temperaments.",
    "Dev-Manushya": "Dev and Manushya Ganas are compatible - gentle and balanced natures work well together.",
    "Manushya-Rakshasa": "Manushya and Rakshasa Ganas are partially compatible - balanced and intense natures creating moderate harmony.",
    "Dev-Rakshasa": "Dev and Rakshasa Ganas are traditionally incompatible - gentle and forceful natures may clash during conflicts.",
    "same-gana": "Identical Ganas create natural temperamental harmony.",
    "compatible-gana": "Compatible Ganas support mutual understanding in handling life's challenges.",
    "incompatible-gana": "Different Ganas require conscious effort to understand each other's conflict styles.",
    "default": "Gana calculated based on Nakshatra classifications."
  },
  
  guidance: {
    zero: [
      "Establish 'time-out' signals or cooling-off periods during heated discussions",
      "Recognize that your partner's approach to conflict isn't wrong, just different",
      "Create pre-agreed rules for fighting fair (no name-calling, no bringing up past issues, etc.)",
      "Appreciate that different temperaments can balance each other - gentleness tempers intensity, directness prevents avoidance",
      "Consider couples communication workshops to build skills for your specific dynamic"
    ],
    partial: [
      "Notice patterns in when your temperaments align vs. clash",
      "Build on situations where your different approaches complement each other",
      "Be mindful during high-stress periods when temperament differences emerge more strongly"
    ],
    full: [
      "Your natural temperament match is a significant advantage in handling life together",
      "You likely have similar stress responses and conflict resolution preferences",
      "While harmony is your strength, ensure you maintain enough healthy conflict to address issues"
    ]
  }
}

// ============================================
// KOOTA 7: BHAKOOT (7 points)
// ============================================
const bhakootTemplate: KootaTemplate = {
  meaning: "Bhakoot represents health, well-being, prosperity, and overall life compatibility based on Moon sign positions.",
  
  interpretations: {
    full: {
      impact: "You score maximum points in Bhakoot, indicating highly favorable Moon sign relationship for mutual health, prosperity, and overall well-being. This suggests you support each other's growth, financial stability, and life goals harmoniously."
    },
    partial: {
      impact: "Your Bhakoot compatibility is moderate, indicating general harmony in life goals and prosperity with some areas requiring conscious alignment. You may have slightly different financial priorities or approaches to long-term planning that need communication."
    },
    zero: {
      impact: "Low Bhakoot score indicates potential challenges in aligned life goals, financial management, or mutual prosperity. You may have different approaches to money, career priorities, or long-term planning. Some combinations also relate to health concerns that should be monitored with professional medical guidance."
    }
  },
  
  scoreReasons: {
    "2-12-relationship": "Your Moon signs are in 2-12 positions (adjacent signs), which traditionally indicates financial or resource management challenges.",
    "6-8-relationship": "Your Moon signs are in 6-8 positions, which traditional texts associate with health and conflict concerns.",
    "5-9-relationship": "Your Moon signs are in 5-9 positions, which is considered highly favorable for children and spirituality.",
    "favorable-bhakoot": "Your Moon signs are favorably positioned for mutual prosperity and well-being.",
    "same-sign": "Same Moon signs can create understanding but may lack complementary dynamics in Bhakoot.",
    "neutral-bhakoot": "Your Moon sign relationship is neutral for Bhakoot, neither strongly favorable nor unfavorable.",
    "unfavorable-bhakoot": "Your Moon sign positions are traditionally considered challenging for Bhakoot compatibility.",
    "default": "Your specific Moon sign positions create a particular Bhakoot relationship affecting prosperity and health."
  },
  
  guidance: {
    zero: [
      "Create clear financial agreements - shared vs. separate accounts, spending limits, savings goals",
      "Have regular money conversations before issues arise",
      "Discuss long-term life goals explicitly (career ambitions, lifestyle preferences, family planning)",
      "If health concerns are indicated, maintain regular medical check-ups (do not replace with astrology)",
      "Consider financial counseling if money management styles differ significantly",
      "Build shared prosperity goals while respecting individual financial autonomy"
    ],
    partial: [
      "Align on major financial decisions while allowing flexibility in smaller ones",
      "Recognize where your prosperity approaches complement vs. conflict",
      "Create joint goals for health and wellness"
    ],
    full: [
      "Your aligned approach to prosperity and well-being is a strong foundation",
      "This compatibility supports building long-term financial and life stability together",
      "Continue to nurture shared goals while supporting each other's individual growth"
    ]
  }
}

// ============================================
// KOOTA 8: NADI (8 points)
// ============================================
const nadiTemplate: KootaTemplate = {
  meaning: "Nadi represents genetic compatibility, health constitution, and pulse type. It is one of the most important kootas in traditional Vedic matching.",
  
  interpretations: {
    full: {
      impact: "You score maximum points in Nadi, indicating different Nadi types which is considered highly favorable. This suggests complementary health constitutions and genetic diversity, which traditional texts view as supporting healthy progeny and overall vitality in the relationship."
    },
    partial: {
      impact: "Your Nadi compatibility is partial. Some aspects of your health constitutions align while others differ. This moderate score is common and generally not a concern in modern contexts where medical science can address most health considerations."
    },
    zero: {
      impact: "Same Nadi is detected (Nadi Dosha), which traditional texts consider inauspicious for health and progeny. This suggests similar constitutional types and reduced genetic diversity. However, modern couples address this through genetic counseling, comprehensive health planning, and medical science rather than avoiding the match."
    }
  },
  
  scoreReasons: {
    "Adi-Madhya": "You have Adi and Madhya Nadis - different pulse types creating complementary health constitutions.",
    "Adi-Antya": "You have Adi and Antya Nadis - different types supporting genetic diversity.",
    "Madhya-Antya": "You have Madhya and Antya Nadis - complementary constitutional types.",
    "Adi-Adi": "Both partners have Adi Nadi - same constitutional type (Nadi Dosha detected).",
    "Madhya-Madhya": "Both partners have Madhya Nadi - same pulse type (Nadi Dosha detected).",
    "Antya-Antya": "Both partners have Antya Nadi - same health constitution (Nadi Dosha detected).",
    "different-nadi": "Different Nadi types indicate complementary health constitutions.",
    "same-nadi": "Same Nadi type traditionally requires remedial measures.",
    "default": "Your Nakshatra-based Nadi classification affects genetic and health compatibility."
  },
  
  guidance: {
    zero: [
      "Consult with medical professionals for genetic counseling before family planning",
      "Maintain comprehensive health insurance and regular medical check-ups",
      "Focus on building complementary wellness routines and healthy lifestyle habits",
      "Traditional remedies include Nadi Dosha Shanti puja and charitable acts",
      "Modern approach: genetic testing and pre-conception health optimization",
      "Remember that medical science can address what traditional texts considered obstacles",
      "This dosha relates to constitutional similarity, not incompatibility as people"
    ],
    partial: [
      "Your partial Nadi compatibility is generally not a concern",
      "Maintain good health practices as you would in any relationship",
      "If planning children, standard genetic counseling is advisable (as for all couples)"
    ],
    full: [
      "Your different Nadi types are considered highly favorable in traditional astrology",
      "This compatibility is viewed as supporting healthy children and overall vitality",
      "This is one of the strongest indicators in the Ashtakoot system"
    ]
  }
}

// ============================================
// EXPORT TEMPLATE MAPPING
// ============================================
export const kootaTemplates: Record<string, KootaTemplate> = {
  Varna: varnaTemplate,
  Vashya: vashyaTemplate,
  Tara: taraTemplate,
  Yoni: yoniTemplate,
  'Graha Maitri': grahaMaitriTemplate,
  Gana: ganaTemplate,
  Bhakoot: bhakootTemplate,
  Nadi: nadiTemplate
}

// ============================================
// EXPLANATION GENERATOR
// ============================================
export function generateKootaExplanation(
  kootaName: string,
  score: number,
  maxScore: number,
  calculationDetails?: { combination?: string; reason?: string }
): KootaExplanation {
  const template = kootaTemplates[kootaName]
  if (!template) {
    return {
      meaning: `${kootaName} compatibility measure`,
      impact: "Score calculated based on traditional Vedic astrology principles.",
      scoreReason: "Calculated from birth chart positions."
    }
  }

  const scoreRatio = score / maxScore
  
  // Determine interpretation tier
  let interpretation
  if (scoreRatio === 1) {
    interpretation = template.interpretations.full
  } else if (scoreRatio >= 0.5) {
    interpretation = template.interpretations.partial
  } else {
    interpretation = template.interpretations.zero
  }

  // Get score reason
  const reasonKey = calculationDetails?.combination || calculationDetails?.reason || 'default'
  const scoreReason = template.scoreReasons[reasonKey] || template.scoreReasons.default || `${kootaName} calculated based on Moon sign positions.`

  // Get guidance
  let guidance
  if (scoreRatio === 1) {
    guidance = template.guidance.full
  } else if (scoreRatio >= 0.5) {
    guidance = template.guidance.partial
  } else {
    guidance = template.guidance.zero
  }

  return {
    meaning: template.meaning,
    impact: interpretation.impact,
    scoreReason: scoreReason,
    improvementTips: scoreRatio < 0.75 ? guidance : undefined
  }
}

// ============================================
// OVERALL SUMMARY GENERATOR
// ============================================
export interface OverallSummary {
  headline: string
  compatibilityPercent: number
  verdictType: 'excellent' | 'very-good' | 'good' | 'average' | 'needs-attention'
  strengths: Array<{ koota: string; why: string }>
  watchOuts: Array<{ koota: string; why: string; howToAddress: string }>
  compatibilityNote: string
}

export function generateOverallSummary(
  kootas: Array<{ name: string; score: number; maxScore: number }>,
  totalScore: number
): OverallSummary {
  const compatibilityPercent = Math.round((totalScore / 36) * 100)
  
  // Determine verdict type
  let verdictType: OverallSummary['verdictType']
  if (totalScore >= 30) verdictType = 'excellent'
  else if (totalScore >= 24) verdictType = 'very-good'
  else if (totalScore >= 18) verdictType = 'good'
  else if (totalScore >= 12) verdictType = 'average'
  else verdictType = 'needs-attention'

  // Find strengths (top 2 by score ratio)
  const sortedByStrength = [...kootas].sort((a, b) => {
    const ratioA = a.score / a.maxScore
    const ratioB = b.score / b.maxScore
    return ratioB - ratioA
  })
  
  const strengths = sortedByStrength.slice(0, 2)
    .filter(k => k.score / k.maxScore >= 0.75)
    .map(k => ({
      koota: k.name,
      why: getStrengthReason(k.name)
    }))

  // Find watch-outs (bottom 2 by score ratio)
  const watchOuts = sortedByStrength.slice(-2)
    .filter(k => k.score / k.maxScore < 0.5)
    .reverse()
    .map(k => ({
      koota: k.name,
      why: getWatchOutReason(k.name),
      howToAddress: getWatchOutGuidance(k.name)
    }))

  // Generate headline and note
  const headline = generateHeadline(totalScore)
  const compatibilityNote = generateCompatibilityNote(totalScore, strengths.length, watchOuts.length)

  return {
    headline,
    compatibilityPercent,
    verdictType,
    strengths,
    watchOuts,
    compatibilityNote
  }
}

function getStrengthReason(kootaName: string): string {
  const reasons: Record<string, string> = {
    'Varna': 'Similar intellectual and spiritual pursuits create mutual respect',
    'Vashya': 'Strong mutual attraction and balanced influence',
    'Tara': 'You bring positive health and prosperity to each other',
    'Yoni': 'Natural physical and temperamental compatibility',
    'Graha Maitri': 'Strong mental compatibility and friendship foundation',
    'Gana': 'Aligned temperaments make navigating life together easier',
    'Bhakoot': 'Favorable for mutual prosperity and well-being',
    'Nadi': 'Different constitutional types support genetic diversity'
  }
  return reasons[kootaName] || `Strong compatibility in ${kootaName}`
}

function getWatchOutReason(kootaName: string): string {
  const reasons: Record<string, string> = {
    'Varna': 'Different ego levels or spiritual orientations',
    'Vashya': 'Power dynamics may be imbalanced',
    'Tara': 'May not naturally enhance each other\'s well-being',
    'Yoni': 'Different instinctive natures or intimacy preferences',
    'Graha Maitri': 'Different mental wavelengths or communication styles',
    'Gana': 'Different temperaments in handling conflicts',
    'Bhakoot': 'Different approaches to finances or life goals',
    'Nadi': 'Same constitutional type (Nadi Dosha detected)'
  }
  return reasons[kootaName] || `Lower score in ${kootaName} requires attention`
}

function getWatchOutGuidance(kootaName: string): string {
  const guidance: Record<string, string> = {
    'Varna': 'Focus on shared values rather than traditional role expectations',
    'Vashya': 'Establish conscious power-sharing agreements in decision-making',
    'Tara': 'Be intentional about supporting each other\'s health and wellness',
    'Yoni': 'Communicate openly about intimacy needs and affection preferences',
    'Graha Maitri': 'Practice active listening and appreciate different thinking styles',
    'Gana': 'Establish clear communication patterns during conflicts',
    'Bhakoot': 'Create shared financial goals and discuss long-term plans explicitly',
    'Nadi': 'Consider genetic counseling and focus on complementary health routines'
  }
  return guidance[kootaName] || `Open communication and conscious effort in ${kootaName} areas`
}

function generateHeadline(totalScore: number): string {
  if (totalScore >= 30) {
    return "You share exceptional compatibility with natural harmony across most relationship dimensions."
  } else if (totalScore >= 24) {
    return "You share strong compatibility with excellent potential for a fulfilling relationship."
  } else if (totalScore >= 18) {
    return "You share good compatibility with areas of natural harmony and some aspects requiring conscious effort."
  } else if (totalScore >= 12) {
    return "You have moderate compatibility with both strengths to build on and challenges to address together."
  } else {
    return "Your compatibility shows significant differences that will require substantial communication and mutual understanding."
  }
}

function generateCompatibilityNote(totalScore: number, strengthCount: number, watchOutCount: number): string {
  const scorePhrase = `Your match shows ${totalScore} out of 36 points (${Math.round((totalScore/36)*100)}%)`
  
  if (totalScore >= 30) {
    return `${scorePhrase}, indicating exceptional compatibility. You have natural alignment in most areas of relationship life. This strong foundation supports both passion and partnership. While no relationship is perfect, your compatibility provides excellent potential for long-term happiness.`
  } else if (totalScore >= 24) {
    return `${scorePhrase}, indicating very good compatibility potential. You have natural strengths in key areas like ${strengthCount >= 1 ? 'mental connection and temperament' : 'important relationship dimensions'}, while some areas would benefit from conscious communication. Many highly successful relationships thrive with this compatibility level.`
  } else if (totalScore >= 18) {
    return `${scorePhrase}, indicating good compatibility potential. You have natural strengths in ${strengthCount >= 1 ? 'several important areas' : 'some key dimensions'}, while ${watchOutCount >= 1 ? 'other aspects' : 'some areas'} will require conscious effort and mutual understanding. Many successful relationships thrive with this score through intentional communication and respect for differences.`
  } else if (totalScore >= 12) {
    return `${scorePhrase}, indicating moderate compatibility with both aligned and contrasting elements. You will need to invest conscious effort in understanding each other's perspectives and building on your strengths. Successful relationships at this compatibility level require strong communication skills, mutual respect, and willingness to work through differences.`
  } else {
    return `${scorePhrase}, indicating significant differences in several relationship dimensions. This does not mean the relationship cannot work, but it will require substantial effort, excellent communication, deep mutual respect, and possibly professional relationship guidance. Focus on building strong friendship and understanding before making long-term commitments.`
  }
}

// ============================================
// DATA QUALITY ASSESSMENT
// ============================================
export interface DataQuality {
  isApproximate: boolean
  confidenceLevel: 'high' | 'medium' | 'low'
  limitations: string[]
}

export function assessDataQuality(
  maleData: { timeOfBirth?: string; timezone?: string },
  femaleData: { timeOfBirth?: string; timezone?: string }
): DataQuality {
  const issues: string[] = []
  let isApproximate = false
  let highSeverityCount = 0

  // Check male birth time
  if (!maleData.timeOfBirth || maleData.timeOfBirth === '00:00' || maleData.timeOfBirth === '12:00') {
    issues.push("Male birth time not provided or approximate - using default affects Nakshatra-based calculations (Tara, Yoni, Nadi)")
    isApproximate = true
    highSeverityCount++
  }

  // Check female birth time
  if (!femaleData.timeOfBirth || femaleData.timeOfBirth === '00:00' || femaleData.timeOfBirth === '12:00') {
    issues.push("Female birth time not provided or approximate - using default affects Nakshatra-based calculations (Tara, Yoni, Nadi)")
    isApproximate = true
    highSeverityCount++
  }

  // Check timezone assumptions
  if (maleData.timezone === 'assumed' || !maleData.timezone) {
    issues.push("Male timezone assumed from location - may affect planetary positions by a few degrees")
    isApproximate = true
  }

  if (femaleData.timezone === 'assumed' || !femaleData.timezone) {
    issues.push("Female timezone assumed from location - may affect planetary positions by a few degrees")
    isApproximate = true
  }

  // Determine confidence level
  let confidenceLevel: 'high' | 'medium' | 'low'
  if (highSeverityCount >= 2) {
    confidenceLevel = 'low'
  } else if (highSeverityCount === 1 || issues.length >= 2) {
    confidenceLevel = 'medium'
  } else if (issues.length > 0) {
    confidenceLevel = 'medium'
  } else {
    confidenceLevel = 'high'
  }

  return {
    isApproximate,
    confidenceLevel,
    limitations: issues
  }
}
