export const HIGH_PRIORITY_TOPICS = [
  "Normalization", "SQL", "ER Model", "ER diagrams", // DBMS
  "Functions", "Lists", // Python
  "SDLC", "Testing", "Waterfall model", "Incremental model", "Evolutionary model", "Agile basics", "XP concepts", // SE (SDLC models)
  "Control systems", "Continuous vs Discrete control", "Robotics basics", "Robot components", "Sensors", "PLC" // Automation
];

export const INITIAL_PLAN = [
  {
    date: "2026-05-03",
    day: "MAY 3",
    color: "bg-red-500",
    sessions: {
      morning: {
        subject: "Software Engineering (Unit 1)",
        topics: ["Nature of Software", "Software Engineering basics", "SDLC"]
      },
      mid: {
        subject: "DBMS (Unit 1)",
        topics: ["DBMS concepts", "File system vs DBMS", "3-schema architecture"]
      },
      night: {
        subject: "Revision",
        topics: ["Revise SE + DBMS"]
      }
    }
  },
  {
    date: "2026-05-04",
    day: "MAY 4",
    color: "bg-orange-500",
    sessions: {
      morning: {
        subject: "Automation (Unit 1)",
        topics: ["Production systems", "Automation basics", "Reasons for automation"]
      },
      mid: {
        subject: "Python (Module 1)",
        topics: ["Tokens", "Operators + precedence", "Type conversion"]
      },
      night: {
        subject: "Practice & Revise",
        topics: ["Practice Python", "Revise Automation"]
      }
    }
  },
  {
    date: "2026-05-05",
    day: "MAY 5",
    color: "bg-yellow-500",
    sessions: {
      morning: {
        subject: "Software Engineering (Unit 1 cont.)",
        topics: ["Waterfall model", "Incremental model", "Evolutionary model", "Agile basics", "XP concepts"]
      },
      mid: {
        subject: "DBMS (Unit 2)",
        topics: ["ER Model", "Entities", "Attributes", "Relationships"]
      },
      night: {
        subject: "Practice & Revise",
        topics: ["ER diagram practice", "Revise SE models"]
      }
    }
  },
  {
    date: "2026-05-06",
    day: "MAY 6",
    color: "bg-green-500",
    sessions: {
      morning: {
        subject: "Automation (Unit 2)",
        topics: ["Control systems", "Continuous vs Discrete control"]
      },
      mid: {
        subject: "Python (Module 2)",
        topics: ["Functions", "Argument types", "Scope of variables"]
      },
      night: {
        subject: "Practice & Revise",
        topics: ["Practice functions", "Revise control systems"]
      }
    }
  },
  {
    date: "2026-05-07",
    day: "MAY 7",
    color: "bg-blue-500",
    sessions: {
      morning: {
        subject: "Software Engineering (Unit 2)",
        topics: ["Requirement engineering", "Functional vs non-functional", "Requirement process"]
      },
      mid: {
        subject: "DBMS (Unit 2 cont.)",
        topics: ["Relational model", "Keys", "Constraints"]
      },
      night: {
        subject: "Revision",
        topics: ["Revision"]
      }
    }
  },
  {
    date: "2026-05-08",
    day: "MAY 8",
    color: "bg-purple-500",
    sessions: {
      morning: {
        subject: "Automation (Unit 3)",
        topics: ["Robotics basics", "Robot components", "Sensors"]
      },
      mid: {
        subject: "Python (Module 3)",
        topics: ["Strings", "Lists", "Dictionary"]
      },
      night: {
        subject: "Practice",
        topics: ["Practice lists & dictionary"]
      }
    }
  },
  {
    date: "2026-05-09",
    day: "MAY 9",
    color: "bg-red-600",
    isImportant: true,
    sessions: {
      morning: {
        subject: "Software Engineering (Unit 3 & 4)",
        topics: ["Design concepts", "Testing"]
      },
      mid: {
        subject: "DBMS (Unit 3)",
        topics: ["SQL", "Joins", "Nested queries"]
      },
      night: {
        subject: "Practice",
        topics: ["SQL practice"]
      }
    }
  },
  {
    date: "2026-05-10",
    day: "MAY 10",
    color: "bg-red-600",
    isAlert: true,
    title: "DBMS FULL DAY",
    sessions: {
      morning: {
        subject: "DBMS Focus",
        topics: ["ER diagrams", "Normalization"]
      },
      mid: {
        subject: "DBMS Focus",
        topics: ["SQL queries", "Transactions"]
      },
      night: {
        subject: "Revision",
        topics: ["Revise important definitions"]
      }
    }
  },
  {
    date: "2026-05-11",
    day: "MAY 11",
    color: "bg-red-500",
    title: "EXAM STRATEGY",
    sessions: {
      morning: { subject: "Python Exam Focus", topics: ["Functions"] },
      mid: { subject: "Python Exam Focus", topics: ["Lists"] },
      night: { subject: "Python Exam Focus", topics: ["Strings"] }
    }
  },
  {
    date: "2026-05-12",
    day: "MAY 12",
    color: "bg-orange-500",
    title: "EXAM STRATEGY",
    sessions: {
      morning: { subject: "SE Exam Focus", topics: ["Models"] },
      mid: { subject: "SE Exam Focus", topics: ["Testing"] },
      night: { subject: "SE Exam Focus", topics: ["Diagrams"] }
    }
  },
  {
    date: "2026-05-13",
    day: "MAY 13-17",
    color: "bg-yellow-500",
    title: "EXAM STRATEGY",
    sessions: {
      morning: { subject: "Automation Exam Focus", topics: ["Control systems"] },
      mid: { subject: "Automation Exam Focus", topics: ["PLC"] },
      night: { subject: "Automation Exam Focus", topics: ["Robotics"] }
    }
  }
];

export const isHighPriority = (topic) => {
  return HIGH_PRIORITY_TOPICS.some(t => topic.toLowerCase().includes(t.toLowerCase()));
};
