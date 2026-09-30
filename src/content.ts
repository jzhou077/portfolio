export type Photo = { src?: string; alt: string };

export type Job = {
  role: string;
  org: string;
  start: string;
  end: string;
  body: string;
  stack?: string;
};

export type Project = {
  title: string;
  year: string;
  body: string;
  stack: string;
  repo?: string;
  demo?: string;
  note?: string;
  photo?: Photo;
  figure?: { kind: "pursuit"; caption: string };
};

export const profile = {
  name: "Jack Zhou",
  email: "jackzhou@mit.edu",
  github: "https://github.com/jzhou077",
  linkedin: "https://www.linkedin.com/in/jack-zhou-95a15a253/",
  resume: "/Jack_Zhou_Resume.pdf",
  photo: { src: "images/headshot.jpg", alt: "Photo of Me" } as Photo,
};

export const intro: string[] = [
  "I'm a sophomore at MIT studying electrical engineering and computer science. Most of what I've built involves robots, sensor data, or both.",
  "Right now I'm an undergraduate researcher in MIT's [Department of Brain and Cognitive Sciences](https://bcs.mit.edu), working on software for scoring sleep from EEG recordings. This summer I interned at Coded By in Philadelphia, where I built a knowledge graph that AI agents can query.",
  "Before MIT I spent four years on SLAM Robotics, an FTC team, and ended up leading the software side. At MIT, I'm a part of AppDev@MIT and Human Technology Integration Club (HTIC). Previously, I also spent time on the telemetry team in MIT Motorsports.",
];

export const scopeCaption =
  "Two synthetic signals: EEG with a couple of sleep spindles, like the recordings I work with in the lab, and a speed trace like the ones from the Motorsports telemetry platform.";

export const experience: Job[] = [
  {
    role: "Undergraduate Researcher",
    org: "MIT Brain and Cognitive Sciences",
    start: "Jan 2026",
    end: "present",
    body: "I extended [AccuSleePy](https://github.com/zekebarger/AccuSleePy) for lab-specific needs, an open-source tool for scoring rodent sleep from EEG and EMG, with spectral analysis: power distribution plots and automatic calculations that make manual sleep-stage scoring easier. I also wrote a Python decoder that converts the lab's raw binary EEG/EMG recordings into CSV so AccuSleePy can read them.",
    stack: "Python, signal processing",
  },
  {
    role: "Software Engineering Intern",
    org: "Coded By",
    start: "Jun 2026",
    end: "Aug 2026",
    body: "Built a context layer for enterprise AI agents. It pulls information out of the tools a company already uses, like Notion and Google Drive, into a knowledge graph that agents query through a remote MCP server. The code is below under KnowHow.",
    stack: "Python, FastAPI, Neo4j, MCP",
  },
  {
    role: "Telemetry Team",
    org: "MIT Motorsports",
    start: "Aug 2025",
    end: "Dec 2025",
    body: "Helped build the team's telemetry platform, which lets engineers on every subteam pull up racecar data like speed, voltage, and temperature. I designed and shipped \"functions\": users write and save Python that transforms and plots telemetry inside the app, which made new visualizations much faster to produce.",
    stack: "Next.js, FastAPI, MongoDB",
  },
  {
    role: "Software Lead",
    org: "SLAM Robotics",
    start: "Sep 2021",
    end: "Jun 2025",
    body: "Led a software team of over six students: onboarding new members, overseeing system design, and helping plan game strategy. On the robot I worked on computer vision, autonomous movement, and driver macros.",
    stack: "Java, OpenCV",
  },
];

export const projects: Project[] = [
  {
    title: "Odin",
    year: "2026",
    repo: "Odin",
    body: "The project from my Coded By internship. A crawler pulls a company's Notion workspace into a temporal knowledge graph built with Graphiti on Neo4j, and agents query it through an MCP server. A small Streamlit app lets you browse the graph.",
    stack: "Python, FastAPI, Graphiti, Neo4j, MCP, Streamlit",
    photo: { src: "images/odin_demo.gif",alt: "Screenshot of the KnowHow graph browser" },
  },
  {
    title: "Autonomous robot for MASLAB",
    year: "2026",
    repo: "MASLAB-Team3-2026",
    body: "MASLAB is MIT's January robotics competition, where teams build a fully autonomous robot in about a month. Using my previous experience in autonomous movement, I worked on navigation for our six-person team: computer vision to find targets, and a pure pursuit controller for our two-wheel differential drive. We won the Wilken's Design Award for our unique and robust robot design.",
    stack: "Python, OpenCV",
    figure: {
      kind: "pursuit",
      caption:
        "A small simulation of pure pursuit, the path-following algorithm I implemented for our MASLAB robot. The robot picks the point on the dashed path one lookahead distance away (the faint circle) and drives the arc that reaches it.",
    },
  },
  {
    title: "FTC AI Assistant",
    year: "2024",
    repo: "ftc-ai-assistant",
    body: "A chatbot that knows the current FTC game manual. Finding details like the size of a scoring element or how many points a task is worth meant a lot of Ctrl+F through a very long PDF, so I built a retrieval-augmented assistant my teammates could just ask.",
    stack: "Next.js, Supabase, OpenAI Assistants API",
    note: "The hosted version is offline because its database is paused.",
  },
  {
    title: "Brainwave Reader",
    year: "2023",
    repo: "Brainwave-Reader",
    body: "Reads raw serial data from a NeuroSky EEG chip over Bluetooth and switches a relay through an Arduino based on brain activity. I tested it with the headset from a Star Wars Force Trainer II.",
    stack: "C#, .NET, Arduino",
    photo: { src: "images/brainwave_setup.jpg", alt: "Photo of the Brainwave Reader setup" },
  },
  {
    title: "Sign-ify",
    year: "2023",
    repo: "Sign-ify",
    demo: "https://jzhou077.github.io/Sign-ify/",
    body: "My entry for the Ctrl+Shift 2023 competition: a website about the effects hearing loss can have when it isn't addressed. It features an machine learning model that recognizes ASL letters.",
    stack: "HTML, CSS, JavaScript",
  },
];

export const skills: { label: string; items: string }[] = [
  { label: "Languages", items: "Python, TypeScript, JavaScript, Java, C, C#, SQL" },
  { label: "Frameworks", items: "React, Next.js, FastAPI, .NET, OpenCV" },
  { label: "Coursework", items: "Algorithms, Discrete Math, Differential Equations, C and Assembly" },
];
