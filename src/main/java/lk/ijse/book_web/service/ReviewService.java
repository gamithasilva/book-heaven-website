package lk.ijse.book_web.service;

import lk.ijse.book_web.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    void saveReview(ReviewDTO reviewDTO);

    List<ReviewDTO> getAllReviewsByBookId(Long book);

    void updateReviewRating(Long bookId);
}
