package lk.ijse.book_web.dto;

import lk.ijse.book_web.enumuration.BookFormat;
import lk.ijse.book_web.enumuration.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BookDetailDTO {

    private Long id;

    private String title;

    private String author;

    private String isbn;

    private String description;

    private String publisher;

    private LocalDate publicationDate;

    private Integer pages;

    private String language;

    private BookFormat format;

    private BigDecimal originalPrice;

    private BigDecimal sellingPrice;

    private Integer stock;

    private String coverImage;

    private Double rating;

    private Integer reviewCount;

    private Integer salesCount;

    private BookStatus status;

    private Long categoryId;

    private String categoryName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
