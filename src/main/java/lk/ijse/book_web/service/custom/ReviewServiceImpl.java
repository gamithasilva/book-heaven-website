package lk.ijse.book_web.service.custom;


import jakarta.transaction.Transactional;
import lk.ijse.book_web.dto.ReviewDTO;
import lk.ijse.book_web.entity.Book;
import lk.ijse.book_web.entity.Customer;
import lk.ijse.book_web.entity.Review;
import lk.ijse.book_web.enumuration.ReviewStatus;
import lk.ijse.book_web.exception.CustomException;
import lk.ijse.book_web.repository.BookRepository;
import lk.ijse.book_web.repository.CustomerRepository;

import lk.ijse.book_web.repository.ReviewRepository;
import lk.ijse.book_web.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {


    private final CustomerRepository customerRepository;
    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    @Override
    @Transactional
    public void saveReview(ReviewDTO reviewDTO) {

        log.info("Saving review: {}", reviewDTO);

        Optional<Customer> optionalCustomer =
                customerRepository.findByEmail(reviewDTO.getCustomerName());

        if (optionalCustomer.isEmpty()) {
            throw new CustomException(404, "Customer not found");
        }

        Customer customer = optionalCustomer.get();

        Optional<Book> optionalBook =
                bookRepository.findById(reviewDTO.getBookId());

        if (optionalBook.isEmpty()) {
            throw new CustomException(404, "Book not found");
        }

        Book book = optionalBook.get();

        log.info("Customer ID: {}", customer.getId());
        log.info("Book ID: {}", book.getId());

        if (reviewRepository.existsByCustomerIdAndBookId(
                customer.getId(),
                book.getId())) {

            throw new CustomException(
                    409,
                    "You have already reviewed this book"
            );
        }

        Review review = new Review();
        review.setCustomer(customer);
        review.setBook(book);
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());

        reviewRepository.save(review);

        log.info("Review saved successfully");

        updateReviewRating(book.getId());

        log.info("Book rating updated successfully");
    }

    @Override
    public List<ReviewDTO> getAllReviewsByBookId(Long book){
        List<Review> reviews = reviewRepository.findAllByBookIdAndStatus(book, ReviewStatus.VISIBLE);
        return reviews.stream().map(
                 review -> ReviewDTO.builder().
                            id(review.getId()).
                            customerId(review.getCustomer().getId()).
                            customerName(review.getCustomer().getFirstName() + " " + review.getCustomer().getLastName()).
                            bookId(review.getBook().getId()).
                            rating(review.getRating()).
                            comment(review.getComment()).
                            status(review.getStatus()).
                            createdAt(review.getCreatedAt()).
                            updatedAt(review.getUpdatedAt()).
                            build()
         ).toList();

    }

    @Override
    public void updateReviewRating(Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new CustomException(404, "Book not found")
                );

        long reviewCount = reviewRepository.countByBookId(bookId);

        Double averageRating = reviewRepository.getAverageRating(bookId);

        if (averageRating == null) {
            averageRating = 0.0;
        }

        book.setRating(averageRating);
        book.setReviewCount((int) reviewCount);

        bookRepository.save(book);
    }



}
