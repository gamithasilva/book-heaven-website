package lk.ijse.book_web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WishlistItemDTO {

    private Long id;
    private Long bookId;
    private String title;
    private String author;
    private BigDecimal price;
    private String coverImage;


}
