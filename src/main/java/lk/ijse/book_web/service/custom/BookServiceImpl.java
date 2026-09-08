package lk.ijse.book_web.service.custom;


import lk.ijse.book_web.dto.BookDetailDTO;
import lk.ijse.book_web.dto.BookResponseDTO;
import lk.ijse.book_web.entity.Book;
import lk.ijse.book_web.repository.BookRepository;
import lk.ijse.book_web.service.BookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    public final BookRepository bookRepository;


    @Override
    public List<BookResponseDTO> getAllBooks() {

        List<Book> books = bookRepository.findAll();

        return books.stream()
                .map(book -> BookResponseDTO.builder()
                        .id(book.getId())
                        .title(book.getTitle())
                        .author(book.getAuthor())
                        .isbn(book.getIsbn())
                        .description(book.getDescription())
                        .publisher(book.getPublisher())
                        .publicationDate(book.getPublicationDate())
                        .pages(book.getPages())
                        .language(book.getLanguage())
                        .format(book.getFormat())

                        .originalPrice(book.getOriginalPrice())
                        .price(book.getSellingPrice())

                        .stock(book.getStock())
                        .coverImage(book.getCoverImage())
                        .rating(book.getRating())
                        .reviewCount(book.getReviewCount())
                        .salesCount(book.getSalesCount())
                        .status(book.getStatus())

                        .categoryId(book.getCategory().getId())
                        .categoryName(book.getCategory().getName())

                        .badge(null)

                        .build())
                .toList();
    }

    @Override
    public BookResponseDTO getBookById(Long id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        return BookResponseDTO.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .description(book.getDescription())
                .publisher(book.getPublisher())
                .publicationDate(book.getPublicationDate())
                .pages(book.getPages())
                .language(book.getLanguage())
                .format(book.getFormat())

                .originalPrice(book.getOriginalPrice())
                .price(book.getSellingPrice())

                .stock(book.getStock())
                .coverImage(book.getCoverImage())
                .rating(book.getRating())
                .reviewCount(book.getReviewCount())
                .salesCount(book.getSalesCount())
                .status(book.getStatus())

                .categoryId(book.getCategory().getId())
                .categoryName(book.getCategory().getName())

                .badge(null)

                .build();
    }


}
