package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Cart;
import lk.ijse.book_web.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart,Long> {


    Optional<Cart> findByCustomer(Customer customer);

    Optional<Cart> findByCustomerId(Long customerId);
}
