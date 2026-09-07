package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address,Long> {
}
