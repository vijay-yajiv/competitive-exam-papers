import { ExamPaper } from "@/types/examPaper";

export const examPapers: ExamPaper[] = [
  // IIT-JEE Papers 2023
  {
    id: "jee-main-2023-jan-session1",
    examType: "iit",
    year: "2023",
    paperType: "JEE Main January Session - Paper 1 (B.E./B.Tech)",
    paperUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    solutionUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    views: 1254
  },
  {
    id: "jee-main-2023-april-session2",
    examType: "iit",
    year: "2023",
    paperType: "JEE Main April Session - Paper 1 (B.E./B.Tech)",
    paperUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    solutionUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    hasDownload: true,
    hasSolution: true
  },
  {
    id: "jee-advanced-2023",
    examType: "iit",
    year: "2023",
    paperType: "JEE Advanced - Paper 1 & 2",
    paperUrl: "https://www.embibe.com/exams/jee-advanced-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/jee-advanced-question-papers/",
    hasDownload: true,
    hasSolution: true
  },
  
  // NEET Papers 2023
  {
    id: "neet-2023-paper",
    examType: "neet",
    year: "2023",
    paperType: "NEET 2023 - Physics, Chemistry, Biology",
    paperUrl: "https://www.embibe.com/exams/neet-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/neet-question-papers/",
    hasDownload: true,
    hasSolution: true
  },
  {
    id: "neet-2023-physics",
    examType: "neet",
    year: "2023",
    paperType: "NEET 2023 - Physics",
    paperUrl: "https://www.embibe.com/exams/neet-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/neet-question-papers/",
    hasDownload: true,
    hasSolution: true
  },
  {
    id: "neet-2023-chemistry",
    examType: "neet",
    year: "2023",
    paperType: "NEET 2023 - Chemistry",
    paperUrl: "https://www.embibe.com/exams/neet-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/neet-question-papers/",
    hasDownload: true,
    hasSolution: true
  },
  {
    id: "neet-2023-biology",
    examType: "neet",
    year: "2023",
    paperType: "NEET 2023 - Biology",
    paperUrl: "https://www.embibe.com/exams/neet-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/neet-question-papers/",
    hasDownload: true,
    hasSolution: true
  },
  
  // GATE Papers 2023
  {
    id: "gate-2023-cse",
    examType: "gate",
    year: "2023",
    paperType: "GATE 2023 - Computer Science Engineering",
    paperUrl: "https://gate.iitk.ac.in/",
    hasDownload: true,
    hasSolution: false,
    subjects: ["Computer Science", "General Aptitude"],
    views: 875
  },
  {
    id: "gate-2023-ee",
    examType: "gate",
    year: "2023",
    paperType: "GATE 2023 - Electrical Engineering",
    paperUrl: "https://gate.iitk.ac.in/",
    hasDownload: true,
    hasSolution: false,
    subjects: ["Electrical Engineering", "General Aptitude"],
    views: 652
  },

  // IIT-JEE Papers 2022
  {
    id: "jee-main-2022-jan-session1",
    examType: "iit",
    year: "2022",
    paperType: "JEE Main January Session - Paper 1 (B.E./B.Tech)",
    paperUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    solutionUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    views: 982
  },
  {
    id: "jee-advanced-2022",
    examType: "iit",
    year: "2022",
    paperType: "JEE Advanced - Paper 1 & 2",
    paperUrl: "https://www.embibe.com/exams/jee-advanced-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/jee-advanced-question-papers/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    views: 890
  },

  // NEET Papers 2022
  {
    id: "neet-2022-paper",
    examType: "neet",
    year: "2022",
    paperType: "NEET 2022 - Physics, Chemistry, Biology",
    paperUrl: "https://www.embibe.com/exams/neet-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/neet-question-papers/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Biology"],
    views: 1054
  },

  // GATE Papers 2022
  {
    id: "gate-2022-cse",
    examType: "gate",
    year: "2022",
    paperType: "GATE 2022 - Computer Science Engineering",
    paperUrl: "https://gate.iitk.ac.in/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Computer Science", "General Aptitude"],
    views: 742
  },

  // IIT-JEE Papers 2021
  {
    id: "jee-main-2021-feb-session1",
    examType: "iit",
    year: "2021",
    paperType: "JEE Main February Session - Paper 1",
    paperUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    solutionUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    views: 765
  },
  {
    id: "jee-advanced-2021",
    examType: "iit",
    year: "2021",
    paperType: "JEE Advanced - Paper 1 & 2",
    paperUrl: "https://www.embibe.com/exams/jee-advanced-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/jee-advanced-question-papers/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    views: 683
  },

  // NEET Papers 2021
  {
    id: "neet-2021-paper",
    examType: "neet",
    year: "2021",
    paperType: "NEET 2021 - Physics, Chemistry, Biology",
    paperUrl: "https://www.embibe.com/exams/neet-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/neet-question-papers/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Biology"],
    views: 921
  },

  // Papers for 2020
  {
    id: "jee-main-2020-jan",
    examType: "iit",
    year: "2020",
    paperType: "JEE Main January Session - Paper 1",
    paperUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    solutionUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    views: 583
  },
  {
    id: "neet-2020-paper",
    examType: "neet",
    year: "2020",
    paperType: "NEET 2020 - Physics, Chemistry, Biology",
    paperUrl: "https://www.embibe.com/exams/neet-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/neet-question-papers/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Biology"],
    views: 712
  },
  {
    id: "gate-2020-cse",
    examType: "gate",
    year: "2020",
    paperType: "GATE 2020 - Computer Science Engineering",
    paperUrl: "https://gate.iitk.ac.in/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Computer Science", "General Aptitude"],
    views: 621
  },

  // Papers for 2019
  {
    id: "jee-main-2019-jan",
    examType: "iit",
    year: "2019",
    paperType: "JEE Main January Session - Paper 1",
    paperUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    solutionUrl: "https://www.embibe.com/exams/jee-mains-question-paper/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    views: 432
  },
  {
    id: "neet-2019-paper",
    examType: "neet",
    year: "2019",
    paperType: "NEET 2019 - Physics, Chemistry, Biology",
    paperUrl: "https://www.embibe.com/exams/neet-question-papers/",
    solutionUrl: "https://www.embibe.com/exams/neet-question-papers/",
    hasDownload: true,
    hasSolution: true,
    subjects: ["Physics", "Chemistry", "Biology"],
    views: 589
  }
];
