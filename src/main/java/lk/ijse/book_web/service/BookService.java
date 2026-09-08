package lk.ijse.book_web.service;



import lk.ijse.book_web.dto.BookResponseDTO;

import java.util.List;

public interface BookService {


    List<BookResponseDTO> getAllBooks();

    BookResponseDTO getBookById(Long id);
}
