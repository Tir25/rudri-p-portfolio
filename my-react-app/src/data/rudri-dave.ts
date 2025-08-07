export interface RudriDave {
  name: string;
  title: string;
  summary: string;
  bio: string;
  currentPosition: string;
  education: string;
  experience: string[];
  skills: string[];
  achievements: string[];
  vision: string;
  interests: string[];
  contact: {
    email?: string;
    linkedin?: string;
    researchGate?: string;
  };
}

export const rudriDaveData: RudriDave = {
  name: "Rudri Dave",
  title: "Assistant Professor | PhD Researcher | Consultant | Senior Business Analyst",
  summary: "Assistant Professor | PhD Researcher | Consultant | Senior Business Analyst | Ex-Unnati | Ex-TCSer",
  bio: "Rudri Dave is an Assistant Professor at Ganpat University - V.M. Patel College of Management Studies, Gujarat, India. She had worked in renowned Industries previously like TCS and Unnati. Her specific domain is Statistics. She loves to teach Statistics. Her vision to shift from industry to academia is to create a bridge between theoretical knowledge and its practical life implication.",
  currentPosition: "Assistant Professor at Ganpat University - V.M. Patel College of Management Studies, Gujarat, India",
  education: "Master's degree in Statistics from Gujarat University",
  experience: [
    "Assistant Professor at Ganpat University - V.M. Patel College of Management Studies",
    "Senior Business Analyst at Unnati",
    "Business Analyst at TCS (Tata Consultancy Services)"
  ],
  skills: [
    "Statistical Data Analysis",
    "Tableau",
    "R Programming",
    "Microsoft Office",
    "Interpersonal Communication",
    "Research Methodology",
    "Data Visualization",
    "Statistical Modeling"
  ],
  achievements: [
    "Won the best research paper award at the 3rd International Conference organized by Ganpat University",
    "Currently pursuing PhD in Statistics",
    "Successfully transitioned from industry to academia",
    "Experienced in bridging theoretical knowledge with practical applications"
  ],
  vision: "To create a bridge between theoretical knowledge and its practical life implications, making statistics accessible and applicable in real-world scenarios.",
  interests: [
    "Statistical Research",
    "Data Analysis",
    "Teaching Statistics",
    "Academic Research",
    "Business Analytics",
    "Statistical Modeling",
    "Research Methodology",
    "Data Visualization"
  ],
  contact: {
    email: "rudri.dave@ganpatuniversity.ac.in",
    linkedin: "linkedin.com/in/rudri-dave",
    researchGate: "researchgate.net/profile/rudri-dave"
  }
}; 