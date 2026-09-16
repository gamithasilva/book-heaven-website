package lk.ijse.book_web.service;

import lk.ijse.book_web.dto.OrderDTO;
import lk.ijse.book_web.dto.OrderRequestDTO;

import java.util.List;

public interface OrderService {



    OrderDTO createOrder(
            OrderRequestDTO request,
            String email
    );

    OrderDTO getOrderById(Long id, String email);

    List<OrderDTO> getMyOrders(String email);

    void cancelOrder(Long id, String email);
}