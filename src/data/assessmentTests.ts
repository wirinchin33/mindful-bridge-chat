// Assessment test data for PHQ-9, GAD-7, and WHO-5
export interface TestQuestion {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export interface AssessmentTest {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  fullDescription: string;
  questions: TestQuestion[];
  scoringInfo: {
    ranges: Array<{
      min: number;
      max: number;
      severity: string;
      description: string;
    }>;
  };
}

export const assessmentTests: AssessmentTest[] = [
  {
    id: "phq9",
    title: "PHQ-9 Depression Screening",
    shortTitle: "PHQ-9",
    description: "Patient Health Questionnaire-9 - Checks for signs of depression",
    fullDescription: "The PHQ-9 is a validated tool for screening and measuring the severity of depression. It consists of 9 questions based on diagnostic criteria for major depressive disorder.",
    questions: [
      {
        id: "phq9_1",
        question: "Little interest or pleasure in doing things",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_2",
        question: "Feeling down, depressed, or hopeless",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_3",
        question: "Trouble falling or staying asleep, or sleeping too much",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_4",
        question: "Feeling tired or having little energy",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_5",
        question: "Poor appetite or overeating",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_6",
        question: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_7",
        question: "Trouble concentrating on things, such as reading or watching television",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_8",
        question: "Moving or speaking so slowly that other people could have noticed. Or the opposite — being fidgety or restless",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_9",
        question: "Thoughts that you would be better off dead or of hurting yourself in some way",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      }
    ],
    scoringInfo: {
      ranges: [
        { min: 0, max: 4, severity: "Minimal", description: "Minimal or no depression" },
        { min: 5, max: 9, severity: "Mild", description: "Mild depression" },
        { min: 10, max: 14, severity: "Moderate", description: "Moderate depression" },
        { min: 15, max: 19, severity: "Moderately Severe", description: "Moderately severe depression" },
        { min: 20, max: 27, severity: "Severe", description: "Severe depression" }
      ]
    }
  },
  {
    id: "gad7",
    title: "GAD-7 Anxiety Screening",
    shortTitle: "GAD-7",
    description: "Generalized Anxiety Disorder-7 - Checks for signs of anxiety",
    fullDescription: "The GAD-7 is a validated tool for screening and measuring the severity of generalized anxiety disorder. It consists of 7 questions about anxiety symptoms over the past 2 weeks.",
    questions: [
      {
        id: "gad7_1",
        question: "Feeling nervous, anxious, or on edge",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_2",
        question: "Not being able to stop or control worrying",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_3",
        question: "Worrying too much about different things",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_4",
        question: "Trouble relaxing",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_5",
        question: "Being so restless that it is hard to sit still",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_6",
        question: "Becoming easily annoyed or irritable",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_7",
        question: "Feeling afraid as if something awful might happen",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" }
        ]
      }
    ],
    scoringInfo: {
      ranges: [
        { min: 0, max: 4, severity: "Minimal", description: "Minimal anxiety" },
        { min: 5, max: 9, severity: "Mild", description: "Mild anxiety" },
        { min: 10, max: 14, severity: "Moderate", description: "Moderate anxiety" },
        { min: 15, max: 21, severity: "Severe", description: "Severe anxiety" }
      ]
    }
  },
  {
    id: "who5",
    title: "WHO-5 Well-Being Index",
    shortTitle: "WHO-5",
    description: "World Health Organization Well-Being Index - Measures psychological well-being",
    fullDescription: "The WHO-5 Well-Being Index is a short questionnaire consisting of 5 simple and non-invasive questions that measure current mental well-being.",
    questions: [
      {
        id: "who5_1",
        question: "I have felt cheerful and in good spirits",
        options: [
          { value: "0", label: "At no time" },
          { value: "1", label: "Some of the time" },
          { value: "2", label: "Less than half the time" },
          { value: "3", label: "More than half the time" },
          { value: "4", label: "Most of the time" },
          { value: "5", label: "All of the time" }
        ]
      },
      {
        id: "who5_2",
        question: "I have felt calm and relaxed",
        options: [
          { value: "0", label: "At no time" },
          { value: "1", label: "Some of the time" },
          { value: "2", label: "Less than half the time" },
          { value: "3", label: "More than half the time" },
          { value: "4", label: "Most of the time" },
          { value: "5", label: "All of the time" }
        ]
      },
      {
        id: "who5_3",
        question: "I have felt active and vigorous",
        options: [
          { value: "0", label: "At no time" },
          { value: "1", label: "Some of the time" },
          { value: "2", label: "Less than half the time" },
          { value: "3", label: "More than half the time" },
          { value: "4", label: "Most of the time" },
          { value: "5", label: "All of the time" }
        ]
      },
      {
        id: "who5_4",
        question: "I woke up feeling fresh and rested",
        options: [
          { value: "0", label: "At no time" },
          { value: "1", label: "Some of the time" },
          { value: "2", label: "Less than half the time" },
          { value: "3", label: "More than half the time" },
          { value: "4", label: "Most of the time" },
          { value: "5", label: "All of the time" }
        ]
      },
      {
        id: "who5_5",
        question: "My daily life has been filled with things that interest me",
        options: [
          { value: "0", label: "At no time" },
          { value: "1", label: "Some of the time" },
          { value: "2", label: "Less than half the time" },
          { value: "3", label: "More than half the time" },
          { value: "4", label: "Most of the time" },
          { value: "5", label: "All of the time" }
        ]
      }
    ],
    scoringInfo: {
      ranges: [
        { min: 0, max: 12, severity: "Poor", description: "Poor well-being - consider further evaluation" },
        { min: 13, max: 17, severity: "Below Average", description: "Below average well-being" },
        { min: 18, max: 22, severity: "Average", description: "Average well-being" },
        { min: 23, max: 25, severity: "Good", description: "Good well-being" }
      ]
    }
  }
];