package lk.ijse.book_web.controller;

import lk.ijse.book_web.dto.CommonResponse;
import lk.ijse.book_web.dto.OrderDTO;
import lk.ijse.book_web.dto.OrderRequestDTO;
import lk.ijse.book_web.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/customer/orders")
@RequiredArgsConstructor
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    // =========================================================
    // CREATE ORDER
    // =========================================================

    @PostMapping
    public ResponseEntity<CommonResponse> createOrder(
            @RequestBody OrderRequestDTO request
    ) {
        String email = getCurrentUserEmail();
        OrderDTO order = orderService.createOrder(request, email);

        return new ResponseEntity<>(
                new CommonResponse(HttpStatus.CREATED.value(), order, "Order created successfully"),
                HttpStatus.CREATED
        );
    }

    // =========================================================
    // GET MY ORDERS
    // =========================================================

    @GetMapping("/my-orders")
    public ResponseEntity<CommonResponse> getMyOrders() {
        String email = getCurrentUserEmail();
        List<OrderDTO> orders = orderService.getMyOrders(email);

        return ResponseEntity.ok(
                new CommonResponse(HttpStatus.OK.value(), orders, "Orders fetched successfully")
        );
    }

    // =========================================================
    // GET MY ORDER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<CommonResponse> getOrderById(
            @PathVariable Long id
    ) {
        String email = getCurrentUserEmail();
        OrderDTO order = orderService.getOrderById(id, email);

        return ResponseEntity.ok(
                new CommonResponse(HttpStatus.OK.value(), order, "Order details fetched successfully")
        );
    }

    // =========================================================
    // CANCEL MY ORDER
    // =========================================================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<CommonResponse> cancelOrder(
            @PathVariable Long id
    ) {
        String email = getCurrentUserEmail();
        orderService.cancelOrder(id, email);

        return ResponseEntity.ok(
                new CommonResponse(HttpStatus.OK.value(), "Order cancelled successfully")
        );
    }

    // =========================================================
    // GET CURRENT USER EMAIL
    // =========================================================

    private String getCurrentUserEmail() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        return authentication.getName();
    }
}