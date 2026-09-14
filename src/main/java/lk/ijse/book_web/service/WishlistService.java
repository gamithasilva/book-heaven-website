package lk.ijse.book_web.service;

import lk.ijse.book_web.dto.WishlistDTO;

public interface WishlistService {
    void addToWishlist(Long bookId, String username);

    void removeFromWishlist(Long bookId, String username);

    WishlistDTO getWishlist(String username);
}
