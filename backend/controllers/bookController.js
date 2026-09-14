const Book = require('../models/Book');
const Loan = require('../models/Loan');
const Notification = require('../models/Notification');

// @desc    Get all books with debounced search and category filter
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Search by title or author using regex (case-insensitive)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== 'All' && category.trim() !== '') {
      query.category = category;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    console.error('getBooks error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error fetching books' });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    return res.json({ success: true, book });
  } catch (error) {
    console.error('getBookById error:', error);
    return res.status(500).json({ success: false, message: 'Invalid Book ID or server error' });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private (Librarian, Admin)
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, publisher, publishedYear, quantity, description } = req.body;

    if (!title || !author || !isbn || !category || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if ISBN exists
    const isbnExists = await Book.findOne({ isbn: isbn.trim() });
    if (isbnExists) {
      return res.status(400).json({ success: false, message: 'A book with this ISBN already exists' });
    }

    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive number' });
    }

    const book = await Book.create({
      title,
      author,
      isbn: isbn.trim(),
      category,
      publisher: publisher || 'Academic Press',
      publishedYear: publishedYear || new Date().getFullYear(),
      quantity: numQuantity,
      availableQuantity: numQuantity,
      description: description || ''
    });

    // Create system notification
    await Notification.create({
      message: `New book added: "${book.title}" by ${book.author}`,
      type: 'info'
    });

    return res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('createBook error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error creating book' });
  }
};

// @desc    Update book details
// @route   PUT /api/books/:id
// @access  Private (Librarian, Admin)
const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const { title, author, isbn, category, publisher, publishedYear, quantity, description } = req.body;

    // If ISBN changed, check uniqueness
    if (isbn && isbn.trim() !== book.isbn) {
      const isbnExists = await Book.findOne({ isbn: isbn.trim(), _id: { $ne: book._id } });
      if (isbnExists) {
        return res.status(400).json({ success: false, message: 'ISBN already in use by another book' });
      }
      book.isbn = isbn.trim();
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (publisher) book.publisher = publisher;
    if (publishedYear) book.publishedYear = publishedYear;
    if (description !== undefined) book.description = description;

    // Handle quantity changes safely
    if (quantity !== undefined) {
      const newQuantity = parseInt(quantity, 10);
      if (isNaN(newQuantity) || newQuantity < 0) {
        return res.status(400).json({ success: false, message: 'Invalid quantity' });
      }

      const issuedCount = book.quantity - book.availableQuantity;
      if (newQuantity < issuedCount) {
        return res.status(400).json({
          success: false,
          message: `Cannot decrease total quantity below ${issuedCount} (currently issued to members)`
        });
      }

      book.availableQuantity = newQuantity - issuedCount;
      book.quantity = newQuantity;
    }

    const updatedBook = await book.save();

    return res.json({
      success: true,
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    console.error('updateBook error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating book' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private (Librarian, Admin)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check if book has active issued loans
    const activeLoan = await Loan.findOne({ bookId: book._id, status: 'Issued' });
    if (activeLoan) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book with active issued loans. Return all copies first.'
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('deleteBook error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error deleting book' });
  }
};

// @desc    Get AI Smart Recommendations for a book based on Category, Author, and Keywords
// @route   GET /api/books/:id/recommendations
// @access  Public
const getRecommendations = async (req, res) => {
  try {
    const currentBook = await Book.findById(req.params.id);
    if (!currentBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const allBooks = await Book.find({ _id: { $ne: currentBook._id } });

    // Extract keywords
    const extractKeywords = (text) => {
      if (!text) return [];
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 3 && !['with', 'from', 'about', 'this', 'that', 'into', 'cover', 'covers', 'guide', 'introduction', 'edition'].includes(word));
    };

    const targetKeywords = extractKeywords(`${currentBook.title} ${currentBook.description}`);

    const scored = allBooks.map((b) => {
      let score = 0;
      let reasons = [];

      // 1. Same category match
      if (b.category === currentBook.category) {
        score += 35;
        reasons.push(`Top pick in ${b.category}`);
      }

      // 2. Same author match
      if (b.author.toLowerCase().trim() === currentBook.author.toLowerCase().trim()) {
        score += 30;
        reasons.push(`By same author: ${b.author}`);
      }

      // 3. Keyword / Topic similarity
      const candidateKeywords = extractKeywords(`${b.title} ${b.description}`);
      const matchingTokens = targetKeywords.filter((token) => candidateKeywords.includes(token));

      if (matchingTokens.length > 0) {
        score += matchingTokens.length * 12;
        reasons.push(`Shared topics: ${matchingTokens.slice(0, 2).join(', ')}`);
      }

      // 4. Availability bonus
      if (b.availableQuantity > 0) {
        score += 5;
      }

      const matchPercentage = Math.min(98, Math.max(65, Math.round(55 + score * 0.7)));

      return {
        book: b,
        score,
        matchPercentage,
        reason: reasons[0] || `Similar reading choice in ${b.category}`
      };
    });

    // Sort by score descending and take top 4
    scored.sort((a, b) => b.score - a.score);
    const recommendations = scored.slice(0, 4);

    return res.json({
      success: true,
      currentBookTitle: currentBook.title,
      recommendations
    });
  } catch (error) {
    console.error('getRecommendations error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error computing recommendations' });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getRecommendations
};

