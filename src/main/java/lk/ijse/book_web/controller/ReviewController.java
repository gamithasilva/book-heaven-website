package lk.ijse.book_web.controller;

import lk.ijse.book_web.dto.CommonResponse;
import lk.ijse.book_web.dto.ReviewCreateDTO;
import lk.ijse.book_web.dto.ReviewDTO;
import lk.ijse.book_web.exception.CustomException;
import lk.ijse.book_web.repository.ReviewRepository;
import lk.ijse.book_web.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/books")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/{bookId}/reviews")
    public CommonResponse createReview(@PathVariable Long bookId, @RequestBody ReviewCreateDTO reviewCreateDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName().equals("anonymousUser")) {

            throw new CustomException(401, "User is not authenticated");
        }

        String username = authentication.getName();
        System.out.println("username is "+username);

        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setBookId(bookId);
        reviewDTO.setCustomerName(username);
        reviewDTO.setRating(reviewCreateDTO.getRating());
        reviewDTO.setComment(reviewCreateDTO.getComment());

        reviewService.saveReview(reviewDTO);



        return new CommonResponse(200,  "OPERATION SUCCESS");
    }

    @GetMapping("/{bookId}/reviews")
    public CommonResponse getReviewsByBookId(@PathVariable Long bookId) {
        return new CommonResponse(200, reviewService.getAllReviewsByBookId(bookId), "OPERATION SUCCESS");
    }
}
