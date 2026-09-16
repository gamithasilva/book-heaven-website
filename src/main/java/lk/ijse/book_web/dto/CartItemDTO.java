package lk.ijse.book_web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {

    private Long id;

    private Long bookId;

    private String title;

    private String author;

    private String category;

    private BigDecimal price;

    private Integer quantity;

    private Integer stock;

    private String coverImage;

    private BigDecimal subtotal;
}