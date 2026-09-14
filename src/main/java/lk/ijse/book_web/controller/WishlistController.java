package lk.ijse.book_web.controller;

import lk.ijse.book_web.dto.CommonResponse;
import lk.ijse.book_web.dto.WishlistDTO;
import lk.ijse.book_web.exception.CustomException;
import lk.ijse.book_web.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/items/{bookId}")
    public CommonResponse addToWishlist(@PathVariable Long bookId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName().equals("anonymousUser")) {

            throw new CustomException(401, "User is not authenticated");
        }

        wishlistService.addToWishlist(bookId, authentication.getName());

        return new CommonResponse(200, "Book added to wishlist");
    }

    @DeleteMapping("/items/{bookId}")
    public CommonResponse removeFromWishlist(@PathVariable Long bookId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName().equals("anonymousUser")) {

            throw new CustomException(401, "User is not authenticated");
        }

        wishlistService.removeFromWishlist(bookId, authentication.getName());

        return new CommonResponse(200, "Book removed from wishlist");
    }


//    @DeleteMapping("/items/{bookId}")
//    public CommonResponse removeFromWishlist(@PathVariable Long bookId){
//
//        Authentication authentication =
//                SecurityContextHolder.getContext().getAuthentication();
//
//        System.out.println("========== DELETE WISHLIST ==========");
//        System.out.println("Authentication: " + authentication);
//        System.out.println("Authenticated: " +
//                (authentication != null && authentication.isAuthenticated()));
//
//        if (authentication != null) {
//            System.out.println("Username: " + authentication.getName());
//            System.out.println("Authorities: " + authentication.getAuthorities());
//        }
//
//        if (authentication == null ||
//                !authentication.isAuthenticated() ||
//                authentication.getName().equals("anonymousUser")) {
//
//            throw new CustomException(401, "User is not authenticated");
//        }
//
//        wishlistService.removeFromWishlist(bookId, authentication.getName());
//
//        return new CommonResponse(200, "Book removed from wishlist");
//    }
    @GetMapping
    public CommonResponse getWishlist(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName().equals("anonymousUser")) {

            throw new CustomException(401, "User is not authenticated");
        }

        WishlistDTO wishlistDTO = wishlistService.getWishlist(authentication.getName());

        return new CommonResponse(200,wishlistDTO,"success");
    }

}
