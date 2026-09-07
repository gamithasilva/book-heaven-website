package lk.ijse.book_web.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CustomException extends RuntimeException {

    private int status;
    private String message;
}
