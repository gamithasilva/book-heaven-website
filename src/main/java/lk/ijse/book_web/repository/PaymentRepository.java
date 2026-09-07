package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
}
