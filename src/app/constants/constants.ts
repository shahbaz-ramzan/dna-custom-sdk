import NetworkConstants from './network-constants';

export const K = {
  NETWORK: NetworkConstants,
  // EXCEPTIONAL_MESSAGES: ExceptionalMessageConstants,
  // APP: AppConstants,
  APP: {
    ACCESS_TOKEN: 'accessToken',
    ENCRYPTION_KEY: '<ENCRYPTION_KEY>',
    DEFAULT_PRIMARY_COLOR: '#eead32',
    USER_OBJECT: 'userObject',
    LANGUAGE_ID: '22',

    REPORTS: {
      COMPARISON_REPORT_ID: 1,
      TEAM_REPORT_ID: 2,
      WORK_TALENT_REPORT_ID: 3,
      FINANCIAL_BEHAVIOR_REPORT_ID: 4,
    },

    INSTRUCTIONS_VIDEOS: {
      INVESTOR: 'https://www.youtube.com/embed/zjH1pUEiL0Y',
      TALENT: 'https://www.youtube.com/embed/jyXuIfjmeOY',
    },

    BEHAVIORAL_BIASES_VIDEOS: <any>{
      'Mental Accounting': 'https://www.youtube.com/embed/dXTN-6_3ZzM',
      'Over Confidence': 'https://www.youtube.com/embed/YEo-ZAJUQeE',
      'Status Quo Bias': 'https://www.youtube.com/embed/R3GZEnnr110',
      Instinctive: 'https://www.youtube.com/embed/ilMJb_Vqcyc',
      'Pattern Bias': 'https://www.youtube.com/embed/i-7gjDnOe7U',
      'Over Trading': 'https://www.youtube.com/embed/cG07wyIxJTM',
      'Benchmark Focus': 'https://www.youtube.com/embed/o6p_TFuMtfU',
      'Optimism Bias': 'https://www.youtube.com/embed/fp5kmpMcbQo',
      'Disposition Effect': 'https://www.youtube.com/embed/wzAQMhzbjSc',
      Controlling: 'https://www.youtube.com/embed/iCHtow_eTjo',
      'Consolidated View': 'https://www.youtube.com/embed/v-Bm3EdpkFM',
      'Newness Bias': 'https://www.youtube.com/embed/SybRXV6q9pU',
      'Risk Aversion': 'https://www.youtube.com/embed/IOzqI_uxgo8',
      'Herd Follower': 'https://www.youtube.com/embed/ojEoDAb1QCo',
      'Fear of Regret': 'https://www.youtube.com/embed/FjwDh31igVk',
      'Loss Aversion': 'https://www.youtube.com/embed/680TEpQSU5w',
    },
    UNIQUE_STYLE_THUMBNAIL: <any>{
      Facilitator: 'assets/images/facilitator.png',
      Adapter: 'assets/images/adapter.png',
      Strategist: 'assets/images/strategist.png',
      Influencer: 'assets/images/influencer.png',
      'Community Builder': 'assets/images/communityBuilder.png',
      Engager: 'assets/images/engager.png',
      'Stylish Thinker': 'assets/images/stylishThinker.png',
      Initiator: 'assets/images/initiator.png',
      'Reflective Thinker': 'assets/images/refelectiveThinker.png',
      'Relationship Builder': 'assets/images/relationshipBuilder.png',
    },
  },
};

export const COUNTRIES = [
  {
    name: 'English (United States)',
    flag: 'https://flagcdn.com/us.svg',
    code: 'US',
    lang: 'EnglishUnitedStates',
  },
  {
    name: 'English (United Kingdom)',
    flag: 'https://flagcdn.com/gb.svg',
    code: 'GB',
    lang: 'EnglishUnitedKingdom',
  },
  {
    name: 'Portuguese (Brazil)',
    flag: 'https://flagcdn.com/br.svg',
    code: 'BR',
    lang: 'PortugueseBrazil',
  },
  {
    name: 'French (Canada)',
    flag: 'https://flagcdn.com/ca.svg',
    code: 'CA',
    lang: 'FrenchCanada',
  },
  {
    name: 'Spanish (Mexico)',
    flag: 'https://flagcdn.com/mx.svg',
    code: 'MX',
    lang: 'SpanishMexico',
  },
  {
    name: 'Dutch (Netherlands)',
    flag: 'https://flagcdn.com/nl.svg',
    code: 'NL',
    lang: 'DutchNetherlands',
  },
  {
    name: 'Urdu (Pakistan)',
    flag: 'https://flagcdn.com/pk.svg',
    code: 'PK',
    lang: 'UrduPakistan',
  },
  {
    name: 'India (Hindi)',
    flag: 'https://flagcdn.com/in.svg',
    code: 'IN',
    lang: 'HindiIndia',
  },
  {
    name: 'Mandarin (Chinese)',
    flag: 'https://flagcdn.com/cn.svg',
    code: 'CN',
    lang: 'MandarinChinese',
  },
  {
    name: 'Afrikaans (South Africa)',
    flag: 'https://flagcdn.com/za.svg',
    code: 'ZA',
    lang: 'AfrikaansSouthAfrica',
  },
  {
    name: 'French (France)',
    flag: 'https://flagcdn.com/fr.svg',
    code: 'FR',
    lang: 'FrenchFrance',
  },
  {
    name: 'German (Germany)',
    flag: 'https://flagcdn.com/de.svg',
    code: 'DE',
    lang: 'GermanGermany',
  },
  {
    name: 'Portuguese (Portugal)',
    flag: 'https://flagcdn.com/pt.svg',
    code: 'PT',
    lang: 'PortuguesePortugal',
  },
  {
    name: 'Spanish (Spain)',
    flag: 'https://flagcdn.com/es.svg',
    code: 'US',
    lang: 'SpanishSpain',
  },
];

export const FDNA_INSTRUCTIONS = {
  p1: 'Each question has three statements. You’ll be asked to choose two of the statements for each question – how you <b>most</b> naturally operate and how you <strong>least</strong>  naturally operate. Base your choices on how you act, make decisions, and interact. You might find some questions more difficult than others, go with your intuition and don’t dwell on it.',
  p2: 'The questions aren’t focused on money but are designed to help uncover your unconscious behavior. Using a sophisticated calculation, your responses are translated into results on how people like you make decisions about money.',
  p3: 'You’ll receive a summary report at the end that will reveal your financial behavior.',
};
export const BDNA_INSTRUCTIONS = {
  p1: 'Each question has three statements. You’ll be asked to choose two of the statements for each question – how you <b>most</b> naturally operate and how you <strong>least</strong> naturally operate. Base your choices on how you act, make decisions, and interact. You might find some questions more difficult than others, go with your intuition and don’t dwell on it.',
  p2: 'The questions focus on “who you are” and not on “who you want to be.” A scientifically validated calculation will translate your responses into results on how people like you approach work, make decisions, and build relationships.',
  p3: 'You’ll see your dashboard at the end that will reveal your workplace talents.',
};
