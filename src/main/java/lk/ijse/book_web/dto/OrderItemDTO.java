package lk.ijse.book_web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {

    private Long id;

    private Long bookId;

    private String bookTitle;

    private String author;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal subtotal;
}