package lk.ijse.book_web.dto;

import lk.ijse.book_web.enumuration.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private Long id;

    private String orderNumber;

    private Long customerId;

    private LocalDateTime orderDate;

    private OrderStatus status;

    private BigDecimal subtotal;

    private BigDecimal discount;

    private BigDecimal deliveryFee;

    private BigDecimal total;

    private String shippingAddress;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Builder.Default
    private List<OrderItemDTO> items = new ArrayList<>();

    private PaymentDTO payment;
}