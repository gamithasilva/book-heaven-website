package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order,Long> {

}
