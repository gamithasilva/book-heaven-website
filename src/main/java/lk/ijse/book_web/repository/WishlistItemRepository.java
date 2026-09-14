package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Wishlist;
import lk.ijse.book_web.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem,Long> {

    Optional<WishlistItem> findByWishlistIdAndBookId(Long wishlistId,Long bookId);

    boolean existsByWishlistIdAndBookId(Long wishlistId,Long bookId);

    void deleteByWishlistIdAndBookId(Long wishlistId,Long bookId);

}
