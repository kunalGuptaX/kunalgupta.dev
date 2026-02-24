export type FieldVisibility = 'required' | 'recommended' | 'optional' | 'hidden'

export type CountryProfileConfig = {
  code: string
  name: string
  flag: string
  fields: Record<string, FieldVisibility>
  sectionOrder: string[]
  dateFormat: string
  tips: string[]
}

const US: CountryProfileConfig = {
  code: 'US',
  name: 'United States',
  flag: '🇺🇸',
  fields: {
    'basics.photo': 'hidden',
    'basics.dateOfBirth': 'hidden',
    'basics.gender': 'hidden',
    'basics.maritalStatus': 'hidden',
    'basics.nationality': 'hidden',
    'basics.fathersName': 'hidden',
    'basics.nationalId': 'hidden',
    'basics.visaStatus': 'optional',
    'basics.militaryService': 'optional',
    'basics.religion': 'hidden',
    'basics.bloodType': 'hidden',
  },
  sectionOrder: ['summary', 'skills', 'work', 'projects', 'education', 'certificates', 'languages', 'volunteer', 'awards'],
  dateFormat: 'MM/YYYY',
  tips: [
    'Keep your resume to one page whenever possible, especially with less than 10 years of experience.',
    'Never include a photo, date of birth, or marital status — these can trigger bias concerns under anti-discrimination laws.',
    'Use strong action verbs and quantify achievements (e.g. "Increased revenue by 30%").',
  ],
}

const DE: CountryProfileConfig = {
  code: 'DE',
  name: 'Germany',
  flag: '🇩🇪',
  fields: {
    'basics.photo': 'recommended',
    'basics.dateOfBirth': 'optional',
    'basics.gender': 'hidden',
    'basics.maritalStatus': 'optional',
    'basics.nationality': 'optional',
    'basics.fathersName': 'hidden',
    'basics.nationalId': 'hidden',
    'basics.visaStatus': 'optional',
    'basics.militaryService': 'optional',
    'basics.religion': 'hidden',
    'basics.bloodType': 'hidden',
  },
  sectionOrder: ['summary', 'work', 'education', 'skills', 'projects', 'certificates', 'languages', 'volunteer', 'awards'],
  dateFormat: 'MM.YYYY',
  tips: [
    'A professional headshot (Bewerbungsfoto) is still common and recommended, though no longer legally required.',
    'Two pages are standard — German employers expect thorough detail about your qualifications and career history.',
    'List work experience in reverse-chronological order with no unexplained gaps in your timeline.',
  ],
}

const JP: CountryProfileConfig = {
  code: 'JP',
  name: 'Japan',
  flag: '🇯🇵',
  fields: {
    'basics.photo': 'required',
    'basics.dateOfBirth': 'required',
    'basics.gender': 'required',
    'basics.maritalStatus': 'optional',
    'basics.nationality': 'recommended',
    'basics.fathersName': 'hidden',
    'basics.nationalId': 'hidden',
    'basics.visaStatus': 'recommended',
    'basics.militaryService': 'hidden',
    'basics.religion': 'hidden',
    'basics.bloodType': 'optional',
  },
  sectionOrder: ['summary', 'work', 'education', 'skills', 'certificates', 'languages', 'projects', 'volunteer', 'awards'],
  dateFormat: 'YYYY/MM',
  tips: [
    'Use the standard rirekisho format with a passport-style photo (3x4 cm) attached to the top right.',
    'Date of birth and gender are expected fields — Japanese resume conventions differ significantly from Western norms.',
    'Emphasize loyalty and long-term commitment; frequent job changes can be viewed negatively.',
  ],
}

const IN: CountryProfileConfig = {
  code: 'IN',
  name: 'India',
  flag: '🇮🇳',
  fields: {
    'basics.photo': 'recommended',
    'basics.dateOfBirth': 'optional',
    'basics.gender': 'optional',
    'basics.maritalStatus': 'optional',
    'basics.nationality': 'recommended',
    'basics.fathersName': 'optional',
    'basics.nationalId': 'hidden',
    'basics.visaStatus': 'hidden',
    'basics.militaryService': 'hidden',
    'basics.religion': 'hidden',
    'basics.bloodType': 'hidden',
  },
  sectionOrder: ['summary', 'work', 'education', 'skills', 'projects', 'certificates', 'languages', 'awards', 'volunteer'],
  dateFormat: 'MM/YYYY',
  tips: [
    'Including a professional photo and personal details like father\'s name is still common in many industries.',
    'A "Declaration" section at the end stating the truthfulness of information is a traditional convention.',
    'Highlight academic achievements prominently — educational credentials carry significant weight in Indian hiring.',
  ],
}

const AE: CountryProfileConfig = {
  code: 'AE',
  name: 'United Arab Emirates',
  flag: '🇦🇪',
  fields: {
    'basics.photo': 'required',
    'basics.dateOfBirth': 'recommended',
    'basics.gender': 'recommended',
    'basics.maritalStatus': 'optional',
    'basics.nationality': 'required',
    'basics.fathersName': 'hidden',
    'basics.nationalId': 'optional',
    'basics.visaStatus': 'required',
    'basics.militaryService': 'optional',
    'basics.religion': 'optional',
    'basics.bloodType': 'hidden',
  },
  sectionOrder: ['summary', 'work', 'education', 'skills', 'certificates', 'languages', 'projects', 'volunteer', 'awards'],
  dateFormat: 'DD/MM/YYYY',
  tips: [
    'Include your nationality and visa status — employers need this for sponsorship and legal compliance.',
    'A professional photo is expected on all CVs in the Gulf region.',
    'Highlight international experience and language skills, as the workforce is highly multinational.',
  ],
}

const UK: CountryProfileConfig = {
  code: 'UK',
  name: 'United Kingdom',
  flag: '🇬🇧',
  fields: {
    'basics.photo': 'hidden',
    'basics.dateOfBirth': 'hidden',
    'basics.gender': 'hidden',
    'basics.maritalStatus': 'hidden',
    'basics.nationality': 'hidden',
    'basics.fathersName': 'hidden',
    'basics.nationalId': 'hidden',
    'basics.visaStatus': 'optional',
    'basics.militaryService': 'hidden',
    'basics.religion': 'hidden',
    'basics.bloodType': 'hidden',
  },
  sectionOrder: ['summary', 'work', 'skills', 'education', 'projects', 'certificates', 'languages', 'volunteer', 'awards'],
  dateFormat: 'MM/YYYY',
  tips: [
    'Do not include a photo, date of birth, gender, or marital status — UK equality laws discourage personal details that could lead to bias.',
    'Two pages is the accepted standard for a CV in the UK.',
    'Include a strong personal statement at the top tailored to the specific role you are applying for.',
  ],
}

const FR: CountryProfileConfig = {
  code: 'FR',
  name: 'France',
  flag: '🇫🇷',
  fields: {
    'basics.photo': 'recommended',
    'basics.dateOfBirth': 'optional',
    'basics.gender': 'hidden',
    'basics.maritalStatus': 'optional',
    'basics.nationality': 'optional',
    'basics.fathersName': 'hidden',
    'basics.nationalId': 'hidden',
    'basics.visaStatus': 'optional',
    'basics.militaryService': 'hidden',
    'basics.religion': 'hidden',
    'basics.bloodType': 'hidden',
  },
  sectionOrder: ['summary', 'work', 'education', 'skills', 'languages', 'projects', 'certificates', 'volunteer', 'awards'],
  dateFormat: 'MM/YYYY',
  tips: [
    'A professional photo is still widely expected on French CVs, especially in client-facing roles.',
    'Keep your CV to one page — conciseness is highly valued by French recruiters.',
    'List language proficiency prominently; French employers value multilingual candidates.',
  ],
}

const CN: CountryProfileConfig = {
  code: 'CN',
  name: 'China',
  flag: '🇨🇳',
  fields: {
    'basics.photo': 'required',
    'basics.dateOfBirth': 'required',
    'basics.gender': 'required',
    'basics.maritalStatus': 'required',
    'basics.nationality': 'recommended',
    'basics.fathersName': 'hidden',
    'basics.nationalId': 'optional',
    'basics.visaStatus': 'hidden',
    'basics.militaryService': 'optional',
    'basics.religion': 'hidden',
    'basics.bloodType': 'hidden',
  },
  sectionOrder: ['summary', 'education', 'work', 'skills', 'projects', 'certificates', 'languages', 'awards', 'volunteer'],
  dateFormat: 'YYYY.MM',
  tips: [
    'Photo, date of birth, gender, and marital status are standard fields on Chinese resumes.',
    'Education is often listed before work experience, as academic background carries significant weight.',
    'One page is preferred for candidates with under five years of experience; keep the layout clean and structured.',
  ],
}

export const countryConfigs: Record<string, CountryProfileConfig> = {
  US,
  DE,
  JP,
  IN,
  AE,
  UK,
  FR,
  CN,
}

export function getCountryConfig(code: string): CountryProfileConfig {
  return countryConfigs[code.toUpperCase()] ?? countryConfigs.US
}

export const countryList: { code: string; name: string; flag: string }[] = Object.values(countryConfigs).map(
  ({ code, name, flag }) => ({ code, name, flag }),
)
