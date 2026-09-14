package lk.ijse.book_web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WishlistDTO {
    private Long id;
    private Long customerId;
    private List<WishlistItemDTO> wishlistItemDTOS;
}
