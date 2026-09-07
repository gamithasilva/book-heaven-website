package lk.ijse.book_web.service;

import lk.ijse.book_web.dto.LoginRequest;
import lk.ijse.book_web.dto.RegisterRequest;
import lk.ijse.book_web.dto.UserDataDTO;

public interface AuthService {
    UserDataDTO login(LoginRequest request);

    UserDataDTO register(RegisterRequest request);
}
