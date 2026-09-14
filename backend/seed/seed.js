const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ensureLocalMongo } = require('../config/autoMongo');
const User = require('../models/User');
const Book = require('../models/Book');
const Member = require('../models/Member');
const Loan = require('../models/Loan');
const BookLending = require('../models/BookLending');
const Notification = require('../models/Notification');

dotenv.config({ path: './.env' });

const seedDatabase = async () => {
  try {
    await ensureLocalMongo();
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library_portal';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    await Member.deleteMany();
    await Loan.deleteMany();
    await BookLending.deleteMany();
    await Notification.deleteMany();
    console.log('Cleared existing database records.');

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'admin'
    });

    // 2. Create Librarians
    const librarian1 = await User.create({
      name: 'Eleanor Vance (Head Librarian)',
      email: 'librarian1@library.com',
      password: 'lib123',
      role: 'librarian'
    });

    const librarian2 = await User.create({
      name: 'Marcus Brody (Assistant Librarian)',
      email: 'librarian2@library.com',
      password: 'lib123',
      role: 'librarian'
    });

    // 3. Create Members
    const membersData = [
      {
        name: 'John Doe',
        email: 'john@student.com',
        password: 'member123',
        department: 'Computer Science',
        year: '3rd Year',
        phone: '9876543210',
        membershipId: 'LIB-MEM-1001'
      },
      {
        name: 'Sarah Connor',
        email: 'sarah@student.com',
        password: 'member123',
        department: 'Information Technology',
        year: '2nd Year',
        phone: '9876543211',
        membershipId: 'LIB-MEM-1002'
      },
      {
        name: 'Alex Mercer',
        email: 'alex@student.com',
        password: 'member123',
        department: 'Electronics Engineering',
        year: '4th Year',
        phone: '9876543212',
        membershipId: 'LIB-MEM-1003'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@student.com',
        password: 'member123',
        department: 'Data Science & AI',
        year: '2nd Year',
        phone: '9876543213',
        membershipId: 'LIB-MEM-1004'
      },
      {
        name: 'David Miller',
        email: 'david@student.com',
        password: 'member123',
        department: 'Mechanical Engineering',
        year: '1st Year',
        phone: '9876543214',
        membershipId: 'LIB-MEM-1005'
      }
    ];

    const createdMembers = [];
    for (const m of membersData) {
      const u = await User.create({
        name: m.name,
        email: m.email,
        password: m.password,
        role: 'member'
      });

      const memberDoc = await Member.create({
        userId: u._id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        department: m.department,
        year: m.year,
        membershipId: m.membershipId
      });

      createdMembers.push(memberDoc);
    }

    // 4. Create 52 Rich Books across diverse categories
    const booksData = [
      // Technology & Programming
      {
        title: 'Introduction to Python',
        author: 'Mark Lutz',
        isbn: '978-0596513986',
        category: 'Technology',
        publisher: "O'Reilly Media",
        publishedYear: 2021,
        quantity: 5,
        availableQuantity: 4,
        description: 'Comprehensive introduction to Python programming language covering basic syntax, data structures, and object-oriented patterns.'
      },
      {
        title: 'Fluent Python: Clear, Concise, and Effective Programming',
        author: 'Luciano Ramalho',
        isbn: '978-1491946008',
        category: 'Technology',
        publisher: "O'Reilly Media",
        publishedYear: 2022,
        quantity: 4,
        availableQuantity: 4,
        description: 'Advanced Python idioms, metaprogramming, generators, coroutines, async concurrency, and typing structures for robust development.'
      },
      {
        title: 'Database Management Systems',
        author: 'Raghu Ramakrishnan',
        isbn: '978-0072465631',
        category: 'Technology',
        publisher: 'McGraw-Hill',
        publishedYear: 2019,
        quantity: 4,
        availableQuantity: 3,
        description: 'Covers relational databases, SQL queries, indexing, query optimization, transaction management, and concurrency control.'
      },
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        isbn: '978-1449373320',
        category: 'Technology',
        publisher: "O'Reilly Media",
        publishedYear: 2020,
        quantity: 6,
        availableQuantity: 6,
        description: 'The definitive guide to distributed systems, replication, partitioning, stream processing, transactions, and reliable data storage architecture.'
      },
      {
        title: 'Computer Networks',
        author: 'Andrew S. Tanenbaum',
        isbn: '978-0132126953',
        category: 'Technology',
        publisher: 'Pearson Education',
        publishedYear: 2020,
        quantity: 6,
        availableQuantity: 5,
        description: 'Definitive guide on networking layers, routing algorithms, TCP/IP protocols, wireless networks, and network security.'
      },
      {
        title: 'Operating Systems: Internals and Design Principles',
        author: 'William Stallings',
        isbn: '978-0134670959',
        category: 'Technology',
        publisher: 'Pearson',
        publishedYear: 2022,
        quantity: 5,
        availableQuantity: 5,
        description: 'In-depth exploration of modern operating system structures, processes, multithreading, memory virtualization, and file systems.'
      },
      {
        title: 'Data Structures and Algorithms in Java',
        author: 'Robert Lafore',
        isbn: '978-0672324536',
        category: 'Technology',
        publisher: 'Sams Publishing',
        publishedYear: 2021,
        quantity: 5,
        availableQuantity: 5,
        description: 'Hands-on guide to essential algorithmic structures including binary trees, graphs, heaps, dynamic programming, and sorting algorithms.'
      },
      {
        title: 'Introduction to Algorithms (CLRS)',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        isbn: '978-0262046305',
        category: 'Technology',
        publisher: 'MIT Press',
        publishedYear: 2022,
        quantity: 5,
        availableQuantity: 5,
        description: 'Comprehensive algorithmic foundation covering divide-and-conquer, greedy algorithms, dynamic programming, graph algorithms, NP-completeness, and data structures.'
      },
      {
        title: 'Grokking Algorithms: An Illustrated Guide',
        author: 'Aditya Bhargava',
        isbn: '978-1617292231',
        category: 'Education',
        publisher: 'Manning Publications',
        publishedYear: 2019,
        quantity: 6,
        availableQuantity: 6,
        description: 'Visual, engaging introduction to fundamental computer science algorithms, search, sorting, recursion, hash tables, and graph algorithms.'
      },
      {
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell & Peter Norvig',
        isbn: '978-0134610993',
        category: 'Technology',
        publisher: 'Pearson',
        publishedYear: 2023,
        quantity: 4,
        availableQuantity: 4,
        description: 'The global standard textbook for modern AI, intelligent agents, search algorithms, probabilistic reasoning, machine learning, and neural networks.'
      },
      {
        title: 'Deep Learning',
        author: 'Ian Goodfellow, Yoshua Bengio & Aaron Courville',
        isbn: '978-0262035613',
        category: 'Technology',
        publisher: 'MIT Press',
        publishedYear: 2020,
        quantity: 4,
        availableQuantity: 4,
        description: 'Comprehensive textbook on deep neural networks, convolutional networks, recurrent nets, autoencoders, and generative adversarial models.'
      },
      {
        title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
        author: 'Aurélien Géron',
        isbn: '978-1098125974',
        category: 'Technology',
        publisher: "O'Reilly Media",
        publishedYear: 2022,
        quantity: 5,
        availableQuantity: 5,
        description: 'Practical guide to building intelligent machine learning systems, deep neural nets, transformers, natural language processing, and computer vision models.'
      },
      {
        title: 'Pattern Recognition and Machine Learning',
        author: 'Christopher M. Bishop',
        isbn: '978-0387310732',
        category: 'Technology',
        publisher: 'Springer',
        publishedYear: 2016,
        quantity: 4,
        availableQuantity: 4,
        description: 'Mathematical foundation for Bayesian methods, graphical models, expectation-maximization, Gaussian processes, and probabilistic machine learning.'
      },
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        category: 'Education',
        publisher: 'Prentice Hall',
        publishedYear: 2018,
        quantity: 5,
        availableQuantity: 5,
        description: 'Best practices for writing clean, readable, testable, and maintainable software code with SOLID design principles.'
      },
      {
        title: 'Clean Architecture: A Craftsman Guide to Software Structure',
        author: 'Robert C. Martin',
        isbn: '978-0134494166',
        category: 'Technology',
        publisher: 'Prentice Hall',
        publishedYear: 2019,
        quantity: 4,
        availableQuantity: 4,
        description: 'Essential guidelines on software architecture design, component coupling, dependency injection, and boundary design.'
      },
      {
        title: 'The Clean Coder: A Code of Conduct for Professional Programmers',
        author: 'Robert C. Martin',
        isbn: '978-0137081073',
        category: 'Education',
        publisher: 'Prentice Hall',
        publishedYear: 2017,
        quantity: 4,
        availableQuantity: 4,
        description: 'Professionalism, discipline, time management, estimation, coding ethics, and software engineering craftsmanship.'
      },
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        isbn: '978-0201633610',
        category: 'Technology',
        publisher: 'Addison-Wesley',
        publishedYear: 2018,
        quantity: 4,
        availableQuantity: 4,
        description: 'The Gang of Four classic on reusable software design patterns: Singleton, Factory, Observer, Decorator, Strategy, and Adapter.'
      },
      {
        title: 'The Pragmatic Programmer: Your Journey To Mastery',
        author: 'David Thomas & Andrew Hunt',
        isbn: '978-0135957059',
        category: 'Education',
        publisher: 'Addison-Wesley',
        publishedYear: 2021,
        quantity: 5,
        availableQuantity: 5,
        description: 'Practical philosophies and wisdom for effective software engineering, automation, debugging, and continuous career growth.'
      },
      {
        title: 'Web Development with Node and Express',
        author: 'Ethan Brown',
        isbn: '978-1492053514',
        category: 'Technology',
        publisher: "O'Reilly Media",
        publishedYear: 2021,
        quantity: 5,
        availableQuantity: 5,
        description: 'Building modern full-stack web applications and RESTful APIs using Node.js, Express, middleware, and MongoDB database integration.'
      },
      {
        title: 'Learning React: Modern Patterns for Developing React Apps',
        author: 'Alex Banks & Eve Porcello',
        isbn: '978-1492051725',
        category: 'Technology',
        publisher: "O'Reilly Media",
        publishedYear: 2022,
        quantity: 4,
        availableQuantity: 4,
        description: 'Comprehensive guide to building component-driven user interfaces with React hooks, functional state, and modern JavaScript syntax.'
      },
      {
        title: 'You Don’t Know JS Yet: Get Started',
        author: 'Kyle Simpson',
        isbn: '978-1712296790',
        category: 'Technology',
        publisher: 'Independently Published',
        publishedYear: 2020,
        quantity: 5,
        availableQuantity: 5,
        description: 'Deep dive into core JavaScript mechanisms, closures, prototypes, lexical scope, asynchronous event loops, and ES6+ features.'
      },
      {
        title: 'The Rust Programming Language',
        author: 'Steve Klabnik & Carol Nichols',
        isbn: '978-1718503106',
        category: 'Technology',
        publisher: 'No Starch Press',
        publishedYear: 2023,
        quantity: 4,
        availableQuantity: 4,
        description: 'Official guide to Rust systems programming, memory safety without garbage collection, lifetimes, pattern matching, and concurrent systems.'
      },
      {
        title: 'The Go Programming Language',
        author: 'Alan A. A. Donovan & Brian W. Kernighan',
        isbn: '978-0134190440',
        category: 'Technology',
        publisher: 'Addison-Wesley',
        publishedYear: 2019,
        quantity: 4,
        availableQuantity: 4,
        description: 'Authoritative guide to Go language idioms, goroutines, channels, interfaces, packages, and building scalable cloud network services.'
      },
      {
        title: 'Site Reliability Engineering: How Google Runs Production Systems',
        author: 'Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Richard Murphy',
        isbn: '978-1491929124',
        category: 'Technology',
        publisher: "O'Reilly Media",
        publishedYear: 2016,
        quantity: 4,
        availableQuantity: 4,
        description: 'Google engineering principles on DevOps, system monitoring, incident management, automated deployments, and building fault-tolerant scalable clouds.'
      },
      {
        title: 'Docker Deep Dive',
        author: 'Nigel Poulton',
        isbn: '978-1521822807',
        category: 'Technology',
        publisher: 'Independently Published',
        publishedYear: 2023,
        quantity: 5,
        availableQuantity: 5,
        description: 'Complete guide to containerization, Docker containers, multi-stage images, networking, Swarm, Docker Compose, and Kubernetes integration.'
      },
      {
        title: 'Kubernetes: Up and Running: Dive into the Future of Infrastructure',
        author: 'Brendan Burns, Joe Beda, Kelsey Hightower, Lachlan Evenson',
        isbn: '978-1098110208',
        category: 'Technology',
        publisher: "O'Reilly Media",
        publishedYear: 2022,
        quantity: 4,
        availableQuantity: 4,
        description: 'Learn how to deploy, manage, and scale containerized applications across cloud clusters using Kubernetes orchestration.'
      },
      {
        title: 'Practical Malware Analysis',
        author: 'Michael Sikorski & Andrew Honig',
        isbn: '978-1593272906',
        category: 'Technology',
        publisher: 'No Starch Press',
        publishedYear: 2019,
        quantity: 3,
        availableQuantity: 3,
        description: 'Hands-on guide to dissecting malicious software, reverse engineering x86 assembly, debugging, network packet sniffing, and malware defenses.'
      },

      // Science & Engineering
      {
        title: 'Engineering Mechanics: Statics and Dynamics',
        author: 'R.C. Hibbeler',
        isbn: '978-0133915426',
        category: 'Science',
        publisher: 'Pearson',
        publishedYear: 2019,
        quantity: 3,
        availableQuantity: 3,
        description: 'Core engineering mechanics principles, vector analysis, equilibrium of particles, friction, kinematics, and kinetics of rigid bodies.'
      },
      {
        title: 'Digital Electronics and Logic Design',
        author: 'M. Morris Mano',
        isbn: '978-0131989245',
        category: 'Science',
        publisher: 'Prentice Hall',
        publishedYear: 2018,
        quantity: 4,
        availableQuantity: 4,
        description: 'Fundamental principles of digital hardware, Boolean algebra, logic gates, combinational logic, and sequential circuit design.'
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '978-0553380163',
        category: 'Science',
        publisher: 'Bantam Books',
        publishedYear: 2017,
        quantity: 4,
        availableQuantity: 4,
        description: 'Iconic exploration of cosmology, black holes, the Big Bang theory, time travel, and the unified theory of physics.'
      },
      {
        title: 'Cosmos',
        author: 'Carl Sagan',
        isbn: '978-0345539434',
        category: 'Science',
        publisher: 'Ballantine Books',
        publishedYear: 2015,
        quantity: 4,
        availableQuantity: 4,
        description: 'Celebrated voyage through cosmic evolution, astronomy, planetary science, and the history of human understanding.'
      },
      {
        title: 'The Feynman Lectures on Physics (Vol 1-3)',
        author: 'Richard P. Feynman',
        isbn: '978-0465023820',
        category: 'Science',
        publisher: 'Basic Books',
        publishedYear: 2018,
        quantity: 3,
        availableQuantity: 3,
        description: 'The legendary physics masterclass covering Newtonian mechanics, thermodynamics, electromagnetism, and quantum mechanics.'
      },
      {
        title: 'Astrophysics for People in a Hurry',
        author: 'Neil deGrasse Tyson',
        isbn: '978-0393609394',
        category: 'Science',
        publisher: 'W. W. Norton & Company',
        publishedYear: 2017,
        quantity: 5,
        availableQuantity: 5,
        description: 'Quick, mind-expanding guide to the cosmos, quantum physics, black holes, general relativity, and the search for extraterrestrial life.'
      },
      {
        title: 'The Selfish Gene',
        author: 'Richard Dawkins',
        isbn: '978-0198788607',
        category: 'Science',
        publisher: 'Oxford University Press',
        publishedYear: 2016,
        quantity: 4,
        availableQuantity: 4,
        description: 'Groundbreaking perspective on biological evolution, natural selection, altruism, genetics, and evolutionary game theory.'
      },

      // History & Civilization
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '978-0062316097',
        category: 'History',
        publisher: 'Harper',
        publishedYear: 2018,
        quantity: 5,
        availableQuantity: 5,
        description: 'Captivating overview of the history of our species, from ancient stone age foragers to global technology leaders.'
      },
      {
        title: 'Homo Deus: A Brief History of Tomorrow',
        author: 'Yuval Noah Harari',
        isbn: '978-0062464316',
        category: 'History',
        publisher: 'Harper',
        publishedYear: 2019,
        quantity: 5,
        availableQuantity: 5,
        description: 'Provocative exploration of humanity future, biotechnology, artificial intelligence algorithms, dataism, and immortality ambitions.'
      },
      {
        title: '21 Lessons for the 21st Century',
        author: 'Yuval Noah Harari',
        isbn: '978-0525512172',
        category: 'History',
        publisher: 'Spiegel & Grau',
        publishedYear: 2020,
        quantity: 4,
        availableQuantity: 4,
        description: 'Essential reflections on present day political crisis, artificial intelligence disruption, fake news, education, and global challenges.'
      },
      {
        title: 'Guns, Germs, and Steel: The Fates of Human Societies',
        author: 'Jared Diamond',
        isbn: '978-0393354324',
        category: 'History',
        publisher: 'W. W. Norton & Company',
        publishedYear: 2017,
        quantity: 4,
        availableQuantity: 4,
        description: 'Pulitzer Prize-winning analysis of geographical and environmental factors shaping world history and civilization rise.'
      },
      {
        title: 'The Silk Roads: A New History of the World',
        author: 'Peter Frankopan',
        isbn: '978-1101912379',
        category: 'History',
        publisher: 'Vintage Books',
        publishedYear: 2017,
        quantity: 4,
        availableQuantity: 4,
        description: 'Monumental reassessment of world history highlighting the ancient trade corridors connecting Europe, Persia, India, and China.'
      },

      // Biography & Memoirs
      {
        title: 'Wings of Fire',
        author: 'A.P.J. Abdul Kalam',
        isbn: '978-8173711463',
        category: 'Biography',
        publisher: 'Universities Press',
        publishedYear: 2016,
        quantity: 5,
        availableQuantity: 5,
        description: 'An autobiography detailing the inspirational life journey of Dr. A.P.J. Abdul Kalam and India space and missile research.'
      },
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        isbn: '978-1451648539',
        category: 'Biography',
        publisher: 'Simon & Schuster',
        publishedYear: 2015,
        quantity: 4,
        availableQuantity: 4,
        description: 'Exclusive biography based on forty interviews with Apple co-founder Steve Jobs, detailing tech innovations and leadership.'
      },
      {
        title: 'Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future',
        author: 'Ashlee Vance',
        isbn: '978-0062301253',
        category: 'Biography',
        publisher: 'Ecco',
        publishedYear: 2017,
        quantity: 5,
        availableQuantity: 5,
        description: 'Gripping biography of tech visionary Elon Musk, covering electric vehicles, commercial rockets, satellite constellations, and clean energy.'
      },
      {
        title: 'Leonardo da Vinci',
        author: 'Walter Isaacson',
        isbn: '978-1501139154',
        category: 'Biography',
        publisher: 'Simon & Schuster',
        publishedYear: 2019,
        quantity: 4,
        availableQuantity: 4,
        description: 'Masterful examination of Leonardo da Vinci boundless curiosity, combining science, anatomy, optics, engineering, and painting.'
      },

      // Education & Self-Improvement
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '978-0735211292',
        category: 'Education',
        publisher: 'Avery',
        publishedYear: 2020,
        quantity: 6,
        availableQuantity: 6,
        description: 'Proven framework for improving every day through tiny behavioral changes, habit loops, and systems optimization.'
      },
      {
        title: 'Deep Work: Rules for Focused Success in a Distracted World',
        author: 'Cal Newport',
        isbn: '978-1455586691',
        category: 'Education',
        publisher: 'Grand Central Publishing',
        publishedYear: 2018,
        quantity: 5,
        availableQuantity: 5,
        description: 'Strategies for cultivating deep cognitive focus, eliminating digital distractions, and producing elite quality creative and analytical work.'
      },
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        isbn: '978-0374533557',
        category: 'Education',
        publisher: 'Farrar, Straus and Giroux',
        publishedYear: 2015,
        quantity: 5,
        availableQuantity: 5,
        description: 'Nobel laureate exploration of two cognitive decision making systems: fast, intuitive thinking versus slow, deliberate analytical logic.'
      },
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        isbn: '978-0857197689',
        category: 'Education',
        publisher: 'Harriman House',
        publishedYear: 2020,
        quantity: 6,
        availableQuantity: 6,
        description: 'Timeless lessons on wealth, greed, risk, compounding interest, and the behavioral psychology of personal financial decisions.'
      },

      // Fiction & Classics
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        isbn: '978-0062315007',
        category: 'Fiction',
        publisher: 'HarperOne',
        publishedYear: 2014,
        quantity: 6,
        availableQuantity: 5,
        description: 'Inspiring fable about following your dreams, listening to your heart, and reading the omens strewn along life journey.'
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0451524935',
        category: 'Fiction',
        publisher: 'Signet Classic',
        publishedYear: 2013,
        quantity: 5,
        availableQuantity: 5,
        description: 'Dystopian masterpiece depicting surveillance society, state control, truth distortion, and individual resistance.'
      },
      {
        title: 'Animal Farm',
        author: 'George Orwell',
        isbn: '978-0451526342',
        category: 'Fiction',
        publisher: 'Signet Classic',
        publishedYear: 2014,
        quantity: 5,
        availableQuantity: 5,
        description: 'Classic political satire allegorizing revolution, totalitarianism, propaganda, and power corrupting collective ideals.'
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0060935467',
        category: 'Fiction',
        publisher: 'Harper Perennial',
        publishedYear: 2015,
        quantity: 4,
        availableQuantity: 4,
        description: 'Pulitzer prize-winning classic exploring justice, empathy, and moral growth in the American South.'
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        isbn: '978-0441172719',
        category: 'Fiction',
        publisher: 'Ace Books',
        publishedYear: 2019,
        quantity: 6,
        availableQuantity: 6,
        description: 'Epic science fiction saga of Paul Atreides, desert ecology, spice melange economics, galactic politics, and prophecies on Arrakis.'
      }
    ];

    const createdBooks = await Book.insertMany(booksData);
    console.log(`Successfully created ${createdBooks.length} rich book records.`);

    // 5. Create 5 Loans (3 Issued, 2 Returned)
    const now = new Date();
    const futureDueDate1 = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const futureDueDate2 = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    const pastIssueDate = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    const pastDueDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    const pastReturnDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

    const loansToCreate = [
      {
        bookId: createdBooks[0]._id, // Python
        memberId: createdMembers[0]._id, // John
        issueDate: now,
        dueDate: futureDueDate1,
        status: 'Issued'
      },
      {
        bookId: createdBooks[2]._id, // DBMS
        memberId: createdMembers[1]._id, // Sarah
        issueDate: now,
        dueDate: futureDueDate2,
        status: 'Issued'
      },
      {
        bookId: createdBooks[4]._id, // Networks
        memberId: createdMembers[2]._id, // Alex
        issueDate: now,
        dueDate: futureDueDate1,
        status: 'Issued'
      },
      {
        bookId: createdBooks[47]._id, // The Alchemist
        memberId: createdMembers[3]._id, // Priya
        issueDate: pastIssueDate,
        dueDate: pastDueDate,
        returnDate: pastReturnDate,
        status: 'Returned'
      },
      {
        bookId: createdBooks[39]._id, // Wings of Fire
        memberId: createdMembers[4]._id, // David
        issueDate: pastIssueDate,
        dueDate: pastDueDate,
        returnDate: pastReturnDate,
        status: 'Returned'
      }
    ];

    const createdLoans = await Loan.insertMany(loansToCreate);

    // 6. Create BookLending records for history
    const lendings = [
      {
        bookId: createdBooks[0]._id,
        memberId: createdMembers[0]._id,
        loanId: createdLoans[0]._id,
        action: 'Issued'
      },
      {
        bookId: createdBooks[2]._id,
        memberId: createdMembers[1]._id,
        loanId: createdLoans[1]._id,
        action: 'Issued'
      },
      {
        bookId: createdBooks[4]._id,
        memberId: createdMembers[2]._id,
        loanId: createdLoans[2]._id,
        action: 'Issued'
      },
      {
        bookId: createdBooks[47]._id,
        memberId: createdMembers[3]._id,
        loanId: createdLoans[3]._id,
        action: 'Issued'
      },
      {
        bookId: createdBooks[47]._id,
        memberId: createdMembers[3]._id,
        loanId: createdLoans[3]._id,
        action: 'Returned'
      },
      {
        bookId: createdBooks[39]._id,
        memberId: createdMembers[4]._id,
        loanId: createdLoans[4]._id,
        action: 'Issued'
      },
      {
        bookId: createdBooks[39]._id,
        memberId: createdMembers[4]._id,
        loanId: createdLoans[4]._id,
        action: 'Returned'
      }
    ];

    await BookLending.insertMany(lendings);

    // 7. Create Sample Notifications
    await Notification.insertMany([
      {
        userId: null,
        message: 'Welcome to the Library Portal! Browse our newly cataloged academic books.',
        type: 'info'
      },
      {
        userId: createdMembers[0].userId,
        message: 'Book "Introduction to Python" issued successfully. Due in 14 days.',
        type: 'info'
      },
      {
        userId: createdMembers[3].userId,
        message: 'Book "The Alchemist" returned successfully. Thank you!',
        type: 'success'
      }
    ]);

    console.log('Database seeded successfully!');
    console.log('Sample Accounts:');
    console.log('- Admin:     admin@library.com / admin123');
    console.log('- Librarian: librarian1@library.com / lib123');
    console.log('- Member:    john@student.com / member123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
