package lk.ijse.book_web.dto;

import lk.ijse.book_web.enumuration.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {

    private Long addressId;

    private PaymentMethod paymentMethod;

    private String deliveryMethod;

    private String couponCode;

    private String notes;

    @Builder.Default
    private List<OrderRequestItemDTO> items = new ArrayList<>();
}