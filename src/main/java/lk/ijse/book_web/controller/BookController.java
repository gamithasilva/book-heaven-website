package lk.ijse.book_web.controller;

import lk.ijse.book_web.dto.CommonResponse;
import lk.ijse.book_web.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping("/getAll")
    public CommonResponse getAllBooks() {
        return new CommonResponse(
                200,
                bookService.getAllBooks(),
                "OPERATION SUCCESS"
        );
    }

    @GetMapping("/{id}")
    public CommonResponse getBookDetails(@PathVariable("id") Long id) {
        return new CommonResponse(200, bookService.getBookById(id), "OPERATION SUCCESS");
    }


}
