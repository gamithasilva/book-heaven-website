package lk.ijse.book_web.exception;

import lk.ijse.book_web.dto.CommonResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

public class AppExceptionHandler {

    @ExceptionHandler(value = {Exception.class})
    public CommonResponse handleServerException(Exception ex, WebRequest webRequest){
        ex.printStackTrace();
        return new CommonResponse(500,"UNEXPECTED_ERROR");
    }

    @ExceptionHandler(value = {CustomException.class})
    public ResponseEntity<CommonResponse> handleCustomException(CustomException ex , WebRequest webRequest){
        ex.printStackTrace();

        return ResponseEntity.ok(new CommonResponse(ex.getStatus(), ex.getMessage()));
    }
}
