package lk.ijse.book_web.controller;

import lk.ijse.book_web.dto.CommonResponse;
import lk.ijse.book_web.dto.LoginRequest;
import lk.ijse.book_web.dto.RegisterRequest;
import lk.ijse.book_web.dto.UserDataDTO;
import lk.ijse.book_web.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<CommonResponse> login(
            @RequestBody LoginRequest request) {

        UserDataDTO userData =
                authService.login(request);

        return ResponseEntity.ok(
                new CommonResponse(
                        200,
                        userData,
                        "Login successful"
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<CommonResponse> register(
            @RequestBody RegisterRequest request) {

        UserDataDTO userData =
                authService.register(request);

        return ResponseEntity.ok(
                new CommonResponse(
                        201,
                        userData,
                        "Registration successful"
                )
        );
    }
}
