const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Book = require('../models/Book');
const Member = require('../models/Member');
const Loan = require('../models/Loan');
const BookLending = require('../models/BookLending');
const Notification = require('../models/Notification');

dotenv.config({ path: './.env' });

const seedDatabase = async () => {
  try {
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

    // 3. Create Members (Users + Member profiles)
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

    // 4. Create 25 Books with diverse topics for smart AI recommendations
    const booksData = [
      {
        title: 'Introduction to Python',
        author: 'Mark Lutz',
        isbn: '978-0596513986',
        category: 'Technology',
        publisher: "O'Reilly Media",
        publishedYear: 2021,
        quantity: 5,
        availableQuantity: 4, // 1 issued
        description: 'Comprehensive introduction to Python programming language covering basic syntax, data structures, and object-oriented patterns.'
      },
      {
        title: 'Database Management Systems',
        author: 'Raghu Ramakrishnan',
        isbn: '978-0072465631',
        category: 'Technology',
        publisher: 'McGraw-Hill',
        publishedYear: 2019,
        quantity: 4,
        availableQuantity: 3, // 1 issued
        description: 'Covers relational databases, SQL queries, indexing, query optimization, transaction management, and concurrency control.'
      },
      {
        title: 'Computer Networks',
        author: 'Andrew S. Tanenbaum',
        isbn: '978-0132126953',
        category: 'Technology',
        publisher: 'Pearson Education',
        publishedYear: 2020,
        quantity: 6,
        availableQuantity: 5, // 1 issued
        description: 'Definitive guide on networking layers, routing algorithms, TCP/IP protocols, wireless networks, and network security.'
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
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        isbn: '978-0062315007',
        category: 'Fiction',
        publisher: 'HarperOne',
        publishedYear: 2014,
        quantity: 6,
        availableQuantity: 5, // 1 issued
        description: 'Inspiring fable about following your dreams, listening to your heart, and reading the omens strewn along life’s journey.'
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
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '978-0735211292',
        category: 'Education',
        publisher: 'Avery',
        publishedYear: 2020,
        quantity: 6,
        availableQuantity: 6,
        description: 'Proven framework for improving every day through tiny behavioral changes, habit loops, and systems optimization.'
      }
    ];

    const createdBooks = await Book.insertMany(booksData);

    // 5. Create 5 Loans (3 Issued, 2 Returned)
    const now = new Date();
    const futureDueDate1 = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days later
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
        bookId: createdBooks[1]._id, // DBMS
        memberId: createdMembers[1]._id, // Sarah
        issueDate: now,
        dueDate: futureDueDate2,
        status: 'Issued'
      },
      {
        bookId: createdBooks[2]._id, // Networks
        memberId: createdMembers[2]._id, // Alex
        issueDate: now,
        dueDate: futureDueDate1,
        status: 'Issued'
      },
      {
        bookId: createdBooks[8]._id, // The Alchemist
        memberId: createdMembers[3]._id, // Priya
        issueDate: pastIssueDate,
        dueDate: pastDueDate,
        returnDate: pastReturnDate,
        status: 'Returned'
      },
      {
        bookId: createdBooks[9]._id, // Wings of Fire
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
        bookId: createdBooks[1]._id,
        memberId: createdMembers[1]._id,
        loanId: createdLoans[1]._id,
        action: 'Issued'
      },
      {
        bookId: createdBooks[2]._id,
        memberId: createdMembers[2]._id,
        loanId: createdLoans[2]._id,
        action: 'Issued'
      },
      {
        bookId: createdBooks[8]._id,
        memberId: createdMembers[3]._id,
        loanId: createdLoans[3]._id,
        action: 'Issued'
      },
      {
        bookId: createdBooks[8]._id,
        memberId: createdMembers[3]._id,
        loanId: createdLoans[3]._id,
        action: 'Returned'
      },
      {
        bookId: createdBooks[9]._id,
        memberId: createdMembers[4]._id,
        loanId: createdLoans[4]._id,
        action: 'Issued'
      },
      {
        bookId: createdBooks[9]._id,
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
