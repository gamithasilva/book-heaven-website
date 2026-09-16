package lk.ijse.book_web.controller;

import lk.ijse.book_web.dto.CartDTO;
import lk.ijse.book_web.dto.CommonResponse;
import lk.ijse.book_web.service.CartSevice;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/customer/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartSevice cartSevice;


    // =========================================================
    // GET CART
    // =========================================================

    @GetMapping
    public ResponseEntity<CommonResponse> getCart() {

        String email = getCurrentUserEmail();

        CartDTO cartDTO = cartSevice.getCart(email);

        return new ResponseEntity<>(
                new CommonResponse(
                        200,
                        cartDTO,
                        "Cart retrieved successfully"
                ),
                HttpStatus.OK
        );
    }


    // =========================================================
    // ADD BOOK TO CART
    // =========================================================

    @PostMapping("/items/{bookId}")
    public ResponseEntity<CommonResponse> addToCart(
            @PathVariable Long bookId,
            @RequestParam Integer quantity) {

        String email = getCurrentUserEmail();

        CartDTO cartDTO = cartSevice.addToCart(
                bookId,
                quantity,
                email
        );

        return new ResponseEntity<>(
                new CommonResponse(
                        200,
                        cartDTO,
                        "Book added to cart successfully"
                ),
                HttpStatus.OK
        );
    }


    // =========================================================
    // UPDATE CART ITEM QUANTITY
    // =========================================================

    @PatchMapping("/items/{bookId}")
    public ResponseEntity<CommonResponse> updateQuantity(
            @PathVariable Long bookId,
            @RequestParam Integer quantity) {

        String email = getCurrentUserEmail();

        CartDTO cartDTO = cartSevice.updateQuantity(
                bookId,
                quantity,
                email
        );

        return new ResponseEntity<>(
                new CommonResponse(
                        200,
                        cartDTO,
                        "Cart quantity updated successfully"
                ),
                HttpStatus.OK
        );
    }


    // =========================================================
    // REMOVE BOOK FROM CART
    // =========================================================

    @DeleteMapping("/items/{bookId}")
    public ResponseEntity<CommonResponse> removeFromCart(
            @PathVariable Long bookId) {

        String email = getCurrentUserEmail();

        CartDTO cartDTO = cartSevice.removeFromCart(
                bookId,
                email
        );

        return new ResponseEntity<>(
                new CommonResponse(
                        200,
                        cartDTO,
                        "Book removed from cart successfully"
                ),
                HttpStatus.OK
        );
    }


    // =========================================================
    // CLEAR CART
    // =========================================================

    @DeleteMapping("/clear")
    public ResponseEntity<CommonResponse> clearCart() {

        String email = getCurrentUserEmail();

        cartSevice.clearCart(email);

        return new ResponseEntity<>(
                new CommonResponse(
                        200,
                        null,
                        "Cart cleared successfully"
                ),
                HttpStatus.OK
        );
    }


    // =========================================================
    // GET CURRENT LOGGED-IN USER EMAIL
    // =========================================================

    private String getCurrentUserEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName().equals("anonymousUser")) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        return authentication.getName();
    }
}