package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist,Long> {


    Optional<Wishlist> findByCustomerId(Long customerId);

}
