export const experiences = [
  {
    id: 1,
    role: "Backend Engineer - Tech Fresh",
    company: "LINE Corporation",
    period: "Jul 2024 - Jun 2025",
    description: "Built 20+ Java backend services for a commerce platform with 21M+ daily users. Solved tracing gaps with OpenTelemetry, enabled real-time monitoring with Grafana/Prometheus, and built production PySpark/Airflow ETL pipelines.",
    category: "Work",
    logoUrl: "/logos/line.png",
  },
  {
    id: 2,
    role: "Machine Learning Engineer (Lab Co-op)",
    company: "EVA Air",
    period: "Sep 2024 - Jan 2025",
    description: "Revamped Autoencoder-based anomaly detection. Optimized turbulence data interpolation achieving 83% speedup using vectorized computations and Parquet format.",
    category: "Research",
    logoUrl: "/logos/evaair.png",
  },
  {
    id: 3,
    role: "Software Engineer Intern",
    company: "Trend Micro",
    period: "Jul 2023 - Sep 2023",
    description: "Cut deployment time by 67% with a unified Jenkins pipeline. Orchestrated parallel workflows across multiple repositories and Jenkins shards.",
    category: "Work",
    logoUrl: "/logos/trendmicro.png",
  },
  {
    id: 4,
    role: "Data Scientist Intern",
    company: "Cathay Financial Holdings",
    period: "Feb 2023 - Jun 2023",
    description: "Reduced hospital processing time by 68% via OCR & NER pipeline. Boosted paddleOCR model accuracy from 75% to 84% with data augmentation.",
    category: "Work",
    logoUrl: "/logos/cathay.png",
  },
];

export const projects = [
  {
    id: 1,
    title: "Reliable Distributed Miner",
    summary: "A reliable Go transport layer over UDP for distributed mining.",
    tags: ["Systems", "Go", "Distributed"],
    description: "Achieved data integrity with 20% packet loss via ARQ/checksums. Implemented dynamic load balancing and task partitioning.",
    link: "https://github.com/kogby",
    metrics: "Fault-tolerant at 20% packet loss",
  },
  {
    id: 2,
    title: "Dynamic Memory Allocator",
    summary: "High-throughput memory allocator in C utilizing segregated free lists.",
    tags: ["Systems", "C", "Optimization"],
    description: "Optimized throughput by 30% with best-fit searches. Enhanced memory utilization to 74%+ using mini-blocks and footer elimination.",
    link: "https://github.com/kogby",
    metrics: "+30% Throughput, 74% Utilization",
  },
  {
    id: 3,
    title: "Online Judge Platform",
    summary: "Scalable backend for a university code-judging platform.",
    tags: ["Backend", "Python", "Kafka"],
    description: "Scaled to 1,200+ concurrent users by refactoring to a message-driven architecture using Kafka for asynchronous processing.",
    link: "https://github.com/kogby",
    metrics: "1,200+ Concurrent Users",
  },
  {
    id: 4,
    title: "AI GO Contest: House Price Prediction",
    summary: "Top 7% ranking machine learning model for housing price prediction.",
    tags: ["ML", "Python", "Data Science"],
    description: "Improved accuracy by 47% via geographical distance filtering. Boosted performance by 12% with beta target encoding.",
    link: "https://github.com/kogby",
    metrics: "Top 7% / 1000+ Teams",
  },
];

export const skills = {
  languages: ["Java", "Go", "C++", "Python", "SQL", "JavaScript"],
  technologies: ["Kubernetes", "Docker", "Kafka", "AWS", "Grafana", "Prometheus", "Spring Boot"],
  ml: ["PyTorch", "TensorFlow", "Spark", "Airflow", "HuggingFace", "MLflow"],
};
