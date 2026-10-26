export type Question = {
  areAnswersValid: boolean;
  options: QuestionOption[];
};

export type QuestionOption = {
  label: string;
  value: string;
  disableMost: boolean;
  disableLeast: boolean;
};

export const Questions: Map<string, Question> = new Map([
  [
    'q1',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Provides support',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Consistent approach',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Aspiring',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q2',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Expresses optimism',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Self-reliant',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Lively imagination',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q3',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Confidently faces danger',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'interactive',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Self-assured',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q4',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Attentive',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Thinks quickly',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Follow routines',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q5',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Solution driven',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Accurate',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Excitable',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q6',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Influencing',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Brave',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Concerned',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q7',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Decision-maker',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Generates new ideas',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Determined',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q8',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Prepares in advance',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Outgoing',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Concerned for others',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q9',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Outspoken',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: "Sees other's viewpoint",
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Exerts will',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q10',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Well organized',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Moves boldly',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Resourceful',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q11',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Non-conforming',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Provides assurance',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Seeks perfection',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q12',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'People orientated',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Highly curious',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Seeks adventure',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q13',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Good at meeting people',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Acts independently',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Demonstrates originality',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q14',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Friendly to others',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Accepts new challenges',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Orderly',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q15',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Enjoys competing',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Lively nature',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Highly productive',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q16',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Straightforward communicator',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Develops new methods',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Courteous',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q17',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Self willed',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Friendly nature',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Connects well with others',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q18',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Investigates new opportunities',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Works efficiently',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Operates intuitively',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q19',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Ventures into new areas',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Vibrant',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Forthright',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q20',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Tolerant',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Intellectual',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Needs facts',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q21',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Structured',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Amusing',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Original',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q22',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Sets the agenda',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Networks',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Idea oriented',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q23',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Assumes control',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Pioneering',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Assists others',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q24',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Self-sufficient',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Likes stability',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Lacks fear',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q25',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Animated',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Persistent',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Encourages thinking',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q26',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Seeks and risks',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Intelligent',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Empathetic',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q27',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Imagines new possibilities',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Sets big goals',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Examines details',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q28',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Direct',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Full of fun',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Process orientated',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q29',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Talks frequently',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Achieves goals',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Influences others',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q30',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Inventive',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Forgiving',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Ambitious',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q31',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Agreeable',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Pays attention to detail',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Confident approach',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q32',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Prefers working alone',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Amiable manner',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Growth driven',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q33',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Accepts challenges',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Engaging',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Investigates new ideas',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q34',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Leads others',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Solves problems',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Precise',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q35',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Lenient',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Expressive',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Risk taker',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q36',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Skillful in designing',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Fits in with others',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Daring',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q37',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Energetic',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Particular',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Wields authority',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q38',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Tolerates losses',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Communicative',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Diligent',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q39',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Systematic',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Maximizer',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Insistent',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q40',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Enjoys talking',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Success driven',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Sensitive to others',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q41',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Opportunistic',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Exercises strong influence',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Sets and makes plans',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q42',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Shows warm feelings',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Appreciates style',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Shows Enthusiasm',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q43',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Brilliant ideas',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Conforming',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Frank',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q44',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Has high standards',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Free speaking',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Pushes forward',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q45',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Follows through',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Patient',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Visionary',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
  [
    'q46',
    {
      areAnswersValid: false,
      options: [
        {
          label: 'Candid',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Comforting',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
        {
          label: 'Enjoys entertaining',
          value: '',
          disableMost: false,
          disableLeast: false,
        },
      ],
    },
  ],
]);
