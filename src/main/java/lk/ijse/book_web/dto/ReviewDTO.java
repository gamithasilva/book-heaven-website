package lk.ijse.book_web.dto;

import lk.ijse.book_web.enumuration.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ReviewDTO {

    private Long id;

    private Long customerId;

    private String customerName;

    private Long bookId;

    private Integer rating;

    private String comment;

    private ReviewStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
