package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {
}
