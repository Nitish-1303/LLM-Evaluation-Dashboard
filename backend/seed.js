import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Task from './models/Task.js';

dotenv.config();

const sampleTasks = [
  {
    prompt: "Explain quantum computing in simple terms",
    output: "Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously, unlike classical bits that are either 0 or 1. This allows quantum computers to process vast amounts of information in parallel."
  },
  {
    prompt: "Write a haiku about artificial intelligence",
    output: "Silicon minds think\nPatterns emerge from the code\nWisdom without soul"
  },
  {
    prompt: "What are the benefits of meditation?",
    output: "Meditation offers numerous benefits including reduced stress, improved focus, better emotional regulation, enhanced self-awareness, and potential improvements in physical health like lower blood pressure."
  },
  {
    prompt: "Describe the water cycle",
    output: "The water cycle involves evaporation of water from surfaces, condensation into clouds, precipitation as rain or snow, and collection in bodies of water. This continuous process distributes water across Earth."
  },
  {
    prompt: "How does photosynthesis work?",
    output: "Photosynthesis is the process where plants convert sunlight, water, and carbon dioxide into glucose and oxygen. Chlorophyll in plant cells captures light energy to drive this chemical reaction."
  },
  {
    prompt: "What is machine learning?",
    output: "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It uses algorithms to analyze data, identify patterns, and make decisions with minimal human intervention."
  },
  {
    prompt: "Explain blockchain technology",
    output: "Blockchain is a decentralized digital ledger that records transactions across multiple computers. Each block contains transaction data and is cryptographically linked to the previous block, creating an immutable chain that ensures transparency and security."
  },
  {
    prompt: "What causes climate change?",
    output: "Climate change is primarily caused by increased greenhouse gas emissions from human activities such as burning fossil fuels, deforestation, and industrial processes. These gases trap heat in the atmosphere, leading to global temperature rise and environmental changes."
  },
  {
    prompt: "How do vaccines work?",
    output: "Vaccines work by introducing a weakened or inactive form of a pathogen into the body, triggering the immune system to produce antibodies. This prepares the immune system to recognize and fight the actual disease if exposed in the future."
  },
  {
    prompt: "What is the theory of relativity?",
    output: "Einstein's theory of relativity consists of special and general relativity. Special relativity states that the laws of physics are the same for all non-accelerating observers, and the speed of light is constant. General relativity describes gravity as the curvature of spacetime caused by mass and energy."
  },
  {
    prompt: "Explain neural networks",
    output: "Neural networks are computing systems inspired by biological neural networks in the brain. They consist of interconnected nodes (neurons) organized in layers that process information, learn patterns from data, and can perform tasks like image recognition and natural language processing."
  },
  {
    prompt: "What is cryptocurrency?",
    output: "Cryptocurrency is a digital or virtual currency that uses cryptography for security. It operates on decentralized networks based on blockchain technology, allowing peer-to-peer transactions without the need for intermediaries like banks."
  },
  {
    prompt: "How does the human brain process information?",
    output: "The human brain processes information through billions of neurons that communicate via electrical and chemical signals. Information enters through sensory organs, travels through neural pathways, and is processed in different brain regions responsible for specific functions like memory, emotion, and decision-making."
  },
  {
    prompt: "What is renewable energy?",
    output: "Renewable energy comes from natural sources that are constantly replenished, such as solar, wind, hydroelectric, geothermal, and biomass. Unlike fossil fuels, these energy sources are sustainable and produce minimal environmental impact."
  },
  {
    prompt: "Explain the concept of DNA",
    output: "DNA (deoxyribonucleic acid) is the molecule that carries genetic instructions for the development, functioning, and reproduction of all living organisms. It consists of two strands forming a double helix structure, with sequences of nucleotides encoding genetic information."
  },
  {
    prompt: "What is cloud computing?",
    output: "Cloud computing is the delivery of computing services including servers, storage, databases, networking, and software over the internet. It allows users to access resources on-demand without managing physical infrastructure, offering scalability and cost-efficiency."
  },
  {
    prompt: "How does 5G technology work?",
    output: "5G is the fifth generation of cellular network technology that uses higher frequency radio waves to transmit data at faster speeds with lower latency. It employs advanced antenna technology and network architecture to support more connected devices and enable new applications."
  },
  {
    prompt: "What is the Internet of Things (IoT)?",
    output: "The Internet of Things refers to the network of physical devices embedded with sensors, software, and connectivity that enables them to collect and exchange data. IoT devices range from smart home appliances to industrial sensors, creating interconnected ecosystems."
  },
  {
    prompt: "Explain the greenhouse effect",
    output: "The greenhouse effect is a natural process where certain gases in Earth's atmosphere trap heat from the sun, keeping the planet warm enough to support life. However, increased greenhouse gas emissions from human activities have intensified this effect, leading to global warming."
  },
  {
    prompt: "What is artificial general intelligence (AGI)?",
    output: "Artificial General Intelligence refers to AI systems that possess the ability to understand, learn, and apply knowledge across a wide range of tasks at a level comparable to human intelligence. Unlike narrow AI, AGI would have the flexibility to handle any intellectual task that a human can perform."
  }
];

async function seedDatabase() {
  let mongod;
  try {
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('your_mongodb_uri')) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } else {
      console.log('Starting in-memory MongoDB for seeding...');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Connected to in-memory MongoDB');
    }

    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    await Task.insertMany(sampleTasks);
    console.log(`Seeded ${sampleTasks.length} sample tasks`);

    await mongoose.connection.close();
    if (mongod) await mongod.stop();
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Seeding error:', error);
    if (mongod) await mongod.stop();
    process.exit(1);
  }
}

seedDatabase();
