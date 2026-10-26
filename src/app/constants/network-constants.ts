import { environment } from '../../environments/environment';
const BASE_DNA_API_URL = environment.publicApiUrl;
const NO_AUTH_API_URL = environment.privateNoAuthUrl;
export const NETWORK = {
  baseLangUrl: environment.langApiUrl,
  azureSharedAccessKey: environment.azureSharedAccessKey,
  uri: {
    LANG_TABLE_POC: environment.languageTable,
    GET_UNIQUE_STYLE_VIDEO_LINKS: environment.uniqueStyleVideoLinks,
    GET_ACCOUNT_SETTINGS: 'Accounts/GetAccountDetailsByAccountIdandSelfregId',
    GET_UNIQUE_STYLE_AND_DESC:
      'NaturalBehavior/GetUniqueStyleAndDescriptionArray',
    GET_VIDEO_URL: 'Discovery/GetVideoUrl',
    GET_PERFORMANCE_GUIDE: 'NaturalBehavior/GetPerformanceGuideArray',
    GET_BDNA_5_SCORE: 'NaturalBehavior/GetBDNA5ScoresArray',
    GET_FDNA_5_SCORE: 'NaturalBehavior/GetFDNA5ScoresArray',
    GET_MARKET_MOOD_DATA: 'NaturalBehavior/GetMarketMoodArray',
    GET_BEHAVIORAL_BIASES: 'NaturalBehavior/GetBehavioralBiasesArray',
    GET_HIRING_DATA: 'NaturalBehavior/GetHiringDataArray',
    GET_BDNA_DASHBOARD_SETTING: 'Discovery/GetBDNADashboardSetting',
    GET_FDNA_DASHBOARD_SETTING: 'Discovery/GetFDNADashboardSetting',
    GET_SUBSCRIPTIONS_FEATURE: 'GetSubscriptionFeaturesByAccountId',
    GET_PARTICIPANT_PROFILE: 'ParticipantProfile/GetStyleMatch',
  },
  METHODS: {
    GET: 'GET' as HttpMethod,
    PUT: 'PUT' as HttpMethod,
    POST: 'POST' as HttpMethod,
    PATCH: 'PATCH' as HttpMethod,
    DELETE: 'DELETE' as HttpMethod,
  },
  HEADER: {
    CONTENT_TYPE: 'Content-Type',
    APPLICATION_JSON: 'application/json',
    DEFAULT: (token = '') => ({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    }),
    NOT_AUTHORIZED: () => ({
      'Content-Type': 'application/json',
    }),
    TYPE: {
      JSON: 'json',
      FILE: 'file',
      FORM_DATA: 'multipart/form-data',
    },
  },

  STATUS_CODE: {
    TIMED_OUT: 0,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  URL: {
    // Base
    BASE_API: BASE_DNA_API_URL,
    NO_AUTH_API: NO_AUTH_API_URL,
    TIMEOUT: environment.httpTimeout,

    //Accounts
    CHECK_USER_EXISTS: `Discovery/CheckIfParticipantExists`,
    CREATE_PARTICIPANT_ACCOUNT: `Discovery/InsertParticipantInAccount`,

    GET_CAREERS_INSIGHTS: 'NaturalBehavior/GetHiringDataArray',
    // GET_UNIQUE_STYLE_AND_DESCRIPTION: 'NaturalBehavior/GetUniqueStyleAndDescription', // Unused - superseded by uri.GET_UNIQUE_STYLE_AND_DESC (...Array variant)
    // GET_SUBSCRIPTION_FEATURES: 'GetSubscriptionFeaturesByAccountId', // Unused - superseded by uri.GET_SUBSCRIPTIONS_FEATURE (the one dashboard.service.ts actually calls)
    // GET_REPORTS_DISCOVERY_ID: "GetReportsByDiscoveryID", // Ignore
    GET_BDNA_DASHBOARD_SETTING: 'Discovery/GetBDNADashboardSetting',
    GET_FDNA_DASHBOARD_SETTING: 'Discovery/GetFDNADashboardSetting',
    GET_PERFORMANCE_GUIDE: 'NaturalBehavior/GetPerformanceGuideArray',
    GET_VIDEO_URL: 'Discovery/GetVideoUrl',
    GET_BDNA5_SCORE: 'NaturalBehavior/GetBDNA5Scores',
    GET_BDNA_DESIRED_TALENTS: 'GetBDNADesiredTalents', // NOT FOUND. Only used in talent app - Ryan said ignore this
    // not in talent but in investor app
    GET_FDNA5_SCORE: 'NaturalBehavior/GetFDNA5Scores',
    // GET_FINANCIAL_BEHAVIOR_OVERVIEW: "GetInvestorFinancialBehaviorOverview", // Ignore
    GET_MARKET_MOOD_ARRAY: 'NaturalBehavior/GetMarketMoodArray',
    GET_BEHAVIORAL_BIASES: 'NaturalBehavior/GetBehavioralBiases',
    CHANGE_ACCOUNT_PASSWORD: 'Account/ChangePassword',
    CHANGE_INVESTOR_PASSWORD: 'FDNAInvestor/ChangePassword',
    GET_CUSTOM_REPORT:
      'CustomReports/GetCustomReportNameListByAccountIdByReportId',

    //Instructions

    GET_DISCOVERY_STATUS: 'Discovery/GetDiscoveryStatus',

    // Questionnaire
    GET_QUESTIONS_LIST: 'Discovery/GetQuestions',
    GET_QUESTION_ANSWER_STATUS: 'Discovery/GetQuestionAnswer',
    SAVE_QUESTION_ANSWER: 'Discovery/InsertQuestionAnswer',
    insert11Q17QAnswers: 'Discovery/Insert11Q17QAnswers',
  },
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export default NETWORK;
