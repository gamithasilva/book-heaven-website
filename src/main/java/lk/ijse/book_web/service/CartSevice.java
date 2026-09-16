package lk.ijse.book_web.service;

import lk.ijse.book_web.dto.CartDTO;

public interface CartSevice {
    CartDTO getCart(String email);

    CartDTO addToCart(Long bookId, Integer quantity, String email);

    CartDTO updateQuantity(
            Long bookId,
            Integer quantity,
            String email);

    CartDTO removeFromCart(
            Long bookId,
            String email);

    void clearCart(String email);
}
