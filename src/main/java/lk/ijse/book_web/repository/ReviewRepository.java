package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Review;
import lk.ijse.book_web.enumuration.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Long> {

    List<Review> findAllByBookIdAndStatus(Long bookId, ReviewStatus status);

    long countByBookId(Long bookId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.book.id = :bookId")
    Double getAverageRating(@Param("bookId") Long bookId);

    boolean existsByCustomerIdAndBookId(Long customerId, Long bookId);
}
