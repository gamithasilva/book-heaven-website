package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
}
