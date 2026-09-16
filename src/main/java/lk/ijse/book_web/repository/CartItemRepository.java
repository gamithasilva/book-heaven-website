package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {

    Optional<CartItem> findByCartIdAndBookId(Long cartId, Long bookId);

}
