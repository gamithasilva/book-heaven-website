package lk.ijse.book_web.dto;

import lk.ijse.book_web.enumuration.BookFormat;
import lk.ijse.book_web.enumuration.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookResponseDTO {

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

    // Pricing
    private BigDecimal originalPrice;
    private BigDecimal price; // Mapped from entity sellingPrice to match frontend

    private Integer stock;
    private String coverImage;
    private Double rating;
    private Integer reviewCount;
    private Integer salesCount;
    private BookStatus status;

    // Category mapping
    private Long categoryId;
    private String categoryName; // Directly mapped for frontend display

    // Computed UI badge ("New", "Discount", "Out of Stock", etc.)
    private String badge;
}