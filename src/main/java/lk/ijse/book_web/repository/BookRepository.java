package lk.ijse.book_web.repository;

import lk.ijse.book_web.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book,Long> {
}
