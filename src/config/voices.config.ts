/**
 * Voice Configuration
 * Available TTS voices organized by category
 */

export interface Voice {
  name: string
  code: string
  category: string
  language: string
}

export const VOICE_CATEGORIES = {
  ENGLISH_STANDARD: 'English Standard',
  ENGLISH_CHARACTER: 'English Character',
  ENGLISH_SEASONAL: 'English Seasonal',
  ENGLISH_DISNEY: 'English Disney',
  FRENCH: 'French',
  SPANISH: 'Spanish',
  PORTUGUESE: 'Portuguese',
  GERMAN: 'German',
  INDONESIAN: 'Indonesian',
  JAPANESE: 'Japanese',
  KOREAN: 'Korean',
  VIETNAMESE: 'Vietnamese',
  OTHER: 'Other'
} as const

export const AVAILABLE_VOICES: Voice[] = [
  // English Standard
  { name: 'Jessie', code: 'en_us_002', category: VOICE_CATEGORIES.ENGLISH_STANDARD, language: 'English' },
  { name: 'Joey', code: 'en_us_006', category: VOICE_CATEGORIES.ENGLISH_STANDARD, language: 'English' },
  { name: 'Professor', code: 'en_us_007', category: VOICE_CATEGORIES.ENGLISH_STANDARD, language: 'English' },
  { name: 'Scientist', code: 'en_us_009', category: VOICE_CATEGORIES.ENGLISH_STANDARD, language: 'English' },
  { name: 'Confidence', code: 'en_us_010', category: VOICE_CATEGORIES.ENGLISH_STANDARD, language: 'English' },
  { name: 'Male English UK', code: 'en_uk_001', category: VOICE_CATEGORIES.ENGLISH_STANDARD, language: 'English' },
  { name: 'Male English UK 2', code: 'en_uk_003', category: VOICE_CATEGORIES.ENGLISH_STANDARD, language: 'English' },
  { name: 'Metro (Australian)', code: 'en_au_001', category: VOICE_CATEGORIES.ENGLISH_STANDARD, language: 'English' },
  { name: 'Smooth (Australian)', code: 'en_au_002', category: VOICE_CATEGORIES.ENGLISH_STANDARD, language: 'English' },

  // English Character Voices
  { name: 'Game On', code: 'en_male_jomboy', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Warm', code: 'es_mx_002', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Wacky', code: 'en_male_funny', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Scream', code: 'en_us_ghostface', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Empathetic', code: 'en_female_samc', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Serious', code: 'en_male_cody', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Beauty Guru', code: 'en_female_makeup', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Bestie', code: 'en_female_richgirl', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Trickster', code: 'en_male_grinch', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Story Teller', code: 'en_male_narration', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Mr. GoodGuy', code: 'en_male_deadpool', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Narrator', code: 'en_uk_001', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Alfred', code: 'en_male_jarvis', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Ashmagic', code: 'en_male_ashmagic', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Olantekkers', code: 'en_male_olantekkers', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Lord Cringe', code: 'en_male_ukneighbor', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Mr. Meticulous', code: 'en_male_ukbutler', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Debutante', code: 'en_female_shenna', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Varsity', code: 'en_female_pansino', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Marty', code: 'en_male_trevor', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Pop Lullaby', code: 'en_female_f08_twinkle', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Classic Electric', code: 'en_male_m03_classical', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Bae', code: 'en_female_betty', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Cupid', code: 'en_male_cupid', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Granny', code: 'en_female_grandma', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Cozy', code: 'en_male_m2_xhxs_m03_christmas', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Peaceful', code: 'en_female_emotional', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Toon Beat', code: 'en_male_m03_sunshine_soon', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Open Mic', code: 'en_female_f08_warmy_breeze', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Jingle', code: 'en_male_m03_lobby', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },
  { name: 'Cottagecore', code: 'en_female_f08_salut_damour', category: VOICE_CATEGORIES.ENGLISH_CHARACTER, language: 'English' },

  // English Seasonal
  { name: 'Author', code: 'en_male_santa_narration', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },
  { name: 'Caroler', code: 'en_male_sing_deep_jingle', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },
  { name: 'Santa', code: 'en_male_santa_effect', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },
  { name: 'NYE 2023', code: 'en_female_ht_f08_newyear', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },
  { name: 'Magician', code: 'en_male_wizard', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },
  { name: 'Opera', code: 'en_female_ht_f08_halloween', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },
  { name: 'Euphoric', code: 'en_female_ht_f08_glorious', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },
  { name: 'Hypetrain', code: 'en_male_sing_funny_it_goes_up', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },
  { name: 'Melodrama', code: 'en_female_ht_f08_wonderful_world', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },
  { name: 'Quirky Time', code: 'en_male_m2_xhxs_m03_silly', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },
  { name: 'Thanksgiving', code: 'en_male_sing_funny_thanksgiving', category: VOICE_CATEGORIES.ENGLISH_SEASONAL, language: 'English' },

  // English Disney
  { name: 'Ghost Face', code: 'en_us_ghostface', category: VOICE_CATEGORIES.ENGLISH_DISNEY, language: 'English' },
  { name: 'Chewbacca', code: 'en_us_chewbacca', category: VOICE_CATEGORIES.ENGLISH_DISNEY, language: 'English' },
  { name: 'C3PO', code: 'en_us_c3po', category: VOICE_CATEGORIES.ENGLISH_DISNEY, language: 'English' },
  { name: 'Stitch', code: 'en_us_stitch', category: VOICE_CATEGORIES.ENGLISH_DISNEY, language: 'English' },
  { name: 'Stormtrooper', code: 'en_us_stormtrooper', category: VOICE_CATEGORIES.ENGLISH_DISNEY, language: 'English' },
  { name: 'Rocket', code: 'en_us_rocket', category: VOICE_CATEGORIES.ENGLISH_DISNEY, language: 'English' },
  { name: 'Madame Leota', code: 'en_female_madam_leota', category: VOICE_CATEGORIES.ENGLISH_DISNEY, language: 'English' },
  { name: 'Ghost Host', code: 'en_male_ghosthost', category: VOICE_CATEGORIES.ENGLISH_DISNEY, language: 'English' },
  { name: 'Pirate', code: 'en_male_pirate', category: VOICE_CATEGORIES.ENGLISH_DISNEY, language: 'English' },

  // French
  { name: 'French - Male 1', code: 'fr_001', category: VOICE_CATEGORIES.FRENCH, language: 'French' },
  { name: 'French - Male 2', code: 'fr_002', category: VOICE_CATEGORIES.FRENCH, language: 'French' },

  // Spanish
  { name: 'Spanish (Spain) - Male', code: 'es_002', category: VOICE_CATEGORIES.SPANISH, language: 'Spanish' },
  { name: 'Spanish MX - Male', code: 'es_mx_002', category: VOICE_CATEGORIES.SPANISH, language: 'Spanish' },

  // Portuguese
  { name: 'Portuguese BR - Female 1', code: 'br_001', category: VOICE_CATEGORIES.PORTUGUESE, language: 'Portuguese' },
  { name: 'Portuguese BR - Female 2', code: 'br_003', category: VOICE_CATEGORIES.PORTUGUESE, language: 'Portuguese' },
  { name: 'Portuguese BR - Female 3', code: 'br_004', category: VOICE_CATEGORIES.PORTUGUESE, language: 'Portuguese' },
  { name: 'Portuguese BR - Male', code: 'br_005', category: VOICE_CATEGORIES.PORTUGUESE, language: 'Portuguese' },
  { name: 'Ivete Sangalo', code: 'bp_female_ivete', category: VOICE_CATEGORIES.PORTUGUESE, language: 'Portuguese' },
  { name: 'Ludmilla', code: 'bp_female_ludmilla', category: VOICE_CATEGORIES.PORTUGUESE, language: 'Portuguese' },
  { name: 'Lhays Macedo', code: 'pt_female_lhays', category: VOICE_CATEGORIES.PORTUGUESE, language: 'Portuguese' },
  { name: 'Laizza', code: 'pt_female_laizza', category: VOICE_CATEGORIES.PORTUGUESE, language: 'Portuguese' },
  { name: 'Galvão Bueno', code: 'pt_male_bueno', category: VOICE_CATEGORIES.PORTUGUESE, language: 'Portuguese' },

  // German
  { name: 'German - Female', code: 'de_001', category: VOICE_CATEGORIES.GERMAN, language: 'German' },
  { name: 'German - Male', code: 'de_002', category: VOICE_CATEGORIES.GERMAN, language: 'German' },

  // Indonesian
  { name: 'Indonesian - Female', code: 'id_001', category: VOICE_CATEGORIES.INDONESIAN, language: 'Indonesian' },

  // Japanese
  { name: 'Japanese - Female 1', code: 'jp_001', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: 'Japanese - Female 2', code: 'jp_003', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: 'Japanese - Female 3', code: 'jp_005', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: 'Japanese - Male', code: 'jp_006', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: 'りーさ', code: 'jp_female_fujicochan', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: '世羅鈴', code: 'jp_female_hasegawariona', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: "Morio's Kitchen", code: 'jp_male_keiichinakano', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: '夏絵ココ', code: 'jp_female_oomaeaika', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: '低音ボイス', code: 'jp_male_yujinchigusa', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: '四郎', code: 'jp_female_shirou', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: '玉川寿紀', code: 'jp_male_tamawakazuki', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: '庄司果織', code: 'jp_female_kaorishoji', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: '八木沙季', code: 'jp_female_yagishaki', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: 'ヒカキン', code: 'jp_male_hikakin', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: '丸山礼', code: 'jp_female_rei', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: '修一朗', code: 'jp_male_shuichiro', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: 'マツダ家の日常', code: 'jp_male_matsudake', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: 'まちこりーた', code: 'jp_female_machikoriiita', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: 'モジャオ', code: 'jp_male_matsuo', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },
  { name: 'モリスケ', code: 'jp_male_osada', category: VOICE_CATEGORIES.JAPANESE, language: 'Japanese' },

  // Korean
  { name: 'Korean - Male 1', code: 'kr_002', category: VOICE_CATEGORIES.KOREAN, language: 'Korean' },
  { name: 'Korean - Female', code: 'kr_003', category: VOICE_CATEGORIES.KOREAN, language: 'Korean' },
  { name: 'Korean - Male 2', code: 'kr_004', category: VOICE_CATEGORIES.KOREAN, language: 'Korean' },

  // Vietnamese
  { name: 'Vietnamese - Female', code: 'BV074_streaming', category: VOICE_CATEGORIES.VIETNAMESE, language: 'Vietnamese' },
  { name: 'Vietnamese - Male', code: 'BV075_streaming', category: VOICE_CATEGORIES.VIETNAMESE, language: 'Vietnamese' },

  // Other
  { name: 'Alto', code: 'en_female_f08_salut_damour', category: VOICE_CATEGORIES.OTHER, language: 'Other' },
  { name: 'Tenor', code: 'en_male_m03_lobby', category: VOICE_CATEGORIES.OTHER, language: 'Other' },
  { name: 'Sunshine Soon', code: 'en_male_m03_sunshine_soon', category: VOICE_CATEGORIES.OTHER, language: 'Other' },
  { name: 'Warmy Breeze', code: 'en_female_f08_warmy_breeze', category: VOICE_CATEGORIES.OTHER, language: 'Other' },
  { name: 'Glorious', code: 'en_female_ht_f08_glorious', category: VOICE_CATEGORIES.OTHER, language: 'Other' },
  { name: 'It Goes Up', code: 'en_male_sing_funny_it_goes_up', category: VOICE_CATEGORIES.OTHER, language: 'Other' },
  { name: 'Chipmunk', code: 'en_male_m2_xhxs_m03_silly', category: VOICE_CATEGORIES.OTHER, language: 'Other' },
  { name: 'Dramatic', code: 'en_female_ht_f08_wonderful_world', category: VOICE_CATEGORIES.OTHER, language: 'Other' },
]

/**
 * Get voices by category
 */
export function getVoicesByCategory(category: string): Voice[] {
  return AVAILABLE_VOICES.filter(voice => voice.category === category)
}

/**
 * Get voice by code
 */
export function getVoiceByCode(code: string): Voice | undefined {
  return AVAILABLE_VOICES.find(voice => voice.code === code)
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  return Object.values(VOICE_CATEGORIES)
}

/**
 * Get popular voices (commonly used ones)
 */
export function getPopularVoices(): Voice[] {
  const popularCodes = [
    'en_us_002', // Jessie
    'en_us_006', // Joey
    'en_uk_001', // Male English UK
    'en_uk_003', // Male English UK 2
    'en_au_001', // Metro
    'en_female_samc', // Empathetic
    'en_male_narration', // Story Teller
    'fr_001', // French Male 1
    'es_002', // Spanish Male
    'jp_001', // Japanese Female 1
  ]
  
  return AVAILABLE_VOICES.filter(voice => popularCodes.includes(voice.code))
}