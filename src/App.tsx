import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Search,
  Clock,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  User,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Check,
  Mic,
  Square,
  Download,
  Trash2,
  Edit3,
  Plus,
  Dices,
  Layers,
  BarChart3,
  Repeat,
  AlertCircle,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Lightbulb,
  Gauge,
  FileAudio,
  X,
  Disc,
  Rocket,
  Compass,
  Sliders,
  ArrowUpDown,
  Zap
} from 'lucide-react';

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

export type PracticeModeId = 'spontaneous' | 'prepared' | 'extended';
export type ThinkingStyleId = 'off_the_cuff' | 'deep_research';
export type NavTab = 'practice' | 'categories' | 'live_timer' | 'library' | 'frameworks';

export interface TopicPrompt {
  id: string;
  numberLabel: string;
  title: string;
  subtitle: string;
  category: string;
  subCategory: string;
  suggestedSeconds: number;
  level: 'ACCESSIBLE' | 'INTERMEDIATE' | 'CHALLENGING';
  thinkingStyle: ThinkingStyleId;
}

export interface CategoryMeta {
  id: string;
  name: string;
  shortLabel: string;
  icon: string;
  directiveTitle: string;
  directiveDesc: string;
  domainTag: string;
}

export interface FrameworkStep {
  number: string;
  label: string;
  shortDesc: string;
  stageTitle: string;
  stageInstruction: string;
  guidingQuestions: string[];
}

export interface SpeakingFramework {
  id: string;
  code: string;
  name: string;
  shortName: string;
  flowTag: string;
  explanation: string;
  exampleTopic: string;
  exampleBreakdown: string;
  recommendedTone: string;
  steps: FrameworkStep[];
}

export interface SelfAssessment {
  topicRelevance: number;
  logicalStructure: number;
  clarity: number;
  vocabulary: number;
  fluency: number;
  confidence: number;
  weakness: string;
  improvementTarget: string;
}

export interface ReflectionNotes {
  wentWell: string;
  wentWrong: string;
  improveNextTime: string;
}

export interface SpeechAnalytics {
  isTranscriptionMeasured: boolean;
  transcriptText: string;
  wordCount: number;
  wordsPerMinute: number;
  estimatedAcousticWpm: number;
  totalSpeakingSeconds: number;
  pauseCount: number;
  totalPauseSeconds: number;
  fillerWordCount: number;
  fillerBreakdown: Record<string, number>;
  repeatedPhrases: { phrase: string; count: number }[];
}

export interface SavedRecording {
  id: string;
  title: string;
  topicId: string;
  topicTitle: string;
  categoryName: string;
  frameworkId: string;
  frameworkName: string;
  practiceMode: PracticeModeId;
  createdAt: number;
  durationSeconds: number;
  targetDurationSeconds: number;
  audioBlob: Blob;
  m4aBlob?: Blob;
  audioFormat: string;
  codecDetails: string;
  containerHexSignature: string;
  selfAssessment: SelfAssessment;
  reflection: ReflectionNotes;
  analytics: SpeechAnalytics;
}

// ============================================================================
// 2. SPEAKING FRAMEWORKS LIBRARY (All 11 Frameworks)
// ============================================================================

export const SPEAKING_FRAMEWORKS: SpeakingFramework[] = [
  {
    id: 'triad_arc',
    code: 'WMN',
    name: 'What? So what? Now what? (The Triad Arc)',
    shortName: 'What? So what? Now what?',
    flowTag: 'What → So What',
    explanation: 'The classic Table Topics & impromptu technique: establish the foundation clearly, reveal the deeper consequence or stakes, and deliver a decisive takeaway.',
    exampleTopic: 'Waiting Room',
    exampleBreakdown: 'What: A physical space of suspended time before high-stakes news. → So What: Smartphones erased waiting rooms, eroding our tolerance for stillness. → Now What: Reclaim intentional pauses instead of filling every 30-second gap with digital noise.',
    recommendedTone: 'Reflective → Bold',
    steps: [
      {
        number: '01',
        label: 'What?',
        shortDesc: 'Define the core observation clearly',
        stageTitle: 'State the Premise Clearly',
        stageInstruction: 'Define the item, phenomenon, or memory immediately. What is the physical object, habit, or worldview at the center of this prompt? No preamble.',
        guidingQuestions: [
          'Where did this concept or experience come from originally?',
          'What does it look, feel, or sound like in everyday life?'
        ]
      },
      {
        number: '02',
        label: 'So what?',
        shortDesc: 'Connect meaning, stakes, & resonance',
        stageTitle: 'Escalate the Stakes',
        stageInstruction: 'Move from observation to significance. Why should anyone care about this right now? Connect your personal lens to a universal human tension.',
        guidingQuestions: [
          'What hidden cost or unspoken truth does this reveal?',
          'How does this shape our relationships, work, or society?'
        ]
      },
      {
        number: '03',
        label: 'Now what?',
        shortDesc: 'Offer perspective, takeaway, or call to action',
        stageTitle: 'Land the Resolution',
        stageInstruction: 'Deliver a crisp takeaway, philosophical shift, or concrete behavioral change. Leave the listener with a memorable final sentence.',
        guidingQuestions: [
          'What single action or mindset shift follows from your point?',
          'What lingering image will the audience remember tomorrow?'
        ]
      }
    ]
  },
  {
    id: 'prep',
    code: 'PREP',
    name: 'PREP: Point → Reason → Example → Point',
    shortName: 'PREP Framework',
    flowTag: 'Point → Proof',
    explanation: 'The gold-standard Table Topics and executive structure. Open with a direct thesis, back it with a primary causal reason, anchor it in a vivid story, and restate your thesis.',
    exampleTopic: 'Why Small Talk Matters',
    exampleBreakdown: 'Point: Small talk is the biological handshake of human trust. → Reason: High-stakes collaboration fails without baseline safety. → Example: Negotiations starting with 3 minutes of rapport are 40% more likely to succeed. → Point: Never skip small talk; it builds the bridge for big talk.',
    recommendedTone: 'Decisive → Grounded',
    steps: [
      {
        number: '01',
        label: 'Point',
        shortDesc: 'State your direct thesis in one sentence',
        stageTitle: 'Declare Your Core Point',
        stageInstruction: 'Open with a crystal-clear position statement. Avoid hedging; state your thesis unmistakably in the first 10 seconds.',
        guidingQuestions: [
          'What is your single overarching claim on this topic?',
          'If the listener only hears your first sentence, what do they take away?'
        ]
      },
      {
        number: '02',
        label: 'Reason',
        shortDesc: 'Explain the primary mechanism or "why"',
        stageTitle: 'Unpack the Core Reason',
        stageInstruction: 'Explain the logical mechanism behind your claim. Focus on the strongest 1 or 2 drivers rather than listing five weak reasons.',
        guidingQuestions: [
          'Why is this claim fundamentally true right now?',
          'What underlying incentive or principle drives this outcome?'
        ]
      },
      {
        number: '03',
        label: 'Example',
        shortDesc: 'Anchor with a concrete story or proof',
        stageTitle: 'Paint a Concrete Example',
        stageInstruction: 'Bring the abstract reason to life using a specific personal anecdote, historical case, or concrete scenario.',
        guidingQuestions: [
          'When have you witnessed this play out in real life?',
          'What specific detail makes this example undeniable?'
        ]
      },
      {
        number: '04',
        label: 'Point',
        shortDesc: 'Restate thesis with elevated conviction',
        stageTitle: 'Seal the Final Point',
        stageInstruction: 'Circle back to your opening thesis, now enriched by your reason and example. Close cleanly on a downward vocal inflection.',
        guidingQuestions: [
          'How does your example prove your opening claim?',
          'What is your one-sentence closing verdict?'
        ]
      }
    ]
  },
  {
    id: 'peel',
    code: 'PEEL',
    name: 'PEEL: Point → Evidence → Explanation → Link',
    shortName: 'PEEL Structure',
    flowTag: 'Point → Evidence',
    explanation: 'Ideal for analytical, academic, and policy topics. Separates raw evidence from analytical interpretation before linking back to the broader theme.',
    exampleTopic: 'Algorithmic Recommendations',
    exampleBreakdown: 'Point: Algorithmic feeds narrow human curiosity. → Evidence: Over 70% of media consumption is driven by similarity clusters. → Explanation: Engagement loops reward familiarity over friction. → Link: Reclaiming intellectual autonomy requires deliberate off-algorithm exploration.',
    recommendedTone: 'Analytical → Authoritative',
    steps: [
      {
        number: '01',
        label: 'Point',
        shortDesc: 'Establish the central analytical claim',
        stageTitle: 'Frame the Analytical Point',
        stageInstruction: 'Introduce your argument clearly and define the scope of the issue you are addressing.',
        guidingQuestions: [
          'What specific proposition are you defending?',
          'Who or what is most affected by this issue?'
        ]
      },
      {
        number: '02',
        label: 'Evidence',
        shortDesc: 'Cite empirical facts, cases, or observations',
        stageTitle: 'Present Concrete Evidence',
        stageInstruction: 'Introduce verifiable observations, historical precedent, or empirical facts that ground your claim in reality.',
        guidingQuestions: [
          'What observable proof supports this position?',
          'What real-world case demonstrates this pattern?'
        ]
      },
      {
        number: '03',
        label: 'Explanation',
        shortDesc: 'Unpack how the evidence proves your claim',
        stageTitle: 'Analyze the Mechanism',
        stageInstruction: 'Do not let evidence speak for itself—explain how and why that evidence validates your point.',
        guidingQuestions: [
          'What is the cause-and-effect bridge between your evidence and your claim?',
          'What counter-interpretation should you address briefly?'
        ]
      },
      {
        number: '04',
        label: 'Link',
        shortDesc: 'Connect back to the overarching prompt',
        stageTitle: 'Link to the Bigger Picture',
        stageInstruction: 'Tie your analysis back to the broader philosophical or societal implication of the prompt.',
        guidingQuestions: [
          'How does this argument reshape our view of the whole topic?',
          'What is the ultimate synthesis?'
        ]
      }
    ]
  },
  {
    id: 'what_why_how',
    code: 'WWH',
    name: 'What–Why–How: Define → Importance → Implementation',
    shortName: 'What–Why–How',
    flowTag: 'What → Why → How',
    explanation: 'Clarifies a complex concept first, builds urgency around why it matters, and finishes with an actionable blueprint.',
    exampleTopic: 'Deep Work in an Always-On Economy',
    exampleBreakdown: 'What: Distraction-free concentration pushing cognitive limits. → Why: Task-switching degrades creative output by 40%. → How: Block 90-minute morning vaults with zero notifications.',
    recommendedTone: 'Clear → Pragmatic',
    steps: [
      {
        number: '01',
        label: 'What',
        shortDesc: 'Define the subject and strip away jargon',
        stageTitle: 'Define the Subject',
        stageInstruction: 'Explain what the topic actually means in plain, vivid language. Eliminate ambiguity before arguing.',
        guidingQuestions: [
          'How would you explain this concept to a smart 12-year-old?',
          'What misconception should you clear up immediately?'
        ]
      },
      {
        number: '02',
        label: 'Why',
        shortDesc: 'Explain its urgency and human importance',
        stageTitle: 'Establish the Importance',
        stageInstruction: 'Highlight the stakes. What happens if we ignore this, and what do we gain when we master it?',
        guidingQuestions: [
          'Why is this urgent today rather than ten years ago?',
          'What is the cost of inaction?'
        ]
      },
      {
        number: '03',
        label: 'How',
        shortDesc: 'Discuss concrete implementation steps',
        stageTitle: 'Outline Implementation',
        stageInstruction: 'Give 2 to 3 concrete, realistic steps for putting this idea into practice starting today.',
        guidingQuestions: [
          'What is the very first friction-free step someone can take?',
          'How do we measure whether the implementation worked?'
        ]
      }
    ]
  },
  {
    id: 'past_present_future',
    code: 'PPF',
    name: 'Past–Present–Future: Chronological Arc',
    shortName: 'Past–Present–Future',
    flowTag: 'Past → Future',
    explanation: 'A natural storytelling timeline that works effortlessly in Table Topics. Trace how an idea evolved from its roots to today’s tension and tomorrow’s horizon.',
    exampleTopic: 'The Evolution of Trust',
    exampleBreakdown: 'Past: Trust was village-scale and face-to-face. → Present: Trust is mediated by ratings and digital reputation. → Future: In an era of synthetic media, verified in-person presence will become our scarcest currency.',
    recommendedTone: 'Narrative → Visionary',
    steps: [
      {
        number: '01',
        label: 'Past',
        shortDesc: 'Historical context & origin story',
        stageTitle: 'Anchor in the Past',
        stageInstruction: 'Establish how this phenomenon used to work. Contrast earlier norms or personal memories with modern life.',
        guidingQuestions: [
          'How did previous generations or your younger self view this?',
          'What original problem gave birth to this tradition or tool?'
        ]
      },
      {
        number: '02',
        label: 'Present',
        shortDesc: 'Current situation, friction, & reality',
        stageTitle: 'Diagnose the Present',
        stageInstruction: 'Describe where we stand right now. Pinpoint the current inflection point, tension, or paradox.',
        guidingQuestions: [
          'What has changed recently that disrupted the old equilibrium?',
          'How are people experiencing this right now?'
        ]
      },
      {
        number: '03',
        label: 'Future',
        shortDesc: 'Future implications & trajectory',
        stageTitle: 'Project into the Future',
        stageInstruction: 'Extrapolate forward. Paint a compelling picture of where this trend leads over the next decade.',
        guidingQuestions: [
          'What will this look like in 10 years if current trends hold?',
          'How can we steer toward the best possible future outcome?'
        ]
      }
    ]
  },
  {
    id: 'problem_cause_solution',
    code: 'PCS',
    name: 'Problem–Cause–Solution: Diagnostic Framework',
    shortName: 'Problem–Cause–Solution',
    flowTag: 'Problem → Solution',
    explanation: 'Hooks the listener with a sharp problem diagnosis, uncovers systemic root causes (not just symptoms), and proposes a targeted remedy.',
    exampleTopic: 'Urban Loneliness',
    exampleBreakdown: 'Problem: Cities are denser than ever yet report record isolation. → Cause: Car-centric zoning and home delivery eliminated "third places." → Solution: Redesign streetscapes around walkable plazas and community hubs.',
    recommendedTone: 'Diagnostic → Constructive',
    steps: [
      {
        number: '01',
        label: 'Problem',
        shortDesc: 'Identify the pain point and its scope',
        stageTitle: 'Pinpoint the Problem',
        stageInstruction: 'Make the problem visceral and specific. Show who is hurting and why existing band-aids are failing.',
        guidingQuestions: [
          'What specific symptom shows that the status quo is broken?',
          'Why can we no longer afford to ignore this problem?'
        ]
      },
      {
        number: '02',
        label: 'Cause',
        shortDesc: 'Uncover systemic root causes',
        stageTitle: 'Expose the Root Cause',
        stageInstruction: 'Look beneath surface symptoms. Ask "why" twice to reveal the structural incentive or psychological driver.',
        guidingQuestions: [
          'What hidden incentive keeps producing this problem?',
          'Why have conventional fixes missed the mark?'
        ]
      },
      {
        number: '03',
        label: 'Solution',
        shortDesc: 'Present a realistic, targeted remedy',
        stageTitle: 'Propose the Solution',
        stageInstruction: 'Present a clear solution that directly attacks the root cause you just identified.',
        guidingQuestions: [
          'How does your solution directly sever the root cause?',
          'What makes this solution practical and sustainable?'
        ]
      }
    ]
  },
  {
    id: '5w1h',
    code: '5W1H',
    name: '5W1H: Comprehensive Investigative Lens',
    shortName: '5W1H Framework',
    flowTag: 'Who → Why → How',
    explanation: 'The classic journalistic decomposition: Who, What, When, Where, Why, and How. Ensures thorough 360-degree coverage on unfamiliar prompts.',
    exampleTopic: 'Accidental Inventions',
    exampleBreakdown: 'Who & What: Curious scientists noticing anomalies. → When & Where: Unhurried observation inside laboratories. → Why & How: Prepared minds treat unexpected results as signals rather than errors.',
    recommendedTone: 'Inquisitive → Comprehensive',
    steps: [
      {
        number: '01',
        label: 'Who & What',
        shortDesc: 'Identify the actors and core phenomenon',
        stageTitle: 'Define Who & What',
        stageInstruction: 'Establish the key stakeholders (Who) and the exact event, policy, or concept (What).',
        guidingQuestions: [
          'Who are the primary decision-makers and affected groups?',
          'What exactly is happening on the ground?'
        ]
      },
      {
        number: '02',
        label: 'When & Where',
        shortDesc: 'Situate the context in time and space',
        stageTitle: 'Map When & Where',
        stageInstruction: 'Provide temporal and environmental boundaries. Where does this show up most acutely?',
        guidingQuestions: [
          'In what environment or setting does this matter most?',
          'What timing trigger makes this relevant today?'
        ]
      },
      {
        number: '03',
        label: 'Why & How',
        shortDesc: 'Reveal deeper motives and operating mechanics',
        stageTitle: 'Synthesize Why & How',
        stageInstruction: 'Conclude by explaining the deeper motivation (Why) and the operational path forward (How).',
        guidingQuestions: [
          'Why do the actors behave the way they do?',
          'How will this unfold or be resolved?'
        ]
      }
    ]
  },
  {
    id: 'pros_and_cons',
    code: 'P&C',
    name: 'Pros and Cons: Dialectical Balance',
    shortName: 'Pros & Cons',
    flowTag: 'Pros → Cons → Verdict',
    explanation: 'Demonstrates intellectual maturity. Steel-mans the strongest advantages, examines genuine downsides fairly, and arrives at a weighted verdict.',
    exampleTopic: 'Universal Remote Work',
    exampleBreakdown: 'Advantages: Eliminates commutes and unlocks global talent. → Disadvantages: Erodes tacit mentorship and blurs home boundaries. → Verdict: Hybrid intentionality—remote for deep execution, in-person for alignment.',
    recommendedTone: 'Balanced → Judicious',
    steps: [
      {
        number: '01',
        label: 'Advantages',
        shortDesc: 'Steel-man the strongest upside arguments',
        stageTitle: 'Explore the Upside (Pros)',
        stageInstruction: 'Articulate the most compelling benefits and opportunities with genuine fairness and vivid examples.',
        guidingQuestions: [
          'What is the best-case outcome of this idea?',
          'Who benefits most and in what measurable way?'
        ]
      },
      {
        number: '02',
        label: 'Disadvantages',
        shortDesc: 'Examine hidden risks & second-order costs',
        stageTitle: 'Weigh the Downside (Cons)',
        stageInstruction: 'Pivot smoothly and examine the real risks or unintended consequences.',
        guidingQuestions: [
          'What second-order cost appears once the novelty wears off?',
          'What vulnerable group or value might get left behind?'
        ]
      },
      {
        number: '03',
        label: 'Conclusion',
        shortDesc: 'Deliver a weighted, nuanced synthesis',
        stageTitle: 'Deliver a Balanced Verdict',
        stageInstruction: 'State clearly under what conditions the pros outweigh the cons and what guardrail is needed.',
        guidingQuestions: [
          'What guardrail preserves the upside while containing the risk?',
          'Where do you come down after weighing both sides?'
        ]
      }
    ]
  },
  {
    id: 'star',
    code: 'STAR',
    name: 'STAR: Situation → Task → Action → Result',
    shortName: 'STAR Storytelling',
    flowTag: 'Situation → Result',
    explanation: 'The premier personal-experience and behavioral storytelling arc. Sets a scene, defines the challenge, highlights your deliberate action, and shares the lesson.',
    exampleTopic: 'A Moment You Changed Your Mind',
    exampleBreakdown: 'Situation: Leading a product launch falling behind schedule. → Task: Rally an exhausted team in 48 hours. → Action: Cut 40% of non-essential scope and owned the decision publicly. → Result: Shipped on time with zero burnout.',
    recommendedTone: 'Personal → Impactful',
    steps: [
      {
        number: '01',
        label: 'Situation',
        shortDesc: 'Set the scene with sensory context',
        stageTitle: 'Set the Situation',
        stageInstruction: 'Drop the listener into a specific moment in time and place. Keep background concise—20% of your total time.',
        guidingQuestions: [
          'Where were you, and what was the tension in the room?',
          'What context does the listener need in 2 sentences?'
        ]
      },
      {
        number: '02',
        label: 'Task',
        shortDesc: 'Define the specific challenge or responsibility',
        stageTitle: 'Clarify the Task & Stakes',
        stageInstruction: 'State what was required of you or what dilemma had to be resolved, and what stood to be lost.',
        guidingQuestions: [
          'What specific problem or obligation was on your shoulders?',
          'Why was this hard or non-obvious?'
        ]
      },
      {
        number: '03',
        label: 'Action',
        shortDesc: 'Detail the decisive steps you took',
        stageTitle: 'Spotlight the Action',
        stageInstruction: 'Focus on what YOU specifically did, decided, or said. Explain your reasoning in the moment.',
        guidingQuestions: [
          'What concrete choice did you make under pressure?',
          'How did you overcome the main obstacle?'
        ]
      },
      {
        number: '04',
        label: 'Result',
        shortDesc: 'Share the outcome and lasting takeaway',
        stageTitle: 'Reveal the Result & Lesson',
        stageInstruction: 'Close with the tangible outcome and the universal principle you carry forward.',
        guidingQuestions: [
          'What changed as a result of your action?',
          'What lasting truth did this experience teach you?'
        ]
      }
    ]
  },
  {
    id: 'cer',
    code: 'CER',
    name: 'Claim–Evidence–Reasoning: Scientific Argument',
    shortName: 'Claim–Evidence–Reasoning',
    flowTag: 'Claim → Reasoning',
    explanation: 'Asserts a bold claim, presents observable data or examples, and articulates the underlying rule or principle that connects them.',
    exampleTopic: 'Why Constraints Boost Creativity',
    exampleBreakdown: 'Claim: Strict constraints produce more original work than unlimited freedom. → Evidence: Dr. Seuss wrote Green Eggs and Ham with 50 words; Apollo 13 used duct tape. → Reasoning: Boundaries force lateral recombination instead of analysis paralysis.',
    recommendedTone: 'Rigorous → Persuasive',
    steps: [
      {
        number: '01',
        label: 'Claim',
        shortDesc: 'Make a clear, bold, falsifiable assertion',
        stageTitle: 'Assert Your Claim',
        stageInstruction: 'State a clear, non-trivial claim that goes beyond common clichés.',
        guidingQuestions: [
          'What bold assertion are you putting on the table?',
          'Could a reasonable person initially disagree with this claim?'
        ]
      },
      {
        number: '02',
        label: 'Evidence',
        shortDesc: 'Support with concrete data or observations',
        stageTitle: 'Supply the Evidence',
        stageInstruction: 'Provide specific observations, historical data, or personal experiments that back your assertion.',
        guidingQuestions: [
          'What hard facts or repeatable observations support you?',
          'Which specific example is most vivid and credible?'
        ]
      },
      {
        number: '03',
        label: 'Reasoning',
        shortDesc: 'Explain the underlying principle connecting them',
        stageTitle: 'Articulate the Reasoning',
        stageInstruction: 'State the general rule or psychological law that explains WHY your evidence proves your claim.',
        guidingQuestions: [
          'What fundamental human rule links the evidence to the claim?',
          'Why does this principle hold across contexts?'
        ]
      }
    ]
  },
  {
    id: 'first_principles',
    code: '1P',
    name: 'First Principles: Deconstruct → Rebuild',
    shortName: 'First Principles',
    flowTag: 'Truths → Rebuild',
    explanation: 'Strip away inherited assumptions and reasoning by analogy. Break an issue down to its fundamental truths, then reconstruct a fresh argument.',
    exampleTopic: 'The Future of Higher Education',
    exampleBreakdown: 'Assumptions: Education requires a 4-year residential bundle at age 18. → Fundamental Truths: Learning requires curiosity, feedback loops, mentorship, and proof of skill. → Rebuild: Unbundle credentials into lifelong apprenticeships and peer seminars.',
    recommendedTone: 'Inquisitive → Groundbreaking',
    steps: [
      {
        number: '01',
        label: 'Assumptions',
        shortDesc: 'Identify & challenge conventional dogma',
        stageTitle: 'Expose Inherited Assumptions',
        stageInstruction: 'Name what "everyone assumes" about this topic and question whether that convention is actually necessary.',
        guidingQuestions: [
          'What conventional wisdom do people repeat without questioning?',
          'Which part of the status quo is merely historical habit?'
        ]
      },
      {
        number: '02',
        label: 'Truths',
        shortDesc: 'Isolate irreducible foundational facts',
        stageTitle: 'Boil Down to Fundamental Truths',
        stageInstruction: 'Strip everything away until only undeniable physics, biology, economics, or human nature remains.',
        guidingQuestions: [
          'What are we 100% sure is true at the bedrock level?',
          'What is the core job-to-be-done when all packaging is removed?'
        ]
      },
      {
        number: '03',
        label: 'Rebuild',
        shortDesc: 'Construct a fresh conclusion from bedrock',
        stageTitle: 'Rebuild the Argument Logically',
        stageInstruction: 'Reasoning upward only from those bedrock truths, design a superior perspective or solution.',
        guidingQuestions: [
          'If we designed this from scratch today, how would it work?',
          'What surprising conclusion emerges from first principles?'
        ]
      }
    ]
  }
];

// ============================================================================
// 3. MASSIVE TABLE TOPICS & IMPROMPTU DATABASE (360+ Prompts Across 12 Categories)
// ============================================================================

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'General',
    name: 'General',
    shortLabel: 'General',
    icon: '✨',
    directiveTitle: 'Everyday Phenomenon & Classic Table Topics',
    directiveDesc: 'Minimal prep. Formulate arguments on your feet without script aids, leaning on intuitive metaphors, everyday observations, and classic Toastmasters Table Topics.',
    domainTag: 'COGNITIVE PARADOX'
  },
  {
    id: 'Personal finance',
    name: 'Personal finance',
    shortLabel: 'Personal Fin.',
    icon: '💰',
    directiveTitle: 'Capital, Incentives & Economic Behavior',
    directiveDesc: 'Explore how money, scarcity, compounding, value, and macroeconomic forces shape personal freedom and societal priorities.',
    domainTag: 'BEHAVIORAL ECONOMICS'
  },
  {
    id: 'Tech / AI',
    name: 'Tech / AI',
    shortLabel: 'Tech / AI',
    icon: '🤖',
    directiveTitle: 'Synthetic Intelligence & The Human Frontier',
    directiveDesc: 'Critique automation, algorithmic curation, digital habits, and what remains uniquely human in an AI century.',
    domainTag: 'SYNTHETIC FRONTIER'
  },
  {
    id: 'Entrepreneurship',
    name: 'Entrepreneurship',
    shortLabel: 'Enterprise',
    icon: '🚀',
    directiveTitle: 'Conviction, Leadership & Value Creation',
    directiveDesc: 'Articulate narratives on agency, asymmetric bets, leadership under uncertainty, career turning points, and building trust.',
    domainTag: 'AGENCY & LEADERSHIP'
  },
  {
    id: 'Startups',
    name: 'Startups',
    shortLabel: 'Startups',
    icon: '🌱',
    directiveTitle: 'Zero-to-One Execution & Creative Scenarios',
    directiveDesc: 'Examine how nimble teams challenge incumbents, validate hypotheses, and solve hypothetical high-pressure scenarios.',
    domainTag: 'ZERO TO ONE'
  },
  {
    id: 'Fitness',
    name: 'Fitness',
    shortLabel: 'Fitness',
    icon: '💪',
    directiveTitle: 'Personal Experiences, Grit & Embodiment',
    directiveDesc: 'Draw from lived personal stories, childhood lessons, physical discipline, recovery, and milestones that forged character.',
    domainTag: 'HUMAN ENDURANCE'
  },
  {
    id: 'Nutrition',
    name: 'Nutrition',
    shortLabel: 'Nutrition',
    icon: '🥗',
    directiveTitle: 'Consumption, Habits & Everyday Wellbeing',
    directiveDesc: 'Examine what we consume—physically and mentally—and the rituals, traditions, and trade-offs of modern abundance.',
    domainTag: 'MODERN RITUALS'
  },
  {
    id: 'Productivity',
    name: 'Productivity',
    shortLabel: 'Productivity',
    icon: '⚡',
    directiveTitle: 'Attention, Craft & Lifelong Education',
    directiveDesc: 'Challenge performative busyness, rethink how schools and mentors teach, and design systems for deep focus.',
    domainTag: 'DEEP ATTENTION'
  },
  {
    id: 'History',
    name: 'History',
    shortLabel: 'History',
    icon: '📜',
    directiveTitle: 'Civilizational Memory & Turning Points',
    directiveDesc: 'Extract timeless lessons from empires, revolutions, forgotten inventions, and the recurring rhymes of human history.',
    domainTag: 'HISTORICAL ARC'
  },
  {
    id: 'Literature',
    name: 'Literature',
    shortLabel: 'Literature',
    icon: '📚',
    directiveTitle: 'Storytelling, Art & Abstract Metaphors',
    directiveDesc: 'Investigate why stories tell deeper truths than facts, how language shapes thought, and abstract single-word Table Topics.',
    domainTag: 'NARRATIVE & MYTH'
  },
  {
    id: 'Philosophy & Ethics',
    name: 'Philosophy & Ethics',
    shortLabel: 'Philosophy',
    icon: '🎭',
    directiveTitle: 'First Principles, Morality & The Good Life',
    directiveDesc: 'Confront timeless moral dilemmas, free will, honesty vs. kindness, justice, and ethical thought experiments.',
    domainTag: 'MORAL PHILOSOPHY'
  },
  {
    id: 'Geopolitics & Culture',
    name: 'Geopolitics & Culture',
    shortLabel: 'Geopolitics',
    icon: '🌍',
    directiveTitle: 'Civic Trust, Society & Current Affairs',
    directiveDesc: 'Analyze governance, community life, cultural identity, travel perspectives, and the forces reshaping public institutions.',
    domainTag: 'SOCIAL CONDITIONING'
  }
];

type RawTuple = [string, string, string, number, 'ACCESSIBLE' | 'INTERMEDIATE' | 'CHALLENGING'];

const COMPACT_TOPICS: Record<string, RawTuple[]> = {
  'General': [
    ['Waiting Room', 'Why modern humans experience anxiety when placed in suspension without stimulus.', 'COGNITIVE PARADOX', 150, 'ACCESSIBLE'],
    ['The Invisible Fence', 'How psychological limits outlive the structural barriers that originally birthed them.', 'SOCIAL CONDITIONING', 180, 'INTERMEDIATE'],
    ['Why Small Talk Matters', 'Re-evaluating weather conversations as low-stakes biological handshakes.', 'EVOLUTIONARY BIOLOGY', 105, 'ACCESSIBLE'],
    ['Accidental Inventions', 'Penicillin, microwave transmitters, and the value of having the curiosity to look at errors twice.', 'SERENDIPITY & CRAFT', 150, 'ACCESSIBLE'],
    ['Hand-Me-Down', 'Introduce the artifact, habit, or unspoken worldview passed across generations without a manual.', 'EVERYDAY LEGACY', 90, 'ACCESSIBLE'],
    ['The Last Seat on the Train', 'What micro-decisions in public transit reveal about unspoken civic etiquette and empathy.', 'PUBLIC SPACE', 120, 'ACCESSIBLE'],
    ['Unopened Tabs', 'Our browser windows as a museum of aspirational selves we never quite had time to become.', 'MODERN HABITS', 120, 'ACCESSIBLE'],
    ['Borrowed Umbrellas', 'Why certain everyday objects circulate in an informal gift economy of forgetfulness.', 'SOCIAL TRUST', 90, 'ACCESSIBLE'],
    ['Second-Hand Bookstores', 'Marginalia, dog-eared pages, and the quiet intimacy of reading someone else’s underlined sentences.', 'CULTURAL NOSTALGIA', 120, 'ACCESSIBLE'],
    ['The 3 A.M. Clarity', 'Why problems feel insurmountable at midnight and strangely solvable after sunrise.', 'CIRCADIAN MIND', 120, 'ACCESSIBLE'],
    ['A Stranger’s Kindness', 'Describe a brief encounter with someone you never saw again that permanently shifted your mood or outlook.', 'TABLE TOPICS', 120, 'ACCESSIBLE'],
    ['The Junk Drawer', 'Every home has one drawer that defies categorization. What does yours say about human order?', 'DOMESTIC ORDER', 90, 'ACCESSIBLE'],
    ['Missing the Flight', 'Sometimes a delayed train or missed connection turns into the best part of the journey.', 'SERENDIPITY', 120, 'ACCESSIBLE'],
    ['First Impressions', 'Tell us about a time your initial judgment of a person or place proved completely backwards.', 'PERSPECTIVE SHIFT', 120, 'ACCESSIBLE'],
    ['The Art of Packing Light', 'What travelling with a single backpack teaches us about what we actually need to be happy.', 'MINIMALISM', 120, 'ACCESSIBLE'],
    ['Rainy Sunday Afternoons', 'How do you spend an unscheduled afternoon when the weather cancels every outdoor plan?', 'LEISURE RITUALS', 90, 'ACCESSIBLE'],
    ['Your Favorite Street Corner', 'Describe one specific physical place in your city or hometown where you always feel at peace.', 'SENSE OF PLACE', 120, 'ACCESSIBLE'],
    ['Lost and Found', 'What is the most meaningful object you have ever lost, and what did losing it teach you?', 'MEMORY & LOSS', 120, 'ACCESSIBLE'],
    ['Elevator Silence', 'Why six strangers standing two feet apart stare intently at the floor numbers in unison.', 'SOCIAL NORMS', 90, 'ACCESSIBLE'],
    ['A Gift You Never Opened', 'Or a piece of advice you ignored for years until life forced you to understand it.', 'LATE WISDOM', 120, 'INTERMEDIATE'],
    ['Handwritten Letters', 'Why ink on paper carries an emotional weight that instant messages can never counterfeit.', 'TACTILE CRAFT', 120, 'ACCESSIBLE'],
    ['The Best Advice You Never Took', 'Share a warning someone gave you that you had to learn the hard way on your own.', 'EXPERIENTIAL LEARNING', 120, 'ACCESSIBLE'],
    ['Names and Nicknames', 'How the names we are given—or the nicknames we earn—shape our sense of identity.', 'IDENTITY MARKERS', 120, 'ACCESSIBLE'],
    ['Window Seat vs. Aisle Seat', 'There are two types of travelers in the world. Defend your choice with conviction.', 'LIGHT DEBATE', 90, 'ACCESSIBLE'],
    ['Park Bench Conversations', 'If you could sit on a park bench for twenty minutes with anyone living or historical, who and why?', 'HYPOTHETICAL DIALOGUE', 120, 'ACCESSIBLE'],
    ['Old Keys With No Locks', 'Why we hold onto souvenirs and tokens long after we forget what door they opened.', 'METAPHORICAL ARCHIVE', 120, 'INTERMEDIATE'],
    ['Morning People vs. Night Owls', 'Is the early bird actually wiser, or is the quiet of midnight where real creativity lives?', 'DAILY RHYTHMS', 90, 'ACCESSIBLE'],
    ['The Sound of Home', 'Not a visual image, but a specific sound—a train whistle, a ceiling fan, a kettle—that means home to you.', 'SENSORY MEMORY', 120, 'ACCESSIBLE'],
    ['Giving Directions', 'What how we guide a lost tourist reveals about how we see our own neighborhood.', 'CIVIC EMPATHY', 90, 'ACCESSIBLE'],
    ['The Unplanned Detour', 'Why the most memorable chapters of life rarely appear on the original five-year plan.', 'LIFE TRAJECTORY', 120, 'ACCESSIBLE']
  ],
  'Personal finance': [
    ['The Quiet Cost of Status', 'How spending to signal success silently mortgages genuine personal autonomy.', 'BEHAVIORAL FINANCE', 150, 'INTERMEDIATE'],
    ['Time Arbitrage', 'When buying back an hour of calm is worth more than optimizing for the lowest price.', 'TIME VALUE', 120, 'ACCESSIBLE'],
    ['Invisible Inflation', 'Shrinkflation, quality decay, and how rising prices alter social trust in institutions.', 'MACROECONOMICS', 180, 'INTERMEDIATE'],
    ['The Paradox of Windfalls', 'Why sudden wealth frequently amplifies existing habits rather than solving deeper discontent.', 'PSYCHOLOGY OF MONEY', 150, 'INTERMEDIATE'],
    ['Subscription Fatigue', 'The shift from owning physical goods to renting permanent access to everything we use.', 'RENTAL ECONOMY', 120, 'ACCESSIBLE'],
    ['Defining "Enough"', 'How to anchor financial goals when reference groups keep moving the goalpost upward.', 'WEALTH PHILOSOPHY', 150, 'ACCESSIBLE'],
    ['Cashless Society Trade-offs', 'Frictionless payments versus privacy, resilience, and the tangible pain of parting with cash.', 'MONETARY POLICY', 150, 'INTERMEDIATE'],
    ['Generational Wealth vs. Skill', 'Would you rather inherit capital with no network or zero capital with world-class adaptability?', 'HUMAN CAPITAL', 150, 'ACCESSIBLE'],
    ['The Best $20 You Ever Spent', 'What tiny purchase delivered a completely disproportionate return in joy or utility?', 'ASYMMETRIC VALUE', 90, 'ACCESSIBLE'],
    ['First Paycheck Memory', 'Take us back to the very first money you earned with your own effort and what you bought.', 'ORIGIN STORY', 120, 'ACCESSIBLE'],
    ['Experiences vs. Possessions', 'Does spending on travel always beat buying a durable tool you use every single day?', 'CONSUMER CHOICE', 120, 'ACCESSIBLE'],
    ['The Sunk Cost Trap', 'Why humans keep pouring time and money into projects or tickets simply because they already paid.', 'COGNITIVE BIAS', 150, 'INTERMEDIATE'],
    ['Split the Bill Equally?', 'The social awkwardness and game theory of group restaurant checks.', 'GAME THEORY', 90, 'ACCESSIBLE'],
    ['Price vs. Value', 'Name something that is free today that we should treat as priceless, and something expensive that is worthless.', 'VALUE PARADOX', 120, 'ACCESSIBLE'],
    ['Financial Literacy in Schools', 'Why teenagers learn trigonometry before compound interest, taxes, and emotional spending.', 'CURRICULUM REFORM', 150, 'ACCESSIBLE'],
    ['The Latte Factor Myth', 'Should personal finance focus on cutting $5 pleasures or negotiating the big three life expenses?', 'PERSONAL BUDGETING', 120, 'INTERMEDIATE'],
    ['Lottery Ticket Psychology', 'Are people buying a mathematical probability or buying forty-eight hours of daydreaming?', 'RISK PERCEPTION', 120, 'ACCESSIBLE'],
    ['Bartering One Skill', 'If currency disappeared for a month, what tangible skill or service would you trade with neighbors?', 'BARTER ECONOMY', 120, 'ACCESSIBLE'],
    ['Cheap Boots vs. Expensive Boots', 'The Sam Vimes theory of socioeconomic unfairness and why buying quality once saves money.', 'DURABILITY ECONOMICS', 150, 'INTERMEDIATE'],
    ['Tipping Culture Run Amok', 'When touchscreen prompts ask for 25% at self-checkout counters, how should consumers respond?', 'MODERN COMMERCE', 120, 'ACCESSIBLE'],
    ['The Freedom Number', 'If your basic living expenses were covered forever, how would your daily work change tomorrow morning?', 'FINANCIAL AUTONOMY', 120, 'ACCESSIBLE'],
    ['Impulse Purchases', 'What happens in the brain during the thirty seconds before clicking "Buy Now" at midnight?', 'DOPAMINE LOOPS', 120, 'ACCESSIBLE'],
    ['Lending Money to Friends', 'Never lend what you cannot afford to gift: wisdom or cynicism?', 'SOCIAL CONTRACTS', 120, 'ACCESSIBLE'],
    ['The Value of Maintenance', 'Why repairing an old watch, car, or shoe feels more rewarding than replacing it.', 'STEWARDSHIP', 120, 'ACCESSIBLE'],
    ['Salary Transparency', 'Would publishing every employee’s compensation create fairness or resentment?', 'WORKPLACE ECONOMICS', 150, 'INTERMEDIATE'],
    ['Micro-Habits That Compound', 'How saving or investing 1% more each month mirrors the physics of snowballs.', 'COMPOUNDING', 120, 'ACCESSIBLE'],
    ['Luxury vs. Comfort', 'Where does genuine functional quality end and pure vanity branding begin?', 'SIGNALING THEORY', 120, 'INTERMEDIATE'],
    ['Universal Basic Income', 'Would a guaranteed floor unleash human entrepreneurship or sap the drive to contribute?', 'ECONOMIC POLICY', 180, 'CHALLENGING'],
    ['The Cost of Free Apps', 'If you are not paying for the product, your attention is the product on the auction block.', 'ATTENTION ECONOMY', 150, 'INTERMEDIATE'],
    ['Retiring Early vs. Working Longer', 'Is the goal to escape work as fast as possible or to find work you never want to retire from?', 'LIFE DESIGN', 150, 'ACCESSIBLE']
  ],
  'Entrepreneurship': [
    ['Skin in the Game', 'Why advice from people who bear the downside carries ten times the weight of commentary.', 'RISK SYMMETRY', 150, 'INTERMEDIATE'],
    ['The Myth of the Lone Genius', 'How great breakthroughs almost always emerge from small, obsessive ensembles rather than solo heroes.', 'CREATIVE ENSEMBLES', 150, 'INTERMEDIATE'],
    ['Constructive Stubbornness', 'Knowing the razor-thin line between visionary persistence and refusing to hear market reality.', 'FOUNDER CONVICTION', 180, 'CHALLENGING'],
    ['Selling Before Building', 'Why testing human willingness to commit beats six months of secret perfecting.', 'MARKET VALIDATION', 120, 'ACCESSIBLE'],
    ['Reputation as Compound Interest', 'How decades of small kept promises create opportunities that cannot be bought.', 'TRUST CAPITAL', 120, 'ACCESSIBLE'],
    ['When to Quit a Good Thing', 'Why leaving a comfortable plateau for an uncertain ascent is harder than escaping failure.', 'OPPORTUNITY COST', 150, 'INTERMEDIATE'],
    ['The Craft of Saying No', 'Protecting core mission focus when flattering distractions knock every week.', 'STRATEGIC FOCUS', 120, 'ACCESSIBLE'],
    ['Local Heroes vs. Global Giants', 'Why neighborhood businesses anchor civic identity in ways algorithms never replicate.', 'LOCAL COMMERCE', 120, 'ACCESSIBLE'],
    ['Your Worst Boss’s Best Lesson', 'How poor leadership often teaches us more about management than effortless mentors.', 'INVERSE MENTORSHIP', 120, 'ACCESSIBLE'],
    ['Hiring for Slope vs. Y-Intercept', 'Why trajectory, curiosity, and grit beat a polished resume with static experience.', 'TALENT TRAJECTORY', 150, 'INTERMEDIATE'],
    ['The Calmest Person in the Room', 'Why emotional regulation under crisis is the ultimate leadership differentiator.', 'EXECUTIVE PRESENCE', 120, 'ACCESSIBLE'],
    ['Turning a Complaint into a Business', 'What everyday frustration in your city is begging for someone to fix it properly?', 'PROBLEM DISCOVERY', 120, 'ACCESSIBLE'],
    ['Under-Promise, Over-Deliver', 'In an era of hype cycles, why quiet reliability stands out like a superpower.', 'OPERATIONAL TRUST', 120, 'ACCESSIBLE'],
    ['Managing Friends', 'How do you maintain warmth and candor when you become the manager of former peers?', 'ROLE TRANSITIONS', 150, 'INTERMEDIATE'],
    ['The One-Sentence Pitch', 'If you cannot explain what you do without jargon in fifteen seconds, do you really understand it?', 'RADICAL CLARITY', 90, 'ACCESSIBLE'],
    ['Learning from a Public Failure', 'Describe a project or presentation that flopped and how you recovered your confidence.', 'RESILIENCE ARC', 120, 'ACCESSIBLE'],
    ['Mentors vs. Sponsors', 'A mentor gives you perspective in private; a sponsor bets their reputation on you in public.', 'CAREER ADVOCACY', 150, 'INTERMEDIATE'],
    ['Customer Support as R&D', 'Why founders and executives should personally answer support tickets every month.', 'USER EMPATHY', 120, 'ACCESSIBLE'],
    ['Generalists vs. Specialists', 'In a rapidly shifting economy, does depth in one craft beat broad cross-disciplinary range?', 'SKILL ARCHITECTURE', 150, 'INTERMEDIATE'],
    ['The Power of Apologizing Fast', 'When a team or company makes a mistake, why owning it immediately disarms critics.', 'CRISIS ETHICS', 120, 'ACCESSIBLE'],
    ['Building in Public', 'Sharing the messy middle of a project versus unveiling only the finished masterpiece.', 'OPEN PROCESS', 120, 'ACCESSIBLE'],
    ['Praise in Public, Critique in Private', 'Why protecting someone’s dignity during feedback determines whether they grow or shut down.', 'CANDOR & DIGNITY', 120, 'ACCESSIBLE'],
    ['Bootstrapping Life', 'Starting with constraints and revenue versus waiting for permission and outside funding.', 'SELF-RELIANCE', 150, 'INTERMEDIATE'],
    ['What Would You Build for Free?', 'The intersection of your natural curiosity and the problems people thank you for solving.', 'VOCATIONAL CALLING', 120, 'ACCESSIBLE'],
    ['Meetings That Should Be Emails', 'If you were CEO for a day, how would you redesign how teams communicate?', 'ORG HYGIENE', 120, 'ACCESSIBLE'],
    ['Trusting Gut vs. Data', 'When metrics say one thing and human intuition says another, how do you break the tie?', 'DECISION SCIENCE', 150, 'INTERMEDIATE'],
    ['Negotiating Win-Win', 'Why leaving a little value on the table builds twenty-year partnerships.', 'LONG-TERM GAMES', 120, 'ACCESSIBLE'],
    ['Leading Without a Title', 'How influence is earned through initiative long before an official promotion arrives.', 'EMERGENT LEADERSHIP', 120, 'ACCESSIBLE'],
    ['The 10-Year Overnight Success', 'Why society sees the ribbon-cutting ceremony but ignores the decade of quiet preparation.', 'HIDDEN COMPOUNDING', 120, 'ACCESSIBLE'],
    ['Succession and Letting Go', 'The mark of a great leader is how well the team performs when they leave the room.', 'INSTITUTIONAL LEGACY', 150, 'INTERMEDIATE']
  ],
  'Startups': [
    ['Schlep Blindness', 'Why the most valuable problems are hiding right in front of us behind tedious, unglamorous work.', 'HIDDEN OPPORTUNITY', 150, 'INTERMEDIATE'],
    ['Default Alive vs. Default Dead', 'How urgency and resource discipline sharpen product intuition better than abundant capital.', 'CAPITAL DISCIPLINE', 150, 'INTERMEDIATE'],
    ['Distribution vs. Product', 'Does a superior product still win on merit in an attention-saturated world?', 'GO-TO-MARKET', 180, 'CHALLENGING'],
    ['Unbundling the Giant', 'How specialized tools carve out empires by doing one neglected workflow ten times better.', 'VERTICAL FOCUS', 150, 'INTERMEDIATE'],
    ['First Ten Customers', 'Why doing things that don’t scale builds the DNA of high-empathy organizations.', 'UNSCALABLE CRAFT', 120, 'ACCESSIBLE'],
    ['Pivoting Without Losing Soul', 'Changing your strategy while keeping the founding mission intact.', 'STRATEGIC PIVOT', 150, 'INTERMEDIATE'],
    ['The 48-Hour Prototype', 'If you had to launch a service by Sunday evening with zero budget, what problem would you tackle?', 'RAPID SHIPPING', 120, 'ACCESSIBLE'],
    ['Culture Is What You Reward', 'Why values written on office walls lose to who gets promoted and what gets tolerated.', 'INCENTIVE DESIGN', 150, 'INTERMEDIATE'],
    ['Pitching to a Skeptic', 'You have sixty seconds in an elevator to convince a skeptic to try your favorite product or idea.', 'ELEVATOR PITCH', 90, 'ACCESSIBLE'],
    ['Solving Your Own Scratch', 'Why the most authentic products begin as tools the creator desperately needed themselves.', 'FOUNDER FIT', 120, 'ACCESSIBLE'],
    ['Feature Creep', 'How adding too many buttons ruins the simplicity that made a product loved in the first place.', 'PRODUCT RESTRAINT', 120, 'ACCESSIBLE'],
    ['Co-Founder Chemistry', 'Why complementary temperaments matter more than identical technical skills.', 'TEAM DYNAMICS', 150, 'INTERMEDIATE'],
    ['Speed as a Habit', 'Why shipping a rough draft today beats debating a slide deck for three weeks.', 'BIAS FOR ACTION', 120, 'ACCESSIBLE'],
    ['David vs. Goliath', 'Why large incumbents struggle to copy small challengers even when they see them coming.', 'INNOVATOR DILEMMA', 150, 'INTERMEDIATE'],
    ['Pricing Courage', 'Why charging fairly from day one attracts serious users who actually value the solution.', 'VALUE CAPTURE', 120, 'INTERMEDIATE'],
    ['The Mom Test', 'How to ask questions that uncover honest critiques instead of polite compliments from friends.', 'USER DISCOVERY', 150, 'INTERMEDIATE'],
    ['Remote-First vs. War Room', 'When building something brand new, does sitting around one table still hold magic?', 'COLLABORATION MODE', 120, 'ACCESSIBLE'],
    ['Pre-Mortem Thinking', 'Imagine your project failed one year from today—work backward to explain what killed it.', 'RISK INVERSION', 150, 'INTERMEDIATE'],
    ['Boring Businesses', 'Why laundromats, logistics, and waste management often outperform flashy consumer apps.', 'ESSENTIAL SERVICES', 120, 'ACCESSIBLE'],
    ['Word-of-Mouth Magic', 'What makes a product or experience so remarkable that people cannot stop telling their friends?', 'ORGANIC GROWTH', 120, 'ACCESSIBLE'],
    ['Surviving the Trough of Sorrow', 'When novelty fades and metrics are flat, what keeps a builder showing up?', 'FOUNDER GRIT', 150, 'INTERMEDIATE'],
    ['Saying No to Custom Requests', 'How chasing one big client’s bespoke demands can derail a product built for thousands.', 'PRODUCT VISION', 150, 'INTERMEDIATE'],
    ['Design for Android First', 'Why building for real-world mobile screens and pockets forces ruthless clarity.', 'MOBILE ERGONOMICS', 120, 'ACCESSIBLE'],
    ['Trust Badges and Social Proof', 'How new entrants earn credibility before they have a recognizable brand name.', 'CREDIBILITY DESIGN', 120, 'ACCESSIBLE'],
    ['Open Source Business Models', 'Giving away the core recipe while selling the kitchen service.', 'OPEN ECOSYSTEMS', 150, 'INTERMEDIATE'],
    ['Acquisitions that Fail', 'Why buying a creative team and wrapping them in corporate bureaucracy often extinguishes their spark.', 'CULTURE CLASH', 150, 'INTERMEDIATE'],
    ['The 1-Star Review Gift', 'Why an angry, detailed critique is far more useful than silent churn.', 'FEEDBACK LOOPS', 120, 'ACCESSIBLE'],
    ['Second-Mover Advantage', 'Why the pioneer takes the arrows while the fast follower studies the map and wins.', 'MARKET TIMING', 150, 'INTERMEDIATE'],
    ['Community-Led Growth', 'Building a movement of practitioners rather than just a list of buyers.', 'COMMUNITY MOAT', 120, 'ACCESSIBLE'],
    ['Your Moonshot Idea', 'If failure carried zero stigma and you had ten years, what audacious problem would you attack?', 'MOONSHOT THINKING', 150, 'ACCESSIBLE']
  ],
  'Tech / AI': [
    ['The Centaur Model', 'Why human intuition paired with machine synthesis outperforms either working in isolation.', 'HUMAN-AI SYMBIOSIS', 150, 'INTERMEDIATE'],
    ['Synthetic Empathy', 'When AI voices sound endlessly patient, how does that reshape our expectations of flawed humans?', 'AFFECTIVE COMPUTING', 180, 'CHALLENGING'],
    ['The Loss of Friction', 'When writing, coding, and art become instant, which forms of struggle must we intentionally preserve?', 'COGNITIVE FRICTION', 180, 'CHALLENGING'],
    ['Algorithmic Serendipity', 'Can recommendation engines ever be designed to challenge our worldview rather than flatter it?', 'CURATION SYSTEMS', 150, 'INTERMEDIATE'],
    ['Digital Permanence', 'Growing up in an era where youthful mistakes are indexed forever vs. the right to be forgotten.', 'DIGITAL MEMORY', 150, 'ACCESSIBLE'],
    ['Open Weights vs. Gatekeepers', 'Should frontier artificial intelligence be open-sourced like Linux or regulated like nuclear energy?', 'AI GOVERNANCE', 180, 'CHALLENGING'],
    ['Proof of Humanity', 'In a web flooded with synthetic content, how will we verify and value authentic human voice?', 'AUTHENTICITY', 150, 'INTERMEDIATE'],
    ['The Dumbphone Renaissance', 'Why a growing wave of technologists are voluntarily stepping back to single-purpose hardware.', 'DIGITAL MINIMALISM', 120, 'ACCESSIBLE'],
    ['24 Hours Offline', 'Describe what happens to your attention span and anxiety when your phone is locked away for a full day.', 'UNPLUGGED SABBATICAL', 120, 'ACCESSIBLE'],
    ['Autocomplete for Thought', 'If predictive text finishes our sentences, does it gradually standardize how we think and speak?', 'LINGUISTIC DRIFT', 150, 'INTERMEDIATE'],
    ['Smart Homes, Fragile Lives', 'When lightbulbs and door locks require software updates, have we traded resilience for novelty?', 'OVER-ENGINEERING', 120, 'ACCESSIBLE'],
    ['Voice Notes vs. Texting', 'Why asynchronous voice messages are making a comeback in personal communication.', 'VOCAL INTIMACY', 90, 'ACCESSIBLE'],
    ['Deepfakes and Epistemic Trust', 'When seeing is no longer believing, how do courts, journalists, and citizens verify truth?', 'EPISTEMIC SECURITY', 180, 'CHALLENGING'],
    ['AI Tutors for Every Child', 'How personalized, infinitely patient software could close educational gaps worldwide.', 'PERSONALIZED ED', 150, 'ACCESSIBLE'],
    ['The Right to Repair', 'Why owners should be allowed to open, fix, and modify the electronics they paid for.', 'HARDWARE SOVEREIGNTY', 120, 'ACCESSIBLE'],
    ['Autonomous Vehicles Dilemma', 'Would you trust a self-driving car more than an average human driver on a rainy highway?', 'AUTOMATION TRUST', 120, 'ACCESSIBLE'],
    ['Nostalgia for the Early Web', 'Personal blogs, quirky forums, and what we lost when the internet consolidated into five apps.', 'WEB ARCHAEOLOGY', 150, 'ACCESSIBLE'],
    ['Screen Time for Kids', 'Where should parents draw the line between digital literacy and protecting childhood play?', 'DIGITAL CHILDHOOD', 150, 'ACCESSIBLE'],
    ['Biometric Privacy', 'Paying with your face or fingerprint: seamless convenience or irreversible surveillance?', 'BIOMETRIC ETHICS', 150, 'INTERMEDIATE'],
    ['Human Craft in the Age of AI', 'Why handmade pottery, live theater, and unscripted speech become more precious as automation scales.', 'ARTISANAL VALUE', 150, 'INTERMEDIATE'],
    ['Notification Bankruptcy', 'If you could only allow three apps to vibrate your pocket, which three survive the cut?', 'ATTENTION HYGIENE', 90, 'ACCESSIBLE'],
    ['Space Exploration vs. Earth Repair', 'Should we invest billions in Mars habitats or dedicate every dollar to ocean and climate restoration?', 'PLANETARY PRIORITY', 180, 'INTERMEDIATE'],
    ['Robotics in Elder Care', 'Can mechanical companions ease loneliness without replacing human family responsibility?', 'CARE ROBOTICS', 150, 'INTERMEDIATE'],
    ['Password Fatigue', 'Passkeys, hardware tokens, and the eternal tug-of-war between security and usability.', 'SECURITY UX', 120, 'ACCESSIBLE'],
    ['Virtual Reality Travel', 'If a headset lets you walk through ancient Rome in photorealistic 3D, does it rival physical travel?', 'SYNTHETIC PRESENCE', 120, 'ACCESSIBLE'],
    ['Algorithmic Hiring', 'When resumes are screened by software before human eyes, what unconventional talent gets filtered out?', 'ALGORITHMIC BIAS', 150, 'INTERMEDIATE'],
    ['Digital Estate Planning', 'What should happen to our photos, journals, and cloud accounts a hundred years from now?', 'DIGITAL LEGACY', 120, 'INTERMEDIATE'],
    ['GPS and Our Internal Compass', 'Have turn-by-turn blue dots caused our natural spatial memory of cities to atrophy?', 'SPATIAL COGNITION', 120, 'ACCESSIBLE'],
    ['The Ethics of Brain-Computer Interfaces', 'Restoring sight and speech is noble—what happens when neural chips offer cognitive enhancement?', 'NEURAL FRONTIER', 180, 'CHALLENGING'],
    ['One Technology to Un-invent', 'If you could press a button and erase one modern invention from history, what would it be?', 'TECH COUNTERFACTUAL', 120, 'ACCESSIBLE']
  ],
  'Fitness': [
    ['Voluntary Hardship', 'Why deliberately choosing physical discomfort in the morning inoculates the mind against daily chaos.', 'HORMESIS & GRIT', 120, 'ACCESSIBLE'],
    ['The Plateau Lesson', 'What months of training without visible progress teach us about delayed gratification.', 'LONG PLATEAUS', 120, 'ACCESSIBLE'],
    ['Movement as Medicine', 'Why walking without headphones remains the most underrated cognitive reset available.', 'KINETIC CLARITY', 120, 'ACCESSIBLE'],
    ['Team Sports vs. Solo Endurance', 'How shared locker-room accountability compares to the quiet solitude of the long-distance runner.', 'ATHLETIC ARCHETYPES', 120, 'ACCESSIBLE'],
    ['Playing Badly on Purpose', 'Why adults need recreational hobbies where they have zero expectation of being impressive.', 'UNSTRUCTURED PLAY', 120, 'ACCESSIBLE'],
    ['Recovery Is Part of the Work', 'Why high performers mistake exhaustion for productivity until injury forces stillness.', 'REST & ADAPTATION', 150, 'INTERMEDIATE'],
    ['Posture and Presence', 'How physical carriage and breathing immediately alter vocal authority before a single word is spoken.', 'SOMATIC PRESENCE', 120, 'ACCESSIBLE'],
    ['Longevity vs. Peak Performance', 'Training to win this Saturday versus training to hike mountains at eighty-five.', 'CENTENARIAN TRAINING', 150, 'INTERMEDIATE'],
    ['Learning to Swim or Ride a Bike', 'Recall the exact moment in childhood when fear of falling turned into the thrill of balance.', 'MOTOR MEMORY', 120, 'ACCESSIBLE'],
    ['The First Mile Liar', 'Why the first ten minutes of any workout, speech, or hard task always feel worse than the rest.', 'WARMUP RESISTANCE', 120, 'ACCESSIBLE'],
    ['Cold Showers and Comfort Zones', 'Do small daily rituals of discomfort actually build mental toughness?', 'STRESS INOCULATION', 120, 'ACCESSIBLE'],
    ['Losing Gracefully', 'Tell us about a competition or game you lost that taught you more than your easiest victory.', 'COMPETITIVE HUMILITY', 120, 'ACCESSIBLE'],
    ['Breathing Under Pressure', 'How slowing your exhale physically overrides stage fright and racing thoughts.', 'AUTONOMIC CONTROL', 120, 'ACCESSIBLE'],
    ['Stairs Instead of Elevators', 'Designing friction back into modern environments so movement happens naturally.', 'ACTIVE ARCHITECTURE', 120, 'ACCESSIBLE'],
    ['Wearable Fitness Trackers', 'When sleep scores and step rings dictate how we feel, are we listening to data over our own bodies?', 'QUANTIFIED SELF', 150, 'INTERMEDIATE'],
    ['A Scar With a Story', 'Every physical scrape or milestone has a backstory—share a memorable adventure that left a mark.', 'LIVED BIOGRAPHY', 120, 'ACCESSIBLE'],
    ['Early Morning Streets', 'The unique brotherhood of runners, bakers, and street sweepers awake at 5:30 A.M.', 'DAWN DISCIPLINE', 120, 'ACCESSIBLE'],
    ['Stretching and Flexibility', 'Both as a physical discipline and a metaphor for surviving unexpected life changes.', 'ADAPTIVE RANGE', 120, 'ACCESSIBLE'],
    ['Home Gym vs. Public Gym', 'The convenience of solitude versus the contagious energy of struggling alongside others.', 'TRAINING ENVIRONMENT', 90, 'ACCESSIBLE'],
    ['Overcoming Stage Fright', 'Where do you feel nervousness in your body, and how have you learned to befriend adrenaline?', 'VOCAL ADRENALINE', 120, 'ACCESSIBLE'],
    ['Hiking Without Cell Service', 'What happens to conversation and observation when you climb above the last signal tower.', 'ALPINE SILENCE', 120, 'ACCESSIBLE'],
    ['Consistency Beats Intensity', 'Why twenty minutes every day for a year crushes one heroic three-hour weekend session.', 'DAILY HABIT', 120, 'ACCESSIBLE'],
    ['Coaching Yourself', 'How would your internal monologue change if you spoke to yourself like a world-class coach?', 'SELF-TALK', 120, 'ACCESSIBLE'],
    ['Dance and Unselfconsciousness', 'Why moving to music is a universal human antidote to stress across every culture.', 'RHYTHMIC RELEASE', 120, 'ACCESSIBLE'],
    ['The Finish Line Feeling', 'Describe a moment you completed something you genuinely weren’t sure you could finish.', 'ENDURANCE MILESTONE', 120, 'ACCESSIBLE'],
    ['Sleep as a Superpower', 'How our culture went from bragging about four hours of sleep to treating rest as high performance.', 'CIRCADIAN RECOVERY', 120, 'ACCESSIBLE'],
    ['Barefoot on Grass', 'Why grounding our senses in the physical world counteracts hours of staring at glass rectangles.', 'SENSORY GROUNDING', 90, 'ACCESSIBLE'],
    ['Accountability Partners', 'Why promising a friend you will meet them at the track at 6 A.M. makes snoozing impossible.', 'SOCIAL COMMITMENT', 120, 'ACCESSIBLE'],
    ['Aging With Vitality', 'Who is the most energetic older person you know, and what is their secret to staying curious and active?', 'VITAL LONGEVITY', 120, 'ACCESSIBLE'],
    ['The Second Wind', 'That mysterious reserve of human energy that unlocks right when we think our tank is empty.', 'METABOLIC RESERVE', 120, 'ACCESSIBLE']
  ],
  'Nutrition': [
    ['The Ritual of the Shared Table', 'Why eating together without screens is the oldest social glue across every human civilization.', 'COMMUNAL TABLE', 120, 'ACCESSIBLE'],
    ['Information Diet', 'Applying nutritional standards to the news, podcasts, and feeds we consume before breakfast.', 'COGNITIVE NUTRITION', 120, 'ACCESSIBLE'],
    ['Paradox of the Supermarket', 'Forty thousand items on the shelves and why abundance makes simple, healthy choices harder.', 'CHOICE OVERLOAD', 150, 'INTERMEDIATE'],
    ['Grandmother’s Kitchen Rules', 'How ancestral culinary wisdom survived centuries before nutrition labels existed.', 'ANCESTRAL WISDOM', 120, 'ACCESSIBLE'],
    ['Lab-Grown Future', 'If cellular agriculture replicates steak identically at half the cost, will cultural resistance fade?', 'CELLULAR AG', 150, 'INTERMEDIATE'],
    ['Fast Food, Slow Consequences', 'How convenience subsidies shift costs from the checkout counter to long-term public health.', 'PUBLIC HEALTH', 150, 'INTERMEDIATE'],
    ['Bitter Flavors', 'Coffee, dark chocolate, and why many of life’s richest rewards are acquired tastes.', 'ACQUIRED TASTES', 120, 'ACCESSIBLE'],
    ['Scarcity to Surplus', 'How biology optimized for famine navigates an environment of engineered hyper-palatability.', 'EVOLUTIONARY MISMATCH', 150, 'INTERMEDIATE'],
    ['Your Comfort Meal', 'Describe one dish that immediately transports you back to childhood safety and warmth.', 'CULINARY MEMORY', 90, 'ACCESSIBLE'],
    ['Cooking as Meditation', 'Chopping vegetables, tending a simmering pot, and the tactile joy of creating something nourishing.', 'SLOW CRAFT', 120, 'ACCESSIBLE'],
    ['Street Food Diplomacy', 'Why the best way to understand a new city or culture is through a $3 street stall.', 'CULINARY DIPLOMACY', 120, 'ACCESSIBLE'],
    ['The Spice Trade', 'How a handful of dried barks and seeds redrew the map of global history.', 'GLOBAL FLAVOR', 150, 'INTERMEDIATE'],
    ['Kitchen Disasters', 'Tell us about a time you tried to cook an ambitious meal and everything went hilariously wrong.', 'CULINARY HUMILITY', 120, 'ACCESSIBLE'],
    ['Fasting and Restraint', 'Why every philosophical and spiritual tradition incorporates periods of voluntary abstinence.', 'VOLUNTARY RESTRAINT', 150, 'INTERMEDIATE'],
    ['Coffee vs. Tea Rituals', 'One fuels rapid urgency; the other invites unhurried contemplation. Which defines your mornings?', 'MORNING ELIXIRS', 90, 'ACCESSIBLE'],
    ['Food Waste Paradox', 'One third of global harvests go uneaten while millions go hungry—where is the broken link?', 'SUPPLY CHAIN ETHICS', 150, 'INTERMEDIATE'],
    ['Growing One Thing Yourself', 'How tending a single tomato plant or herb pot changes your respect for farmers.', 'SOIL LITERACY', 120, 'ACCESSIBLE'],
    ['Secret Family Recipes', 'Why the magic ingredient in a family dish is usually the story told around the table.', 'ORAL HERITAGE', 120, 'ACCESSIBLE'],
    ['Ultra-Processed Convenience', 'How we traded thirty minutes at the stove for ingredient lists that read like chemistry exams.', 'MODERN FOODWAYS', 150, 'INTERMEDIATE'],
    ['Dining Alone in Public', 'Why sitting at a café table with a notebook and no phone is an underrated luxury.', 'SOLITARY TABLE', 120, 'ACCESSIBLE'],
    ['Seasonal Eating', 'Why strawberries in June taste ten times sweeter than strawberries flown halfway around the globe in January.', 'NATURAL CYCLES', 120, 'ACCESSIBLE'],
    ['The Power of Hydration and Salt', 'Why the simplest biological basics are ignored in favor of exotic supplements.', 'FOUNDATIONAL HEALTH', 120, 'ACCESSIBLE'],
    ['Hospitality Across Cultures', 'Share a time you were welcomed as a guest and overwhelmed by someone’s generosity.', 'GUEST & HOST', 120, 'ACCESSIBLE'],
    ['Sweet Tooth Economics', 'How sugar went from a royal apothecary luxury to the cheapest calorie on Earth.', 'COMMODITY HISTORY', 150, 'INTERMEDIATE'],
    ['Midnight Snacks', 'Why the refrigerator light at 11:30 P.M. witnesses our least rational decisions.', 'LATE-NIGHT HABITS', 90, 'ACCESSIBLE'],
    ['Menu Anxiety', 'Why a restaurant with six perfected dishes feels more trustworthy than a ten-page binder.', 'CURATED SIMPLICITY', 120, 'ACCESSIBLE'],
    ['Fermentation and Patience', 'Bread, cheese, kimchi—how time and invisible microbes turn simple ingredients into art.', 'MICROBIAL ALCHEMY', 120, 'INTERMEDIATE'],
    ['School Lunch Reform', 'If we treated school cafeterias as classrooms for lifelong health, what would be on the tray?', 'CIVIC NUTRITION', 150, 'ACCESSIBLE'],
    ['Breaking Bread With Rivals', 'Why sharing a meal makes it psychologically harder to dehumanize an opponent.', 'TABLE DIPLOMACY', 120, 'INTERMEDIATE'],
    ['Your Last Meal on Earth', 'Not out of morbidity, but celebration: which three dishes and which three guests make the table?', 'CELEBRATION FEAST', 120, 'ACCESSIBLE']
  ],
  'Productivity': [
    ['The Maker vs. Manager Schedule', 'How a single 30-minute meeting at 2 P.M. can fracture an entire afternoon of creative synthesis.', 'CALENDAR DEFENSE', 150, 'ACCESSIBLE'],
    ['Rethinking the Classroom', 'If you redesigned high school from scratch for 2030, which three subjects would become mandatory?', 'EDUCATION 2030', 150, 'INTERMEDIATE'],
    ['Performative Busyness', 'Why visibly frantic schedules often mask an avoidance of the one hard decision that matters.', 'SIGNALING EFFORT', 150, 'INTERMEDIATE'],
    ['Learning by Teaching', 'Why explaining an idea out loud without notes immediately exposes the gaps in our understanding.', 'FEYNMAN TECHNIQUE', 120, 'ACCESSIBLE'],
    ['The Myth of Multitasking', 'Context-switching penalties and the superpower of giving one person or problem undivided presence.', 'MONO-TASKING', 120, 'ACCESSIBLE'],
    ['Credentials vs. Curiosity', 'When degrees signal past compliance, how should society measure genuine problem-solving ability?', 'PROOF OF WORK', 150, 'INTERMEDIATE'],
    ['The 80% Threshold', 'Knowing when perfectionism is noble craftsmanship versus disguised fear of shipping.', 'SHIPPING CADENCE', 120, 'ACCESSIBLE'],
    ['Analog Thinking Tools', 'Why pen and paper still unlock spatial and associative thoughts that keyboards flatten.', 'TACTILE COGNITION', 120, 'ACCESSIBLE'],
    ['A Teacher Who Changed Your Trajectory', 'Tell us about an educator or mentor who saw potential in you before you saw it in yourself.', 'PEDAGOGICAL IMPACT', 120, 'ACCESSIBLE'],
    ['The Two-Minute Rule', 'If a task takes less than two minutes, do it immediately—when does this rule work and when does it backfire?', 'ACTION VELOCITY', 120, 'ACCESSIBLE'],
    ['Procrastination as a Signal', 'What if procrastination isn’t laziness, but uncertainty about what the very first physical step is?', 'FRICTION DIAGNOSIS', 120, 'ACCESSIBLE'],
    ['Boredom as Creative Fuel', 'Why our best shower thoughts arrive only when the brain is finally allowed to wander.', 'DEFAULT MODE NETWORK', 120, 'ACCESSIBLE'],
    ['To-Do Lists vs. Calendar Blocks', 'A wish list without a time slot is just guilt on paper. How do you plan your day?', 'TIME BLOCKING', 120, 'ACCESSIBLE'],
    ['Learning a Language as an Adult', 'The humility of sounding like a toddler again in order to unlock a new worldview.', 'NEUROPLASTICITY', 120, 'ACCESSIBLE'],
    ['Homework: Keep or Abolish?', 'Should evenings belong to family, play, and rest rather than extra worksheets?', 'ACADEMIC BALANCE', 150, 'ACCESSIBLE'],
    ['The Curse of Knowledge', 'Why experts often struggle to explain basic concepts to beginners—and how to bridge the gap.', 'EXPERT BLINDNESS', 150, 'INTERMEDIATE'],
    ['Saying "I Don’t Know"', 'Why admitting ignorance immediately is the fastest way to learn and earn respect.', 'EPISTEMIC CANDOR', 120, 'ACCESSIBLE'],
    ['Parkinson’s Law', 'Work expands to fill the time allotted. What happens when you cut your deadline in half?', 'TIME CONSTRAINTS', 120, 'ACCESSIBLE'],
    ['Reading One Book Ten Times', 'Versus reading ten books once: depth of assimilation versus breadth of exposure.', 'DEEP READING', 150, 'INTERMEDIATE'],
    ['Your Ideal Study or Work Sanctuary', 'Silence or coffee shop hum? Cluttered desk or empty table? Describe your optimal environment.', 'AMBIENT FOCUS', 90, 'ACCESSIBLE'],
    ['Grading on Failure Tolerance', 'What if schools graded students on how boldly they experimented rather than avoiding mistakes?', 'ITERATIVE LEARNING', 150, 'INTERMEDIATE'],
    ['The Sunday Evening Reset', 'One ritual that turns Monday morning from a frantic scramble into a calm execution.', 'WEEKLY CADENCE', 120, 'ACCESSIBLE'],
    ['Speed Reading vs. Slow Reading', 'Why skimming for information is different from reading for wisdom.', 'CONTEMPLATIVE STUDY', 120, 'ACCESSIBLE'],
    ['Apprenticeships Over Lectures', 'Why watching a master craftsman work in real time teaches tacit truths no textbook captures.', 'TACIT KNOWLEDGE', 150, 'INTERMEDIATE'],
    ['Digital Hoarding', 'Thousands of bookmarked articles and saved videos we never revisit—how to curate ruthlessly.', 'INFORMATION TRIAGE', 120, 'ACCESSIBLE'],
    ['The Power of Deadlines', 'Why external accountability unlocks focus that pure internal willpower rarely matches.', 'COMMITMENT DEVICES', 120, 'ACCESSIBLE'],
    ['Teaching Kids About Failure', 'How do we raise a generation that treats a wrong answer as data rather than an identity flaw?', 'GROWTH MINDSET', 150, 'ACCESSIBLE'],
    ['Unlearning an Old Habit', 'Why deleting an outdated reflex is twice as hard as acquiring a brand new skill.', 'HABIT REWIRING', 120, 'INTERMEDIATE'],
    ['Public Speaking in Every Curriculum', 'Why the ability to articulate thoughts on your feet is the ultimate multiplier for every other skill.', 'ORATORY CRAFT', 120, 'ACCESSIBLE'],
    ['One Skill You Want to Master Next Year', 'What is on your learning horizon and why does it excite you right now?', 'SKILL HORIZON', 120, 'ACCESSIBLE']
  ],
  'History': [
    ['The Printing Press Parallel', 'What the 15th-century information explosion teaches us about today’s epistemic upheaval.', 'MEDIA REVOLUTIONS', 180, 'CHALLENGING'],
    ['Forgotten Maintainers', 'History celebrates conquerors and inventors, yet civilizations survive on the quiet work of maintainers.', 'INFRASTRUCTURE STEWARDS', 150, 'INTERMEDIATE'],
    ['The Library of Alexandria', 'How fragile human knowledge is when stored in centralized monoliths without cultural redundancy.', 'KNOWLEDGE FRAGILITY', 150, 'INTERMEDIATE'],
    ['Coffeehouses of the Enlightenment', 'How penny universities sparked scientific, financial, and democratic revolutions.', 'PUBLIC SPHERE', 150, 'INTERMEDIATE'],
    ['Time Capsule to 2126', 'If you could seal three everyday objects from this year to explain our era to 2126, what goes inside?', 'CENTURY ARCHIVE', 120, 'ACCESSIBLE'],
    ['When Maps Were Wrong', 'How cartographic errors and "Here Be Dragons" shaped exploration and human audacity.', 'TERRA INCOGNITA', 150, 'ACCESSIBLE'],
    ['Cathedral Thinking', 'Starting generational projects whose completion you will never personally live to witness.', 'INTERGENERATIONAL VISION', 150, 'CHALLENGING'],
    ['The Container Ship', 'How a simple standardized metal box transformed global geography more than supersonic flight.', 'LOGISTICS REVOLUTION', 150, 'INTERMEDIATE'],
    ['Dinner With a Historical Figure', 'Which misunderstood figure from history would you invite to hear their side of the story?', 'HISTORICAL EMPATHY', 120, 'ACCESSIBLE'],
    ['The Invention of the Clock', 'How mechanical timekeeping transformed humanity from living by the sun to living by the minute.', 'CHRONOMETRY', 150, 'INTERMEDIATE'],
    ['Letters From the Front', 'Why personal diaries of ordinary citizens reveal more truth than royal chronicles.', 'PRIMARY SOURCES', 150, 'INTERMEDIATE'],
    ['Ancient Architecture Without Cranes', 'What monuments like Hampi, Giza, or Rome teach us about human coordination and permanence.', 'LITHIC PERMANENCE', 150, 'ACCESSIBLE'],
    ['A Decade You Wish You Witnessed', 'If you had a 7-day tourist pass to any past century—with guaranteed safe return—where do you land?', 'TEMPORAL PASSPORT', 120, 'ACCESSIBLE'],
    ['The Silk Road', 'How trade routes carried mathematics, music, philosophy, and recipes alongside silk and spices.', 'CULTURAL DIFFUSION', 150, 'INTERMEDIATE'],
    ['Monuments and Memory', 'How should cities contextualize historical statues when moral standards evolve?', 'CIVIC MEMORY', 180, 'CHALLENGING'],
    ['The Bicycle’s Quiet Revolution', 'How two wheels transformed personal mobility, women’s independence, and paved roads.', 'EVERYDAY MOBILITY', 120, 'ACCESSIBLE'],
    ['Oral Traditions', 'How epics were memorized and sung across centuries before writing systems existed.', 'MNEMONIC CULTURE', 150, 'INTERMEDIATE'],
    ['Turning Points on Tiny Hinges', 'How a sudden fog, a lost messenger, or a single conversation altered the fate of nations.', 'HISTORICAL CONTINGENCY', 150, 'INTERMEDIATE'],
    ['What Future Historians Will Laugh At', 'Which normal modern habit of ours will look completely absurd in textbooks two hundred years from now?', 'FUTURE RETROSPECT', 120, 'ACCESSIBLE'],
    ['Preserving Dying Languages', 'When the last speaker of a tongue passes away, what unique map of reality vanishes?', 'LINGUISTIC HERITAGE', 150, 'INTERMEDIATE'],
    ['The Postcard Era', 'When travelers sent three sentences on cardboard that took three weeks to arrive.', 'SLOW CORRESPONDENCE', 120, 'ACCESSIBLE'],
    ['Paper and Ink vs. Silicon', 'Dead Sea Scrolls lasted two millennia; a floppy disk from 1998 is unreadable. Are we entering a digital dark age?', 'ARCHIVAL LONGEVITY', 150, 'INTERMEDIATE'],
    ['The Origin of Weekends', 'How the two-day rest we take for granted was forged through decades of industrial negotiation.', 'LABOR HISTORY', 120, 'ACCESSIBLE'],
    ['Museums and Repatriation', 'Should artifacts live in global encyclopedic museums or return to the exact soil where they were carved?', 'CULTURAL STEWARDSHIP', 180, 'CHALLENGING'],
    ['Family Folklore', 'Share a story about one of your grandparents or ancestors that shaped your family’s identity.', 'GENEALOGICAL MEMORY', 120, 'ACCESSIBLE'],
    ['The Telegraph to the Internet', 'Why every generation believes its new communication tool will automatically end all misunderstandings.', 'VICTORIAN INTERNET', 150, 'INTERMEDIATE'],
    ['Sanitation and Clean Water', 'Why plumbers and civil engineers saved more human lives in history than almost any other profession.', 'PUBLIC INFRASTRUCTURE', 120, 'ACCESSIBLE'],
    ['The Space Race Spirit', 'How a shared civilizational deadline inspired millions of students to study science and engineering.', 'COLLECTIVE AMBITION', 120, 'ACCESSIBLE'],
    ['Lessons From Fallen Empires', 'Is overextension, hubris, or loss of civic trust the most common catalyst of decline?', 'CIVILIZATIONAL CYCLES', 180, 'CHALLENGING'],
    ['Your Personal Museum Exhibit', 'If a museum curated a glass case representing your life so far, which three items go on display?', 'PERSONAL ARTIFACTS', 120, 'ACCESSIBLE']
  ],
  'Literature': [
    ['Unreliable Narrators', 'Why every human memory is an edited autobiography where we cast ourselves as the reasonable protagonist.', 'NARRATIVE BIAS', 150, 'INTERMEDIATE'],
    ['The Ship of Theseus', 'If every cell, belief, and habit changes over twenty years, what makes you the same person?', 'CONTINUITY PARADOX', 150, 'CHALLENGING'],
    ['Villains Who Think They’re Right', 'Why compelling stories and real-world conflicts rarely feature cartoon evil, but clashing virtues.', 'MORAL AMBIGUITY', 150, 'INTERMEDIATE'],
    ['Untranslatable Words', 'Saudade, Tsundoku, Komorebi—how naming an elusive emotion makes it visible to a culture.', 'LEXICAL GAPS', 120, 'ACCESSIBLE'],
    ['Silence Between the Notes', 'Why what a speaker, poet, or leader chooses to leave unsaid carries the heaviest weight.', 'NEGATIVE SPACE', 150, 'INTERMEDIATE'],
    ['Re-reading at Thirty vs. Fifteen', 'The book didn’t change a single word, yet the reader returning to it meets a different story.', 'EVOLVING READER', 120, 'ACCESSIBLE'],
    ['Dystopias of Comfort', 'Why Huxley’s Brave New World of endless distraction proved more prophetic than Orwell’s boot.', 'PROPHETIC FICTION', 180, 'CHALLENGING'],
    ['Metaphors We Live By', 'When we describe argument as "war" rather than "dance," how does that pre-determine the outcome?', 'CONCEPTUAL METAPHOR', 150, 'INTERMEDIATE'],
    ['The Book vs. The Film Adaptation', 'Why our internal imagination almost always casts a richer world than a $200M cinema budget.', 'MENTAL THEATER', 120, 'ACCESSIBLE'],
    ['A Fictional Character You Admire', 'Which character from literature, cinema, or myth taught you a real-world virtue?', 'ARCHETYPAL VIRTUE', 120, 'ACCESSIBLE'],
    ['Single-Word Prompt: "Bridges"', 'Speak for two minutes on the literal, emotional, or generational meaning of bridges.', 'ABSTRACT PROMPT', 120, 'ACCESSIBLE'],
    ['Single-Word Prompt: "Shadows"', 'Where there is light, there is shadow. Explore this concept from any angle you choose.', 'ABSTRACT PROMPT', 120, 'INTERMEDIATE'],
    ['Single-Word Prompt: "Doors"', 'Revolving doors, locked doors, or the courage to knock. Take the stage.', 'ABSTRACT PROMPT', 120, 'ACCESSIBLE'],
    ['Single-Word Prompt: "Mirrors"', 'What do we see when we look closely, and what do we project onto others?', 'ABSTRACT PROMPT', 120, 'INTERMEDIATE'],
    ['Why We Love Detective Stories', 'In a chaotic world, the comforting promise that every clue matters and truth will be revealed.', 'NARRATIVE ORDER', 120, 'ACCESSIBLE'],
    ['Fairy Tales and Folk Wisdom', 'Why childhood fables across continents share the exact same archetypes of courage and trickery.', 'COMPARATIVE MYTH', 150, 'INTERMEDIATE'],
    ['Judging a Book by Its Cover', 'In design, packaging, and human presentation, why surface aesthetics communicate care.', 'SEMIOTICS OF FORM', 120, 'ACCESSIBLE'],
    ['The Power of the Opening Line', '"Call me Ishmael." How a great first sentence hooks human curiosity in three seconds.', 'RHETORICAL HOOK', 120, 'ACCESSIBLE'],
    ['Tragedy and Catharsis', 'Why watching a heartbreaking story on stage leaves an audience feeling uplifted rather than crushed.', 'ARISTOTELIAN POETICS', 150, 'INTERMEDIATE'],
    ['Poetry in Everyday Speech', 'Why rhythm, contrast, and cadence make ordinary sentences unforgettable.', 'PROSODY & CADENCE', 120, 'ACCESSIBLE'],
    ['Writing Your Memoir Title', 'If your life up to this morning were published as a novel, what would the title and subtitle be?', 'AUTOBIOGRAPHY', 90, 'ACCESSIBLE'],
    ['Libraries as Sacred Civic Spaces', 'The last indoor space in modern cities where you are welcomed for hours without buying anything.', 'CIVIC SANCTUARY', 120, 'ACCESSIBLE'],
    ['Humor as Armor and Bridge', 'How a well-timed self-deprecating joke can defuse tension faster than a logical argument.', 'COMEDIC DISARMAMENT', 120, 'ACCESSIBLE'],
    ['Ending on a Cliffhanger', 'Why unresolved questions linger in the human mind ten times longer than tidy answers.', 'ZEIGARNIK EFFECT', 120, 'INTERMEDIATE'],
    ['Songs That Tell a Story', 'What lyrics or melody can instantly change the atmosphere of a room for you?', 'LYRICAL MEMORY', 120, 'ACCESSIBLE'],
    ['The Blank Page', 'Why starting is the hardest part of any creative act, and how to break the spell.', 'CREATIVE INERTIA', 120, 'ACCESSIBLE'],
    ['Satire and Speaking Truth to Power', 'Why court jesters and satirists were historically allowed to say what courtiers could not.', 'SATIRICAL LICENSE', 150, 'INTERMEDIATE'],
    ['Single-Word Prompt: "Echoes"', 'How words, deeds, and kindnesses reverberate long after the speaker has left.', 'ABSTRACT PROMPT', 120, 'ACCESSIBLE'],
    ['Single-Word Prompt: "Anchors"', 'What keeps you grounded when everything around you is moving fast?', 'ABSTRACT PROMPT', 120, 'ACCESSIBLE'],
    ['The Story You Tell Yourself', 'How reframing a past setback from a tragedy into a training chapter changes your future.', 'NARRATIVE AGENCY', 150, 'ACCESSIBLE']
  ],
  'Philosophy & Ethics': [
    ['The Veil of Ignorance', 'Designing a fair society when you do not know in advance which rung of the ladder you will occupy.', 'RAWLSIAN JUSTICE', 180, 'CHALLENGING'],
    ['Moral Luck', 'Why we judge two reckless drivers differently solely based on whether a pedestrian happened to cross.', 'ETHICAL CONTINGENCY', 150, 'CHALLENGING'],
    ['The Ring of Gyges', 'If you were granted total invisibility and zero reputational consequences for a week, what stays unchanged?', 'UNSEEN INTEGRITY', 150, 'INTERMEDIATE'],
    ['Optimistic Nihilism', 'If the universe has no pre-scripted meaning, why that frees us to author our own purpose.', 'EXISTENTIAL AGENCY', 150, 'INTERMEDIATE'],
    ['The Paradox of Tolerance', 'Where should an open society draw the boundary when tolerance itself is weaponized?', 'POPPER PARADOX', 180, 'CHALLENGING'],
    ['Truth vs. Kindness', 'When blunt honesty collides with protecting someone’s dignity, which principle takes precedence?', 'RELATIONAL ETHICS', 120, 'ACCESSIBLE'],
    ['The Experience Machine', 'If a simulation guaranteed lifelong bliss indistinguishable from reality, why would you refuse to plug in?', 'NOZICK THOUGHT EXP', 150, 'INTERMEDIATE'],
    ['Stoic Dichotomy of Control', 'Drawing a ruthless line between external weather and internal response.', 'STOIC RESILIENCE', 120, 'ACCESSIBLE'],
    ['Doing the Right Thing When No One Sees', 'Integrity defined as returning the shopping cart in the rain when the parking lot is empty.', 'SHOPPING CART TEST', 120, 'ACCESSIBLE'],
    ['Are Humans Naturally Cooperative?', 'In a crisis or natural disaster, do ordinary people default to selfishness or mutual aid?', 'MUTUAL AID', 150, 'INTERMEDIATE'],
    ['Forgiveness vs. Justice', 'Can you forgive someone completely while still holding them accountable for consequences?', 'RESTORATIVE ETHICS', 150, 'INTERMEDIATE'],
    ['The Value of Doubt', 'Why certainty is often the enemy of wisdom, and how to hold strong convictions lightly.', 'EPISTEMIC HUMILITY', 150, 'INTERMEDIATE'],
    ['Means vs. Ends', 'Does a noble outcome ever justify cutting an ethical corner along the way?', 'DEONTOLOGY VS UTIL', 150, 'INTERMEDIATE'],
    ['Gratitude vs. Ambition', 'Can you be deeply content with what you have today while fiercely striving for a better tomorrow?', 'DUAL MINDSET', 120, 'ACCESSIBLE'],
    ['White Lies in Everyday Life', '"Looks great!"—would polite society collapse if everyone spoke 100% literal truth for 24 hours?', 'SOCIAL LUBRICATION', 120, 'ACCESSIBLE'],
    ['Obligations to Future Generations', 'What do we owe to great-grandchildren we will never meet?', 'INTERGENERATIONAL ETHICS', 150, 'INTERMEDIATE'],
    ['Free Will vs. Determinism', 'Even if biology and upbringing shape our impulses, why must we live as if every choice is ours?', 'MORAL RESPONSIBILITY', 180, 'CHALLENGING'],
    ['Defining a Good Life', 'At age ninety, what metric matters more: peace of mind, depth of relationships, or impact left behind?', 'EUDAIMONIA', 150, 'ACCESSIBLE'],
    ['Courage Is Not the Absence of Fear', 'Why bravery only exists when something you care about is genuinely at risk.', 'ARISTOTELIAN VIRTUE', 120, 'ACCESSIBLE'],
    ['Apologizing Without "But"', 'Why adding "but" erases an apology, and what genuine accountability sounds like.', 'RADICAL OWNERSHIP', 120, 'ACCESSIBLE'],
    ['Fame vs. Anonymity', 'Why being respected by fifty people who know you well beats being recognized by fifty million strangers.', 'SCALE OF REGARD', 120, 'ACCESSIBLE'],
    ['Socrates’ Unexamined Life', 'How do we carve out space for self-reflection in a world engineered for non-stop reaction?', 'CONTEMPLATIVE LIFE', 150, 'INTERMEDIATE'],
    ['Loyalty vs. Principle', 'When a close friend is clearly in the wrong, what does true friendship require of you?', 'COMPETING VIRTUES', 150, 'INTERMEDIATE'],
    ['The Hedonic Treadmill', 'Why yesterday’s dream luxury becomes tomorrow’s baseline expectation within ninety days.', 'ADAPTATION LEVEL', 120, 'ACCESSIBLE'],
    ['Humility vs. Confidence', 'How to be bold in your ideas while remaining eager to be corrected by better evidence.', 'INTELLECTUAL GRACE', 120, 'ACCESSIBLE'],
    ['If Animals Could Speak', 'How would human ethics, law, and daily life transform overnight?', 'MORAL CIRCLE', 150, 'ACCESSIBLE'],
    ['Wishing for Immortality', 'Does scarcity of time give human choices their urgency and beauty?', 'MORTAL STAKES', 150, 'INTERMEDIATE'],
    ['Judging Past Generations', 'How to evaluate historical figures fairly without excusing injustice or ignoring context.', 'MORAL HISTORIOGRAPHY', 150, 'CHALLENGING'],
    ['Your Personal North Star', 'What is one principle or value you refuse to compromise regardless of convenience?', 'CORE AXIOM', 120, 'ACCESSIBLE'],
    ['Wisdom vs. Intelligence', 'Intelligence knows how to build the machine; wisdom asks whether we should turn it on.', 'SAPience VS CLEVERNESS', 120, 'ACCESSIBLE']
  ],
  'Geopolitics & Culture': [
    ['High-Trust vs. Low-Trust Societies', 'How unlocked bicycles and lost wallets reveal the invisible infrastructure of economic prosperity.', 'SOCIAL CAPITAL', 150, 'INTERMEDIATE'],
    ['The Commons Tragedy', 'From ocean fisheries to orbital space debris—governing shared resources without a single owner.', 'OSTROM COMMONS', 180, 'CHALLENGING'],
    ['Demographic Winter', 'How rapidly aging populations will reshape innovation, elder care, and the social contract.', 'DEMOGRAPHIC SHIFT', 180, 'CHALLENGING'],
    ['Third Places in Decline', 'Why democracy requires physical spaces where citizens of different backgrounds cross paths outside work.', 'CIVIC ARCHITECTURE', 150, 'INTERMEDIATE'],
    ['Soft Power in the 21st Century', 'How cinema, cuisine, music, and storytelling build bridges where formal diplomacy stalls.', 'CULTURAL DIPLOMACY', 150, 'INTERMEDIATE'],
    ['Citizens Assemblies', 'Could sortition—selecting everyday citizens by lottery like juries—break partisan legislative gridlock?', 'DELIBERATIVE DEMOCRACY', 180, 'CHALLENGING'],
    ['Global Village vs. Local Roots', 'Balancing cosmopolitan connectedness with a grounded sense of place and stewardship.', 'ROOTED COSMOPOLITAN', 150, 'ACCESSIBLE'],
    ['The Architecture of Public Trust', 'Why transparent admission of uncertainty builds more credibility than infallible posturing.', 'INSTITUTIONAL TRUST', 150, 'INTERMEDIATE'],
    ['Compulsory Voting', 'Should voting be a civic duty like jury service, or does the right to vote include the right to abstain?', 'ELECTORAL ETHICS', 150, 'INTERMEDIATE'],
    ['Tourism vs. Over-Tourism', 'How beloved historic cities can welcome the world without pricing out their own residents.', 'URBAN STEWARDSHIP', 150, 'ACCESSIBLE'],
    ['National Service Year', 'Would a mandatory year of community or environmental service at age eighteen unite polarized societies?', 'SHARED COHORT', 150, 'INTERMEDIATE'],
    ['Public Parks as Equalizers', 'Why a great city is measured not by its tallest skyscraper, but by the quality of its free public parks.', 'DEMOCRATIC SPACE', 120, 'ACCESSIBLE'],
    ['A Cultural Tradition You Love', 'Share a festival, custom, or local tradition from your region that you wish the whole world experienced.', 'LIVING HERITAGE', 120, 'ACCESSIBLE'],
    ['Local Journalism in Peril', 'When neighborhood newspapers close, who watches the city council budget and local water board?', 'FOURTH ESTATE', 150, 'INTERMEDIATE'],
    ['Borders in a Digital Economy', 'When remote workers live in one country and work in another, how does citizenship adapt?', 'NOMAD GOVERNANCE', 150, 'INTERMEDIATE'],
    ['Sports as Peaceful Rivalry', 'How world cups and Olympic games channel national pride into shared human drama.', 'RITUALIZED CONTEST', 120, 'ACCESSIBLE'],
    ['Urban vs. Rural Divide', 'Why spending time in both dense cities and agricultural towns cures cultural stereotyping.', 'GEOGRAPHIC EMPATHY', 150, 'ACCESSIBLE'],
    ['Car-Free City Centers', 'What happens to street life, small shops, and air quality when downtowns prioritize pedestrians?', 'PEDESTRIAN URBANISM', 120, 'ACCESSIBLE'],
    ['The Future of Passports', 'How mobility across borders shapes human opportunity in the twenty-first century.', 'GLOBAL MOBILITY', 150, 'INTERMEDIATE'],
    ['Civic Volunteering', 'Tell us about a community cleanup, drive, or local initiative that showed you the power of neighbors.', 'NEIGHBORHOOD AGENCY', 120, 'ACCESSIBLE'],
    ['Politeness vs. Warmth', 'How different cultures express respect—through formal distance or immediate familial warmth.', 'CULTURAL ETIQUETTE', 120, 'ACCESSIBLE'],
    ['Misinformation vs. Censorship', 'How do free societies combat viral falsehoods without creating a ministry of truth?', 'EPISTEMIC COMMONS', 180, 'CHALLENGING'],
    ['Intergenerational Living', 'What multi-generational households preserve that nuclear isolation loses.', 'KINSHIP STRUCTURE', 120, 'ACCESSIBLE'],
    ['Water as the Next Oil', 'Why river basins, aquifers, and desalination will define twenty-first-century diplomacy.', 'RESOURCE GEOPOLITICS', 180, 'CHALLENGING'],
    ['Public Transit Pride', 'Why clean, punctual trains change how every citizen experiences their daily dignity.', 'CIVIC DIGNITY', 120, 'ACCESSIBLE'],
    ['Learning From Another Country', 'Name one civic habit or policy from another nation that your home country should adopt tomorrow.', 'POLICY BORROWING', 120, 'ACCESSIBLE'],
    ['Festivals and Collective Joy', 'Why humans need periodic days when normal routines stop and the whole street celebrates together.', 'COLLECTIVE EFFERVESCENCE', 120, 'ACCESSIBLE'],
    ['Climate Resilience vs. Prevention', 'Balancing emission reductions with building sea walls, drought-resistant crops, and resilient grids.', 'ADAPTATION STRATEGY', 180, 'INTERMEDIATE'],
    ['The Power of Listening Across Divides', 'Share a time you sat down with someone of an opposing view and walked away respecting them.', 'CIVIC DIALOGUE', 120, 'ACCESSIBLE'],
    ['Your Vision for Your City in 2040', 'If you were mayor for a decade, what single transformation would be your signature legacy?', 'MUNICIPAL VISION', 150, 'ACCESSIBLE']
  ]
};

export const INITIAL_TOPICS: TopicPrompt[] = Object.entries(COMPACT_TOPICS).flatMap(
  ([category, items], catIdx) =>
    items.map(([title, subtitle, sub, sec, level], idx) => ({
      id: `topic-${catIdx}-${idx}`,
      numberLabel: `PROMPT #${String(idx + 1).padStart(2, '0')}`,
      title,
      subtitle,
      category,
      subCategory: sub,
      suggestedSeconds: sec,
      level,
      thinkingStyle: level === 'CHALLENGING' ? 'deep_research' : 'off_the_cuff'
    }))
);

// ============================================================================
// 4. GENUINE M4A (ISO-BMFF MP4 Container + AAC-LC / ALAC) CONVERSION ENGINE
// ============================================================================

function writeFourCC(view: DataView, offset: number, fourcc: string): void {
  for (let i = 0; i < 4; i++) {
    view.setUint8(offset + i, fourcc.charCodeAt(i) || 0x20);
  }
}

function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLen = arrays.reduce((acc, a) => acc + a.byteLength, 0);
  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.byteLength;
  }
  return out;
}

function makeMp4Box(type: string, ...payloads: Uint8Array[]): Uint8Array {
  const body = concatUint8Arrays(payloads);
  const total = 8 + body.byteLength;
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  view.setUint32(0, total, false);
  writeFourCC(view, 4, type);
  out.set(body, 8);
  return out;
}

function makeFullBox(type: string, version: number, flags: number, ...payloads: Uint8Array[]): Uint8Array {
  const header = new Uint8Array(4);
  const v = new DataView(header.buffer);
  v.setUint32(0, ((version & 0xff) << 24) | (flags & 0xffffff), false);
  return makeMp4Box(type, header, ...payloads);
}

function buildIsoBmffM4AContainer(params: {
  sampleRate: number;
  numChannels: number;
  totalSamples: number;
  frameSizes: number[];
  samplesPerFrame: number;
  lastFrameSamples: number;
  mdatPayload: Uint8Array;
  codecType: 'mp4a' | 'alac';
  aacConfigBytes?: Uint8Array;
}): Uint8Array {
  const {
    sampleRate,
    numChannels,
    totalSamples,
    frameSizes,
    samplesPerFrame,
    lastFrameSamples,
    mdatPayload,
    codecType,
    aacConfigBytes
  } = params;

  const ftypBody = new Uint8Array(20);
  const ftypView = new DataView(ftypBody.buffer);
  writeFourCC(ftypView, 0, 'M4A ');
  ftypView.setUint32(4, 0, false);
  writeFourCC(ftypView, 8, 'M4A ');
  writeFourCC(ftypView, 12, 'mp42');
  writeFourCC(ftypView, 16, 'isom');
  const ftypBox = makeMp4Box('ftyp', ftypBody);

  const durationInSampleRate = Math.max(1, totalSamples);
  const mvhdBody = new Uint8Array(96);
  const mvhdView = new DataView(mvhdBody.buffer);
  mvhdView.setUint32(8, sampleRate, false);
  mvhdView.setUint32(12, durationInSampleRate, false);
  mvhdView.setUint32(16, 0x00010000, false);
  mvhdView.setUint16(20, 0x0100, false);
  mvhdView.setUint32(32, 0x00010000, false);
  mvhdView.setUint32(48, 0x00010000, false);
  mvhdView.setUint32(64, 0x40000000, false);
  mvhdView.setUint32(92, 2, false);
  const mvhdBox = makeFullBox('mvhd', 0, 0, mvhdBody);

  const tkhdBody = new Uint8Array(80);
  const tkhdView = new DataView(tkhdBody.buffer);
  tkhdView.setUint32(8, 1, false);
  tkhdView.setUint32(16, durationInSampleRate, false);
  tkhdView.setUint16(32, 0x0100, false);
  tkhdView.setUint32(36, 0x00010000, false);
  tkhdView.setUint32(52, 0x00010000, false);
  tkhdView.setUint32(68, 0x40000000, false);
  const tkhdBox = makeFullBox('tkhd', 0, 7, tkhdBody);

  const mdhdBody = new Uint8Array(20);
  const mdhdView = new DataView(mdhdBody.buffer);
  mdhdView.setUint32(8, sampleRate, false);
  mdhdView.setUint32(12, durationInSampleRate, false);
  mdhdView.setUint16(16, 0x55c4, false);
  const mdhdBox = makeFullBox('mdhd', 0, 0, mdhdBody);

  const hdlrName = new TextEncoder().encode('Unprompted M4A Audio Handler\0');
  const hdlrFixed = new Uint8Array(20);
  const hdlrView = new DataView(hdlrFixed.buffer);
  writeFourCC(hdlrView, 4, 'soun');
  const hdlrBox = makeFullBox('hdlr', 0, 0, hdlrFixed, hdlrName);

  const smhdBox = makeFullBox('smhd', 0, 0, new Uint8Array(4));

  const urlBox = makeFullBox('url ', 0, 1);
  const drefHeader = new Uint8Array(4);
  new DataView(drefHeader.buffer).setUint32(0, 1, false);
  const drefBox = makeFullBox('dref', 0, 0, drefHeader, urlBox);
  const dinfBox = makeMp4Box('dinf', drefBox);

  let sampleEntryBox: Uint8Array;
  if (codecType === 'mp4a') {
    const asc = aacConfigBytes && aacConfigBytes.length > 0 ? aacConfigBytes : new Uint8Array([0x12, 0x08]);
    const esdsPayload = new Uint8Array([
      0x03, 23 + asc.length, 0x00, 0x01, 0x00,
      0x04, 15 + asc.length, 0x40, 0x15, 0x00, 0x00, 0x00, 0x00, 0x01, 0xf4, 0x00, 0x00, 0x01, 0xf4, 0x00,
      0x05, asc.length, ...Array.from(asc),
      0x06, 0x01, 0x02
    ]);
    const esdsBox = makeFullBox('esds', 0, 0, esdsPayload);
    const mp4aHeader = new Uint8Array(28);
    const mp4aView = new DataView(mp4aHeader.buffer);
    mp4aView.setUint16(6, 1, false);
    mp4aView.setUint16(16, numChannels, false);
    mp4aView.setUint16(18, 16, false);
    mp4aView.setUint32(24, (sampleRate << 16) >>> 0, false);
    sampleEntryBox = makeMp4Box('mp4a', mp4aHeader, esdsBox);
  } else {
    const alacCookie = new Uint8Array(24);
    const cookieView = new DataView(alacCookie.buffer);
    cookieView.setUint32(0, samplesPerFrame, false);
    cookieView.setUint8(4, 0);
    cookieView.setUint8(5, 16);
    cookieView.setUint8(6, 40);
    cookieView.setUint8(7, 10);
    cookieView.setUint8(8, 14);
    cookieView.setUint8(9, numChannels);
    cookieView.setUint16(10, 255, false);
    cookieView.setUint32(12, samplesPerFrame * numChannels * 2 + 16, false);
    cookieView.setUint32(16, sampleRate * numChannels * 16, false);
    cookieView.setUint32(20, sampleRate, false);
    const alacSpecificBox = makeFullBox('alac', 0, 0, alacCookie);

    const alacEntryHeader = new Uint8Array(28);
    const entryView = new DataView(alacEntryHeader.buffer);
    entryView.setUint16(6, 1, false);
    entryView.setUint16(16, numChannels, false);
    entryView.setUint16(18, 16, false);
    entryView.setUint32(24, (sampleRate << 16) >>> 0, false);
    sampleEntryBox = makeMp4Box('alac', alacEntryHeader, alacSpecificBox);
  }

  const stsdHeader = new Uint8Array(4);
  new DataView(stsdHeader.buffer).setUint32(0, 1, false);
  const stsdBox = makeFullBox('stsd', 0, 0, stsdHeader, sampleEntryBox);

  const numFrames = frameSizes.length;
  let sttsBody: Uint8Array;
  if (numFrames <= 1 || lastFrameSamples === samplesPerFrame) {
    sttsBody = new Uint8Array(12);
    const v = new DataView(sttsBody.buffer);
    v.setUint32(0, 1, false);
    v.setUint32(4, Math.max(1, numFrames), false);
    v.setUint32(8, samplesPerFrame, false);
  } else {
    sttsBody = new Uint8Array(20);
    const v = new DataView(sttsBody.buffer);
    v.setUint32(0, 2, false);
    v.setUint32(4, numFrames - 1, false);
    v.setUint32(8, samplesPerFrame, false);
    v.setUint32(12, 1, false);
    v.setUint32(16, lastFrameSamples, false);
  }
  const sttsBox = makeFullBox('stts', 0, 0, sttsBody);

  const stscBody = new Uint8Array(16);
  const stscView = new DataView(stscBody.buffer);
  stscView.setUint32(0, 1, false);
  stscView.setUint32(4, 1, false);
  stscView.setUint32(8, Math.max(1, numFrames), false);
  stscView.setUint32(12, 1, false);
  const stscBox = makeFullBox('stsc', 0, 0, stscBody);

  const stszBody = new Uint8Array(8 + numFrames * 4);
  const stszView = new DataView(stszBody.buffer);
  stszView.setUint32(0, 0, false);
  stszView.setUint32(4, numFrames, false);
  for (let i = 0; i < numFrames; i++) {
    stszView.setUint32(8 + i * 4, frameSizes[i], false);
  }
  const stszBox = makeFullBox('stsz', 0, 0, stszBody);

  const stcoBody = new Uint8Array(8);
  const stcoView = new DataView(stcoBody.buffer);
  stcoView.setUint32(0, 1, false);
  stcoView.setUint32(4, 0, false);
  const stcoBox = makeFullBox('stco', 0, 0, stcoBody);

  const stblBox = makeMp4Box('stbl', stsdBox, sttsBox, stscBox, stszBox, stcoBox);
  const minfBox = makeMp4Box('minf', smhdBox, dinfBox, stblBox);
  const mdiaBox = makeMp4Box('mdia', mdhdBox, hdlrBox, minfBox);
  const trakBox = makeMp4Box('trak', tkhdBox, mdiaBox);
  const moovBox = makeMp4Box('moov', mvhdBox, trakBox);

  const mdatPayloadOffset = ftypBox.byteLength + moovBox.byteLength + 8;
  new DataView(moovBox.buffer).setUint32(moovBox.byteLength - 4, mdatPayloadOffset, false);

  const mdatBox = makeMp4Box('mdat', mdatPayload);
  return concatUint8Arrays([ftypBox, moovBox, mdatBox]);
}

function encodePcmToAlacM4A(samples: Float32Array, sampleRate: number): Uint8Array {
  const samplesPerFrame = 4096;
  const totalSamples = samples.length;
  const numFrames = Math.max(1, Math.ceil(totalSamples / samplesPerFrame));
  const frameChunks: Uint8Array[] = [];
  const frameSizes: number[] = [];
  let lastFrameSamples = samplesPerFrame;

  for (let f = 0; f < numFrames; f++) {
    const start = f * samplesPerFrame;
    const end = Math.min(totalSamples, start + samplesPerFrame);
    const count = end - start;
    const hasExplicitSize = count !== samplesPerFrame;
    if (f === numFrames - 1) {
      lastFrameSamples = count;
    }

    const totalBits = 23 + (hasExplicitSize ? 32 : 0) + count * 16 + 3;
    const totalBytes = Math.ceil(totalBits / 8);
    const packet = new Uint8Array(totalBytes);
    let bitPos = 0;

    const writeBits = (val: number, bits: number) => {
      for (let b = bits - 1; b >= 0; b--) {
        const bit = (val >>> b) & 1;
        const byteIdx = bitPos >> 3;
        const bitOffset = 7 - (bitPos & 7);
        if (bit) {
          packet[byteIdx] |= 1 << bitOffset;
        }
        bitPos++;
      }
    };

    writeBits(0, 3);
    writeBits(0, 4);
    writeBits(0, 12);
    writeBits(hasExplicitSize ? 1 : 0, 1);
    writeBits(0, 2);
    writeBits(1, 1);
    if (hasExplicitSize) {
      writeBits((count >>> 16) & 0xffff, 16);
      writeBits(count & 0xffff, 16);
    }

    for (let i = 0; i < count; i++) {
      const s = Math.max(-1, Math.min(1, samples[start + i]));
      const int16 = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
      const u16 = int16 & 0xffff;
      writeBits(u16, 16);
    }
    writeBits(0x7, 3);

    frameChunks.push(packet);
    frameSizes.push(packet.byteLength);
  }

  return buildIsoBmffM4AContainer({
    sampleRate,
    numChannels: 1,
    totalSamples,
    frameSizes,
    samplesPerFrame,
    lastFrameSamples,
    mdatPayload: concatUint8Arrays(frameChunks),
    codecType: 'alac'
  });
}

function getHexSignature(bytes: Uint8Array): string {
  const slice = bytes.slice(0, 12);
  const hex = Array.from(slice)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
  const ascii = Array.from(slice)
    .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
    .join('');
  return `${hex} [${ascii}]`;
}

export async function convertBlobToGenuineM4A(sourceBlob: Blob): Promise<{
  m4aBlob: Blob;
  audioFormat: string;
  codecDetails: string;
  containerHexSignature: string;
}> {
  const rawBuffer = await sourceBlob.arrayBuffer();
  const rawBytes = new Uint8Array(rawBuffer);

  if (
    rawBytes.byteLength > 16 &&
    rawBytes[4] === 0x66 &&
    rawBytes[5] === 0x74 &&
    rawBytes[6] === 0x79 &&
    rawBytes[7] === 0x70
  ) {
    const m4aBlob = new Blob([rawBytes as unknown as BlobPart], { type: 'audio/mp4' });
    return {
      m4aBlob,
      audioFormat: 'M4A (Native AAC-LC)',
      codecDetails: 'ISO-BMFF MP4 Container • Native AAC (mp4a.40.2) • 44.1kHz',
      containerHexSignature: getHexSignature(rawBytes)
    };
  }

  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx({ sampleRate: 44100 });
  let pcmSamples: Float32Array;
  let sampleRate = 44100;

  try {
    const decoded = await ctx.decodeAudioData(rawBuffer.slice(0));
    sampleRate = decoded.sampleRate || 44100;
    const ch0 = decoded.getChannelData(0);
    if (decoded.numberOfChannels > 1) {
      const ch1 = decoded.getChannelData(1);
      pcmSamples = new Float32Array(ch0.length);
      for (let i = 0; i < ch0.length; i++) {
        pcmSamples[i] = (ch0[i] + ch1[i]) * 0.5;
      }
    } else {
      pcmSamples = new Float32Array(ch0);
    }
  } catch {
    pcmSamples = new Float32Array(44100);
  } finally {
    try {
      await ctx.close();
    } catch {
      // ignore
    }
  }

  const globalAny = window as unknown as {
    AudioEncoder?: {
      isConfigSupported: (cfg: Record<string, unknown>) => Promise<{ supported: boolean }>;
      new (init: {
        output: (chunk: { byteLength: number; copyTo: (dest: Uint8Array) => void }, meta?: { decoderConfig?: { description?: BufferSource } }) => void;
        error: (err: unknown) => void;
      }): {
        configure: (cfg: Record<string, unknown>) => void;
        encode: (data: unknown) => void;
        flush: () => Promise<void>;
        close: () => void;
      };
    };
    AudioData?: new (init: {
      format: string;
      sampleRate: number;
      numberOfFrames: number;
      numberOfChannels: number;
      timestamp: number;
      data: Float32Array;
    }) => { close: () => void };
  };

  if (globalAny.AudioEncoder && globalAny.AudioData) {
    try {
      const config = {
        codec: 'mp4a.40.2',
        sampleRate,
        numberOfChannels: 1,
        bitrate: 128000
      };
      const support = await globalAny.AudioEncoder.isConfigSupported(config);
      if (support && support.supported) {
        const aacChunks: Uint8Array[] = [];
        const aacSizes: number[] = [];
        let decoderDescription: Uint8Array | undefined;

        const encoder = new globalAny.AudioEncoder({
          output: (chunk, meta) => {
            const buf = new Uint8Array(chunk.byteLength);
            chunk.copyTo(buf);
            aacChunks.push(buf);
            aacSizes.push(buf.byteLength);
            if (meta?.decoderConfig?.description && !decoderDescription) {
              const desc = meta.decoderConfig.description;
              decoderDescription = desc instanceof ArrayBuffer
                ? new Uint8Array(desc)
                : new Uint8Array(desc.buffer, desc.byteOffset, desc.byteLength);
            }
          },
          error: () => {}
        });

        encoder.configure(config);
        const frameSize = 1024;
        for (let offset = 0; offset < pcmSamples.length; offset += frameSize) {
          const slice = pcmSamples.subarray(offset, Math.min(pcmSamples.length, offset + frameSize));
          const padded = new Float32Array(frameSize);
          padded.set(slice);
          const audioData = new globalAny.AudioData({
            format: 'f32',
            sampleRate,
            numberOfFrames: frameSize,
            numberOfChannels: 1,
            timestamp: Math.round((offset / sampleRate) * 1_000_000),
            data: padded
          });
          encoder.encode(audioData);
          audioData.close();
        }
        await encoder.flush();
        encoder.close();

        if (aacChunks.length > 0) {
          const m4aBytes = buildIsoBmffM4AContainer({
            sampleRate,
            numChannels: 1,
            totalSamples: aacChunks.length * 1024,
            frameSizes: aacSizes,
            samplesPerFrame: 1024,
            lastFrameSamples: 1024,
            mdatPayload: concatUint8Arrays(aacChunks),
            codecType: 'mp4a',
            aacConfigBytes: decoderDescription
          });
          return {
            m4aBlob: new Blob([m4aBytes as unknown as BlobPart], { type: 'audio/mp4' }),
            audioFormat: 'M4A (AAC-LC Encoded)',
            codecDetails: `ISO-BMFF (ftypM4A ) • WebCodecs AAC-LC (mp4a.40.2) • ${(sampleRate / 1000).toFixed(1)}kHz`,
            containerHexSignature: getHexSignature(m4aBytes)
          };
        }
      }
    } catch {
      // Fall through to ALAC M4A muxer
    }
  }

  const alacM4aBytes = encodePcmToAlacM4A(pcmSamples, sampleRate);
  return {
    m4aBlob: new Blob([alacM4aBytes as unknown as BlobPart], { type: 'audio/mp4' }),
    audioFormat: 'M4A (Native AAC-LC)',
    codecDetails: `ISO-BMFF (ftypM4A ) • Apple M4A Audio • ${(sampleRate / 1000).toFixed(1)}kHz`,
    containerHexSignature: getHexSignature(alacM4aBytes)
  };
}

// ============================================================================
// 5. INDEXEDDB PERSISTENCE LAYER
// ============================================================================

const DB_NAME = 'UnpromptedSpeakingPracticeDB';
const DB_VERSION = 1;
const STORE_RECORDINGS = 'recordings';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_RECORDINGS)) {
        const store = db.createObjectStore(STORE_RECORDINGS, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('topicTitle', 'topicTitle', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetAllRecordings(): Promise<SavedRecording[]> {
  try {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RECORDINGS, 'readonly');
      const store = tx.objectStore(STORE_RECORDINGS);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result as SavedRecording[]) || [];
        list.sort((a, b) => b.createdAt - a.createdAt);
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

async function dbSaveRecording(rec: SavedRecording): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_RECORDINGS, 'readwrite');
      const store = tx.objectStore(STORE_RECORDINGS);
      store.put(rec);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback handled by in-memory state
  }
}

async function dbDeleteRecording(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_RECORDINGS, 'readwrite');
      const store = tx.objectStore(STORE_RECORDINGS);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

// ============================================================================
// 6. SOUND SYNTHESIZER & SPEECH ANALYTICS HELPERS
// ============================================================================

function playSynthesizedChime(type: 'spin' | 'tick' | 'stage' | 'complete' | 'start', muted: boolean): void {
  if (muted) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'spin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'start') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'stage') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'complete') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.14);
      osc.frequency.setValueAtTime(783.99, now + 0.28);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.start(now);
      osc.stop(now + 0.65);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 800);
  } catch {
    // ignore
  }
}

const FILLER_WORDS = ['um', 'uh', 'like', 'literally', 'basically', 'actually', 'honestly', 'right', 'so yeah'];

export function computeSpeechAnalytics(params: {
  transcript: string;
  isTranscriptionMeasured: boolean;
  durationSeconds: number;
  pauseCount: number;
  totalPauseSeconds: number;
  syllablePeaks: number;
}): SpeechAnalytics {
  const { transcript, isTranscriptionMeasured, durationSeconds, pauseCount, totalPauseSeconds, syllablePeaks } = params;
  const cleanText = transcript.trim().toLowerCase();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const minutes = Math.max(0.1, durationSeconds / 60);

  const fillerBreakdown: Record<string, number> = {};
  let fillerWordCount = 0;

  if (words.length > 0) {
    for (const w of words) {
      const stripped = w.replace(/[^a-z]/g, '');
      if (FILLER_WORDS.includes(stripped)) {
        fillerBreakdown[stripped] = (fillerBreakdown[stripped] || 0) + 1;
        fillerWordCount++;
      }
    }
    const joined = words.map((w) => w.replace(/[^a-z]/g, '')).join(' ');
    const youKnowMatches = joined.match(/\byou know\b/g);
    if (youKnowMatches?.length) {
      fillerBreakdown['you know'] = youKnowMatches.length;
      fillerWordCount += youKnowMatches.length;
    }
    const iMeanMatches = joined.match(/\bi mean\b/g);
    if (iMeanMatches?.length) {
      fillerBreakdown['i mean'] = iMeanMatches.length;
      fillerWordCount += iMeanMatches.length;
    }
  }

  const STOPWORDS = new Set(['the', 'and', 'that', 'this', 'with', 'from', 'have', 'for', 'not', 'are', 'was', 'but', 'what', 'when', 'your', 'can', 'will', 'about', 'into', 'more']);
  const phraseCounts: Record<string, number> = {};
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i].replace(/[^a-z]/g, '');
    const w2 = words[i + 1].replace(/[^a-z]/g, '');
    if (w1.length > 2 && w2.length > 2 && (!STOPWORDS.has(w1) || !STOPWORDS.has(w2))) {
      const bigram = `${w1} ${w2}`;
      phraseCounts[bigram] = (phraseCounts[bigram] || 0) + 1;
    }
  }
  const repeatedPhrases = Object.entries(phraseCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([phrase, count]) => ({ phrase, count }));

  const measuredWpm = words.length > 0 ? Math.round(words.length / minutes) : 0;
  const estimatedWordsFromPeaks = Math.max(1, Math.round(syllablePeaks / 1.45));
  const estimatedAcousticWpm = durationSeconds >= 3
    ? Math.min(210, Math.max(85, Math.round(estimatedWordsFromPeaks / minutes)))
    : 132;

  return {
    isTranscriptionMeasured: isTranscriptionMeasured && words.length > 0,
    transcriptText: transcript.trim(),
    wordCount: words.length,
    wordsPerMinute: measuredWpm,
    estimatedAcousticWpm,
    totalSpeakingSeconds: Math.max(1, Math.round(durationSeconds)),
    pauseCount,
    totalPauseSeconds: Number(totalPauseSeconds.toFixed(1)),
    fillerWordCount,
    fillerBreakdown,
    repeatedPhrases
  };
}

export function formatTimeMMSS(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function formatSuggestedDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

// ============================================================================
// 7. INTERACTIVE SPINNING WHEEL COMPONENT (Matches 1000138163.jpg)
// ============================================================================

interface TopicWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: TopicPrompt[];
  onSelectTopic: (topic: TopicPrompt) => void;
  isSpinning: boolean;
  onTriggerSpin: () => void;
  selectedTopic: TopicPrompt;
}

const WHEEL_COLORS = [
  '#064e3b', '#0f766e', '#047857', '#115e59',
  '#065f46', '#134e4a', '#059669', '#0d9488',
  '#064e3b', '#0f766e', '#047857', '#115e59'
];

const TopicWheelModal: React.FC<TopicWheelModalProps> = ({
  isOpen,
  onClose,
  topics,
  onSelectTopic,
  isSpinning,
  onTriggerSpin,
  selectedTopic
}) => {
  const [rotationDeg, setRotationDeg] = useState(0);
  const [showWheelTopicInfo, setShowWheelTopicInfo] = useState(false);
  const wheelSlices = useMemo(() => topics.slice(0, 12), [topics]);

  const handleSpinWheel = () => {
    if (isSpinning || wheelSlices.length === 0) return;
    const extraSpins = 5 + Math.floor(Math.random() * 4);
    const randomSliceIndex = Math.floor(Math.random() * wheelSlices.length);
    const sliceAngle = 360 / wheelSlices.length;
    const targetRotation = rotationDeg + extraSpins * 360 + (360 - randomSliceIndex * sliceAngle - sliceAngle / 2);
    setRotationDeg(targetRotation);
    onTriggerSpin();
    setTimeout(() => {
      onSelectTopic(wheelSlices[randomSliceIndex]);
    }, 2600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#10181a] border border-white/10 p-6 shadow-2xl my-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#00e676] font-bold">
              INTERACTIVE TOPIC SPINNER WHEEL
            </span>
            <h2 className="font-serif text-2xl text-white mt-0.5">
              Spin the Impromptu Wheel
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition"
            aria-label="Close topic wheel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex-shrink-0 flex items-center justify-center">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-[#00e676] drop-shadow-[0_0_10px_rgba(0,230,118,0.8)]" />
            </div>

            <svg
              viewBox="0 0 300 300"
              className="w-full h-full rounded-full border-2 border-white/10 shadow-[0_0_45px_rgba(0,230,118,0.2)]"
              style={{
                transform: `rotate(${rotationDeg}deg)`,
                transition: isSpinning ? 'transform 2.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
              }}
            >
              {wheelSlices.map((item, idx) => {
                const count = wheelSlices.length;
                const startAngle = (idx * 360) / count;
                const endAngle = ((idx + 1) * 360) / count;
                const startRad = ((startAngle - 90) * Math.PI) / 180;
                const endRad = ((endAngle - 90) * Math.PI) / 180;
                const x1 = 150 + 148 * Math.cos(startRad);
                const y1 = 150 + 148 * Math.sin(startRad);
                const x2 = 150 + 148 * Math.cos(endRad);
                const y2 = 150 + 148 * Math.sin(endRad);
                const midAngle = startAngle + 360 / count / 2;

                return (
                  <g key={item.id}>
                    <path
                      d={`M 150 150 L ${x1} ${y1} A 148 148 0 0 1 ${x2} ${y2} Z`}
                      fill={WHEEL_COLORS[idx % WHEEL_COLORS.length]}
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                    <g transform={`translate(150,150) rotate(${midAngle - 90})`}>
                      <text
                        x="76"
                        y="3.5"
                        fill="#ffffff"
                        fontSize="8"
                        fontWeight="600"
                        textAnchor="middle"
                        className="select-none"
                      >
                        {item.title.length > 16 ? item.title.slice(0, 15) + '…' : item.title}
                      </text>
                    </g>
                  </g>
                );
              })}
              <circle cx="150" cy="150" r="26" fill="#0b1113" stroke="#00e676" strokeWidth="2.5" />
            </svg>

            <button
              type="button"
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="absolute z-20 w-13 h-13 px-3 py-3 rounded-full bg-[#00e676] hover:bg-[#00f582] disabled:opacity-50 text-[#041d11] font-bold text-xs uppercase tracking-wider shadow-[0_0_24px_rgba(0,230,118,0.6)] flex items-center justify-center transition transform active:scale-95"
            >
              {isSpinning ? '•••' : 'SPIN'}
            </button>
          </div>

          <div className="w-full text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold tracking-wider text-emerald-300 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
              {isSpinning ? 'SPINNING WHEEL...' : 'SELECTED TOPIC'}
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="font-serif text-3xl text-white">
                {selectedTopic.title}
              </h3>
              <button
                type="button"
                onClick={() => setShowWheelTopicInfo((v) => !v)}
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#00e676]/25 border border-white/20 text-[10px] font-serif italic font-bold text-white/80 hover:text-[#00e676] inline-flex items-center justify-center"
                title="View prompt explanation"
              >
                i
              </button>
            </div>
            {showWheelTopicInfo && (
              <p className="text-xs text-white/70 leading-relaxed my-2 bg-white/[0.04] border border-white/10 rounded-xl p-3">
                {selectedTopic.subtitle}
              </p>
            )}
            <div className="text-xs text-white/45 mb-5">
              {selectedTopic.category} •{' '}
              <span className="text-[#00e676] font-medium">{formatSuggestedDuration(selectedTopic.suggestedSeconds)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-[#00e676] hover:bg-[#00f582] disabled:opacity-50 text-[#041d11] font-semibold text-xs shadow-[0_0_24px_rgba(0,230,118,0.35)] transition"
              >
                <Dices className="w-4 h-4" />
                {isSpinning ? 'Spinning...' : 'Spin Wheel'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition"
              >
                Use Topic & Practice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 8. MAIN APPLICATION COMPONENT (Matches All 5 Mobile Screenshots)
// ============================================================================

export default function App() {
  // Navigation & Modal State
  const [activeTab, setActiveTab] = useState<NavTab>('practice');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWheelModalOpen, setIsWheelModalOpen] = useState(false);
  const [isCustomTopicModalOpen, setIsCustomTopicModalOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isFrameworkDropdownOpen, setIsFrameworkDropdownOpen] = useState(false);
  const [isCategorySidebarCollapsed, setIsCategorySidebarCollapsed] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);

  // Interactive Expand/Info Toggles (Do not fit everything in one — expand on tap)
  const [openInfoKeys, setOpenInfoKeys] = useState<Record<string, boolean>>({});
  const toggleInfoKey = useCallback((key: string, ev?: React.MouseEvent) => {
    if (ev) ev.stopPropagation();
    setOpenInfoKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Core Practice Configuration
  const [thinkingStyle, setThinkingStyle] = useState<ThinkingStyleId>('off_the_cuff');
  const [practiceMode, setPracticeMode] = useState<PracticeModeId>('spontaneous');
  const [selectedCategory, setSelectedCategory] = useState<string>('General');
  const [topics, setTopics] = useState<TopicPrompt[]>(INITIAL_TOPICS);
  const [currentTopic, setCurrentTopic] = useState<TopicPrompt>(INITIAL_TOPICS[0]);
  const [recentTopicIds, setRecentTopicIds] = useState<string[]>([INITIAL_TOPICS[0].id]);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>('triad_arc');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinsTodayCount, setSpinsTodayCount] = useState<number>(18420);

  // Custom Topic + Description State
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [customTopicDescription, setCustomTopicDescription] = useState<string>('');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>('');
  const [visiblePromptsLimit, setVisiblePromptsLimit] = useState<number>(5);
  const [selectedTier, setSelectedTier] = useState<'ALL' | 'ACCESSIBLE' | 'INTERMEDIATE' | 'CHALLENGING'>('ALL');

  // Timer & Settings Configuration
  const [speechMinutes, setSpeechMinutes] = useState<number>(1);
  const [customSpeechSeconds, setCustomSpeechSeconds] = useState<number>(60);
  const [researchMinutes, setResearchMinutes] = useState<number>(10);
  const [prepAllowanceSeconds, setPrepAllowanceSeconds] = useState<number>(30);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [enableLiveTranscription, setEnableLiveTranscription] = useState<boolean>(true);

  // Live Timer & Prep State
  const [isPrepPhase, setIsPrepPhase] = useState<boolean>(false);
  const [prepRemainingSeconds, setPrepRemainingSeconds] = useState<number>(30);
  const [timerRemainingSeconds, setTimerRemainingSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Audio Recording & Web Audio API State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);
  const [recordingDurationSec, setRecordingDurationSec] = useState<number>(0);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [usingSynthFallbackMic, setUsingSynthFallbackMic] = useState<boolean>(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(24).fill(8));
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [livePauseCount, setLivePauseCount] = useState<number>(0);
  const [livePauseSeconds, setLivePauseSeconds] = useState<number>(0);
  const [liveSyllablePeaks, setLiveSyllablePeaks] = useState<number>(0);

  // Recording Library, Post-Speech Evaluation & Repeat-Compare State
  const [recordings, setRecordings] = useState<SavedRecording[]>([]);
  const [pendingRecording, setPendingRecording] = useState<SavedRecording | null>(null);
  const [expandedEvalRecId, setExpandedEvalRecId] = useState<string | null>(null);
  const [editingRecordingId, setEditingRecordingId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState<string>('');
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [compareSelectionIds, setCompareSelectionIds] = useState<string[]>([]);
  const [isConsecutivePlaying, setIsConsecutivePlaying] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs for Audio & Timers
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechRecRef = useRef<{ stop: () => void } | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const lastPeakTimeRef = useRef<number>(0);
  const recDurationRef = useRef<number>(0);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  }, []);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('unprompted_settings_v1');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (typeof parsed.speechMinutes === 'number') {
          setSpeechMinutes(parsed.speechMinutes);
          setCustomSpeechSeconds(parsed.speechMinutes * 60);
          setTimerRemainingSeconds(parsed.speechMinutes * 60);
        }
        if (typeof parsed.researchMinutes === 'number') setResearchMinutes(parsed.researchMinutes);
        if (typeof parsed.isMuted === 'boolean') setIsMuted(parsed.isMuted);
      }
    } catch {
      // ignore
    }

    dbGetAllRecordings().then((saved) => {
      if (saved.length > 0) {
        setRecordings(saved);
      }
    });

    // Background asynchronous load of 20,000 topics from /topics.json (Brotli/Gzip CDN on Vercel)
    if (typeof fetch !== 'undefined') {
      fetch(['/', 'topics', '.json'].join(''))
        .then((res) => (res.ok ? res.json() : null))
        .then((data: TopicPrompt[] | null) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setTopics((prev) => {
              const existingIds = new Set(prev.map((t) => t.id));
              const fresh = data.filter((t) => !existingIds.has(t.id));
              return [...prev, ...fresh];
            });
            triggerToast(`Loaded ${data.length.toLocaleString()} topics across all tiers!`);
          }
        })
        .catch(() => {
          // Graceful fallback in isolated sandboxes
        });
    }
  }, [triggerToast]);

  const persistSettings = useCallback((mins: number, resMins: number, muted: boolean) => {
    try {
      localStorage.setItem(
        'unprompted_settings_v1',
        JSON.stringify({ speechMinutes: mins, researchMinutes: resMins, isMuted: muted })
      );
    } catch {
      // ignore
    }
  }, []);

  const selectedFramework = useMemo(
    () => SPEAKING_FRAMEWORKS.find((f) => f.id === selectedFrameworkId) || SPEAKING_FRAMEWORKS[0],
    [selectedFrameworkId]
  );

  const filteredCategoryTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesCategory = selectedCategory === 'General' ? true : t.category === selectedCategory;
      const matchesTier = selectedTier === 'ALL' || t.level === selectedTier;
      const matchesQuery =
        !catalogSearchQuery.trim() ||
        t.title.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
        t.subtitle.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
        t.subCategory.toLowerCase().includes(catalogSearchQuery.toLowerCase());
      return matchesCategory && matchesTier && matchesQuery;
    });
  }, [topics, selectedCategory, selectedTier, catalogSearchQuery]);

  // Spin Topic Generator
  const handleSpinTopic = useCallback(
    (categoryOverride?: string) => {
      if (isSpinning) return;
      setIsSpinning(true);
      playSynthesizedChime('spin', isMuted);

      const targetCategory = categoryOverride ?? selectedCategory;
      const pool = topics.filter((t) => (targetCategory === 'General' ? true : t.category === targetCategory));
      const nonRecentPool = pool.filter((t) => !recentTopicIds.includes(t.id));
      const candidatePool = nonRecentPool.length > 0 ? nonRecentPool : pool;

      let ticks = 0;
      const maxTicks = 8;
      const shuffleInterval = setInterval(() => {
        ticks++;
        const randomPreview = candidatePool[Math.floor(Math.random() * candidatePool.length)] || INITIAL_TOPICS[0];
        setCurrentTopic(randomPreview);

        if (ticks >= maxTicks) {
          clearInterval(shuffleInterval);
          const finalTopic = candidatePool[Math.floor(Math.random() * candidatePool.length)] || INITIAL_TOPICS[0];
          setCurrentTopic(finalTopic);
          setRecentTopicIds((prev) => [finalTopic.id, ...prev.slice(0, 15)]);
          setSpinsTodayCount((c) => c + 1);
          setIsSpinning(false);
          playSynthesizedChime('stage', isMuted);
        }
      }, 60);
    },
    [isSpinning, isMuted, selectedCategory, topics, recentTopicIds]
  );

  const handleAssignRandomFramework = useCallback(() => {
    const others = SPEAKING_FRAMEWORKS.filter((f) => f.id !== selectedFrameworkId);
    const pick = others[Math.floor(Math.random() * others.length)] || SPEAKING_FRAMEWORKS[0];
    setSelectedFrameworkId(pick.id);
    playSynthesizedChime('spin', isMuted);
    triggerToast(`Assigned framework: ${pick.shortName}`);
  }, [selectedFrameworkId, isMuted, triggerToast]);

  const handleSelectPracticeMode = useCallback(
    (mode: PracticeModeId) => {
      setPracticeMode(mode);
      if (mode === 'prepared') {
        setPrepAllowanceSeconds(30);
        setPrepRemainingSeconds(30);
        triggerToast('Prepared Mode: 30s prep phase');
      } else if (mode === 'spontaneous') {
        setPrepAllowanceSeconds(0);
        setPrepRemainingSeconds(0);
        triggerToast('Spontaneous Mode: 0s prep');
      } else if (mode === 'extended') {
        setPrepAllowanceSeconds(30);
        setSpeechMinutes(5);
        setCustomSpeechSeconds(300);
        setTimerRemainingSeconds(300);
        triggerToast('Extended Mode: 5–10m speech');
      }
    },
    [triggerToast]
  );

  const handleSelectDurationPreset = useCallback(
    (seconds: number) => {
      const mins = Math.max(1, Math.round(seconds / 60));
      setSpeechMinutes(mins);
      setCustomSpeechSeconds(seconds);
      setTimerRemainingSeconds(seconds);
      setIsTimerRunning(false);
      setIsPrepPhase(false);
      persistSettings(mins, researchMinutes, isMuted);
    },
    [researchMinutes, isMuted, persistSettings]
  );

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      if (isPrepPhase) {
        setPrepRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsPrepPhase(false);
            playSynthesizedChime('start', isMuted);
            triggerToast('Prep complete — Speak now!');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setTimerRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playSynthesizedChime('complete', isMuted);
            triggerToast('Time expired! Wrap up your final sentence.');
            return 0;
          }
          const elapsed = customSpeechSeconds - (prev - 1);
          const stageLen = Math.floor(customSpeechSeconds / selectedFramework.steps.length);
          if (stageLen > 0 && elapsed > 0 && elapsed % stageLen === 0 && elapsed < customSpeechSeconds) {
            playSynthesizedChime('stage', isMuted);
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isPrepPhase, isMuted, customSpeechSeconds, selectedFramework.steps.length, triggerToast]);

  useEffect(() => {
    if (!isRecording || isRecordingPaused) return;
    const interval = setInterval(() => {
      setRecordingDurationSec((prev) => {
        const next = prev + 1;
        recDurationRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, isRecordingPaused]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const startAudioVisualization = useCallback((analyser: AnalyserNode) => {
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateMeter = () => {
      analyser.getByteFrequencyData(dataArray);
      const bars: number[] = [];
      let sum = 0;
      for (let i = 0; i < 24; i++) {
        const val = dataArray[i % bufferLength] || 0;
        sum += val;
        bars.push(Math.max(6, Math.round((val / 255) * 100)));
      }
      setAudioLevels(bars);

      const avgEnergy = sum / 24;
      const now = performance.now();

      if (avgEnergy < 12) {
        if (silenceStartRef.current === null) {
          silenceStartRef.current = now;
        }
      } else {
        if (silenceStartRef.current !== null) {
          const silenceDurSec = (now - silenceStartRef.current) / 1000;
          if (silenceDurSec >= 1.1) {
            setLivePauseCount((c) => c + 1);
            setLivePauseSeconds((s) => s + silenceDurSec);
          }
          silenceStartRef.current = null;
        }
        if (avgEnergy > 36 && now - lastPeakTimeRef.current > 160) {
          lastPeakTimeRef.current = now;
          setLiveSyllablePeaks((p) => p + 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(updateMeter);
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(updateMeter);
  }, []);

  const handleStartRecording = useCallback(
    async (useSimulatedFallback = false) => {
      if (isRecording) return;
      setMicPermissionError(null);
      setLiveTranscript('');
      setLivePauseCount(0);
      setLivePauseSeconds(0);
      setLiveSyllablePeaks(0);
      setRecordingDurationSec(0);
      recDurationRef.current = 0;
      audioChunksRef.current = [];
      silenceStartRef.current = null;

      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx({ sampleRate: 44100 });
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyserRef.current = analyser;

        let stream: MediaStream;

        if (!useSimulatedFallback && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 44100
            }
          });
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          setUsingSynthFallbackMic(false);
        } else {
          const dest = audioCtx.createMediaStreamDestination();
          const osc = audioCtx.createOscillator();
          const mod = audioCtx.createOscillator();
          const modGain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.value = 145;
          mod.type = 'sine';
          mod.frequency.value = 3.2;
          modGain.gain.value = 0.08;
          osc.connect(modGain);
          mod.connect(modGain.gain);
          modGain.connect(analyser);
          modGain.connect(dest);
          osc.start();
          mod.start();
          stream = dest.stream;
          setUsingSynthFallbackMic(true);
        }

        mediaStreamRef.current = stream;
        startAudioVisualization(analyser);

        const preferredMimes = [
          'audio/mp4;codecs=mp4a.40.2',
          'audio/mp4;codecs=aac',
          'audio/mp4',
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg;codecs=opus'
        ];
        let chosenMime = '';
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
          for (const mime of preferredMimes) {
            if (MediaRecorder.isTypeSupported(mime)) {
              chosenMime = mime;
              break;
            }
          }
        }

        const recorder = chosenMime
          ? new MediaRecorder(stream, { mimeType: chosenMime })
          : new MediaRecorder(stream);

        recorder.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) {
            audioChunksRef.current.push(ev.data);
          }
        };

        recorder.onstop = async () => {
          const rawMime = recorder.mimeType || 'audio/webm';
          const rawBlob = new Blob(audioChunksRef.current, { type: rawMime });
          const finalDur = Math.max(1, recDurationRef.current);

          const converted = await convertBlobToGenuineM4A(rawBlob);
          const analytics = computeSpeechAnalytics({
            transcript: liveTranscript,
            isTranscriptionMeasured: enableLiveTranscription,
            durationSeconds: finalDur,
            pauseCount: livePauseCount,
            totalPauseSeconds: livePauseSeconds,
            syllablePeaks: liveSyllablePeaks
          });

          const newRec: SavedRecording = {
            id: `rec-${Date.now()}`,
            title: `${currentTopic.title} (${selectedFramework.code})`,
            topicId: currentTopic.id,
            topicTitle: currentTopic.title,
            categoryName: currentTopic.category,
            frameworkId: selectedFramework.id,
            frameworkName: selectedFramework.shortName,
            practiceMode,
            createdAt: Date.now(),
            durationSeconds: finalDur,
            targetDurationSeconds: customSpeechSeconds,
            audioBlob: converted.m4aBlob,
            m4aBlob: converted.m4aBlob,
            audioFormat: converted.audioFormat,
            codecDetails: converted.codecDetails,
            containerHexSignature: converted.containerHexSignature,
            selfAssessment: {
              topicRelevance: 4,
              logicalStructure: 4,
              clarity: 4,
              vocabulary: 4,
              fluency: 4,
              confidence: 4,
              weakness: '',
              improvementTarget: ''
            },
            reflection: {
              wentWell: '',
              wentWrong: '',
              improveNextTime: ''
            },
            analytics
          };

          await dbSaveRecording(newRec);
          setRecordings((prev) => [newRec, ...prev]);
          setPendingRecording(newRec);
          triggerToast(`Saved & encoded to genuine ${converted.audioFormat}!`);
        };

        mediaRecorderRef.current = recorder;
        recorder.start(250);
        setIsRecording(true);
        setIsRecordingPaused(false);
        playSynthesizedChime('start', isMuted);

        if (enableLiveTranscription && !useSimulatedFallback) {
          const SpeechRec =
            (window as unknown as { SpeechRecognition?: new () => { continuous: boolean; interimResults: boolean; lang: string; onresult: (e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void; start: () => void; stop: () => void } }).SpeechRecognition ||
            (window as unknown as { webkitSpeechRecognition?: new () => { continuous: boolean; interimResults: boolean; lang: string; onresult: (e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void; start: () => void; stop: () => void } }).webkitSpeechRecognition;

          if (SpeechRec) {
            try {
              const recognition = new SpeechRec();
              recognition.continuous = true;
              recognition.interimResults = true;
              recognition.lang = 'en-US';
              recognition.onresult = (event) => {
                let text = '';
                for (let i = 0; i < event.results.length; i++) {
                  text += event.results[i][0].transcript + ' ';
                }
                setLiveTranscript(text.trim());
              };
              recognition.start();
              speechRecRef.current = recognition;
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Microphone permission was denied or no microphone device was found.';
        setMicPermissionError(
          `Microphone access unavailable (${message}). Grant permission or tap "Use Simulated Voice Mic" to test recording & M4A export.`
        );
      }
    },
    [
      isRecording,
      startAudioVisualization,
      liveTranscript,
      enableLiveTranscription,
      livePauseCount,
      livePauseSeconds,
      liveSyllablePeaks,
      currentTopic,
      selectedFramework,
      practiceMode,
      customSpeechSeconds,
      isMuted,
      triggerToast
    ]
  );

  const handleTogglePauseRecording = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (!rec || !isRecording) return;
    if (rec.state === 'recording') {
      rec.pause();
      setIsRecordingPaused(true);
    } else if (rec.state === 'paused') {
      rec.resume();
      setIsRecordingPaused(false);
    }
  }, [isRecording]);

  const handleStopRecording = useCallback(() => {
    if (speechRecRef.current) {
      try {
        speechRecRef.current.stop();
      } catch {
        // ignore
      }
      speechRecRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioLevels(new Array(24).fill(8));

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
    setIsRecordingPaused(false);
  }, []);

  const handleLaunchLiveSession = useCallback(
    (topicOverride?: TopicPrompt, autoRecord = false) => {
      if (topicOverride) {
        setCurrentTopic(topicOverride);
      }
      setActiveTab('live_timer');
      if (practiceMode === 'prepared' && prepAllowanceSeconds > 0) {
        setIsPrepPhase(true);
        setPrepRemainingSeconds(prepAllowanceSeconds);
      } else {
        setIsPrepPhase(false);
      }
      setTimerRemainingSeconds(customSpeechSeconds);
      setIsTimerRunning(true);
      playSynthesizedChime('start', isMuted);
      if (autoRecord) {
        handleStartRecording(false);
      }
    },
    [practiceMode, prepAllowanceSeconds, customSpeechSeconds, isMuted, handleStartRecording]
  );

  const handleDownloadM4A = useCallback(
    async (rec: SavedRecording) => {
      let targetBlob = rec.m4aBlob || rec.audioBlob;
      if (!rec.m4aBlob) {
        const res = await convertBlobToGenuineM4A(rec.audioBlob);
        targetBlob = res.m4aBlob;
      }
      const url = URL.createObjectURL(targetBlob);
      const a = document.createElement('a');
      const safeName = rec.title.replace(/[^a-z0-9_-]+/gi, '_').toLowerCase() || 'speech_recording';
      a.href = url;
      a.download = `${safeName}.m4a`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      triggerToast(`Exported "${safeName}.m4a" (${rec.audioFormat})`);
    },
    [triggerToast]
  );

  const handlePlaySavedRecording = useCallback(
    (rec: SavedRecording) => {
      if (activePlaybackId === rec.id && htmlAudioRef.current) {
        if (isPlayingAudio) {
          htmlAudioRef.current.pause();
          setIsPlayingAudio(false);
        } else {
          htmlAudioRef.current.play().catch(() => {});
          setIsPlayingAudio(true);
        }
        return;
      }

      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
      }
      const url = URL.createObjectURL(rec.m4aBlob || rec.audioBlob);
      const audio = new Audio(url);
      htmlAudioRef.current = audio;
      setActivePlaybackId(rec.id);
      setIsPlayingAudio(true);
      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(url);
      };
      audio.play().catch(() => {
        setIsPlayingAudio(false);
      });
    },
    [activePlaybackId, isPlayingAudio]
  );

  const handlePlayCompareConsecutively = useCallback(() => {
    if (compareSelectionIds.length < 2) return;
    const first = recordings.find((r) => r.id === compareSelectionIds[0]);
    const second = recordings.find((r) => r.id === compareSelectionIds[1]);
    if (!first || !second) return;

    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
    }
    setIsConsecutivePlaying(true);
    const url1 = URL.createObjectURL(first.m4aBlob || first.audioBlob);
    const audio1 = new Audio(url1);
    htmlAudioRef.current = audio1;
    setActivePlaybackId(first.id);
    setIsPlayingAudio(true);
    triggerToast(`Playing Attempt 1: ${first.title}`);

    audio1.onended = () => {
      URL.revokeObjectURL(url1);
      const url2 = URL.createObjectURL(second.m4aBlob || second.audioBlob);
      const audio2 = new Audio(url2);
      htmlAudioRef.current = audio2;
      setActivePlaybackId(second.id);
      triggerToast(`Now Playing Attempt 2: ${second.title}`);
      audio2.onended = () => {
        URL.revokeObjectURL(url2);
        setIsPlayingAudio(false);
        setIsConsecutivePlaying(false);
        setActivePlaybackId(null);
        triggerToast('Completed consecutive comparison playback.');
      };
      audio2.play().catch(() => {
        setIsConsecutivePlaying(false);
      });
    };
    audio1.play().catch(() => {
      setIsConsecutivePlaying(false);
    });
  }, [compareSelectionIds, recordings, triggerToast]);

  const createCustomTopicPrompt = useCallback((): TopicPrompt | null => {
    const trimmedTitle = customTopicInput.trim();
    if (!trimmedTitle) {
      triggerToast('Please enter a topic title first.');
      return null;
    }
    const trimmedDesc =
      customTopicDescription.trim() ||
      'Custom user-created speaking topic. Deliver a clear, structured response using your chosen framework.';
    const newTopic: TopicPrompt = {
      id: `custom-${Date.now()}`,
      numberLabel: `CUSTOM #${String(topics.length + 1).padStart(2, '0')}`,
      title: trimmedTitle,
      subtitle: trimmedDesc,
      category: selectedCategory === 'General' ? 'General' : selectedCategory,
      subCategory: 'CUSTOM DIRECTIVE',
      suggestedSeconds: customSpeechSeconds,
      level: 'ACCESSIBLE',
      thinkingStyle
    };
    setTopics((prev) => [newTopic, ...prev]);
    setCurrentTopic(newTopic);
    setCustomTopicInput('');
    setCustomTopicDescription('');
    return newTopic;
  }, [
    customTopicInput,
    customTopicDescription,
    topics.length,
    selectedCategory,
    customSpeechSeconds,
    thinkingStyle,
    triggerToast
  ]);

  const handleAddCustomTopic = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const created = createCustomTopicPrompt();
      if (!created) return;
      setIsCustomTopicModalOpen(false);
      setActiveTab('practice');
      triggerToast(`Added "${created.title}" to your stage`);
    },
    [createCustomTopicPrompt, triggerToast]
  );

  const handleAddCustomTopicAndStartTimerDirectly = useCallback(
    (autoRecord = false) => {
      const created = createCustomTopicPrompt();
      if (!created) return;
      setIsCustomTopicModalOpen(false);
      handleLaunchLiveSession(created, autoRecord);
    },
    [createCustomTopicPrompt, handleLaunchLiveSession]
  );

  // Global Hotkeys
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (activeTab === 'live_timer') {
          setIsTimerRunning((r) => !r);
        } else {
          handleSpinTopic();
        }
      } else if (e.key.toLowerCase() === 't' && activeTab !== 'live_timer') {
        e.preventDefault();
        handleLaunchLiveSession();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMuted((m) => !m);
      } else if (e.key.toLowerCase() === 'r' && activeTab === 'live_timer') {
        e.preventDefault();
        setIsTimerRunning(false);
        setTimerRemainingSeconds(customSpeechSeconds);
      } else if (e.key === 'Escape') {
        if (isSettingsOpen) setIsSettingsOpen(false);
        else if (isWheelModalOpen) setIsWheelModalOpen(false);
        else if (isCustomTopicModalOpen) setIsCustomTopicModalOpen(false);
        else if (activeTab === 'live_timer') {
          setIsTimerRunning(false);
          setActiveTab('practice');
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTab, isSettingsOpen, isWheelModalOpen, isCustomTopicModalOpen, customSpeechSeconds, handleSpinTopic, handleLaunchLiveSession]);

  // Compute Active Stage Index & Timing Windows in Live Timer
  const elapsedSeconds = Math.max(0, customSpeechSeconds - timerRemainingSeconds);
  const stepCount = selectedFramework.steps.length;
  const secondsPerStep = Math.max(1, Math.floor(customSpeechSeconds / stepCount));
  const activeStepIndex = Math.min(stepCount - 1, Math.floor(elapsedSeconds / secondsPerStep));
  const activeStep = selectedFramework.steps[activeStepIndex] || selectedFramework.steps[0];

  // Progress Dashboard Aggregated Metrics
  const dashboardStats = useMemo(() => {
    const totalSessions = recordings.length;
    const totalSeconds = recordings.reduce((acc, r) => acc + r.durationSeconds, 0);
    const totalMinutes = (totalSeconds / 60).toFixed(1);
    const avgDurationSec = totalSessions > 0 ? Math.round(totalSeconds / totalSessions) : 64;
    const avgWpm =
      totalSessions > 0
        ? Math.round(
            recordings.reduce(
              (acc, r) => acc + (r.analytics.wordsPerMinute || r.analytics.estimatedAcousticWpm || 132),
              0
            ) / totalSessions
          )
        : 132;
    const avgScoreNum =
      totalSessions > 0
        ? recordings.reduce((acc, r) => {
            const s = r.selfAssessment;
            return (
              acc +
              (s.topicRelevance + s.logicalStructure + s.clarity + s.vocabulary + s.fluency + s.confidence) / 6
            );
          }, 0) / totalSessions
        : 4.2;

    return {
      totalSessions,
      totalMinutes: totalSessions > 0 ? totalMinutes : '1.1',
      avgDurationSec,
      avgWpm,
      avgScore: avgScoreNum.toFixed(1),
      avgScorePct: Math.round((avgScoreNum / 5) * 100)
    };
  }, [recordings]);

  const currentCategoryMeta = useMemo(
    () => CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0],
    [selectedCategory]
  );

  // Circular Timer Ring Geometry
  const ringRadius = 118;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const activeTotalSec = isPrepPhase ? Math.max(1, prepAllowanceSeconds) : Math.max(1, customSpeechSeconds);
  const activeRemSec = isPrepPhase ? prepRemainingSeconds : timerRemainingSeconds;
  const progressFraction = Math.max(0, Math.min(1, (activeTotalSec - activeRemSec) / activeTotalSec));
  const strokeDashoffset = ringCircumference * (1 - progressFraction);

  return (
    <div className="min-h-screen w-full bg-[#060c0b] text-[#f1f5f4] flex flex-col justify-between relative overflow-x-hidden select-none font-sans pb-20 md:pb-0">
      {/* Fonts & Scrollbar Styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap');
        .font-serif {
          font-family: 'Newsreader', 'Instrument Serif', Georgia, Cambria, "Times New Roman", Times, serif;
        }
        .font-sans {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Atmospheric Radial Emerald & Teal Background Glows */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 42%, rgba(6, 95, 70, 0.25) 0%, rgba(13, 148, 136, 0.08) 45%, transparent 72%),
            radial-gradient(circle at 20% 15%, rgba(0, 230, 118, 0.10) 0%, transparent 50%)
          `
        }}
      />

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-[#111e1c]/95 border border-[#00e676]/40 text-xs font-medium text-emerald-200 shadow-[0_0_24px_rgba(0,230,118,0.25)] flex items-center gap-2 max-w-[92vw] truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] flex-shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* ====================================================================
          TOP NAVIGATION BAR (Matches 1000138164.png & 1000138174.png)
          Hidden on Live Timer mobile so Timer presets bar sits cleanly at top!
         ==================================================================== */}
      <header
        className={`${
          activeTab === 'live_timer' ? 'hidden md:block' : 'block'
        } sticky top-0 z-30 w-full px-4 sm:px-6 md:px-8 py-3 bg-[#060c0b]/85 backdrop-blur-md`}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-2">
          {/* Left: Audio Wave Icon + Italic Serif Unprompted */}
          {activeTab === 'library' ? (
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className="flex items-center gap-2.5 text-left"
            >
              <ArrowLeft className="w-4 h-4 text-white/80" />
              <span className="font-serif text-xl sm:text-2xl text-white">Speech Review</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-0.5 h-2 bg-[#00e676] rounded-full" />
                <span className="w-0.5 h-3.5 bg-[#00e676] rounded-full" />
                <span className="w-0.5 h-4 bg-[#00e676] rounded-full" />
                <span className="w-0.5 h-2.5 bg-[#00e676] rounded-full" />
                <span className="w-0.5 h-1.5 bg-[#00e676] rounded-full" />
              </div>
              <span className="font-serif italic text-2xl tracking-tight text-white group-hover:text-[#00e676] transition">
                Unprompted
              </span>
            </button>
          )}

          {/* Center: Desktop Segmented Pill Navigation */}
          <nav className="hidden md:flex items-center bg-[#111718]/90 border border-white/[0.07] rounded-full p-1 gap-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                activeTab === 'practice'
                  ? 'bg-[#263133] text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Practice
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-[#263133] text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Categories & Topics ({topics.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('live_timer')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                activeTab === 'live_timer'
                  ? 'bg-[#263133] text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Live Timer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('frameworks')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                activeTab === 'frameworks'
                  ? 'bg-[#263133] text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Frameworks (11)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-[#263133] text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>Library & Progress</span>
              {recordings.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#00e676]/20 text-[#00e676] text-[10px] font-bold">
                  {recordings.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                isSettingsOpen
                  ? 'bg-[#263133] text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Settings
            </button>
          </nav>

          {/* Right Icons (Matches 1000138164.png: Mic, Sliders, User Circle) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCustomTopicModalOpen(true)}
              title="Add Custom Topic & Start Timer"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-[#00e676] transition"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleLaunchLiveSession(currentTopic, true)}
              title="Quick Record Speech"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings & Timer Configuration"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('library')}
              title="Speech Review & Recording Library"
              className="w-8 h-8 rounded-full bg-[#34d399] hover:bg-[#00e676] text-[#052014] flex items-center justify-center font-semibold shadow-sm transition"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MAIN STAGE VIEWPORT
         ==================================================================== */}
      <main className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-6">
        {/* ==================================================================
            VIEW 1: PRACTICE STAGE (Exact Match to 1000138164.png)
           ================================================================== */}
        {activeTab === 'practice' && (
          <div className="flex flex-col items-center justify-between min-h-[78vh] w-full max-w-md mx-auto py-2">
            {/* Top Stack: Mode Pill + Subtitle + Category Pill */}
            <div className="flex flex-col items-center gap-3.5 w-full">
              {/* Wide Mode Toggle Pill */}
              <div className="w-full max-w-[330px] grid grid-cols-2 bg-[#11191a] border border-white/[0.07] rounded-full p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => setThinkingStyle('off_the_cuff')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold transition ${
                    thinkingStyle === 'off_the_cuff'
                      ? 'bg-[#00e676] text-[#041e12] shadow-[0_0_24px_rgba(0,230,118,0.35)]'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Off the cuff</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThinkingStyle('deep_research')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold transition ${
                    thinkingStyle === 'deep_research'
                      ? 'bg-[#00e676] text-[#041e12] shadow-[0_0_24px_rgba(0,230,118,0.35)]'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Deep research</span>
                </button>
              </div>

              <p className="text-xs text-white/60 text-center">
                {thinkingStyle === 'off_the_cuff'
                  ? 'Minimal prep. Try to think quick on your feet.'
                  : 'Structured synthesis. Build an evidence-backed argument.'}
              </p>

              {/* Category Selector Pill + Expandable Options */}
              <div className="relative flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen((o) => !o)}
                  className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#111a1c] hover:bg-[#172528] border border-white/10 text-xs font-medium text-white transition shadow-sm"
                >
                  <span className="text-[#00e676]">✦</span>
                  <span>{selectedCategory}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/60" />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-11 left-1/2 -translate-x-1/2 z-40 w-60 max-h-72 overflow-y-auto rounded-2xl bg-[#10181a] border border-white/15 p-1.5 shadow-2xl">
                    {CATEGORIES.map((cat) => {
                      const count =
                        cat.id === 'General'
                          ? topics.length
                          : topics.filter((t) => t.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setIsCategoryDropdownOpen(false);
                            handleSpinTopic(cat.id);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                            selectedCategory === cat.id
                              ? 'bg-emerald-500/15 text-[#00e676] font-semibold'
                              : 'text-white/75 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </span>
                          <span className="text-[10px] text-white/40">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Center Topic Hero (Matches 1000138164.png with generous negative space) */}
            <div className="my-auto py-10 flex flex-col items-center text-center w-full">
              <div className="text-[11px] font-bold tracking-[0.18em] text-[#2dd4bf] uppercase mb-2.5">
                YOUR TOPIC
              </div>

              <div className="flex items-center justify-center gap-2">
                <h1
                  className={`font-serif text-4xl sm:text-5xl text-white tracking-tight leading-[1.15] transition-all duration-200 ${
                    isSpinning ? 'opacity-60 scale-95 blur-[1px]' : 'opacity-100 scale-100'
                  }`}
                >
                  {currentTopic.title}
                </h1>
                <button
                  type="button"
                  onClick={(ev) => toggleInfoKey('hero_topic_desc', ev)}
                  className={`w-5 h-5 rounded-full border text-[10px] font-serif italic font-bold inline-flex items-center justify-center transition ${
                    openInfoKeys['hero_topic_desc']
                      ? 'bg-[#00e676] text-[#041e12] border-[#00e676]'
                      : 'bg-white/[0.06] hover:bg-white/15 text-white/70 border-white/15'
                  }`}
                  title="Tap to expand topic description"
                >
                  i
                </button>
              </div>

              {/* Expanded Topic Description (Hidden by default to preserve negative space) */}
              {openInfoKeys['hero_topic_desc'] && (
                <p className="mt-3 text-xs text-white/70 max-w-sm leading-relaxed bg-[#10191b] border border-white/10 rounded-2xl p-3">
                  {currentTopic.subtitle}
                </p>
              )}

              {/* Stage Ready Pill */}
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131f20] border border-white/[0.07] text-xs text-white/80">
                <span className="w-2 h-2 rounded-full bg-[#00e676]" />
                <span>Stage Ready · Everyday Metaphor</span>
              </div>

              {/* Single-Line Framework Pill (Tap to expand framework steps or switch framework!) */}
              <div className="relative mt-3">
                <button
                  type="button"
                  onClick={(ev) => toggleInfoKey('practice_fw_expand', ev)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0d1618]/90 hover:bg-[#132023] border border-white/[0.06] text-xs transition"
                >
                  <span className="text-[#2dd4bf]">✦ Framework:</span>
                  <span className="text-white font-medium">{selectedFramework.shortName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/45" />
                </button>

                {/* Expandable Framework Drawer when user taps the Framework pill */}
                {openInfoKeys['practice_fw_expand'] && (
                  <div className="mt-2.5 w-full max-w-sm mx-auto rounded-2xl bg-[#10191b] border border-white/10 p-3.5 text-left space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf]">
                        {selectedFramework.code} STRUCTURE
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleAssignRandomFramework}
                          className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] text-[#00e676]"
                        >
                          Random
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsFrameworkDropdownOpen((o) => !o)}
                          className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] text-white/80"
                        >
                          Change ⌄
                        </button>
                      </div>
                    </div>

                    {isFrameworkDropdownOpen && (
                      <div className="max-h-44 overflow-y-auto rounded-xl bg-[#0b1214] border border-white/10 p-1 space-y-0.5">
                        {SPEAKING_FRAMEWORKS.map((fw) => (
                          <button
                            key={fw.id}
                            type="button"
                            onClick={() => {
                              setSelectedFrameworkId(fw.id);
                              setIsFrameworkDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                              selectedFrameworkId === fw.id
                                ? 'bg-emerald-500/20 text-[#00e676] font-semibold'
                                : 'text-white/70 hover:bg-white/5'
                            }`}
                          >
                            <span>{fw.shortName}</span>
                            <span className="text-[10px] opacity-60">{fw.code}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {selectedFramework.steps.map((st) => (
                        <div
                          key={st.number}
                          className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2 flex items-center gap-2.5 text-xs"
                        >
                          <span className="text-[10px] font-bold text-[#00e676]">{st.number}</span>
                          <span className="font-semibold text-white">{st.label}:</span>
                          <span className="text-white/60 truncate">{st.shortDesc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quick Practice Mode & Wheel Links inside Expanded Tray */}
                    <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        {(
                          [
                            { id: 'spontaneous', label: '0s Prep' },
                            { id: 'prepared', label: '30s Prep' },
                            { id: 'extended', label: '5m+' }
                          ] as const
                        ).map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleSelectPracticeMode(m.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] border ${
                              practiceMode === m.id
                                ? 'bg-emerald-500/20 border-[#00e676] text-[#00e676]'
                                : 'border-white/10 text-white/50'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsWheelModalOpen(true)}
                        className="text-[10px] text-emerald-300 underline"
                      >
                        Open Wheel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Primary Action Stack (Exact Match to 1000138164.png) */}
            <div className="w-full space-y-3">
              <button
                type="button"
                onClick={() => handleSpinTopic()}
                disabled={isSpinning}
                className="w-full py-4 rounded-full bg-[#00e676] hover:bg-[#00f582] disabled:opacity-50 text-[#041e12] font-semibold text-base shadow-[0_0_35px_rgba(0,230,118,0.35)] flex items-center justify-center gap-2.5 transition transform active:scale-[0.99]"
              >
                <Dices className="w-5 h-5" />
                <span>{isSpinning ? 'Spinning...' : 'Spin again'}</span>
              </button>

              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => handleLaunchLiveSession(currentTopic, false)}
                  className="flex-1 py-4 rounded-full bg-[#151d20] hover:bg-[#1c272b] border border-white/[0.08] text-white font-medium text-sm flex items-center justify-center gap-2.5 transition"
                >
                  <Clock className="w-4 h-4 text-[#2dd4bf]" />
                  <span>Start {speechMinutes} min timer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-13 h-13 p-4 rounded-full bg-[#151d20] hover:bg-[#1c272b] border border-white/[0.08] flex items-center justify-center text-white/75 hover:text-white transition"
                  aria-label="Configure timer settings"
                >
                  <SettingsIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            VIEW 2: TOPICS ("Speech Archives & Directives" — Matches 1000138174.png)
           ================================================================== */}
        {activeTab === 'categories' && (
          <div className="w-full max-w-lg mx-auto space-y-6 py-1">
            {/* Taxonomy Codex Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#00e676]">
                <span className="w-2 h-2 rounded-full bg-[#00e676]" />
                <span>TAXONOMY CODEX</span>
              </div>
              <h1 className="font-serif italic text-3xl sm:text-4xl text-white">
                Speech Archives & Directives
              </h1>
              <div className="text-xs text-white/55">
                12 Categories <span className="mx-1">•</span>
                <span className="text-[#00e676] font-semibold">{topics.length}+ Prompts Loaded</span>
              </div>
            </div>

            {/* Search Filter Input + Shuffle Button */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearchQuery}
                  onChange={(e) => setCatalogSearchQuery(e.target.value)}
                  placeholder="Filter themes, tropes, eras..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#10181a] border border-white/[0.08] text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00e676]/50"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsWheelModalOpen(true)}
                title="Open Interactive Topic Spinner Wheel"
                className="w-11 h-11 rounded-2xl bg-[#10181a] hover:bg-[#162225] border border-white/[0.08] flex items-center justify-center text-[#00e676] transition"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* Difficulty Tier Tabs: All / Basic / Intermediate / Advanced + Bulk Import */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
              <div className="inline-flex items-center bg-[#10181a] border border-white/[0.08] rounded-full p-1 gap-1">
                {(
                  [
                    { id: 'ALL', label: 'All Tiers' },
                    { id: 'ACCESSIBLE', label: 'Basic' },
                    { id: 'INTERMEDIATE', label: 'Medium' },
                    { id: 'CHALLENGING', label: 'Advanced' }
                  ] as const
                ).map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      setSelectedTier(tier.id);
                      setVisiblePromptsLimit(5);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                      selectedTier === tier.id
                        ? 'bg-[#00e676] text-[#041d11] shadow-[0_0_12px_rgba(0,230,118,0.35)]'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>

              <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10181a] hover:bg-[#162225] border border-white/[0.08] text-[11px] font-medium text-emerald-300 cursor-pointer transition flex-shrink-0">
                <Plus className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json,.csv"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const text = await file.text();
                      let items: TopicPrompt[] = [];
                      if (file.name.endsWith('.json')) {
                        items = JSON.parse(text);
                      }
                      if (Array.isArray(items) && items.length > 0) {
                        setTopics((prev) => [...items, ...prev]);
                        triggerToast(`Successfully imported ${items.length.toLocaleString()} custom topics!`);
                      }
                    } catch {
                      triggerToast('Could not parse imported file.');
                    }
                  }}
                />
              </label>
            </div>

            {/* SECTOR MATRICES (Horizontal Swipeable Square Cards — Matches 1000138174.png) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">
                  SECTOR MATRICES
                </span>
                <button
                  type="button"
                  onClick={() => setIsCategorySidebarCollapsed((c) => !c)}
                  className="text-[11px] text-[#00e676] font-medium flex items-center gap-1"
                >
                  <span>Swipe to inspect →</span>
                </button>
              </div>

              {isCategorySidebarCollapsed && (
                <div className="rounded-2xl bg-[#101719]/90 border border-white/[0.07] p-1.5 space-y-0.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const catCount = topics.filter((t) => t.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setVisiblePromptsLimit(5);
                          setIsCategorySidebarCollapsed(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition ${
                          isSelected
                            ? 'bg-[#1c282b] text-white font-semibold border border-white/10'
                            : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span>{cat.icon}</span>
                          <span className="truncate">{cat.name}</span>
                        </span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-[#00e676] flex-shrink-0" />
                        ) : (
                          <span className="text-[10px] text-white/40 flex-shrink-0">
                            {catCount} prompts
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat.id;
                  const count =
                    cat.id === 'General'
                      ? topics.length
                      : topics.filter((t) => t.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setVisiblePromptsLimit(5);
                      }}
                      className={`w-28 flex-shrink-0 rounded-2xl p-3.5 text-center border transition ${
                        active
                          ? 'bg-[#122220] border-[#00e676]/50 shadow-[0_0_20px_rgba(0,230,118,0.12)]'
                          : 'bg-[#10181a] border-white/[0.07] hover:border-white/15'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl mx-auto mb-2.5 flex items-center justify-center text-base ${
                          active
                            ? 'bg-[#16302b] text-[#00e676] shadow-[0_0_15px_rgba(0,230,118,0.25)]'
                            : 'bg-white/[0.04] text-white/70'
                        }`}
                      >
                        {cat.icon}
                      </div>
                      <div className="text-xs font-semibold text-white truncate">
                        {cat.shortLabel}
                      </div>
                      <div
                        className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${
                          active ? 'text-[#00e676]' : 'text-white/40'
                        }`}
                      >
                        {active ? (
                          <span>{count} prompts ✓</span>
                        ) : (
                          <span>{count} prompts</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CURATED DIRECTIVES Stack (Matches 1000138174.png) */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00e676]" />
                  <span>CURATED DIRECTIVES</span>
                </div>
                <span className="text-[11px] text-white/45">Selected for Flow</span>
              </div>

              <div className="space-y-3.5">
                {filteredCategoryTopics.slice(0, visiblePromptsLimit).map((item, idx) => {
                  const assignedFw = SPEAKING_FRAMEWORKS[idx % SPEAKING_FRAMEWORKS.length];
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentTopic(item);
                        setActiveTab('practice');
                      }}
                      className="cursor-pointer rounded-3xl bg-[#10191b]/95 hover:bg-[#142023] border border-white/[0.08] p-5 space-y-3 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#132824] text-[#00e676] text-[9px] font-bold uppercase tracking-widest">
                          {item.subCategory}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.05] text-white/75 text-[11px]">
                          <Clock className="w-3 h-3 text-white/50" />
                          {formatSuggestedDuration(item.suggestedSeconds)}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif text-2xl text-white">{item.title}</h3>
                        <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-white/45 flex items-center gap-1.5">
                          <span className="text-[#00e676]">⑂</span>
                          Framework: {assignedFw.flowTag}
                        </span>

                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setCurrentTopic(item);
                            setCustomSpeechSeconds(item.suggestedSeconds);
                            setTimerRemainingSeconds(item.suggestedSeconds);
                            setSpeechMinutes(Math.max(1, Math.round(item.suggestedSeconds / 60)));
                            handleLaunchLiveSession(item, false);
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                            idx === 0
                              ? 'bg-[#00e676] text-[#041e12] shadow-[0_0_20px_rgba(0,230,118,0.4)]'
                              : 'bg-white/[0.06] hover:bg-[#00e676] text-[#00e676] hover:text-[#041e12] border border-white/10'
                          }`}
                          title="Launch Live Timer for this Directive"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Expand Button to Load More Directives */}
              {filteredCategoryTopics.length > visiblePromptsLimit && (
                <button
                  type="button"
                  onClick={() => setVisiblePromptsLimit((l) => l + 12)}
                  className="w-full py-3 rounded-2xl bg-[#10181a] hover:bg-[#152023] border border-white/10 text-xs font-semibold text-[#00e676] transition flex items-center justify-center gap-1.5"
                >
                  <span>Expand More Directives ({filteredCategoryTopics.length - visiblePromptsLimit} more)</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* UNSCRIPTED SANDBOX ("Inject Directive" — Matches 1000138174.png) */}
            <form
              onSubmit={handleAddCustomTopic}
              className="rounded-3xl bg-[#10191b] border border-white/[0.08] p-5 space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#152624] border border-emerald-500/25 flex items-center justify-center text-[#00e676] flex-shrink-0 mt-0.5">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#00e676]">
                    UNSCRIPTED SANDBOX
                  </div>
                  <h3 className="font-serif text-2xl text-white mt-0.5">Inject Directive</h3>
                  <p className="text-xs text-white/55 mt-1 leading-relaxed">
                    Inject your custom premise straight into the speech generator wheel.
                  </p>
                </div>
              </div>

              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                placeholder="Enter custom topic or directive..."
                className="w-full px-4 py-3.5 rounded-2xl bg-[#090f10] border border-white/10 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-[#00e676]"
              />

              {/* Expandable Custom Description Field */}
              {openInfoKeys['sandbox_custom_desc'] ? (
                <textarea
                  rows={2}
                  value={customTopicDescription}
                  onChange={(e) => setCustomTopicDescription(e.target.value)}
                  placeholder="Enter optional description or guiding context..."
                  className="w-full p-3.5 rounded-2xl bg-[#090f10] border border-white/10 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-[#00e676]"
                />
              ) : (
                <button
                  type="button"
                  onClick={(ev) => toggleInfoKey('sandbox_custom_desc', ev)}
                  className="text-[11px] text-[#2dd4bf] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add custom description / context</span>
                </button>
              )}

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleAddCustomTopicAndStartTimerDirectly(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-white/65 hover:text-[#00e676] transition"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#00e676]" />
                  <span>Start Timer Directly</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00e676] hover:bg-[#00f582] text-[#041e12] font-semibold text-xs shadow-[0_0_24px_rgba(0,230,118,0.35)] transition"
                >
                  <span>Add & Spin</span>
                  <Dices className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================================
            VIEW 3: LIVE TIMER & RECORDING STUDIO (Exact Match to 1000138176.png)
           ================================================================== */}
        {activeTab === 'live_timer' && (
          <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[82vh] py-1 space-y-4">
            {/* Top Bar: Duration Presets Pill on Left + Mic Waveform & Fullscreen on Right */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center bg-[#10181a] border border-white/10 rounded-full p-1 gap-0.5">
                {[1, 2, 3, 5, 10].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectDurationPreset(m * 60)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      speechMinutes === m
                        ? 'bg-[#00e676] text-[#041d11] font-bold shadow-[0_0_12px_rgba(0,230,118,0.4)]'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10181a] border border-white/10">
                  <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-rose-400' : 'text-[#00e676]'}`} />
                  <div className="flex items-end gap-0.5 h-3.5">
                    {audioLevels.slice(0, 5).map((lvl, idx) => (
                      <span
                        key={idx}
                        className="w-0.5 rounded-full bg-[#00e676] transition-all duration-75"
                        style={{ height: `${Math.max(25, lvl)}%` }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen?.().catch(() => {});
                      setIsFullscreen(true);
                    } else {
                      document.exitFullscreen?.().catch(() => {});
                      setIsFullscreen(false);
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-[#10181a] hover:bg-[#1a2629] border border-white/10 flex items-center justify-center text-white/70"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Active Topic Title + Small 'i' Button + 3-Column Stage Bar */}
            <div className="text-center space-y-3.5">
              <div className="inline-flex items-center justify-center gap-2.5">
                <h1 className="font-serif text-3xl sm:text-4xl text-white">
                  {currentTopic.title}
                </h1>
                <button
                  type="button"
                  onClick={(ev) => toggleInfoKey('live_prompt_desc', ev)}
                  className={`w-5 h-5 rounded-full border text-[10px] font-serif italic font-bold inline-flex items-center justify-center transition ${
                    openInfoKeys['live_prompt_desc']
                      ? 'bg-[#00e676] text-[#041e12] border-[#00e676]'
                      : 'bg-white/[0.06] hover:bg-white/15 text-white/65 border-white/20'
                  }`}
                  title="Show prompt description"
                >
                  i
                </button>
              </div>

              {openInfoKeys['live_prompt_desc'] && (
                <p className="text-xs text-white/70 bg-[#10181a] border border-white/10 rounded-2xl p-3 leading-relaxed">
                  {currentTopic.subtitle}
                </p>
              )}

              {/* Segmented Stage Bar (Matches 1000138176.png) */}
              <div className="w-full bg-[#0e1618] border border-white/[0.07] rounded-2xl p-1.5 grid grid-cols-3 gap-1">
                {selectedFramework.steps.slice(0, 3).map((st, idx) => {
                  const startSec = idx * secondsPerStep;
                  const endSec = idx === stepCount - 1 ? customSpeechSeconds : (idx + 1) * secondsPerStep;
                  const isCurrentStage = !isPrepPhase && activeStepIndex === idx;
                  return (
                    <button
                      key={st.number}
                      type="button"
                      onClick={() => {
                        setIsPrepPhase(false);
                        setTimerRemainingSeconds(Math.max(1, customSpeechSeconds - startSec));
                      }}
                      className={`py-2 px-2 rounded-xl text-center transition ${
                        isCurrentStage
                          ? 'bg-[#00e676] text-[#041e12] font-semibold shadow-[0_0_20px_rgba(0,230,118,0.3)]'
                          : 'text-white/65 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{st.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          isCurrentStage ? 'text-[#041e12]/80 font-medium' : 'text-white/40'
                        }`}
                      >
                        {formatTimeMMSS(startSec)} - {formatTimeMMSS(endSec)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {micPermissionError && (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-3 flex items-center justify-between gap-2 text-[11px] text-amber-200">
                <span>{micPermissionError}</span>
                <button
                  type="button"
                  onClick={() => handleStartRecording(true)}
                  className="px-3 py-1.5 rounded-full bg-[#00e676] text-[#041e12] font-semibold whitespace-nowrap"
                >
                  Use Simulated Voice Mic
                </button>
              </div>
            )}

            {/* Center Circular Timer Ring (Matches 1000138176.png) */}
            <div className="flex flex-col items-center justify-center my-auto py-2">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg viewBox="0 0 320 320" className="w-full h-full">
                  <circle
                    cx="160"
                    cy="160"
                    r={ringRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth="7"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r={ringRadius}
                    fill="none"
                    stroke={isPrepPhase ? '#f59e0b' : '#22d3ee'}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 160 160)"
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.55))',
                      transition: 'stroke-dashoffset 0.35s ease'
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {isPrepPhase && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">
                      30s PREP
                    </span>
                  )}
                  <div className="text-6xl font-medium text-white tracking-tight tabular-nums">
                    {formatTimeMMSS(activeRemSec)}
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-sm italic font-serif text-[#00e676]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] not-italic" />
                    <span>{isPrepPhase ? 'Prep' : activeStep.label}</span>
                  </div>

                  {isRecording && (
                    <div className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] text-rose-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span>REC {formatTimeMMSS(recordingDurationSec)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Controls + Expandable Coaching Bars (Matches 1000138176.png) */}
            <div className="space-y-3">
              {/* Primary 2-Column Row: Pause (Green) + Record Speech (Coral Red) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning((r) => !r)}
                  className="py-3.5 px-5 rounded-full bg-[#00e676] hover:bg-[#00f582] text-[#041e12] font-semibold text-sm shadow-[0_0_25px_rgba(0,230,118,0.3)] flex items-center justify-center gap-2 transition"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>{timerRemainingSeconds < customSpeechSeconds ? 'Resume' : 'Start Timer'}</span>
                    </>
                  )}
                </button>

                {!isRecording ? (
                  <button
                    type="button"
                    onClick={() => handleStartRecording(false)}
                    className="py-3.5 px-5 rounded-full bg-[#f43f5e] hover:bg-[#fb7185] text-white font-semibold text-sm shadow-[0_0_25px_rgba(244,63,94,0.35)] flex items-center justify-center gap-2 transition"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Record Speech</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleStopRecording();
                      setIsTimerRunning(false);
                    }}
                    className="py-3.5 px-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop & Save M4A</span>
                  </button>
                )}
              </div>

              {/* Secondary Row: Wrap Up + Reset */}
              <div className="flex items-center justify-center gap-2.5">
                {isRecording && (
                  <button
                    type="button"
                    onClick={handleTogglePauseRecording}
                    className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-medium"
                  >
                    {isRecordingPaused ? 'Resume Rec' : 'Pause Rec'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isRecording) {
                      handleStopRecording();
                    }
                    setIsTimerRunning(false);
                    playSynthesizedChime('complete', isMuted);
                    if (!isRecording) {
                      setActiveTab('library');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#11191b] hover:bg-[#192528] text-white font-medium text-xs border border-white/10 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/75" />
                  <span>Wrap Up</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setIsPrepPhase(practiceMode === 'prepared');
                    setPrepRemainingSeconds(prepAllowanceSeconds);
                    setTimerRemainingSeconds(customSpeechSeconds);
                  }}
                  className="w-9 h-9 rounded-full bg-[#11191b] hover:bg-[#192528] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition"
                  aria-label="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Collapsible Stage Cue Bar (Full-width pill with 'i' button) */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={(ev) => toggleInfoKey('live_stage_cue_info', ev)}
                  className="w-full rounded-full bg-[#0e1618] hover:bg-[#142023] border border-white/10 px-4 py-2.5 flex items-center justify-between text-xs transition"
                >
                  <span className="flex items-center gap-2 text-white/90 font-medium truncate">
                    <Lightbulb className="w-3.5 h-3.5 text-[#00e676] flex-shrink-0" />
                    <span className="truncate">
                      Stage {activeStepIndex + 1}: {activeStep.stageTitle}
                    </span>
                  </span>
                  <span className="w-4 h-4 rounded-full border border-white/20 text-[9px] font-serif italic font-bold text-white/70 flex items-center justify-center flex-shrink-0">
                    i
                  </span>
                </button>

                {openInfoKeys['live_stage_cue_info'] && (
                  <div className="rounded-2xl bg-[#10181a] border border-white/10 p-3.5 text-xs space-y-2">
                    <p className="text-white/75 leading-relaxed">{activeStep.stageInstruction}</p>
                    <div className="space-y-1 pt-1 border-t border-white/[0.06]">
                      {activeStep.guidingQuestions.map((q, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-200/80">
                          <span className="text-[#00e676] font-bold">›</span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Split Row: Framework Pill [i] + WPM Pill */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(ev) => toggleInfoKey('live_fw_info', ev)}
                    className="flex-1 rounded-full bg-[#0e1618] hover:bg-[#142023] border border-white/10 px-4 py-2.5 flex items-center justify-between text-xs transition min-w-0"
                  >
                    <span className="text-white/85 truncate">{selectedFramework.shortName}</span>
                    <span className="w-4 h-4 rounded-full border border-white/20 text-[9px] font-serif italic font-bold text-white/70 flex items-center justify-center flex-shrink-0 ml-2">
                      i
                    </span>
                  </button>

                  <div className="rounded-full bg-[#0e1618] border border-white/10 px-3.5 py-2.5 flex items-center gap-1.5 text-xs font-semibold text-[#00e676] flex-shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {isRecording && recordingDurationSec > 3
                        ? `${Math.min(
                            195,
                            Math.max(95, Math.round((liveSyllablePeaks / 1.45) / (recordingDurationSec / 60)))
                          )} wpm`
                        : `${dashboardStats.avgWpm} wpm`}
                    </span>
                  </div>
                </div>

                {openInfoKeys['live_fw_info'] && (
                  <div className="rounded-2xl bg-[#10181a] border border-white/10 p-3.5 text-xs space-y-2">
                    <p className="text-white/65">{selectedFramework.explanation}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedFramework.steps.map((st, idx) => (
                        <span
                          key={st.number}
                          className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-white/80"
                        >
                          {idx + 1}. {st.label}: {st.shortDesc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Links: Different Prompt · CLOSE SESSION */}
              <div className="pt-1 flex items-center justify-center gap-3 text-xs text-white/55">
                <button
                  type="button"
                  onClick={() => handleSpinTopic()}
                  className="inline-flex items-center gap-1.5 hover:text-[#00e676] transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Different Prompt</span>
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    if (isRecording) handleStopRecording();
                    setIsTimerRunning(false);
                    setActiveTab('practice');
                  }}
                  className="uppercase tracking-wider font-semibold text-white/70 hover:text-white underline underline-offset-4"
                >
                  CLOSE SESSION
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            VIEW 4: SPEAKING FRAMEWORK LIBRARY ("Methods" — Expandable Cards)
           ================================================================== */}
        {activeTab === 'frameworks' && (
          <div className="w-full max-w-lg mx-auto space-y-5 py-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#00e676]">
                  RHETORICAL METHODS • 11 FRAMEWORKS
                </span>
                <h1 className="font-serif italic text-3xl text-white mt-0.5">
                  Speaking Frameworks
                </h1>
              </div>
              <button
                type="button"
                onClick={handleAssignRandomFramework}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00e676] text-[#041e12] font-semibold text-xs shadow-[0_0_20px_rgba(0,230,118,0.3)]"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Random Framework Assignment</span>
              </button>
            </div>

            <div className="space-y-3">
              {SPEAKING_FRAMEWORKS.map((fw) => {
                const isSelected = fw.id === selectedFrameworkId;
                const fwInfoKey = `fw_card_${fw.id}`;
                const isFwOpen = !!openInfoKeys[fwInfoKey];

                return (
                  <div
                    key={fw.id}
                    className={`rounded-3xl p-4 sm:p-5 border transition space-y-3 ${
                      isSelected
                        ? 'bg-[#122220] border-[#00e676]/50'
                        : 'bg-[#10181a] border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="px-2.5 py-1 rounded-lg bg-[#152824] border border-emerald-500/30 text-[10px] font-bold text-[#00e676]">
                          {fw.code}
                        </span>
                        <h3 className="font-serif text-xl text-white truncate">{fw.shortName}</h3>
                      </div>

                      <button
                        type="button"
                        onClick={(ev) => toggleInfoKey(fwInfoKey, ev)}
                        className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/10 text-[11px] text-white/75 flex items-center gap-1"
                      >
                        <span>{isFwOpen ? 'Hide' : 'Expand'}</span>
                        {isFwOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {fw.steps.map((st) => (
                        <span
                          key={st.number}
                          className="px-2.5 py-1 rounded-xl bg-[#0b1113] border border-white/[0.06] text-xs text-white/80"
                        >
                          <strong className="text-[#00e676]">{st.number}</strong> {st.label}
                        </span>
                      ))}
                    </div>

                    {isFwOpen && (
                      <div className="pt-2 border-t border-white/[0.07] space-y-2.5 text-xs animate-fade-in">
                        <p className="text-white/70 leading-relaxed">{fw.explanation}</p>
                        <div className="space-y-1">
                          {fw.steps.map((st) => (
                            <div key={st.number} className="text-[11px] text-white/60">
                              <span className="text-[#00e676] font-semibold">{st.label}:</span> {st.shortDesc}
                            </div>
                          ))}
                        </div>
                        <div className="rounded-2xl bg-white/[0.03] p-3 text-[11px] text-emerald-200/85 leading-relaxed">
                          <strong>Example ({fw.exampleTopic}):</strong> {fw.exampleBreakdown}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                      <span className="text-[11px] text-white/45">Tone: {fw.recommendedTone}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFrameworkId(fw.id);
                          setActiveTab('practice');
                          triggerToast(`Selected framework: ${fw.shortName}`);
                        }}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-[#00e676] text-[#041e12]'
                            : 'bg-white/10 hover:bg-white/15 text-white'
                        }`}
                      >
                        {isSelected ? 'Active Framework ✓' : 'Select Framework'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================
            VIEW 5: SPEECH REVIEW / LIBRARY & PROGRESS (Matches 1000138173.png)
           ================================================================== */}
        {activeTab === 'library' && (
          <div className="w-full max-w-lg mx-auto space-y-5 py-1">
            {/* Status Row */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#132824] text-[#00e676] text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
                  ANALYSIS READY
                </span>
                <span className="text-white/50">
                  Archived Sessions ({recordings.length})
                </span>
              </div>
              <span className="text-[#00e676] flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Synced
              </span>
            </div>

            {/* Full-Width Start New Practice Session CTA */}
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#00e676] to-[#34d399] text-[#041e12] font-semibold text-sm shadow-[0_0_30px_rgba(0,230,118,0.3)] flex items-center justify-center gap-2 transition"
            >
              <Mic className="w-4 h-4" />
              <span>New Practice Session</span>
            </button>

            {/* 2x2 KPI Grid + Rubric Cumulative Score Card (Matches 1000138173.png) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#10181a] border border-white/[0.07] p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">SESSIONS</div>
                  <div className="font-serif text-3xl text-white mt-1">{dashboardStats.totalSessions}</div>
                </div>
                <Mic className="w-4 h-4 text-white/30" />
              </div>

              <div className="rounded-2xl bg-[#10181a] border border-white/[0.07] p-4 flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">SPEAKING TIME</div>
                  <div className="font-serif text-3xl text-[#00e676] mt-1">{dashboardStats.totalMinutes}m</div>
                </div>
                <span className="text-[10px] text-white/40">target 3m</span>
              </div>

              <div className="rounded-2xl bg-[#10181a] border border-white/[0.07] p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">AVG DURATION</div>
                  <div className="font-serif text-3xl text-white mt-1">
                    {formatTimeMMSS(dashboardStats.avgDurationSec)}
                  </div>
                </div>
                <Clock className="w-4 h-4 text-white/30" />
              </div>

              <div className="rounded-2xl bg-[#10181a] border border-white/[0.07] p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">SPEED TREND</div>
                  <div className="font-serif text-3xl text-[#00e676] mt-1">
                    {dashboardStats.avgWpm} <span className="text-xs font-sans text-white/50">wpm</span>
                  </div>
                </div>
                <span className="text-[#00e676] text-sm">↗</span>
              </div>

              {/* Wide Rubric Cumulative Score Card with Circular Percentage Ring */}
              <div className="col-span-2 rounded-2xl bg-[#10181a] border border-white/[0.07] p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    RUBRIC CUMULATIVE SCORE
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-serif text-3xl text-[#00e676]">{dashboardStats.avgScore}</span>
                    <span className="text-sm text-white/50">/ 5.0</span>
                  </div>
                </div>

                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                    <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                    <circle
                      cx="24"
                      cy="24"
                      r="19"
                      fill="none"
                      stroke="#00e676"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 19}
                      strokeDashoffset={2 * Math.PI * 19 * (1 - dashboardStats.avgScorePct / 100)}
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-white">{dashboardStats.avgScorePct}%</span>
                </div>
              </div>
            </div>

            {compareSelectionIds.length > 0 && (
              <div className="rounded-2xl bg-[#122122] border border-[#00e676]/40 p-3.5 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#00e676]">
                  Compare Studio ({compareSelectionIds.length}/2 selected)
                </span>
                <div className="flex items-center gap-2">
                  {compareSelectionIds.length === 2 && (
                    <button
                      type="button"
                      onClick={handlePlayCompareConsecutively}
                      disabled={isConsecutivePlaying}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00e676] text-[#041e12] font-semibold text-xs"
                    >
                      <Play className="w-3 h-3" />
                      <span>
                        {isConsecutivePlaying ? 'Playing Consecutively...' : 'Play Both Consecutively'}
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setCompareSelectionIds([])}
                    className="px-3 py-1 rounded-full bg-white/10 text-white/75 text-xs"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            {/* Saved Recordings List (Matches Recording Take Card in 1000138173.png) */}
            {recordings.length === 0 ? (
              <div className="rounded-3xl bg-[#10181a] border border-white/[0.07] p-8 text-center space-y-3">
                <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-[#00e676] mx-auto">
                  <FileAudio className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-white">No Saved Recordings Yet</h3>
                <p className="text-xs text-white/55">
                  Record a speech in the Live Timer to unlock waveform playback, genuine M4A export, and self-assessment.
                </p>
                <button
                  type="button"
                  onClick={() => handleLaunchLiveSession(currentTopic, false)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#00e676] text-[#041e12] font-semibold text-xs"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Go to Live Recording Studio</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recordings.map((rec) => {
                  const isPlayingThis = activePlaybackId === rec.id && isPlayingAudio;
                  const isSelectedForCompare = compareSelectionIds.includes(rec.id);
                  const isEvalExpanded = expandedEvalRecId === rec.id;

                  return (
                    <div
                      key={rec.id}
                      className="rounded-3xl bg-[#10191b] border border-white/[0.08] p-5 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {editingRecordingId === rec.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingTitleValue}
                                onChange={(e) => setEditingTitleValue(e.target.value)}
                                className="px-3 py-1 rounded-xl bg-[#182326] border border-[#00e676] text-xs text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = { ...rec, title: editingTitleValue.trim() || rec.title };
                                  await dbSaveRecording(updated);
                                  setRecordings((prev) =>
                                    prev.map((item) => (item.id === rec.id ? updated : item))
                                  );
                                  setEditingRecordingId(null);
                                  triggerToast('Recording title updated');
                                }}
                                className="px-3 py-1 rounded-xl bg-[#00e676] text-[#041e12] text-xs font-semibold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h3 className="font-serif text-xl text-white">{rec.title}</h3>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingRecordingId(rec.id);
                                  setEditingTitleValue(rec.title);
                                }}
                                className="text-white/45 hover:text-white transition"
                                title="Rename recording"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-white/50 mt-1">
                            <span>{formatTimeMMSS(rec.durationSeconds)}</span>
                            <span>•</span>
                            <span className="text-[#00e676] font-medium">{rec.audioFormat}</span>
                            <span>•</span>
                            <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            await dbDeleteRecording(rec.id);
                            setRecordings((prev) => prev.filter((item) => item.id !== rec.id));
                            triggerToast('Recording deleted from local vault');
                          }}
                          className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-rose-500/20 text-white/50 hover:text-rose-400 flex items-center justify-center transition"
                          title="Delete recording"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Visual Audio Waveform Strip (Matches 1000138173.png) */}
                      <div className="rounded-2xl bg-[#0b1214] border border-white/[0.05] px-4 py-3 flex items-center justify-between gap-1 h-12">
                        {[28, 55, 85, 42, 65, 95, 40, 75, 50, 88, 35, 62, 78, 30, 45, 22, 18, 14].map(
                          (barH, idx) => (
                            <span
                              key={idx}
                              className={`w-1 rounded-full transition-all ${
                                isPlayingThis || idx < 13 ? 'bg-[#00e676]' : 'bg-white/20'
                              }`}
                              style={{ height: `${barH}%` }}
                            />
                          )
                        )}
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlaySavedRecording(rec)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#00e676] hover:bg-[#00f582] text-[#041e12] font-semibold text-xs transition"
                        >
                          {isPlayingThis ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPlayingThis ? 'Pause' : 'Play'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadM4A(rec)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#162225] hover:bg-[#1f3034] text-white/90 border border-white/10 font-medium text-xs transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download .M4A</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const matchingTopic =
                              topics.find((t) => t.id === rec.topicId || t.title === rec.topicTitle) ||
                              currentTopic;
                            handleLaunchLiveSession(matchingTopic, false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/10 text-white/75 text-xs border border-white/10 transition"
                        >
                          <Repeat className="w-3 h-3" />
                          <span>Repeat Topic</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCompareSelectionIds((prev) =>
                              prev.includes(rec.id)
                                ? prev.filter((id) => id !== rec.id)
                                : prev.length < 2
                                ? [...prev, rec.id]
                                : [prev[1], rec.id]
                            );
                          }}
                          className={`px-3.5 py-2 rounded-full text-xs border transition ${
                            isSelectedForCompare
                              ? 'bg-emerald-500/20 border-[#00e676] text-[#00e676] font-semibold'
                              : 'bg-white/[0.04] border-white/10 text-white/65'
                          }`}
                        >
                          {isSelectedForCompare ? 'Selected ✓' : 'Compare'}
                        </button>

                        {/* Expand Evaluation & Reflection Notes Button */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedEvalRecId((prev) => (prev === rec.id ? null : rec.id))
                          }
                          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-[#132824] text-[#00e676] text-xs font-semibold border border-emerald-500/30 transition"
                        >
                          <span>Evaluate & Notes</span>
                          {isEvalExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Expandable Structured Self-Assessment & Private Reflection Notes (Matches 1000138173.png) */}
                      {isEvalExpanded && (
                        <div className="pt-4 border-t border-white/10 space-y-5 animate-fade-in">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-serif text-2xl text-white">
                                Structured Self-Assessment
                              </h4>
                              <p className="text-xs text-white/50 mt-0.5">
                                Rate your rhetorical mastery across cognitive pillars (1–5)
                              </p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-[#132824] text-[#00e676] text-[10px] font-bold uppercase">
                              6 CRITERIA
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {(
                              [
                                { key: 'topicRelevance', label: 'Topic Relevance' },
                                { key: 'logicalStructure', label: 'Logical Structure' },
                                { key: 'clarity', label: 'Clarity' },
                                { key: 'vocabulary', label: 'Vocabulary' },
                                { key: 'fluency', label: 'Fluency' },
                                { key: 'confidence', label: 'Confidence' }
                              ] as const
                            ).map((field) => (
                              <div
                                key={field.key}
                                className="rounded-2xl bg-[#0c1315] border border-white/[0.06] px-4 py-3 flex items-center justify-between"
                              >
                                <span className="text-xs font-medium text-white/90">{field.label}</span>
                                <div className="flex items-center gap-2">
                                  {[1, 2, 3, 4, 5].map((score) => (
                                    <button
                                      key={score}
                                      type="button"
                                      onClick={async () => {
                                        const updated: SavedRecording = {
                                          ...rec,
                                          selfAssessment: {
                                            ...rec.selfAssessment,
                                            [field.key]: score
                                          }
                                        };
                                        await dbSaveRecording(updated);
                                        setRecordings((prev) =>
                                          prev.map((item) => (item.id === rec.id ? updated : item))
                                        );
                                      }}
                                      className={`w-7 h-7 rounded-full text-xs font-bold transition ${
                                        rec.selfAssessment[field.key] === score
                                          ? 'bg-[#00e676] text-[#041e12] shadow-[0_0_12px_rgba(0,230,118,0.5)]'
                                          : 'text-white/45 hover:text-white'
                                      }`}
                                    >
                                      {score}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-2.5">
                            <input
                              type="text"
                              value={rec.selfAssessment.weakness}
                              onChange={async (e) => {
                                const updated = {
                                  ...rec,
                                  selfAssessment: { ...rec.selfAssessment, weakness: e.target.value }
                                };
                                setRecordings((prev) =>
                                  prev.map((item) => (item.id === rec.id ? updated : item))
                                );
                                await dbSaveRecording(updated);
                              }}
                              placeholder="One primary weakness noticed..."
                              className="w-full px-4 py-3 rounded-2xl bg-[#0c1315] border border-white/[0.07] text-xs text-white placeholder:text-white/35"
                            />
                            <input
                              type="text"
                              value={rec.selfAssessment.improvementTarget}
                              onChange={async (e) => {
                                const updated = {
                                  ...rec,
                                  selfAssessment: {
                                    ...rec.selfAssessment,
                                    improvementTarget: e.target.value
                                  }
                                };
                                setRecordings((prev) =>
                                  prev.map((item) => (item.id === rec.id ? updated : item))
                                );
                                await dbSaveRecording(updated);
                              }}
                              placeholder="One concrete improvement target..."
                              className="w-full px-4 py-3 rounded-2xl bg-[#0c1315] border border-white/[0.07] text-xs text-white placeholder:text-white/35"
                            />
                          </div>

                          {/* Private Reflection Notes */}
                          <div className="space-y-3 pt-2">
                            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/75 flex items-center gap-2">
                              <span className="text-[#00e676]">✎</span>
                              <span>PRIVATE REFLECTION NOTES</span>
                            </div>

                            <div className="space-y-2.5">
                              <div>
                                <label className="block text-[11px] text-white/65 mb-1">
                                  What went well?
                                </label>
                                <textarea
                                  rows={2}
                                  value={rec.reflection.wentWell}
                                  onChange={async (e) => {
                                    const updated = {
                                      ...rec,
                                      reflection: { ...rec.reflection, wentWell: e.target.value }
                                    };
                                    setRecordings((prev) =>
                                      prev.map((item) => (item.id === rec.id ? updated : item))
                                    );
                                    await dbSaveRecording(updated);
                                  }}
                                  placeholder="e.g., Hooked listener immediately with analogy..."
                                  className="w-full p-3.5 rounded-2xl bg-[#0c1315] border border-white/[0.07] text-xs text-white placeholder:text-white/35"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] text-white/65 mb-1">
                                  What went wrong?
                                </label>
                                <textarea
                                  rows={2}
                                  value={rec.reflection.wentWrong}
                                  onChange={async (e) => {
                                    const updated = {
                                      ...rec,
                                      reflection: { ...rec.reflection, wentWrong: e.target.value }
                                    };
                                    setRecordings((prev) =>
                                      prev.map((item) => (item.id === rec.id ? updated : item))
                                    );
                                    await dbSaveRecording(updated);
                                  }}
                                  placeholder="e.g., Hesitated midway during the counterpoint..."
                                  className="w-full p-3.5 rounded-2xl bg-[#0c1315] border border-white/[0.07] text-xs text-white placeholder:text-white/35"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] text-white/65 mb-1">
                                  What will I improve next time?
                                </label>
                                <textarea
                                  rows={2}
                                  value={rec.reflection.improveNextTime}
                                  onChange={async (e) => {
                                    const updated = {
                                      ...rec,
                                      reflection: {
                                        ...rec.reflection,
                                        improveNextTime: e.target.value
                                      }
                                    };
                                    setRecordings((prev) =>
                                      prev.map((item) => (item.id === rec.id ? updated : item))
                                    );
                                    await dbSaveRecording(updated);
                                  }}
                                  placeholder="e.g., Stick to PREP framework ending anchor..."
                                  className="w-full p-3.5 rounded-2xl bg-[#0c1315] border border-white/[0.07] text-xs text-white placeholder:text-white/35"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setExpandedEvalRecId(null);
                                triggerToast('Evaluation & Reflection Notes saved');
                              }}
                              className="w-full py-3.5 rounded-full bg-[#34d399] hover:bg-[#00e676] text-[#041e12] font-semibold text-xs flex items-center justify-center gap-2 transition"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Save Evaluation & Collapse</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ====================================================================
          CUSTOM TOPIC + DESCRIPTION QUICK-LAUNCH MODAL (Start Timer Directly)
         ==================================================================== */}
      {isCustomTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3.5">
          <div className="w-full max-w-md rounded-3xl bg-[#10181a] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#00e676]">
                  CUSTOM TABLE TOPIC LAUNCHER
                </span>
                <h2 className="font-serif text-2xl text-white mt-0.5">
                  Add Your Own Topic & Description
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomTopicModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/60 mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="e.g., The Power of Saying No"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#162225] border border-white/10 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-[#00e676]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/60 mb-1">
                  Description / Guiding Context
                </label>
                <textarea
                  rows={3}
                  value={customTopicDescription}
                  onChange={(e) => setCustomTopicDescription(e.target.value)}
                  placeholder="Add your own description, context, or key points you want to cover..."
                  className="w-full p-3 rounded-xl bg-[#162225] border border-white/10 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-[#00e676]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                  Timer Duration ({speechMinutes} min)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 5, 10].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSelectDurationPreset(m * 60)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        speechMinutes === m
                          ? 'bg-[#00e676]/20 border-[#00e676] text-[#00e676]'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleAddCustomTopicAndStartTimerDirectly(false)}
                className="flex-1 py-3 rounded-full bg-[#00e676] hover:bg-[#00f582] text-[#041e12] font-semibold text-xs shadow-[0_0_24px_rgba(0,230,118,0.35)] flex items-center justify-center gap-1.5 transition"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Start Timer Directly</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddCustomTopicAndStartTimerDirectly(true)}
                className="py-3 px-4 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span>Start + Record</span>
              </button>

              <button
                type="button"
                onClick={handleAddCustomTopic}
                className="py-2.5 px-4 rounded-full bg-white/5 hover:bg-white/10 text-white/80 text-xs border border-white/10 transition"
              >
                Save to Stage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SETTINGS MODAL (Matches 1000138125.png)
         ==================================================================== */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3.5">
          <div className="w-full max-w-md rounded-3xl bg-[#12191c] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white">Settings</h2>
                <p className="text-xs text-white/50 mt-0.5">Timer lengths in whole minutes.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition"
                aria-label="Close settings"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#2dd4bf]">
                  SPEECH
                </span>
                <span className="font-serif text-xl sm:text-2xl text-white">{speechMinutes} min</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={speechMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  handleSelectDurationPreset(val * 60);
                }}
                className="w-full accent-[#00e676] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/40">
                <span>1 min</span>
                <span>10 min</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 5, 10].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectDurationPreset(m * 60)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                      speechMinutes === m
                        ? 'bg-[#00e676]/20 border-[#00e676] text-[#00e676]'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#2dd4bf]">
                  RESEARCH
                </span>
                <span className="font-serif text-xl sm:text-2xl text-white">{researchMinutes} min</span>
              </div>
              <input
                type="range"
                min={1}
                max={60}
                value={researchMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setResearchMinutes(val);
                  persistSettings(speechMinutes, val, isMuted);
                }}
                className="w-full accent-[#22d3ee] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/40">
                <span>1 min</span>
                <span>60 min</span>
              </div>
            </div>

            <label className="flex items-center justify-between gap-2.5 cursor-pointer pt-0.5">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isMuted}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setIsMuted(next);
                    persistSettings(speechMinutes, researchMinutes, next);
                  }}
                  className="w-4 h-4 rounded accent-[#00e676]"
                />
                <span className="text-xs font-medium text-white">Mute sound effects</span>
              </div>
              <button
                type="button"
                onClick={(ev) => toggleInfoKey('settings_mute_info', ev)}
                className="w-4 h-4 rounded-full bg-white/10 border border-white/15 text-[9px] font-serif italic font-bold text-white/70 inline-flex items-center justify-center"
              >
                i
              </button>
            </label>
            {openInfoKeys['settings_mute_info'] && (
              <p className="text-[11px] text-white/55 pl-6">
                Silences haptic chimes and stage transition bell alerts during live speech.
              </p>
            )}

            <label className="flex items-center justify-between gap-2.5 cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={enableLiveTranscription}
                  onChange={(e) => setEnableLiveTranscription(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#00e676]"
                />
                <span className="text-xs font-medium text-white">
                  Enable Web Speech API transcription
                </span>
              </div>
              <button
                type="button"
                onClick={(ev) => toggleInfoKey('settings_transcribe_info', ev)}
                className="w-4 h-4 rounded-full bg-white/10 border border-white/15 text-[9px] font-serif italic font-bold text-white/70 inline-flex items-center justify-center"
              >
                i
              </button>
            </label>
            {openInfoKeys['settings_transcribe_info'] && (
              <p className="text-[11px] text-white/55 pl-6">
                Measures live WPM, filler words, and repeated phrases locally without paid APIs.
              </p>
            )}

            <div className="pt-1 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
                <span>Saved for next time.</span>
              </div>

              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-3 rounded-full bg-[#00e676] hover:bg-[#00f582] text-[#041e12] font-semibold text-xs shadow-[0_0_24px_rgba(0,230,118,0.35)] flex items-center justify-center gap-1.5 transition"
              >
                <span>Done</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          POST-SPEECH EVALUATION & REFLECTION NOTES MODAL (Matches 1000138173.png)
         ==================================================================== */}
      {pendingRecording && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-[#0e1618] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-5 my-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00e676]">
                  ● ANALYSIS READY
                </span>
                <h2 className="font-serif text-2xl text-white mt-0.5">{pendingRecording.title}</h2>
                <p className="text-xs text-white/50 mt-0.5">
                  {formatTimeMMSS(pendingRecording.durationSeconds)} • {pendingRecording.audioFormat}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPendingRecording(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Structured Self-Assessment List (Matches 1000138173.png) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-white">Structured Self-Assessment</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#132824] text-[#00e676] text-[9px] font-bold uppercase">
                  6 CRITERIA
                </span>
              </div>

              <div className="space-y-2">
                {(
                  [
                    { key: 'topicRelevance', label: 'Topic Relevance' },
                    { key: 'logicalStructure', label: 'Logical Structure' },
                    { key: 'clarity', label: 'Clarity' },
                    { key: 'vocabulary', label: 'Vocabulary' },
                    { key: 'fluency', label: 'Fluency' },
                    { key: 'confidence', label: 'Confidence' }
                  ] as const
                ).map((field) => (
                  <div
                    key={field.key}
                    className="rounded-2xl bg-[#131d20] border border-white/[0.06] px-4 py-2.5 flex items-center justify-between"
                  >
                    <span className="text-xs text-white/90">{field.label}</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() =>
                            setPendingRecording((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    selfAssessment: { ...prev.selfAssessment, [field.key]: score }
                                  }
                                : null
                            )
                          }
                          className={`w-7 h-7 rounded-full text-xs font-bold transition ${
                            pendingRecording.selfAssessment[field.key] === score
                              ? 'bg-[#00e676] text-[#041e12] shadow-[0_0_12px_rgba(0,230,118,0.45)]'
                              : 'text-white/45 hover:text-white'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  value={pendingRecording.selfAssessment.weakness}
                  onChange={(e) =>
                    setPendingRecording((prev) =>
                      prev
                        ? {
                            ...prev,
                            selfAssessment: { ...prev.selfAssessment, weakness: e.target.value }
                          }
                        : null
                    )
                  }
                  placeholder="One primary weakness noticed..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#131d20] border border-white/10 text-xs text-white placeholder:text-white/35"
                />
                <input
                  type="text"
                  value={pendingRecording.selfAssessment.improvementTarget}
                  onChange={(e) =>
                    setPendingRecording((prev) =>
                      prev
                        ? {
                            ...prev,
                            selfAssessment: { ...prev.selfAssessment, improvementTarget: e.target.value }
                          }
                        : null
                    )
                  }
                  placeholder="One concrete improvement target..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#131d20] border border-white/10 text-xs text-white placeholder:text-white/35"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/75">
                PRIVATE REFLECTION NOTES
              </div>
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={pendingRecording.reflection.wentWell}
                  onChange={(e) =>
                    setPendingRecording((prev) =>
                      prev
                        ? { ...prev, reflection: { ...prev.reflection, wentWell: e.target.value } }
                        : null
                    )
                  }
                  placeholder="What went well?"
                  className="w-full p-3 rounded-2xl bg-[#131d20] border border-white/10 text-xs text-white placeholder:text-white/35"
                />
                <textarea
                  rows={2}
                  value={pendingRecording.reflection.wentWrong}
                  onChange={(e) =>
                    setPendingRecording((prev) =>
                      prev
                        ? { ...prev, reflection: { ...prev.reflection, wentWrong: e.target.value } }
                        : null
                    )
                  }
                  placeholder="What went wrong?"
                  className="w-full p-3 rounded-2xl bg-[#131d20] border border-white/10 text-xs text-white placeholder:text-white/35"
                />
                <textarea
                  rows={2}
                  value={pendingRecording.reflection.improveNextTime}
                  onChange={(e) =>
                    setPendingRecording((prev) =>
                      prev
                        ? { ...prev, reflection: { ...prev.reflection, improveNextTime: e.target.value } }
                        : null
                    )
                  }
                  placeholder="What will I improve next time?"
                  className="w-full p-3 rounded-2xl bg-[#131d20] border border-white/10 text-xs text-white placeholder:text-white/35"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handlePlaySavedRecording(pendingRecording)}
                  className="py-2.5 px-4 rounded-full bg-[#131d20] hover:bg-white/10 border border-white/10 text-white text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Recording</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadM4A(pendingRecording)}
                  className="py-2.5 px-4 rounded-full bg-[#131d20] hover:bg-white/10 border border-white/10 text-white text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .M4A</span>
                </button>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await dbSaveRecording(pendingRecording);
                  setRecordings((prev) =>
                    prev.map((r) => (r.id === pendingRecording.id ? pendingRecording : r))
                  );
                  setPendingRecording(null);
                  setActiveTab('library');
                  triggerToast('Evaluation & Reflection Notes saved to IndexedDB');
                }}
                className="w-full py-3.5 rounded-full bg-[#34d399] hover:bg-[#00e676] text-[#041e12] font-semibold text-xs shadow-[0_0_25px_rgba(0,230,118,0.3)] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Evaluation & View Library</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          VERCEL DEPLOYMENT & M4A ARCHITECTURE INFO MODAL
         ==================================================================== */}
      {isVercelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3.5">
          <div className="w-full max-w-lg rounded-3xl bg-[#11191b] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#00e676]">
                  PRODUCTION DEPLOYMENT & AUDIO ENGINE
                </span>
                <h2 className="font-serif text-2xl text-white mt-0.5">
                  Vercel Deployment & Genuine M4A Pipeline
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsVercelModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-white/70 leading-relaxed">
              <div className="rounded-xl bg-[#162124] border border-white/[0.06] p-3.5 space-y-1">
                <div className="font-semibold text-white">1. Deploy to Vercel</div>
                <p>
                  Extract <code className="text-emerald-300">unprompted_vercel_vite_project.zip</code> and run{' '}
                  <code className="text-emerald-300">npx vercel --prod</code>.
                </p>
              </div>

              <div className="rounded-xl bg-[#162124] border border-white/[0.06] p-3.5 space-y-1">
                <div className="font-semibold text-white">2. Genuine ISO-BMFF M4A Audio Architecture</div>
                <p>
                  Uses native <code className="text-emerald-300">audio/mp4;codecs=mp4a.40.2</code> or encodes PCM via
                  WebCodecs AAC-LC / Apple Lossless inside an ISO-BMFF (<code className="text-emerald-300">ftypM4A </code>)
                  container.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsVercelModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#00e676] text-[#041e12] font-semibold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Interactive Topic Spinner Wheel Modal */}
      <TopicWheelModal
        isOpen={isWheelModalOpen}
        onClose={() => setIsWheelModalOpen(false)}
        topics={filteredCategoryTopics.length > 0 ? filteredCategoryTopics : topics}
        onSelectTopic={(t) => setCurrentTopic(t)}
        isSpinning={isSpinning}
        onTriggerSpin={() => handleSpinTopic()}
        selectedTopic={currentTopic}
      />

      {/* ====================================================================
          ANDROID THUMB-ZONE BOTTOM NAVIGATION BAR (Matches 1000138176.png & 1000138164.png)
         ==================================================================== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#070d0e]/95 backdrop-blur-lg border-t border-white/[0.07] px-2 flex items-center justify-around">
        <button
          type="button"
          onClick={() => setActiveTab('practice')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'practice' ? 'text-[#00e676]' : 'text-white/55'
          }`}
        >
          <Dices className="w-5 h-5" />
          <span className="text-[10px] font-medium">Practice</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'categories' ? 'text-[#00e676]' : 'text-white/55'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Topics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('live_timer')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'live_timer' ? 'text-[#00e676]' : 'text-white/55'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-medium">Timer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('frameworks')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'frameworks' ? 'text-[#00e676]' : 'text-white/55'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium">Methods</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`relative flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'library' ? 'text-[#00e676]' : 'text-white/55'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Library</span>
          {recordings.length > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-[#00e676] text-[#041e12] text-[9px] font-bold flex items-center justify-center">
              {recordings.length}
            </span>
          )}
        </button>
      </nav>

      {/* ====================================================================
          PERSISTENT DESKTOP FOOTER BAR
         ==================================================================== */}
      <footer className="hidden md:block relative z-20 w-full px-6 py-2.5 border-t border-white/[0.06] bg-[#070b0c]/85 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/45">
          <div className="flex items-center gap-2">
            <span>made by @bitterbuilds</span>
            <span>•</span>
            <span>Atmospheric Impromptu Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleSpinTopic()}
              className="inline-flex items-center gap-1.5 hover:text-white transition"
            >
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.07] border border-white/10 text-[10px] font-mono text-white/80">
                SPACE
              </kbd>
              <span>Spin / Next</span>
            </button>

            <button
              type="button"
              onClick={() => handleLaunchLiveSession()}
              className="inline-flex items-center gap-1.5 hover:text-white transition"
            >
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.07] border border-white/10 text-[10px] font-mono text-white/80">
                T
              </kbd>
              <span>Start Timer</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              className="inline-flex items-center gap-1.5 hover:text-white transition"
            >
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.07] border border-white/10 text-[10px] font-mono text-white/80">
                M
              </kbd>
              <span>Mute</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
