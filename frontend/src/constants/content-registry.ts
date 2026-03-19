/**
 * Content Registry — maps every TechnicalNavItem ID to its detailed content lines.
 * This preserves all granular technical content originally authored inline on the
 * ai.tsx, practice-ml.tsx, and system.tsx pages and makes it renderable from the
 * ContentDrawer slide-over panel.
 */

export type ContentLine = string | { text: string; link: { url: string; text: string } };

export interface DrawerContent {
  lines: ContentLine[];
}

export const contentRegistry: Record<string, DrawerContent> = {
  // ─── Core Tech ──────────────────────────────────────────────────────────
  'l1-vs-l2-regression': {
    lines: [
      'L1 Regression (Lasso): Penalty = λ × Σ|βᵢ| — Uses sum of absolute values',
      'L2 Regression (Ridge): Penalty = λ × Σβᵢ² — Uses sum of squared values',
      'Feature Selection: L1 drives coefficients to exactly zero (automatic feature selection)',
      'Coefficient Shrinkage: L2 shrinks coefficients towards zero but rarely makes them exactly zero',
      'Solution Type: L1 creates sparse solutions, L2 creates dense solutions',
      'Multicollinearity: L1 picks one from correlated features, L2 handles all correlated features well',
      'Interpretability: L1 provides high interpretability (fewer features), L2 moderate (all features)',
      'Computational: L1 is non-differentiable at 0, L2 is smooth and differentiable',
      'Use L1 when: You need automatic feature selection, interpretable models, or sparse solutions',
      'Use L2 when: You have multicollinear features, want stability, or need to keep all relevant features',
      'Elastic Net: Combines both L1 and L2 penalties for benefits of both techniques',
    ],
  },
  'overfitting-vs-underfitting': {
    lines: [
      'Overfitting: Model learns training data too well, including noise and random fluctuations',
      'Overfitting Signs: High training accuracy + Low validation/test accuracy (high variance, low bias)',
      'Overfitting Causes: Model too complex, too many parameters, insufficient data, over-training',
      'Overfitting Solutions: More data, regularization (L1/L2, dropout), early stopping, simpler model',
      'Underfitting: Model too simple to capture underlying patterns in the data',
      'Underfitting Signs: Low training accuracy + Low validation/test accuracy (high bias, low variance)',
      'Underfitting Causes: Model too simple, insufficient training, excessive regularization, poor features',
      'Underfitting Solutions: More complex model, more features, reduce regularization, longer training',
      'Sweet Spot: Balance between capturing patterns and generalizing to new data',
      'Detection: Use validation curves, learning curves, and cross-validation to identify the issue',
      'Bias-Variance Tradeoff: Overfitting = high variance, Underfitting = high bias',
    ],
  },
  'gradient-descent-vs-sgd-vs-als': {
    lines: [
      'Gradient Descent (Batch): Uses entire dataset per update — θ = θ - α∇J(θ)',
      'GD Pros: Smooth convergence, guaranteed global minimum (convex functions), stable updates',
      'GD Cons: High memory usage, slow per iteration, not suitable for large datasets',
      'Stochastic Gradient Descent (SGD): Uses one random sample per update',
      'SGD Pros: Low memory, fast per iteration, online learning capable, escapes local minima',
      'SGD Cons: Noisy convergence path, oscillates around minimum, may need learning rate scheduling',
      'Mini-batch SGD: Compromise between GD and SGD using small batches (32-512 samples)',
      'Alternating Least Squares (ALS): Alternates optimization between parameter sets',
      'ALS Use Case: Matrix factorization, collaborative filtering, recommender systems',
      'ALS Method: Fix user factors → optimize item factors → fix items → optimize users',
      'ALS Advantages: Highly parallelizable, guaranteed objective decrease, handles sparse data well',
      'When to use: GD (small datasets), SGD (large datasets/online), ALS (matrix factorization)',
    ],
  },
  'supervised-vs-unsupervised-vs-rl': {
    lines: [
      'Supervised Learning: Trains on labeled input-output pairs — learns a mapping f: X → Y',
      'Supervised Goal: Minimize prediction error against known ground-truth labels',
      'Supervised Examples: Linear regression, logistic regression, SVM, neural networks, decision trees',
      'Supervised Use Cases: Spam detection, image classification, price prediction, fraud detection',
      'Unsupervised Learning: Discovers hidden patterns in unlabeled data — no ground truth required',
      'Unsupervised Goal: Find structure, clusters, or compressed representations in raw data',
      'Unsupervised Examples: K-Means, DBSCAN, PCA, t-SNE, autoencoders, GMM',
      'Unsupervised Use Cases: Customer segmentation, anomaly detection, dimensionality reduction, topic modeling',
      'Reinforcement Learning: Agent learns by interacting with an environment and receiving reward signals',
      'RL Goal: Maximize cumulative discounted reward — R = Σ γᵗrₜ',
      'RL Key Elements: State (S), Action (A), Reward (R), Policy (π), Value function (V)',
      'RL Examples: Q-Learning, SARSA, DQN, PPO, Actor-Critic, DDPG',
      'RL Use Cases: Game playing (AlphaGo), robotics, autonomous driving, recommendation systems',
      'Key Difference — Feedback: Supervised=explicit labels, Unsupervised=none, RL=delayed scalar reward',
      'Key Difference — Data: Supervised=labeled dataset, Unsupervised=raw dataset, RL=environment interaction',
      'Key Difference — Objective: Supervised=fit labels, Unsupervised=find structure, RL=maximize reward',
      'When to use Supervised: You have labeled training data and a well-defined prediction target',
      'When to use Unsupervised: No labels available; exploratory analysis or feature learning needed',
      'When to use RL: Sequential decision-making where feedback arrives over time and actions matter',
    ],
  },
  'ai-vs-genai-vs-agentic': {
    lines: [
      'Classical AI: rule-based systems + ML models trained on labeled data — deterministic, narrow outputs',
      'Generative AI: LLMs (GPT, Gemini, Claude) + diffusion models — creates new text, images, code from patterns',
      'Agentic AI: autonomous goal-pursuit using tools, memory, and multi-step planning — LLM drives the control loop',
      'Agent loop: Observe → Plan → Act → Reflect — repeats until goal is achieved or budget is exhausted',
      'Key distinction: Classical AI predicts, Generative AI creates, Agentic AI decides',
      'GenAI needs: prompt engineering, temperature tuning, context window management, output parsing',
      'Agentic AI needs: tool registry, short/long-term memory, safety guardrails, retry logic, observability',
      'Interview signal: explain which layer your product lives at — and why you stopped (or did not stop) there',
      'Eval: measure task completion rate and hallucination rate to determine if you need to move from GenAI to Agentic architecture',
    ],
  },
  'ai-product-maturity': {
    lines: [
      'Stage 1 — MVP: single LLM call, hardcoded system prompt, no memory, no tools, no grounding',
      'Stage 2 — RAG: vector store + retrieval layer grounds the LLM in private/real-time data, reduces hallucination',
      'Stage 3 — MCP: Model Context Protocol (Anthropic, Nov 2024) — open standard for agent-to-tool communication',
      'MCP analogy: “USB-C for AI agents” — universal connector between any LLM agent and any tool/data source',
      'MCP vs custom function calling: protocol-level standardization vs one-off integrations per tool',
      'When to stop at Stage 1: simple Q&A, content generation, no private data or live context needed',
      'When to move to Stage 2: need factual grounding, private knowledge base, or real-time retrieval',
      'When to move to Stage 3: agent needs to dynamically choose tools at runtime based on task context',
      'In this app: rag.service.ts is Stage 2; MCP would power a Stage 3 career automation agent',
      'Eval: Stage 1 — response accuracy; Stage 2 — retrieval precision + faithfulness (RAGAS); Stage 3 — task success rate + tool call accuracy',
    ],
  },
  'fine-tuning-vs-rag-vs-prompting': {
    lines: [
      'Fine-tuning: continue training a pre-trained model on your labeled domain data — changes the model\'s weights permanently',
      'Use fine-tuning when: consistent output format/tone, domain jargon, task specialization (classification, extraction, code)',
      'RAG (Retrieval-Augmented Generation): inject relevant docs into the prompt at query time — no retraining, always up-to-date',
      'Use RAG when: need factual grounding, private/live data, or knowledge that changes frequently',
      'Few-shot prompting: provide 2-5 examples in the system prompt — steers behavior in-context without any training',
      'Use prompting when: behavior change is minor, you have no labeled data, or you need results today',
      'LoRA (Low-Rank Adaptation): fine-tune only small adapter layers (< 1% of params) — makes fine-tuning affordable on consumer GPUs',
      'QLoRA: quantized LoRA — 4-bit quantization + LoRA adapters; fine-tune 7B+ models on a single GPU',
      'Decision order: try prompting first → if not enough, try RAG → if still not enough, fine-tune with LoRA',
      'RLHF (Reinforcement Learning from Human Feedback): trains on human preference rankings — how GPT-4 and Claude are aligned',
    ],
  },
  'bias-vs-variance-tradeoff': {
    lines: [
      'Bias: error from wrong assumptions — model underfits, misses real patterns in data',
      'Variance: error from sensitivity to training noise — model overfits, memorizes instead of generalizing',
      'High bias + low variance: consistent but consistently wrong (classic underfitting)',
      'Low bias + high variance: accurate on training data, fails on unseen data (classic overfitting)',
      'The tradeoff: reducing bias tends to increase variance and vice versa — no free lunch',
      'Techniques to reduce bias: more complex model, more features, deeper network, longer training',
      'Techniques to reduce variance: regularization (L1/L2), dropout, early stopping, more training data',
      'Ensemble methods: bagging reduces variance (Random Forest); boosting reduces bias (XGBoost, AdaBoost)',
      'Total error = Bias² + Variance + Irreducible noise — you can only minimize the first two',
    ],
  },
  'accuracy-precision-recall-f1': {
    lines: [
      'Accuracy = (TP+TN) / (TP+TN+FP+FN) — intuitive but misleading on imbalanced datasets',
      'Precision = TP / (TP+FP) — of all predicted positives, how many were actually correct?',
      'Recall = TP / (TP+FN) — of all actual positives, how many did the model catch?',
      'F1 Score = 2 × (Precision × Recall) / (Precision + Recall) — harmonic mean, balances both',
      'Use Precision when false positives are costly: spam filters, ad targeting, legal document flagging',
      'Use Recall when false negatives are costly: cancer screening, fraud detection, safety systems',
      'Use F1 when both precision and recall matter equally and class distribution is imbalanced',
      'AUC-ROC: measures model ranking ability across all classification thresholds — threshold-independent',
      'Confusion matrix: TP / FP / FN / TN — the foundation from which all these metrics are derived',
    ],
  },
  'decision-tree-random-forest-xgboost': {
    lines: [
      'Decision Tree: recursively splits data on feature thresholds to minimize impurity (Gini index or entropy)',
      'Decision Tree weakness: high variance — small data changes produce very different trees, prone to overfitting',
      'Random Forest: trains N decision trees on random data subsets + random feature subsets (bagging), then averages predictions',
      'Random Forest strength: averaging reduces variance — robust out-of-the-box, parallelizable, hard to overfit',
      'XGBoost: builds trees sequentially — each new tree corrects residual errors of the previous (gradient boosting)',
      'XGBoost strength: reduces both bias and variance, handles missing values natively, built-in L1/L2 regularization',
      'When Decision Tree wins: interpretability required, small dataset, stakeholders need feature importance',
      'When Random Forest wins: tabular data, fast baseline needed, no time to tune hyperparameters',
      'When XGBoost wins: structured/tabular data, maximum predictive accuracy is the goal, Kaggle competitions',
      'Neural networks beat tree models when: unstructured data (images, text, audio) or very large datasets (>10M rows)',
    ],
  },
  'linear-logistic-regression': {
    lines: [
      'Linear Regression: fits a line y = mx + b to minimize mean squared error between predictions and true labels',
      'Output: continuous value — use for price prediction, demand forecasting, risk scoring, sales estimation',
      'Key assumption: linear relationship between features and target; highly sensitive to outliers',
      'Logistic Regression: applies sigmoid σ(z) to a linear function to output a probability between 0 and 1',
      'Output: probability + threshold (default 0.5) → binary class label (0 or 1)',
      'Loss function: Binary Cross-Entropy (log loss) — not MSE, because MSE is non-convex for classification tasks',
      'Decision boundary: linear — logistic regression cannot model XOR or non-linear class boundaries without feature engineering',
      'When to use: fast interpretable baseline, linearly separable data, sparse high-dimensional features (text classification)',
      'When NOT to use: non-linear relationships, image/audio/text data, complex feature interactions',
      'Foundation insight: a single artificial neuron IS logistic regression — deep networks stack many of them',
    ],
  },
  'embeddings-vector-search': {
    lines: [
      'Embedding: a dense float vector representing semantic meaning (e.g. 1536 dimensions for OpenAI ada-002)',
      'Similar meaning = similar direction in vector space, measured by cosine similarity or dot product',
      'Embedding models: OpenAI text-embedding-ada-002, Cohere embed, BGE, sentence-transformers (open source)',
      'Vector search: Approximate Nearest Neighbor (ANN) — finds top-k similar vectors at billion-scale speed',
      'ANN algorithms: HNSW (Hierarchical Navigable Small World), IVF (Inverted File Index), LSH',
      'Vector stores: pgvector (PostgreSQL), Pinecone, Weaviate, Chroma, Qdrant — each with different scale/cost trade-offs',
      'RAG pipeline: embed query → retrieve top-k docs → inject into LLM prompt — grounding over memorization',
      'In this app: rag.service.ts + rag-vector.model.ts implement this pipeline for resume and job matching',
    ],
  },
  'transformer-attention-mechanism': {
    lines: [
      'Transformer (2017, “Attention Is All You Need”): replaced RNNs/LSTMs for sequence modeling tasks',
      'Self-attention: each token attends to all other tokens simultaneously — captures long-range dependencies',
      'Attention score = softmax(QKᵀ/√d) × V — Q(query), K(key), V(value) projected from the same input',
      'Softmax role: converts raw attention scores (logits) into probabilities summing to 1 — determines how much each token attends to every other token',
      'Multi-head attention: run H attention heads in parallel with different learned projections, then concatenate',
      'Positional encoding: adds position information since attention is order-agnostic by default',
      'Encoder-only (BERT): bidirectional context — best for classification, NER, and embedding tasks',
      'Decoder-only (GPT, Llama, Claude): causal (masked) attention — best for text generation',
      'Encoder-Decoder (T5, BART): full context encoding + generation — best for translation and summarization',
      'Decision guide: choose encoder-only for understanding tasks, decoder-only for generation, encoder-decoder when you need both — always start from a pre-trained model, not from scratch',
      'Scaling law: more parameters + more data = better performance — the empirical basis for GPT-4, Gemini, Claude',
    ],
  },
  'activation-functions': {
    lines: [
      'Activation functions introduce non-linearity into neural networks — without them, deep networks collapse to a single linear transformation',
      'ReLU (Rectified Linear Unit): f(x) = max(0, x) — most common hidden layer activation; fast, avoids vanishing gradients',
      'Leaky ReLU: f(x) = max(0.01x, x) — fixes "dying ReLU" problem where neurons get stuck outputting zero',
      'Sigmoid: f(x) = 1 / (1 + e⁻ˣ) — squashes output to (0, 1); used in binary classification output layers',
      'Sigmoid problem: vanishing gradients in deep networks — gradients shrink to near zero during backpropagation',
      'Tanh: f(x) = (eˣ - e⁻ˣ) / (eˣ + e⁻ˣ) — squashes output to (-1, 1); zero-centered, better than Sigmoid for hidden layers',
      'Softmax: converts a vector of logits into probabilities summing to 1 — used in multi-class classification output layers',
      'GELU (Gaussian Error Linear Unit): smooth approximation of ReLU — used in BERT, GPT, and most modern transformers',
      'Rule of thumb: ReLU/GELU for hidden layers → Sigmoid for binary output → Softmax for multi-class output',
      'Eval: monitor training loss curves and dead neuron % (ReLU dying) — switch to Leaky ReLU or GELU if > 10% neurons output zero permanently',
    ],
  },
  'design-patterns-for-ai': {
    lines: [
      'RAG Pattern: retrieval step grounds the LLM in private or real-time data before generation — reduces hallucination',
      'Agent Loop Pattern: Observe → Plan → Act → Reflect — LLM drives the control flow, not the developer',
      'Chain-of-Thought (CoT): prompt the LLM to reason step-by-step before answering — improves accuracy on complex tasks',
      'Few-Shot Prompting: provide 2-5 input/output examples in the prompt to steer format and style without fine-tuning',
      'Tool Use Pattern: LLM emits structured tool call → host executes → result injected back into context',
      'Output Guardrails: validate, parse, and constrain LLM output before passing downstream — never trust raw text',
      'Memory Pattern: short-term (in-context window), long-term (vector store retrieval), episodic (session log)',
      'Prompt Versioning: treat system prompts like code — version control, A/B test, evaluate against golden test sets',
      'Anti-pattern: chaining LLM calls without intermediate validation — errors compound silently across steps',
      'Eval: RAG — faithfulness score (RAGAS); CoT — answer accuracy on benchmarks; Guardrails — rejection rate, false positive rate on safe inputs',
    ],
  },
  'n8n-vs-langgraph': {
    lines: [
      'n8n: open-source, self-hostable visual workflow automation — think Zapier but with full code extensibility',
      'n8n control flow: deterministic — you define every node and edge at design time; execution is predictable',
      'n8n strengths: scheduled triggers, webhook ingestion, 400+ integrations, low-code, easy non-technical handoff',
      'LangGraph: Python library for stateful multi-actor agent workflows modeled as directed graphs',
      'LangGraph control flow: dynamic — the LLM decides which node(s) to visit at runtime based on task state',
      'LangGraph strengths: complex reasoning chains, branching on LLM output, human-in-the-loop checkpoints',
      'Key question: who controls the flow? n8n = the developer at design time; LangGraph = the model at runtime',
      'They compose: n8n can call a LangGraph agent as a single step inside a larger scheduled automation',
      'In this app: scheduler.service.ts mirrors n8n (deterministic); rag.service.ts mirrors LangGraph (AI-driven)',
      'Eval: n8n — workflow success rate, step failure logs; LangGraph — agent task completion rate, number of loop iterations, human intervention rate',
    ],
  },
  'rag-vs-langchain-vs-langgraph': {
    lines: [
      'Raw RAG: embed query → retrieve docs → inject into prompt manually — full control, zero framework overhead',
      'LangChain: composable chain primitives (LLMChain, RetrievalQA, ConversationalChain) — fast prototyping, heavy abstraction',
      'LangGraph: stateful graph of nodes + edges with conditional routing — built for production agentic systems',
      'LangChain vs LangGraph: LangChain = linear pipelines; LangGraph = cyclic, stateful, resumable workflows',
      'When raw RAG wins: simple retrieval + generation, you own the entire prompt, minimal dependencies',
      'When LangChain wins: rapid prototyping, built-in memory modules, large ecosystem of community integrations',
      'When LangGraph wins: multi-agent systems, human-in-the-loop approval, long-running tasks needing checkpointing',
      'LlamaIndex alternative: stronger than LangChain for document parsing, chunking, and indexing pipelines',
      'Production principle: abstract only what you must — start with raw RAG, add frameworks only when you hit limits',
      'In this app: rag.service.ts is raw RAG — the natural next step is a LangGraph-based career automation agent',
    ],
  },

  // ─── Playbooks ────────────────────────────────────────────────────────────────
  'business-objectives': {
    lines: [
      'Revenue Growth: Increase conversion rates by 15-25% through visual product discovery',
      'User Experience: Reduce search friction and improve product findability',
      'Inventory Optimization: Surface long-tail products through visual similarity',
      'Competitive Advantage: Differentiate through advanced search capabilities',
      'Data Collection: Gather visual preferences for personalization',
      'Eval: conversion rate lift (target +15-25%), catalog utilization % (long-tail product discovery), session depth after visual search engagement',
    ],
  },
  'key-interview-questions': {
    lines: [
      'Architecture: "How would you design a visual search system for 100M products?"',
      'Scalability: "How do you handle real-time visual search with low latency?"',
      'ML Pipeline: "Explain the end-to-end ML pipeline for visual feature extraction"',
      'Similarity Matching: "How do you measure and rank visual similarity?"',
      'Infrastructure: "How would you store and index billions of image embeddings?"',
      'Performance: "How do you optimize search response time under 100ms?"',
      'Quality: "How do you measure and improve search result relevance?"',
      'A/B Testing: "How would you evaluate the business impact of visual search?"',
      'Eval: track which questions stump you in mock interviews — use that as signal for which system design areas need deeper study',
    ],
  },
  'system-components': {
    lines: [
      'Image Processing: CNN-based feature extraction (ResNet, EfficientNet)',
      'Vector Database: High-dimensional similarity search (Pinecone, Weaviate)',
      'API Gateway: Request routing and rate limiting',
      'Caching Layer: Redis for frequent queries and embeddings',
      'ML Serving: Model inference infrastructure (TensorFlow Serving)',
      'Data Pipeline: Real-time image processing and indexing',
      'Eval: ingestion latency (time to index new item), embedding freshness lag, vector search p95 latency, API error rate under load',
    ],
  },
  'success-metrics': {
    lines: [
      'Business: Conversion rate, revenue per search, user engagement',
      'Technical: Response time (<100ms), system availability (99.9%)',
      'ML: Precision@K, recall, click-through rate, user satisfaction',
    ],
  },
  'visual-search-ml': {
    lines: [
      'Why visual search: users search by image not text — higher conversion, lower friction, better mobile UX',
      'When to build it: catalog > 100k products, users struggle with text search, mobile-first audience',
      'How it works: image → CNN embedding → vector store → ANN search → ranked results returned to user',
      'Key components: image ingestion pipeline, embedding model (ResNet/EfficientNet/CLIP), vector database, re-ranking layer, serving API',
      'Embedding model choice: CLIP is preferred — trained on image-text pairs, captures semantic similarity across modalities',
      'Scaling challenge: indexing millions of embeddings in near-real-time as catalog updates continuously',
      'Re-ranking: initial ANN results re-scored by price, popularity, inventory, or personalization signals',
      'Evaluation: Precision@K (relevance), click-through rate, add-to-cart rate after visual search interaction',
      'Interview signal: draw the end-to-end pipeline, explain each component’s latency budget and failure mode',
      {
        text: 'System Design: ',
        link: {
          url: 'https://bytebytego.com/courses/machine-learning-system-design-interview/visual-search-system',
          text: 'ByteByteGo — Visual Search Architecture',
        },
      },
      {
        text: 'Visual Diagrams: ',
        link: {
          url: 'https://excalidraw.com/#room=bca6c4b2c12608201786,qfbidnaJ9mH1FHgRiawMIw',
          text: 'System Architecture Drawing',
        },
      },
    ],
  },
  'google-street-blurring-ml': {
    lines: [
      'Why: GDPR + global privacy regulations require PII blurring (faces, license plates) at planetary scale before publishing',
      'When: any pipeline processing public imagery that may contain identifiable personal data',
      'How it works: image ingestion → object detection (YOLO/Faster-RCNN) → bounding box extraction → blur/pixelate → re-stitch → publish',
      'Scale challenge: Google processes billions of Street View frames — must be batch, not real-time, to be cost-feasible',
      'Geospatial ingestion: frames tagged with lat/lng metadata, stored in geo-partitioned object storage for regional processing',
      'False positive vs false negative tradeoff: better to over-blur than miss a face — recall prioritized over precision',
      'Distributed processing: each geographic region processed independently in parallel, MapReduce-style',
      'Model accuracy challenge: detect faces/plates in all lighting, angles, occlusion, weather conditions worldwide',
      'Interview signal: explain the batch vs real-time decision, the recall-over-precision tradeoff, and the geo-partition strategy',
      {
        text: 'System Design: ',
        link: {
          url: 'https://bytebytego.com/courses/machine-learning-system-design-interview/google-street-view-blurring-system',
          text: 'ByteByteGo — Google Street View Blurring System',
        },
      },
      {
        text: 'Visual Diagrams: ',
        link: {
          url: 'https://excalidraw.com/#json=Pm44fjK19V0tO__DPwl68,DGH7lrd7c_CKl6cG8l2KcQ',
          text: 'System Architecture Drawing',
        },
      },
    ],
  },  'gcp-ai-learning-path': {
    lines: [
      'Course 1 — Introduction to Generative AI: GenAI definition, how LLMs work, Vertex AI platform overview',
      'Course 2 — Introduction to Large Language Models: LLM types (BERT, GPT, T5), prompting basics, fine-tuning vs prompting trade-offs',
      'Course 3 — Introduction to Responsible AI: Google’s 7 AI principles, bias and fairness, human oversight and accountability',
      'Course 4 — Prompt Design in Vertex AI: zero-shot, few-shot, and chain-of-thought prompting in Vertex AI Studio',
      'Certification: Google Cloud Generative AI Fundamentals badge — awarded on course completion, no exam required',
      'Key takeaway: understand the full stack from model types → responsible deployment → practical prompting',
      'Practical next step: pair each course with hands-on Vertex AI Studio experiments to reinforce concepts',
      'Portfolio signal: demonstrates cloud AI platform fluency beyond pure framework-level knowledge',
    ],
  },
  // ─── Architecture — Foundation ───────────────────────────────────────────
  'arch-perf-matrices': {
    lines: [
      'Load time: total time for page to fully render — target < 3s on mobile (Google Core Web Vitals threshold)',
      'TTFB (Time to First Byte): server response speed — target < 200ms; high TTFB = slow backend or missing CDN',
      'DOM Content Loaded: HTML parsed and DOM fully built — use when diagnosing JS-blocking render issues',
      'Render-blocking resources: CSS/JS that pause rendering until loaded — fix with defer, async, or preload hints',
      'Page size: total transferred bytes — target < 1MB for mobile; compress assets, lazy-load images, code-split bundles',
      'RTT (Round Trip Time): network latency between client and server — reduce with CDN edge nodes closer to users',
      'When to use each: TTFB for server-side perf diagnosis, DCL for JS load order issues, LCP for perceived user experience',
    ],
  },
  'arch-system-reliability': {
    lines: [
      'CAP theorem: A distributed system can only guarantee two of these properties at the same time. CA(SQL) / CP(NoSql) / AP(Scylla DB)',
      'Eventual consistency: A model where updates will propagate and become consistent over time. (Kafka/RabbitMQ)',
      'Load Balancing: Distributing workloads across multiple resources.',
      'Consistent Hashing: A technique to distribute requests across servers while minimizing disruption.',
      'Rate limiter: Controls the rate of requests sent to a server.',
      'Monitoring: logs, health and performance metrics — async logging, Prometheus & Grafana',
    ],
  },
  'arch-key-attributes': {
    lines: [
      'Latency: time from request to first byte of response — target < 100ms for interactive UIs, < 200ms for APIs',
      'Throughput: requests per second the system can sustain under load — always measure at p95/p99, not average',
      'Scalability: ability to maintain latency and throughput as load grows — vertical (bigger machine) vs horizontal (more machines)',
      'When latency is the priority: user-facing APIs, real-time search, checkout flows, live dashboards',
      'When throughput is the priority: batch processing jobs, event pipelines, log ingestion, analytics systems',
      'When scalability is the constraint: unpredictable traffic spikes, cost optimization, global user growth',
      'Trade-off: optimizing for ultra-low latency often limits throughput — single-threaded fast paths vs concurrent workloads',
    ],
  },

  // ─── Architecture — Design & APIs ────────────────────────────────────────
  'arch-api-performance': {
    lines: [
      'Statelessness: Each API request should contain all the information needed to process it.',
      'Stateful: Assign request sessions and use Apache sticky sessions.',
      'Caching: Storing frequently accessed data closer to the client.',
      'Pagination: Dividing large datasets into smaller, manageable chunks.',
      'Compression: Reducing the size of data transmitted over the network.',
      'Connection Pools: Efficiently managing connections to minimize overhead.',
      'Asynchronous processing: Handling requests asynchronously to improve responsiveness.',
      'When stateless wins: horizontally scalable services, microservices, REST APIs under unpredictable load',
      'When stateful wins: WebSocket sessions, real-time collaboration, multiplayer gaming, persistent streaming connections',
      'Decision rule: default to stateless; add stateful connections only when persistent context is a hard requirement',
    ],
  },
  'arch-design-patterns': {
    lines: [
      'MVC: Separates application logic, UI, and user input.',
      'MVP: Focuses on separating presentation layer from business logic.',
      'MCP: Emphasizes modularity and communication protocols.',
      '3-Tier: Divides applications into Presentation, Logic, and Data layers.',
      'MVVC: Enhances separation with data binding.',
      'Singleton: Ensures a class has only one instance.',
      'Factory: Lets subclasses decide the type of objects to create.',
      'Observer: Establishes one-to-many dependency.',
      'Decorator: Dynamically adds responsibilities.',
      'Strategy: Defines interchangeable algorithms.',
    ],
  },
  'arch-monolith-vs-micro': {
    lines: [
      'Monolithic: All components interconnected and running as single service.',
      'Modular Monolithic: Separation of concerns using feature toggles.',
      'Microservices: Small, independent services communicating via APIs.',
      'Eval: deployment frequency, lead time for changes, service failure blast radius — use DORA metrics to objectively compare architectures',
    ],
  },
  'arch-frontend-perf': {
    lines: [
      'Minification: Reducing CSS and JS file sizes.',
      'Bundling: Combining multiple files into fewer network requests.',
      'Lazy loading: Loading resources on demand to reduce initial payload.',
      'Image optimization: Maximize quality without increasing file size.',
      'CDN usage: Global content distribution for faster delivery near users.',
      'Critical rendering path optimization: Reduce render-blocking resources.',
    ],
  },
  'arch-graphql-vs-rest': {
    lines: [
      'GraphQL: Request only the exact data you need in a single query.',
      'REST: Standard HTTP methods — simple, widely supported, excellent caching.',
      'GraphQL Advantages: Efficient data fetching, flexible queries, typed schema.',
      'REST Advantages: Simplicity, better native HTTP caching, broad tooling support.',
    ],
  },
  'arch-protocols': {
    lines: [
      'HTTP: The foundation of web communication — request/response over TCP.',
      'HTTPS: HTTP + TLS — encrypted transport layer, required for production.',
      'FTP: File Transfer Protocol — dedicated binary/text file transfer.',
      'SMTP: Simple Mail Transfer Protocol — outbound email delivery standard.',
      'gRPC: High-performance RPC framework using HTTP/2 and Protobuf serialization.',
    ],
  },

  // ─── Architecture — Backend & Storage ────────────────────────────────────
  'arch-db-performance': {
    lines: [
      'Indexing: Creating indexes on database tables to speed up query lookups.',
      'Query optimization: Analyzing and rewriting slow-running queries.',
      'Connection pooling: Reusing database connections to minimize overhead.',
      'Caching: Storing frequently accessed data in memory (Redis, Memcached).',
      'Sharding: Distributing data across multiple database instances.',
      'Replication: Creating read replicas for availability and read scalability.',
    ],
  },
  'arch-db-types': {
    lines: [
      'Relational Databases: Structured storage with SQL — strong ACID guarantees.',
      'NoSQL Databases: Non-relational with flexible schemas — document, key-value, column.',
      'In-memory Databases: Store data in RAM for sub-millisecond access (Redis).',
      'Graph Databases: Use graph structures for relationship-heavy workloads (Neo4j).',
      'Time-series Databases: Optimized for time-stamped data (InfluxDB, TimescaleDB).',
      'Horizontal Sharding: Distribute rows across partitions by a shard key.',
      'Vertical Sharding: Split columns across separate tables or databases.',
      'Eval: query p95 latency, read/write throughput under load, storage cost per GB — run benchmark before committing to a database type',
    ],
  },
  'arch-kafka-vs-redis': {
    lines: [
      'Kafka: Distributed event streaming platform — durable, ordered, high-throughput.',
      'Redis: In-memory data structure store — low-latency cache and pub/sub.',
      'Use Kafka for: Async event pipelines, audit logs, real-time stream processing.',
      'Use Redis for: Session caching, leaderboards, rate limiting, ephemeral queues.',
      'Eval: message throughput (msgs/sec), consumer lag (Kafka), cache hit rate % (Redis), tail latency at p99',
    ],
  },

  // ─── Architecture — DevOps ────────────────────────────────────────────────
  'arch-devops': {
    lines: [
      'Continuous Integration (CI): Automating code integration, linting, and test runs on every push.',
      'Continuous Deployment (CD): Automating deployment to staging/production after CI passes.',
      'Infrastructure as Code (IaC): Managing infrastructure through version-controlled config (Terraform, Pulumi).',
      'Monitoring and Logging: System tracking via metrics (Prometheus), logs (Loki), and traces (Jaeger).',
      'Containerization: Container-based deployment using Docker for reproducible environments.',
      'Orchestration: Deployment lifecycle automation via Kubernetes or managed equivalents.',
      'Region-based traffic management: Route users to the closest region for lower latency.',
      'Sticky sessions: Use load balancer session affinity for stateful services.',
      'Eval: DORA metrics — deployment frequency, lead time, change failure rate, mean time to recovery (MTTR)',
    ],
  },
  'arch-networking': {
    lines: [
      'Load Balancing: Distributing traffic across server instances (L4 / L7 balancers).',
      'Firewalls: Network security rules to filter inbound and outbound traffic.',
      'VPNs: Secure encrypted tunnels for private network access.',
      'DNS: Domain name translation — A/CNAME records, TTL tuning for failover.',
      'CDN: Global content distribution layer for static assets and API acceleration.',
      'Network Monitoring: Traffic analysis, packet inspection, and anomaly detection.',
    ],
  },
  'arch-communication': {
    lines: [
      'Synchronous: Sender sends a request and waits for the server to respond before continuing.',
      'Asynchronous: Sender continues processing after dispatching — response handled via callback or queue.',
    ],
  },
};
