package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart,Long> {
}
