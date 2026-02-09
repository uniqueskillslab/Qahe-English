// IELTS Writing Practice Questions
// Mock data for Task 1 Academic, Task 1 General, and Task 2

export interface WritingQuestion {
  id: string;
  title: string;
  prompt: string;
  type: 'task1-academic' | 'task1-general' | 'task2';
  timeLimit: number; // in minutes
  minWords: number;
  maxWords?: number;
  tips?: string[];
  imageUrl?: string; // For charts, graphs, maps
  taskDescription?: string; // Additional context
}

// Task 1 Academic Questions (Charts, Graphs, Maps, Processes)
export const task1AcademicQuestions: WritingQuestion[] = [
  {
    id: 'task1-ac-001',
    title: 'Bar Chart - Internet Users',
    type: 'task1-academic',
    timeLimit: 20,
    minWords: 150,
    maxWords: 200,
    prompt: `The bar chart below shows the percentage of internet users in five different countries from 2000 to 2010.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
    taskDescription: 'Analyze the trends in internet usage across different countries over a 10-year period.',
    tips: [
      'Identify overall trends and patterns',
      'Compare countries and highlight significant changes',
      'Use appropriate data vocabulary (increase, decrease, fluctuate)',
      'Include specific data points to support your description'
    ]
  },
  {
    id: 'task1-ac-002',
    title: 'Line Graph - Temperature Changes',
    type: 'task1-academic',
    timeLimit: 20,
    minWords: 150,
    maxWords: 200,
    prompt: `The line graph below shows average monthly temperatures in three major cities over the course of a year.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
    taskDescription: 'Describe seasonal temperature patterns in different cities.',
    tips: [
      'Describe overall patterns and seasonal variations',
      'Compare temperature ranges between cities',
      'Identify highest and lowest points',
      'Use appropriate vocabulary for describing trends'
    ]
  },
  {
    id: 'task1-ac-003',
    title: 'Process Diagram - Water Cycle',
    type: 'task1-academic',
    timeLimit: 20,
    minWords: 150,
    maxWords: 200,
    prompt: `The diagram below shows the process of the water cycle in nature.

Summarise the information by selecting and reporting the main features.

Write at least 150 words.`,
    taskDescription: 'Explain the stages of the water cycle process.',
    tips: [
      'Use sequence words (first, then, next, finally)',
      'Describe each stage of the process clearly',
      'Use passive voice appropriately',
      'Show understanding of the cyclical nature'
    ]
  },
  {
    id: 'task1-ac-004',
    title: 'Table - Student Demographics',
    type: 'task1-academic',
    timeLimit: 20,
    minWords: 150,
    maxWords: 200,
    prompt: `The table below shows the number of students enrolled in different faculties at a university in 2020 and 2023.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
    taskDescription: 'Compare student enrollment changes across different academic faculties.',
    tips: [
      'Compare data across years and faculties',
      'Identify significant increases or decreases',
      'Group similar faculties when appropriate',
      'Use comparative language effectively'
    ]
  },
  {
    id: 'task1-ac-005',
    title: 'Map Changes - Town Development',
    type: 'task1-academic',
    timeLimit: 20,
    minWords: 150,
    maxWords: 200,
    prompt: `The maps below show the changes that have taken place in Meadow Village between 1980 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
    taskDescription: 'Describe urban development and changes over time.',
    tips: [
      'Use location and direction vocabulary',
      'Describe what was removed and what was added',
      'Note changes in size and function of areas',
      'Use past tense for changes that occurred'
    ]
  }
];

// Task 1 General Questions (Letters)
export const task1GeneralQuestions: WritingQuestion[] = [
  {
    id: 'task1-gen-001',
    title: 'Formal Letter - Job Application Follow-up',
    type: 'task1-general',
    timeLimit: 20,
    minWords: 150,
    taskDescription: 'Write a formal letter following up on a job application.',
    prompt: `You recently applied for a job at a company but have not heard back from them. Write a letter to the hiring manager.

In your letter:
• Remind them of your application and the position you applied for
• Explain why you are still interested in the position
• Ask about the status of your application

Write at least 150 words. You do NOT need to write any addresses.

Begin your letter as follows: Dear Mr/Ms [Name],`,
    tips: [
      'Use formal language and tone',
      'Structure: greeting, purpose, main points, conclusion',
      'Be polite and professional',
      'End with appropriate closing (Yours sincerely)'
    ]
  },
  {
    id: 'task1-gen-002',
    title: 'Semi-formal Letter - Neighbor Complaint',
    type: 'task1-general',
    timeLimit: 20,
    minWords: 150,
    taskDescription: 'Write a semi-formal letter to a neighbor about a problem.',
    prompt: `Your neighbor has been playing music very loudly late at night, which is disturbing your sleep. Write a letter to your neighbor.

In your letter:
• Explain why you are writing
• Describe how this problem is affecting you
• Suggest a solution to the problem

Write at least 150 words. You do NOT need to write any addresses.

Begin your letter as follows: Dear [Neighbor's name],`,
    tips: [
      'Use polite but direct language',
      'Be friendly but firm',
      'Offer reasonable solutions',
      'Maintain good neighborly relations'
    ]
  },
  {
    id: 'task1-gen-003',
    title: 'Informal Letter - Travel Invitation',
    type: 'task1-general',
    timeLimit: 20,
    minWords: 150,
    taskDescription: 'Write an informal letter inviting a friend to visit.',
    prompt: `A friend who lives in a different country has asked you about coming to visit your country. Write a letter to your friend.

In your letter:
• Invite him/her to visit your country
• Suggest the best time of year to come
• Describe the activities you could do together

Write at least 150 words. You do NOT need to write any addresses.

Begin your letter as follows: Dear [Friend's name],`,
    tips: [
      'Use casual, friendly language',
      'Show enthusiasm and warmth',
      'Include personal experiences and opinions',
      'Use contractions and informal expressions'
    ]
  },
  {
    id: 'task1-gen-004',
    title: 'Formal Letter - Service Complaint',
    type: 'task1-general',
    timeLimit: 20,
    minWords: 150,
    taskDescription: 'Write a formal complaint letter about poor service.',
    prompt: `You recently had a meal at a restaurant, but you were not satisfied with the service you received. Write a letter to the restaurant manager.

In your letter:
• Describe what went wrong with the service
• Explain how you felt about the experience
• Say what you would like the manager to do

Write at least 150 words. You do NOT need to write any addresses.

Begin your letter as follows: Dear Sir or Madam,`,
    tips: [
      'State facts clearly and objectively',
      'Express disappointment professionally',
      'Request specific action or compensation',
      'Use formal complaint language'
    ]
  },
  {
    id: 'task1-gen-005',
    title: 'Semi-formal Letter - Course Inquiry',
    type: 'task1-general',
    timeLimit: 20,
    minWords: 150,
    taskDescription: 'Write a semi-formal letter asking about a training course.',
    prompt: `You are interested in attending a training course at a local college. Write a letter to the course coordinator.

In your letter:
• Explain why you are interested in the course
• Ask for information about course content and schedule
• Inquire about fees and registration process

Write at least 150 words. You do NOT need to write any addresses.

Begin your letter as follows: Dear Course Coordinator,`,
    tips: [
      'Show genuine interest and motivation',
      'Ask specific, relevant questions',
      'Be courteous and professional',
      'Structure your inquiry logically'
    ]
  }
];

// Task 2 Essay Questions (Opinion, Discussion, Problem-Solution)
export const task2Questions: WritingQuestion[] = [
  {
    id: 'task2-001',
    title: 'Opinion Essay - Technology in Education',
    type: 'task2',
    timeLimit: 40,
    minWords: 250,
    taskDescription: 'Give your opinion on the role of technology in education.',
    prompt: `Some people believe that technology has made learning easier and more convenient. Others argue that it has made students lazy and less capable of deep thinking.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    tips: [
      'Present both sides of the argument fairly',
      'Clearly state your own position',
      'Use specific examples to support points',
      'Organize ideas in clear paragraphs'
    ]
  },
  {
    id: 'task2-002',
    title: 'Problem-Solution Essay - Urban Traffic',
    type: 'task2',
    timeLimit: 40,
    minWords: 250,
    taskDescription: 'Discuss traffic problems in cities and suggest solutions.',
    prompt: `Traffic congestion is becoming a major problem in many cities around the world.

What are the causes of this problem, and what measures can be taken to solve it?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    tips: [
      'Identify multiple causes of traffic congestion',
      'Propose practical and realistic solutions',
      'Consider both government and individual actions',
      'Connect causes to appropriate solutions'
    ]
  },
  {
    id: 'task2-003',
    title: 'Agree/Disagree Essay - Working from Home',
    type: 'task2',
    timeLimit: 40,
    minWords: 250,
    taskDescription: 'Discuss whether working from home is beneficial.',
    prompt: `Some people believe that working from home is better than working in an office.

To what extent do you agree or disagree with this statement?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    tips: [
      'Take a clear position (agree, disagree, or partial agreement)',
      'Provide strong supporting arguments',
      'Consider counterarguments briefly',
      'Use personal or observed examples'
    ]
  },
  {
    id: 'task2-004',
    title: 'Discussion Essay - Environmental Responsibility',
    type: 'task2',
    timeLimit: 40,
    minWords: 250,
    taskDescription: 'Discuss who should be responsible for environmental protection.',
    prompt: `Some people think that environmental problems should be solved by governments, while others believe that individuals should take responsibility.

Discuss both views and give your opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    tips: [
      'Explore government responsibilities and capabilities',
      'Discuss individual actions and their impact',
      'Consider collaborative approaches',
      'Provide concrete examples of both approaches'
    ]
  },
  {
    id: 'task2-005',
    title: 'Advantages/Disadvantages Essay - Social Media',
    type: 'task2',
    timeLimit: 40,
    minWords: 250,
    taskDescription: 'Discuss the advantages and disadvantages of social media.',
    prompt: `Social media has become an integral part of modern life.

What are the advantages and disadvantages of social media for individuals and society?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    tips: [
      'Balance advantages and disadvantages',
      'Consider both individual and societal impacts',
      'Use specific examples from real life',
      'Organize points logically within each category'
    ]
  }
];

// Utility functions for getting questions
export const getRandomQuestion = (type: WritingQuestion['type']): WritingQuestion => {
  let questions: WritingQuestion[];
  
  switch (type) {
    case 'task1-academic':
      questions = task1AcademicQuestions;
      break;
    case 'task1-general':
      questions = task1GeneralQuestions;
      break;
    case 'task2':
      questions = task2Questions;
      break;
    default:
      throw new Error(`Unknown question type: ${type}`);
  }
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

export const getQuestionById = (id: string): WritingQuestion | null => {
  const allQuestions = [
    ...task1AcademicQuestions,
    ...task1GeneralQuestions,
    ...task2Questions
  ];
  
  return allQuestions.find(q => q.id === id) || null;
};

export const getQuestionsByType = (type: WritingQuestion['type']): WritingQuestion[] => {
  switch (type) {
    case 'task1-academic':
      return task1AcademicQuestions;
    case 'task1-general':
      return task1GeneralQuestions;
    case 'task2':
      return task2Questions;
    default:
      return [];
  }
};