package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review,Long> {
}
