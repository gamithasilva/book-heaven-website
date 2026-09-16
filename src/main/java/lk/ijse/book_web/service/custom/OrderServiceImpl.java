package lk.ijse.book_web.service.custom;

import lk.ijse.book_web.dto.*;
import lk.ijse.book_web.entity.*;
import lk.ijse.book_web.enumuration.OrderStatus;
import lk.ijse.book_web.enumuration.PaymentStatus;
import lk.ijse.book_web.repository.*;
import lk.ijse.book_web.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;

    private final CustomerRepository customerRepository;
    private final BookRepository bookRepository;
    private final AddressRepository addressRepository;

    @Override
    public OrderDTO createOrder(
            OrderRequestDTO request,
            String email
    ) {

        // =====================================================
        // FIND CUSTOMER
        // =====================================================

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found")
                );


        // =====================================================
        // VALIDATE ITEMS
        // =====================================================

        if (request.getItems() == null ||
                request.getItems().isEmpty()) {

            throw new RuntimeException("Order must contain at least one book");
        }


        // =====================================================
        // FIND ADDRESS
        // =====================================================

        Address address = addressRepository.findById(
                request.getAddressId()
        ).orElseThrow(() ->
                new RuntimeException("Address not found")
        );


        // Make sure address belongs to current customer
        if (!address.getCustomer().getId()
                .equals(customer.getId())) {

            throw new RuntimeException(
                    "Address does not belong to this customer"
            );
        }


        // =====================================================
        // CREATE ORDER
        // =====================================================

        Order order = new Order();

        order.setOrderNumber(
                generateOrderNumber()
        );

        order.setCustomer(customer);

        order.setOrderDate(LocalDateTime.now());

        order.setStatus(OrderStatus.PENDING);

        order.setCreatedAt(LocalDateTime.now());

        order.setUpdatedAt(LocalDateTime.now());


        // =====================================================
        // SHIPPING ADDRESS
        // =====================================================

        String shippingAddress =
                buildShippingAddress(address);

        order.setShippingAddress(shippingAddress);


        // =====================================================
        // PROCESS ITEMS
        // =====================================================

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderRequestItemDTO requestItem :
                request.getItems()) {

            if (requestItem.getQuantity() == null ||
                    requestItem.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Quantity must be greater than 0"
                );
            }


            Book book = bookRepository.findById(
                    requestItem.getBookId()
            ).orElseThrow(() ->
                    new RuntimeException(
                            "Book not found: "
                                    + requestItem.getBookId()
                    )
            );


            // =================================================
            // STOCK CHECK
            // =================================================

            if (book.getStock() <
                    requestItem.getQuantity()) {

                throw new RuntimeException(
                        "Not enough stock for: "
                                + book.getTitle()
                );
            }


            // =================================================
            // GET PRICE FROM DATABASE
            // =================================================

            BigDecimal unitPrice =
                    book.getSellingPrice();


            BigDecimal itemSubtotal =
                    unitPrice.multiply(
                            BigDecimal.valueOf(
                                    requestItem.getQuantity()
                            )
                    );


            // =================================================
            // CREATE ORDER ITEM
            // =================================================

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);

            orderItem.setBook(book);

            orderItem.setBookTitle(
                    book.getTitle()
            );

            orderItem.setAuthor(
                    book.getAuthor()
            );

            orderItem.setQuantity(
                    requestItem.getQuantity()
            );

            orderItem.setUnitPrice(
                    unitPrice
            );

            orderItem.setSubtotal(
                    itemSubtotal
            );

            order.getItems().add(orderItem);


            // =================================================
            // CALCULATE ORDER SUBTOTAL
            // =================================================

            subtotal = subtotal.add(itemSubtotal);


            // =================================================
            // REDUCE STOCK
            // =================================================

            book.setStock(
                    book.getStock() -
                            requestItem.getQuantity()
            );

            bookRepository.save(book);
        }


        // =====================================================
        // DISCOUNT
        // =====================================================

        BigDecimal discount = calculateDiscount(
                subtotal,
                request.getCouponCode()
        );


        // =====================================================
        // DELIVERY FEE
        // =====================================================

        BigDecimal deliveryFee =
                calculateDeliveryFee(
                        subtotal,
                        request.getDeliveryMethod()
                );


        // =====================================================
        // FINAL TOTAL
        // =====================================================

        BigDecimal total =
                subtotal
                        .subtract(discount)
                        .add(deliveryFee);


        order.setSubtotal(subtotal);

        order.setDiscount(discount);

        order.setDeliveryFee(deliveryFee);

        order.setTotal(total);


        // =====================================================
        // SAVE ORDER
        // =====================================================

        Order savedOrder =
                orderRepository.save(order);


        // =====================================================
        // CREATE PAYMENT
        // =====================================================

        Payment payment = new Payment();

        payment.setOrder(savedOrder);

        payment.setPaymentReference(
                generatePaymentReference()
        );

        payment.setAmount(total);

        payment.setPaymentMethod(
                request.getPaymentMethod()
        );

        payment.setPaymentStatus(
                PaymentStatus.PENDING
        );

        payment.setCreatedAt(
                LocalDateTime.now()
        );

        Payment savedPayment =
                paymentRepository.save(payment);


        // =====================================================
        // RETURN DTO
        // =====================================================

        savedOrder.setPayment(savedPayment);

        return mapToDTO(savedOrder);
    }


    // =========================================================
    // GET ORDER
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(
            Long id,
            String email
    ) {

        Customer customer =
                customerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer not found"
                                )
                        );


        Order order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );


        if (!order.getCustomer().getId()
                .equals(customer.getId())) {

            throw new RuntimeException(
                    "You are not allowed to access this order"
            );
        }


        return mapToDTO(order);
    }


    // =========================================================
    // GET MY ORDERS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getMyOrders(
            String email
    ) {

        Customer customer =
                customerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer not found"
                                )
                        );


        return orderRepository
                .findByCustomerIdOrderByCreatedAtDesc(
                        customer.getId()
                )
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // CANCEL ORDER
    // =========================================================

    @Override
    public void cancelOrder(
            Long id,
            String email
    ) {

        Customer customer =
                customerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer not found"
                                )
                        );


        Order order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );


        if (!order.getCustomer().getId()
                .equals(customer.getId())) {

            throw new RuntimeException(
                    "You are not allowed to cancel this order"
            );
        }


        if (order.getStatus() !=
                OrderStatus.PENDING) {

            throw new RuntimeException(
                    "This order cannot be cancelled"
            );
        }


        // Return stock
        for (OrderItem item : order.getItems()) {

            Book book = item.getBook();

            book.setStock(
                    book.getStock() +
                            item.getQuantity()
            );

            bookRepository.save(book);
        }


        order.setStatus(
                OrderStatus.CANCELLED
        );

        order.setUpdatedAt(
                LocalDateTime.now()
        );

        orderRepository.save(order);


        // Update payment
        Payment payment =
                paymentRepository
                        .findByOrderId(order.getId())
                        .orElse(null);

        if (payment != null) {

            payment.setPaymentStatus(
                    PaymentStatus.FAILED
            );

            payment.setUpdatedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);
        }
    }


    // =========================================================
    // DISCOUNT
    // =========================================================

    private BigDecimal calculateDiscount(
            BigDecimal subtotal,
            String couponCode
    ) {

        if (couponCode == null ||
                couponCode.trim().isEmpty()) {

            return BigDecimal.ZERO;
        }


        String code =
                couponCode.trim().toUpperCase();


        if ("BOOK10".equals(code)) {

            return subtotal.multiply(
                    new BigDecimal("0.10")
            );
        }


        if ("SAVE20".equals(code)) {

            return subtotal.multiply(
                    new BigDecimal("0.20")
            );
        }


        throw new RuntimeException(
                "Invalid coupon code"
        );
    }


    // =========================================================
    // DELIVERY FEE
    // =========================================================

    private BigDecimal calculateDeliveryFee(
            BigDecimal subtotal,
            String deliveryMethod
    ) {

        if ("EXPRESS".equalsIgnoreCase(
                deliveryMethod)) {

            return new BigDecimal("750");
        }


        // Standard delivery
        if (subtotal.compareTo(
                new BigDecimal("10000")
        ) >= 0) {

            return BigDecimal.ZERO;
        }


        return new BigDecimal("350");
    }


    // =========================================================
    // SHIPPING ADDRESS
    // =========================================================

    private String buildShippingAddress(
            Address address
    ) {

        StringBuilder result =
                new StringBuilder();

        if (address.getRecipientName() != null) {
            result.append(
                    address.getRecipientName()
            );
        }

        result.append(", ")
                .append(address.getAddressLine1());

        if (address.getAddressLine2() != null &&
                !address.getAddressLine2().isBlank()) {

            result.append(", ")
                    .append(address.getAddressLine2());
        }

        result.append(", ")
                .append(address.getCity());

        result.append(", ")
                .append(address.getPostalCode());

        result.append(", ")
                .append(address.getCountry());

        if (address.getPhone() != null) {

            result.append(", Phone: ")
                    .append(address.getPhone());
        }

        return result.toString();
    }


    // =========================================================
    // ORDER NUMBER
    // =========================================================

    private String generateOrderNumber() {

        return "BH-"
                + System.currentTimeMillis();
    }


    // =========================================================
    // PAYMENT REFERENCE
    // =========================================================

    private String generatePaymentReference() {

        return "PAY-"
                + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }


    // =========================================================
    // ENTITY -> DTO
    // =========================================================

    private OrderDTO mapToDTO(Order order) {

        List<OrderItemDTO> itemDTOs =
                order.getItems()
                        .stream()
                        .map(item ->
                                OrderItemDTO.builder()
                                        .id(item.getId())
                                        .bookId(
                                                item.getBook().getId()
                                        )
                                        .bookTitle(
                                                item.getBookTitle()
                                        )
                                        .author(
                                                item.getAuthor()
                                        )
                                        .quantity(
                                                item.getQuantity()
                                        )
                                        .unitPrice(
                                                item.getUnitPrice()
                                        )
                                        .subtotal(
                                                item.getSubtotal()
                                        )
                                        .build()
                        )
                        .collect(Collectors.toList());


        PaymentDTO paymentDTO = null;

        if (order.getPayment() != null) {

            Payment payment =
                    order.getPayment();

            paymentDTO =
                    PaymentDTO.builder()
                            .id(payment.getId())
                            .orderId(
                                    order.getId()
                            )
                            .paymentReference(
                                    payment.getPaymentReference()
                            )
                            .amount(
                                    payment.getAmount()
                            )
                            .paymentMethod(
                                    payment.getPaymentMethod()
                            )
                            .paymentStatus(
                                    payment.getPaymentStatus()
                            )
                            .transactionId(
                                    payment.getTransactionId()
                            )
                            .paidAt(
                                    payment.getPaidAt()
                            )
                            .createdAt(
                                    payment.getCreatedAt()
                            )
                            .updatedAt(
                                    payment.getUpdatedAt()
                            )
                            .build();
        }


        return OrderDTO.builder()
                .id(order.getId())
                .orderNumber(
                        order.getOrderNumber()
                )
                .customerId(
                        order.getCustomer().getId()
                )
                .orderDate(
                        order.getOrderDate()
                )
                .status(
                        order.getStatus()
                )
                .subtotal(
                        order.getSubtotal()
                )
                .discount(
                        order.getDiscount()
                )
                .deliveryFee(
                        order.getDeliveryFee()
                )
                .total(
                        order.getTotal()
                )
                .shippingAddress(
                        order.getShippingAddress()
                )
                .createdAt(
                        order.getCreatedAt()
                )
                .updatedAt(
                        order.getUpdatedAt()
                )
                .items(itemDTOs)
                .payment(paymentDTO)
                .build();
    }
}