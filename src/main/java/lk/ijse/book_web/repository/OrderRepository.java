package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Customer;
import lk.ijse.book_web.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByCustomerOrderByCreatedAtDesc(Customer customer);

    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}