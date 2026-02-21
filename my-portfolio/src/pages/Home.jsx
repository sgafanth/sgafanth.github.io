import { useRef } from "react";
import { Link } from "react-router-dom";
import { getTheme } from '../theme';
import { 
  Mail, 
  Linkedin, 
  Github,
  ArrowRight, 
  ExternalLink, 
  Moon, 
  Sun, 
  Brain, 
  Database,
  Beaker,
  Briefcase,
  ChevronDown, 
} from 'lucide-react';

const Portfolio = ({ darkMode, setDarkMode }) => {
  const EMERGING_SIGNALS_PROJECT = "Emerging Signals - A horizon scanning tool";
  const theme = getTheme(darkMode);
  const duckAudioRef = useRef(null);

  const handleDuckClick = () => {
    if (!duckAudioRef.current) {
      duckAudioRef.current = new Audio("/secret/duck.m4a");
    }

    duckAudioRef.current.currentTime = 0;
    duckAudioRef.current.play().catch(() => {});
  };

  // --- DATA ---

  const experience = [
    {
      title: "Data Scientist - AI & Innovation Lab",
      company: "DWP Digital",
      companyUrl: "https://www.gov.uk/government/organisations/department-for-work-pensions",
      logoUrl: "images/dwp_crown_square.jpeg", 
      period: "2025 - Present",
      summary: "Utilising technology to deliver solutions for internal stakeholders.",
      achievements: [
        "**Multiple Projects Involving: **NLP, Agentic AI, classification, transformers, and computer vision. ",
        "**Horizon Scanning:** To identify and share knowledge on emerging technologies and threats.",
        '**Technical Delivery & Recognition:** Received internal award for technical capability, remarkable pace, and high-quality output.',
        "**Knowledge Sharing & Influence:** Regularly presented to groups of 15-**100+ colleagues**.",
        
      ],
      skills: [
        "AWS (Lambda, EC2, SageMaker, IAM)",
        "Azure OpenAI",
        "Natural Language Processing (NLP)",
        "Computer Vision",
        "CNN",
        "Transfer Learning",
        "Classification",
        "Large Language Models (LLMs)",
        "Proof of Concept Development",
        "Horizon Scanning"
      ]
    },
    {
      title: "Data Scientist",
      company: "zally",
      companyUrl: "https://www.zally.com/",
      logoUrl: "images/zally_square.png",
      period: "2024 - 2025",
      summary: "Combined applied research with rapid experimentation to deliver 100+ user models to production with >90% accuracy.",
      achievements: [
        "**Increased model accuracy:** Improved ML model accuracy from 60% to over 90% by running 200+ experiments on datasets containing 450,000+ rows per user across 100+ users.",
        "**Automated bad data filtering:** Built an end-to-end pipeline to label and filter irrelevant data representing 60% of all user data by utilising Python, CatBoost, and AWS S3.",
        "**KPI dashboard:** Built and deployed an interactive dashboard on AWS EC2 to present KPIs and data insights to technical and non-technical stakeholders.",
        "**Code quality and reliability:** Documented and formatted 54 modules to PEP8 standards and maintained unit tests with a minimum of 80% code coverage.",
        "**Deployed models to production:** Used AWS services (S3, SageMaker, DynamoDB, EC2) to deploy models and managed code using Git and Azure DevOps."
      ],
      skills: [
        "Machine Learning",
        "CatBoost",
        "AWS (S3, EC2, SageMaker, DynamoDB)",
        "Data Pipelines",
        "Unit Testing",
        "Git",
        "Experimentation & Model Tuning",
        "Technical Documentation",
        "Stakeholder Communication"
      ]
    },
    {
      title: "BSc (Hons) Computer Science Student",
      company: "University of Liverpool",
      companyUrl: "https://www.liverpool.ac.uk/",
      logoUrl: "images/liverpool_logo_square.png",
      period: "2019 - 2023", 
      summary: "First-class Computer Science graduate.", 
      achievements: [ 
        "**Achieved academic distinction:** Graduated with First Class Honours in BSc Computer Science.", 
        "**Built NLP application:** Developed a chatbot web app using HuggingFace (GPT-2), Flask, and Python.", 
      ], 
      skills: [ 
        "Natural Language Processing", 
        "Statistics & Mathematics",
        "Systems, Infrastructure, & Security",
        "Algorithms, Data Structures, & Theory",
        "Artificial Intelligence", 
        "Software Engineering",
        "Data Mining & Visualisation", 
      ] },

    // {
    //   title: "Junior Data Scientist - 12 Month University Industrial Placement",
    //   company: "Alder Hey Innovation Hub",
    //   companyUrl: "https://www.alderheyinnovation.com/",
    //   logoUrl: "images/alderhey.webp",
    //   period: "2021 - 2022",
    //   summary: "Developed a clinical risk prediction tool that achieved an ROC of 0.85, outperforming comparable studies by 7.6% while analysing 160,000+ patient records.",
    //   achievements: [
    //     "**Clinical risk model:** Built Random Forest and CatBoost models to flag readmission risk, achieving ROC 0.85 and outperforming other studies by 7.6%.",
    //     "**Large disparate datasets:** Used SQL and Python to extract, preprocess, and analyse 160,000+ patient records spanning 5 years.",
    //     "**Operational insights:** Visualised weekly readmission risk scores for hundreds of patients using Microsoft PowerBI.",
    //     "**Model performance analysis:** Tracked model performance through live time-series graphs, saving over 1 hour per week of manual testing.",
    //     "**Delivered at pace:** Worked in Agile 2-week sprints with daily scrums to deliver features ahead of schedule."
    //   ],
    //   skills: [
    //     "Python",
    //     "SQL",
    //     "Machine Learning",
    //     "CatBoost",
    //     "Healthcare Data Analysis",
    //     "Exploratory Data Analysis",
    //     "Data Preprocessing",
    //     "Time-Series Analysis",
    //     "Agile Development"
    //   ]
    // },
    
    // {
    //   title: "Software Engineer [Work Experience]",
    //   company: "Thomson Reuters [Now LSEG]",
    //   companyUrl: "https://www.thomsonreuters.com/",
    //   logoUrl: "images/Thomson-Reuters-Logo.png",
    //   period: "AUG 2018 – SEP 2018",
    //   summary: "Two-week software engineering placement, delivering automation scripts that improved operational efficiency.",
    //   achievements: [
    //     "**Process Automation:** Automated a manual Hadoop Hive table-splitting process in Python, saving **30 minutes per day** and reducing human error.",
    //     "**Stream Validation Tooling:** Built a RegEx-based Python script to compare Kafka output topics with YAML configurations, auto-generating missing topics and saving **2+ hours per week**.",
    //     "**Independent Delivery:** Delivered listed engineering tasks a week ahead of schedule within a two-week placement."
    //   ],
    //   skills: ["Python", "Hadoop Hive", "Kafka", "RegEx", "Automation"]
    // }
  ];

  const sideProjects = [
    {
      title: "Medium Blog Posts",
      url: "https://andyfanthome.medium.com/",
      period: "2026 - Present",
      description: "Blog posts detailing my AI and data science projects.",
      skills: []
    },
    {
      title: "GitHub Projects",
      url: "https://github.com/sgafanth",
      period: "2025-Present",
      description: "Showcase of my AI and data science projects.",
      skills: []
    }
  ];

  const projects = {
     "Emerging Signals - A horizon scanning tool": [
      "Using AWS services, huggingface sentence-embedder, and rss-feeds to display trends and emerging technology/threats to aid horizon scanning. [In progress]",
      
    ],
    "Customer Complaint Triage Tool": [
      "Investigating if NLP and machine learning can be used to correctly label plain-text complaints sent to financial institutions. [In progress]"
    ],

    // "Logo Identification - Computer Vision": [
    //   "Using computer vision to match unknown logos to ones in a reference library. [In progress]",
      
    // ],

    // "Analysis and Forecasting Redunancies": [
    //   "How well can historical and recent data industry and market data be used to predict changes in redundancy rates? [In progress]"
    // ],

    // "Sentiment Analysis in News": [
    //   "Looking at changes in discourse in the past couple of decades. [In progress]"
    // ],

    "Downfall Video Game": [
      "A top-down 2D shoot-em-up game made for my Computer Science A-Level coursework. [Pending upload]"
    ],
  };

  const skills = {
    "Applied Machine Learning & Analysis": [
      "Production classification models",
      "Transfer learning",
      "NLP and HuggingFace transformers",
      "Large language models",
      "Computer vision prototypes",
      "Azure OpenAI",
      "Exploratory Data Analysis",
      "Feature Engineering"
    ],

    "Data Engineering & MLOps": [
      "End-to-end ML pipelines",
      "SQL and large datasets",
      "AWS and Azure",
      "Unit testing",
      "Git and refactoring",
      "AWS (SageMaker, Lambda, S3, EC2, DynamoDB)",
      
    ],

    "Experimentation & Analytical Thinking": [
      "Large-scale experimentation",
      "Hyperparameter optimisation",
      "Model performance evaluation",
    ],

    "Delivery, Communication & Impact": [
      "Dashboard Creation",
      "Horizon Scanning",
      "Technical presentations (Audience of 100+)",
      "Collaboration"
    ]
  };


  // --- RENDER ---

  return (
    <div className={`page-offset min-h-screen ${theme.page} transition-colors duration-300 font-sans`}>
      
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed bottom-5 right-5 md:top-5 md:bottom-auto md:right-8 z-50 p-4 rounded-full ${theme.toggleButton} transition-all shadow-lg`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={28} /> : <Moon size={28} />}
      </button>

      {/* Hero Section */}
      <section className={`pt-[55px] md:pt-14 lg:pt-16 pb-20 px-6 md:px-8 overflow-hidden ${theme.heroSectionBg}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-2 md:gap-10 lg:gap-14 items-center">
            {/* Text Content */}
            <div className="max-w-3xl mx-auto md:mx-0 z-10 order-1 lg:order-1 text-center md:text-left">
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                <Brain size={12} />
                Data Scientist
              </div> */}
              
              <h1 className={`text-5xl md:text-6xl lg:text-6xl font-bold mb-2 md:mb-1 leading-tight tracking-tight ${theme.heroHeading}`}>
                Andy&nbsp;
                <span className={theme.heroAccentText}>
                   Fanthome
                </span>
              </h1>
              
              <div className="hidden md:block">
                <p className={`text-xl md:text-2xl ${theme.bodyMuted} mb-8 leading-relaxed font-light`}>
                  Welcome to my portfolio.
                </p>
                
                <div className="flex flex-col items-start gap-3">
                  <div className="hidden md:flex items-center gap-4">
                    <a 
                      href="mailto:andy@fantho.me"
                      className={`inline-flex items-center gap-2 px-6 py-3 md:px-5 md:py-2 border-2 ${theme.outlineButton} rounded-full transition-all text-sm md:text-base font-medium`}
                    >
                      <Mail size={18} />
                      Contact
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/andyfanthome/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-6 py-3 md:px-5 md:py-2 border-2 ${theme.outlineButton} rounded-full transition-all text-sm md:text-base font-medium`}
                    >
                      <Linkedin size={18} />
                      LinkedIn
                    </a>
                    <a 
                      href="https://github.com/sgafanth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-6 py-3 md:px-5 md:py-2 border-2 ${theme.outlineButton} rounded-full transition-all text-sm md:text-base font-medium`}
                    >
                      <Github size={18} />
                      GitHub
                    </a>
                  </div>
                  <a 
                    href="/Andy-Fanthome-CV.pdf"
                    download
                    className={`inline-flex items-center gap-2 px-6 py-3 md:px-6 md:py-2 ${theme.primaryButton} rounded-full transition-all text-sm md:text-base font-semibold shadow-lg ${theme.primaryButtonShadow} group`}
                  >
                    Download CV
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Profile Picture & Visual */}
            <div className="relative group order-2 lg:order-2 flex justify-center">
              <div className={`absolute inset-0 rounded-[2.5rem] blur-3xl opacity-20 transition-opacity duration-500 ${theme.heroGlow}`}></div>
              <img 
                src="images/me.jpeg"
                alt="Andy Fanthome" 
                className={`relative w-48 lg:w-56 h-auto rounded-[2rem] shadow-2xl transition-all duration-500 ease-out object-cover aspect-[3/4] ${theme.heroImageBg}`}
              />
            </div>

            <div className="max-w-3xl mx-auto z-10 order-3 md:hidden text-center">
              <p className={`text-xl ${theme.bodyMuted} mb-8 leading-relaxed font-light`}>
              Welcome to my portfolio.
              </p>

              <div className="flex flex-col items-center gap-3">
                <div className="flex flex-col items-center gap-2.5">
                  <a 
                    href="mailto:andy@fantho.me"
                    className={`inline-flex items-center gap-2 px-6 py-3 border-2 ${theme.outlineButton} rounded-full transition-all text-sm font-medium`}
                  >
                    <Mail size={18} />
                    Contact
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/andyfanthome/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 border-2 ${theme.outlineButton} rounded-full transition-all text-sm font-medium`}
                  >
                    <Linkedin size={18} />
                    LinkedIn
                  </a>
                  <a 
                    href="https://github.com/sgafanth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 border-2 ${theme.outlineButton} rounded-full transition-all text-sm font-medium`}
                    >
                      <Github size={18} />
                      GitHub
                    </a>
                </div>
                <a 
                  href="/Andy-Fanthome-CV.pdf"
                  download
                  className={`inline-flex items-center gap-2 px-6 py-3 ${theme.primaryButton} rounded-full transition-all text-sm font-semibold shadow-lg ${theme.primaryButtonShadow} group`}
                >
                  Download CV
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className={`py-6 ${theme.statsSection}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <div className={`text-2xl lg:text-3xl font-bold mb-1 ${theme.heading}`}>↑50%</div>
              <div className={`text-sm tracking-wide font-semibold ${theme.bodySubtle}`}>Increase in model performance</div>
            </div>
            <div className="text-center md:text-left">
              <div className={`text-2xl lg:text-3xl font-bold mb-1 ${theme.heading}`}>2 Years</div>
              <div className={`text-sm tracking-wide font-semibold ${theme.bodySubtle}`}>Industry experience</div>
            </div>
            <div className="text-center md:text-left">
              <div className={`text-2xl lg:text-3xl font-bold mb-1 ${theme.heading}`}>↓99.8%</div>
              <div className={`text-sm tracking-wide font-semibold ${theme.bodySubtle}`}>Latency reduction</div>
            </div>
            <div className="text-center md:text-left">
              <div className={`text-2xl lg:text-3xl font-bold mb-1 ${theme.heading}`}>45</div>
              <div className={`text-sm tracking-wide font-semibold ${theme.bodySubtle}`}>Million rows of user data</div>
            </div>
          </div>
        </div>
      </section>


      {/* Projects */}
      <section id="latest-projects" className={`section-anchor py-20 px-6 md:px-8 ${theme.educationSection}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${theme.heading}`}>My latest projects</h2>
            <p className={`text-xl ${theme.bodyMuted} max-w-2xl`}>
          Recent blogs and repositories looking into different areas of data science and machine learning.
          </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(projects).map(([category, items], idx) => (
              category === EMERGING_SIGNALS_PROJECT ? (
                <Link
                  key={idx}
                  to="/emerging-signals-explorer"
                  className={`project-card-clickable block p-6 ${theme.projectCard} rounded-2xl transition-all duration-300`}
                >
                  <h3 className={`text-lg font-bold mb-6 tracking-tight flex items-center gap-2 ${theme.heading}`}>
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {items.map((skill, i) => (
                      <div key={i} className={`flex items-center text-sm ${theme.body}`}>
                        <div className={`w-1 h-1 rounded-full ${theme.dot}`}></div>
                        {skill}
                      </div>
                    ))}
                  </div>
                </Link>
              ) : (
                <div key={idx} className={`p-6 ${theme.projectCard} rounded-2xl transition-all duration-300`}>
                  <h3 className={`text-lg font-bold mb-6 tracking-tight flex items-center gap-2 ${theme.heading}`}>
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {items.map((skill, i) => (
                      <div key={i} className={`flex items-center text-sm ${theme.body}`}>
                        <div className={`w-1 h-1 rounded-full ${theme.dot}`}></div>
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 md:mt-24">
          <h2 className={`text-3xl font-bold mb-12 tracking-tight ${theme.heading}`}>All Projects</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {sideProjects.map((project, idx) => (
              <div 
                key={idx}
                className={`group p-8 ${theme.projectCardAlt} rounded-2xl transition-all`}
              >
                  <div className="flex justify-between items-start mb-4">
                     <h3 className={`text-xl font-bold ${theme.heading}`}>{project.title}</h3>
                     <a href={project.url} className={theme.iconLink}>
                        <ExternalLink size={20} />
                     </a>
                  </div>
                  <p className={`mb-6 text-sm leading-relaxed ${theme.bodyMuted}`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, i) => (
                        <span key={i} className={`px-2 py-1 ${theme.skillTag} rounded text-xs font-medium`}>
                        {skill}
                        </span>
                    ))}
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Experience */}
      <section id="professional-experience" className="section-anchor py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${theme.heading}`}>Professional Experience</h2>
              <p className={`text-xl ${theme.bodyMuted} max-w-2xl`}>
                A track record of utilising emerging technology to deliver solutions at pace.
              </p>
            </div>
            <a
              href="/Andy-Fanthome-CV.pdf"
              download
              className={`hidden md:inline-flex items-center gap-2 text-sm font-bold border-b-2 border-transparent ${theme.sectionLinkHoverBorder} transition-all ${theme.bodyMuted}`}
            >
              Download Full Resume <ChevronDown size={14} />
            </a>
          </div>

          <div className={`relative ml-6 md:ml-8 space-y-12 md:space-y-16`}>
            <div className={`absolute left-[-2px] top-[10px] bottom-0 border-l-2 ${theme.timelineRail}`} aria-hidden="true"></div>
            {experience.map((job, idx) => (
              <div key={idx} className="relative pl-12 md:pl-16 group">
                <div className={`absolute -left-[23px] top-1.5 w-11 h-11 rounded-full overflow-hidden ${theme.timelineMarker} shadow-md`}>
                  <img
                    src={job.logoUrl}
                    alt={`${job.company} logo`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className={`text-2xl font-bold tracking-tight ${theme.heading}`}>
                          {job.title}
                        </h3>
                        <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className={`text-lg font-semibold ${theme.companyLink} inline-flex items-center gap-1`}>
                          {job.company} <ExternalLink size={14} />
                        </a>
                      </div>
                      <div className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${theme.timelinePill}`}>
                        {job.period}
                      </div>
                    </div>

                    <p className={`whitespace-pre-line text-base md:text-lg mb-3 leading-relaxed ${theme.body}`}>
                      {job.summary.split("**").map((part, index) =>
                        index % 2 === 1 ? <strong key={index} className={theme.bodyStrong}>{part}</strong> : part
                      )}
                    </p>

                    <ul className="space-y-2.5 mb-6">
                      {job.achievements.map((item, i) => {
                        const parts = item.split("**");
                        return (
                          <li key={i} className={`flex items-start gap-3 text-base ${theme.bodyMuted}`}>
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${theme.timelineDot}`}></span>
                            <span>
                              {parts.map((part, index) =>
                                index % 2 === 1 ? <strong key={index} className={theme.bodyStrong}>{part}</strong> : part
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span key={i} className={`px-3 py-1 ${theme.timelineChip} rounded-md text-xs font-bold uppercase tracking-wider`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className={`section-anchor py-20 px-6 md:px-8 ${theme.educationSection}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-10">
            <div className="w-full md:w-3/4">
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${theme.heading}`}>
                Education
              </h2>
              <p className={`text-lg mb-8 ${theme.bodyMuted}`}>
                Awarded a first-class (74%) degree. Built and evaluated cloud-deployed NLP applications for final year project, achieving notable performance and 95% user satisfaction. 
              </p>

              <div className={`p-8 rounded-2xl ${theme.educationCard}`}>
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${theme.heading}`}>BSc (Honours) Computer Science with a Year in Industry</h3>
                    <div className={theme.bodyMuted}>University of Liverpool</div>
                  </div>
                  <div className={`mt-2 md:mt-0 inline-flex items-center h-4 px-3 rounded-full text-[10px] leading-none font-bold uppercase tracking-wide whitespace-nowrap ${theme.timelinePill}`}>2019 - 2023</div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className={`space-y-2 ${theme.body}`}>
                    <li>• Data Science</li>
                    <li>• Software Engineering</li>
                    <li>• Systems, Infrastructure & Security</li>
                  </ul>
                  <ul className={`space-y-2 ${theme.body}`}>
                    <li>• Artificial Intelligence</li>
                    <li>• Algorithms, Theory & Mathematics</li>
                    
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/4 md:max-w-[220px]">
              <div className={`aspect-square rounded-2xl overflow-hidden relative group ${theme.educationBorder}`}>
                <img src="images/liverpool_logo_square.png" alt="University of Liverpool logo" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className={`absolute inset-0 ${theme.imageOverlayGradient} flex items-end p-6`}>
                  <div>
                    <div className={`${theme.imageOverlayTitle} font-bold text-lg`}>First-Class Degree (74%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skill-toolkit" className={`section-anchor py-24 px-6 md:px-8 ${theme.sectionSoftBg}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${theme.heading}`}>Skills</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, items], idx) => (
              <div key={idx} className={`p-6 ${theme.projectCard} rounded-2xl transition-all duration-300`}>
                <h3 className={`text-lg font-bold mb-6 tracking-tight flex items-center gap-2 ${theme.heading}`}>
                    {idx === 0 && <Brain size={18} className={theme.skillIcon1} />}
                    {idx === 1 && <Database size={18} className={theme.skillIcon2} />}
                    {idx === 2 && <Beaker size={18} className={theme.skillIcon3} />}
                    {idx === 3 && <Briefcase size={18} className={theme.skillIcon4} />}
                    {category}
                </h3>
                <div className="space-y-3">
                  {items.map((skill, i) => (
                    <div key={i} className={`flex items-center gap-2 text-sm ${theme.body}`}>
                      <div className={`w-1 h-1 rounded-full ${theme.dot}`}></div>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-32 px-6 md:px-8 ${theme.ctaSection}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Like what you see?</h2>
          <p className={`text-xl mb-12 leading-relaxed max-w-2xl mx-auto ${theme.ctaBody}`}>
            I am available for Data Science roles. Reach out to have a chat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="mailto:andy@fantho.me"
              className={`px-10 py-4 ${theme.ctaPrimaryButton} rounded-full transition-all text-lg font-bold shadow-xl w-full sm:w-auto`}
            >
              Email Me
            </a>
            <a 
              href="https://www.linkedin.com/in/andyfanthome/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-10 py-4 ${theme.ctaSecondaryButton} rounded-full transition-all text-lg font-medium w-full sm:w-auto flex justify-center items-center gap-2`}
            >
              <Linkedin size={20} /> LinkedIn
            </a>
          </div>
          <div className="mt-8">
            <button
              type="button"
              onClick={handleDuckClick}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#d2042d] text-white shadow-lg transition-colors hover:bg-[#b10326]"
              aria-label="Cherry red button"
            >
              <img src="images/duck.png" alt="" className="h-10 w-10 object-contain" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-8 ${theme.footer}`}>
        <div className={`max-w-7xl mx-auto text-center text-sm ${theme.footerText}`}>
          © 2026 Andy Fanthome. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
